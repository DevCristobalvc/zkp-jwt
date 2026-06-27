pragma circom 2.0.0;

include "../../circuits/node_modules/circomlib/circuits/poseidon.circom";
include "../../circuits/node_modules/circomlib/circuits/mux1.circom";

/*
 * MerkleMembership for Stellar/Soroban
 *
 * Proves that a Stellar wallet address is a member of an authorized set
 * without revealing which specific member it is.
 *
 * Curve: BLS12-381 (compiled with --prime bls12381)
 * Hash:  Poseidon (compatible with Stellar's native poseidon_hash host function)
 *
 * Private inputs:
 *   - walletAddress: Stellar public key as field element (first 32 bytes)
 *   - pathIndices[levels]: Binary path from leaf to root
 *   - siblings[levels]: Sibling hashes along the Merkle path
 *
 * Public inputs:
 *   - root: Merkle root stored on-chain in Soroban
 */

template MerkleMembershipStellar(levels) {
    signal input walletAddress;
    signal input pathIndices[levels];
    signal input siblings[levels];

    signal input root;

    component leafHasher = Poseidon(1);
    leafHasher.inputs[0] <== walletAddress;

    signal computedHash[levels + 1];
    computedHash[0] <== leafHasher.out;

    component hashers[levels];
    component leftSelector[levels];
    component rightSelector[levels];

    for (var i = 0; i < levels; i++) {
        pathIndices[i] * (1 - pathIndices[i]) === 0;

        leftSelector[i] = Mux1();
        rightSelector[i] = Mux1();

        leftSelector[i].c[0] <== computedHash[i];
        leftSelector[i].c[1] <== siblings[i];
        leftSelector[i].s <== pathIndices[i];

        rightSelector[i].c[0] <== siblings[i];
        rightSelector[i].c[1] <== computedHash[i];
        rightSelector[i].s <== pathIndices[i];

        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== leftSelector[i].out;
        hashers[i].inputs[1] <== rightSelector[i].out;

        computedHash[i + 1] <== hashers[i].out;
    }

    root === computedHash[levels];
}

component main {public [root]} = MerkleMembershipStellar(10);
