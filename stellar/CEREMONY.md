# Trusted Setup Ceremony

The Groth16 proving key for `merkle_membership_stellar.circom` is produced by the reproducible ceremony in
[`setup_stellar.sh`](./setup_stellar.sh). This document records how it was run and what guarantees it provides.

## Why a ceremony

Groth16 requires a structured reference string (SRS). Its generation produces secret "toxic waste" that, if retained,
would let a holder forge proofs. A multi-contribution ceremony makes the waste unrecoverable **as long as at least one
contributor was honest and discarded their randomness**. A final public random beacon removes any bias from the last
contributor.

## What the script does

**Phase 1 — Powers of Tau (universal, curve-wide)**

1. `powersoftau new bls12381 14` — initialize for up to 2¹⁴ constraints (circuit has 5615).
2. Three sequential `contribute` steps, each seeded with 64 bytes from the OS CSPRNG (`/dev/urandom`).
3. `powersoftau verify` — checks the contribution chain.
4. `powersoftau beacon` — finalize with a public random beacon.
5. `prepare phase2` + `verify` — derive and validate the phase-2 base.

**Phase 2 — circuit-specific (Groth16)**

1. `groth16 setup` from the phase-1 output and the circuit `r1cs`.
2. Three sequential `zkey contribute` steps, each with fresh CSPRNG entropy.
3. `zkey beacon` — finalize with the public beacon.
4. `zkey verify` — validate the full key against the `r1cs` and phase-1 output (`ZKey Ok!`).
5. `zkey export verificationkey` — emit `verification_key_bls12381.json`.

## Reproduce

```bash
cd zkp-jwt/stellar
npm install
bash setup_stellar.sh
# expect: "Powers of Tau Ok!", "ZKey Ok!", verification key exported
```

The verifying contract takes the verification key **as a call argument**, so a fresh ceremony does **not** require a
contract redeploy — only the regenerated `verification_key_bls12381.json`, `merkle.zkey`, and `merkle.wasm` shipped to
the frontend.

## Current status and production requirements

- The committed artifacts were generated **on a single developer machine** with three contributions plus a beacon. This
  is sound for a testnet demo but does **not** satisfy the independence assumption for production.
- **Before mainnet:**
  - Run contributions from **independent parties on separate machines** (each discarding their own entropy).
  - Use a **future, publicly verifiable beacon** — e.g. a Bitcoin block hash at a height announced in advance — instead
    of the placeholder `BEACON_HEX` in the script.
  - Publish each contribution's transcript hash so anyone can audit the chain with `powersoftau verify` / `zkey verify`.
