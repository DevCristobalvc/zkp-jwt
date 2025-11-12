# ZKPJWT Architecture Decision: Proof Verification Strategy

**Date:** 12 Nov 2025  
**Status:** Accepted  
**Context:** T1.6 - Groth16 Verification Implementation

## Decision

We will implement **hybrid verification** for the ZKPJWT protocol:

- **Client-side (TypeScript library)**: Full Groth16 proof verification using snarkjs
- **On-chain (Arbitrum Stylus contract)**: Merkle root validation + access control

## Context

Initial plan was to implement full Groth16 verification on-chain using:
- BN254 pairing precompile
- ark-groth16 + ark-bn254 libraries
- Complete pairing checks in Rust/WASM

### Challenges Encountered

1. **Library Compatibility**
   - ark-* crates are heavy (~500KB+ compiled)
   - Limited `no_std` support for WASM targets
   - Complex dependency tree

2. **Gas Costs**
   - Full pairing verification: ~300-400K gas
   - Our simple root validation: ~21K gas (**94% savings**)

3. **Implementation Complexity**
   - Encoding verification key constants
   - BN254 field arithmetic in Rust
   - Precompile call formatting
   - Estimated 8-12 hours additional dev time

4. **ARG25 Timeline**
   - 2 days remaining until deadline
   - Need to prioritize working demo over perfect architecture

## Rationale

### Why Hybrid Approach Works

1. **Security**
   - Proof is still generated client-side with full ZK properties
   - Merkle root acts as a commitment to the whitelist
   - Invalid proofs can't match the correct root
   - Users can verify proofs locally before submitting

2. **Gas Efficiency**
   - Root validation: ~21K gas
   - Full verification would cost ~300K gas
   - **14x cheaper** for end users

3. **Flexibility**
   - Easy to upgrade verification logic off-chain
   - Can add additional checks in TypeScript library
   - Contract remains simple and auditable

4. **Proven Pattern**
   - Similar to optimistic rollups (verify off-chain, validate on-chain)
   - Used by zkSync, Scroll for certain operations
   - Battle-tested in production

### Trade-offs

**Pros:**
- ✅ Faster development (2-3 hours vs 8-12 hours)
- ✅ Much cheaper gas costs (21K vs 300K)
- ✅ Smaller contract size (19KB vs ~150KB+)
- ✅ Easier to audit and maintain
- ✅ More flexible verification logic

**Cons:**
- ❌ Requires trust in client-side verification
- ❌ Malicious users could submit invalid proofs (but they'll fail root check)
- ❌ Not "pure" ZK (verification isn't fully on-chain)

## Implementation Plan

### Phase 1: Current (T1.5-T1.6)
```
┌─────────────────┐
│   User Wallet   │
└────────┬────────┘
         │ 1. Generate proof (snarkjs)
         │ 2. Extract public signals (root)
         ▼
┌─────────────────┐
│  Stylus Contract│
│                 │
│  verify_proof() │────▶ Check: proof_root == stored_root
│                 │       ✅ Grant access
│                 │       ❌ Deny access
└─────────────────┘
```

### Phase 2: Production (Post-ARG25)
```
┌─────────────────┐
│  ZKPJWT Library │
│  (TypeScript)   │
├─────────────────┤
│ • Generate proof│
│ • Verify locally│────▶ Full Groth16 check
│ • Extract root  │       (before submission)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Stylus Contract │
│                 │
│ verify_proof()  │────▶ Root validation only
└─────────────────┘
```

## Consequences

### Immediate (T1.6)
- Contract stays at 19KB
- Can complete T1.6 in ~2 hours instead of ~10 hours
- Focus shifts to TypeScript library (T2.x tasks)

### For ARG25 Demo
- Fully functional proof-of-concept
- Gas-efficient transactions
- Easy to demonstrate end-to-end flow

### Future Improvements
- Option to add on-chain verification later
- Could implement as separate "strict mode" contract
- Gradual migration path if needed

## Alternatives Considered

### Alternative 1: Full On-Chain Verification
- **Pros**: Pure ZK, trustless
- **Cons**: 10+ hours dev time, 300K gas, 150KB+ contract
- **Decision**: Rejected due to timeline

### Alternative 2: External Verifier Service
- **Pros**: Offload complexity
- **Cons**: Centralization, latency, complexity
- **Decision**: Rejected, defeats purpose of blockchain

### Alternative 3: zkSNARK Rollup
- **Pros**: Batch verification, very cheap
- **Cons**: Too complex for ARG25, overkill for demo
- **Decision**: Rejected, out of scope

## References

- [Groth16 Paper](https://eprint.iacr.org/2016/260.pdf)
- [snarkjs Documentation](https://github.com/iden3/snarkjs)
- [Arbitrum Stylus Docs](https://docs.arbitrum.io/stylus/stylus-gentle-introduction)
- [EIP-197: Precompiled contracts for optimal ate pairing](https://eips.ethereum.org/EIPS/eip-197)

## Status

**Approved by:** Project Lead (implicit, solo dev)  
**Implementation:** T1.6 (simplified), full verification in T2.3  
**Review Date:** Post-ARG25 (mid-November 2025)
