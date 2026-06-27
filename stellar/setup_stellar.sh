#!/usr/bin/env bash
set -euo pipefail

# MedVault ZK trusted setup — BLS12-381 Groth16
#
# Reproducible multi-contribution Powers-of-Tau + Phase-2 ceremony for
# merkle_membership_stellar.circom. Each phase takes several independent
# contributions and is finalized with a public random beacon, so the toxic
# waste is unrecoverable as long as at least one contributor was honest.
#
# For mainnet, BEACON_HEX MUST be replaced with a future, unpredictable public
# randomness value (e.g. a Bitcoin block hash at an announced height) and the
# contributions MUST come from independent parties on separate machines.

POWER=14
CURVE=bls12381
CIRCUIT=merkle_membership_stellar
BUILD=build
BEACON_HEX=${BEACON_HEX:-0000000000000000000a8e840d7d9b6b3e2dd0a4f1c7e8d9c0b1a2f3e4d5c6b7}
BEACON_ITERS=10

SNARKJS="node node_modules/snarkjs/build/cli.cjs"
rand() { head -c 64 /dev/urandom | base64 | tr -d '\n'; }

mkdir -p "$BUILD"

echo "== compile circuit =="
circom "circuits/${CIRCUIT}.circom" --r1cs --wasm --sym --prime "$CURVE" -o "$BUILD"

echo "== phase 1: powers of tau =="
$SNARKJS powersoftau new "$CURVE" "$POWER" "$BUILD/pot_0000.ptau" -v
$SNARKJS powersoftau contribute "$BUILD/pot_0000.ptau" "$BUILD/pot_0001.ptau" --name="Contribution 1" -v -e="$(rand)"
$SNARKJS powersoftau contribute "$BUILD/pot_0001.ptau" "$BUILD/pot_0002.ptau" --name="Contribution 2" -v -e="$(rand)"
$SNARKJS powersoftau contribute "$BUILD/pot_0002.ptau" "$BUILD/pot_0003.ptau" --name="Contribution 3" -v -e="$(rand)"
$SNARKJS powersoftau verify "$BUILD/pot_0003.ptau"
$SNARKJS powersoftau beacon "$BUILD/pot_0003.ptau" "$BUILD/pot_beacon.ptau" "$BEACON_HEX" "$BEACON_ITERS" -n="Phase1 final beacon"
$SNARKJS powersoftau prepare phase2 "$BUILD/pot_beacon.ptau" "$BUILD/pot${POWER}_${CURVE}_final.ptau" -v
$SNARKJS powersoftau verify "$BUILD/pot${POWER}_${CURVE}_final.ptau"

echo "== phase 2: circuit-specific (groth16) =="
$SNARKJS groth16 setup "$BUILD/${CIRCUIT}.r1cs" "$BUILD/pot${POWER}_${CURVE}_final.ptau" "$BUILD/merkle_${CURVE}_0000.zkey"
$SNARKJS zkey contribute "$BUILD/merkle_${CURVE}_0000.zkey" "$BUILD/merkle_${CURVE}_0001.zkey" --name="Phase2 Contribution 1" -v -e="$(rand)"
$SNARKJS zkey contribute "$BUILD/merkle_${CURVE}_0001.zkey" "$BUILD/merkle_${CURVE}_0002.zkey" --name="Phase2 Contribution 2" -v -e="$(rand)"
$SNARKJS zkey contribute "$BUILD/merkle_${CURVE}_0002.zkey" "$BUILD/merkle_${CURVE}_0003.zkey" --name="Phase2 Contribution 3" -v -e="$(rand)"
$SNARKJS zkey beacon "$BUILD/merkle_${CURVE}_0003.zkey" "$BUILD/merkle_${CURVE}_final.zkey" "$BEACON_HEX" "$BEACON_ITERS" -n="Phase2 final beacon"
$SNARKJS zkey verify "$BUILD/${CIRCUIT}.r1cs" "$BUILD/pot${POWER}_${CURVE}_final.ptau" "$BUILD/merkle_${CURVE}_final.zkey"
$SNARKJS zkey export verificationkey "$BUILD/merkle_${CURVE}_final.zkey" "$BUILD/verification_key_${CURVE}.json"

echo "== done: zkey verified, verification key exported =="
