# ZKPJWT Verifier Contract

Arbitrum Stylus smart contract for verifying Groth16 zero-knowledge proofs in the ZKPJWT protocol.

## Overview

This contract enables privacy-preserving access control by verifying ZK proofs of Merkle tree membership without revealing which specific wallet is being verified.

### Current Status (T1.5)

Basic contract structure implemented with:
- ✅ Merkle root storage and management
- ✅ Owner-based access control
- ✅ Root validation for proofs
- ⏳ Full Groth16 verification (to be implemented in T1.6)
- ⏳ Event emission (to be added in T1.6)

## Contract Functions

### Admin Functions

```rust
pub fn init(&mut self)
```
Initialize contract and set deployer as owner.

```rust
pub fn set_root(&mut self, new_root: U256) -> Result<(), Vec<u8>>
```
Update Merkle root (owner only). Used when whitelist changes.

```rust
pub fn transfer_ownership(&mut self, new_owner: Address) -> Result<(), Vec<u8>>
```
Transfer contract ownership.

### Query Functions

```rust
pub fn get_root(&self) -> U256
```
Get current Merkle root.

```rust
pub fn get_owner(&self) -> Address
```
Get contract owner address.

### Verification Function

```rust
pub fn verify_proof(&self, proof_root: U256) -> Result<bool, Vec<u8>>
```
Verify that proof's root matches stored root. Full Groth16 verification coming in T1.6.

## Build

```bash
cargo build --release --target wasm32-unknown-unknown
```

**Output:** `target/wasm32-unknown-unknown/release/zkpjwt_verifier.wasm` (19KB)

## Export ABI

```bash
cargo stylus export-abi
```

## Deploy (coming in T1.7)

```bash
cargo stylus deploy \
  --private-key=<PRIVATE_KEY> \
  --endpoint=https://sepolia-rollup.arbitrum.io/rpc
```

## Architecture

```
┌─────────────────────────────────────┐
│   ZKPJWTVerifier Contract           │
├─────────────────────────────────────┤
│  Storage:                           │
│  - merkle_root: U256                │
│  - owner: Address                   │
├─────────────────────────────────────┤
│  Functions:                         │
│  - init()                           │
│  - get_root() → U256                │
│  - set_root(U256)                   │
│  - get_owner() → Address            │
│  - transfer_ownership(Address)      │
│  - verify_proof(U256) → bool        │
└─────────────────────────────────────┘
```

## Security Considerations

- Owner has exclusive rights to update Merkle root
- Root updates should be coordinated with off-chain whitelist changes
- Groth16 verification ensures proof validity (T1.6)
- No replay protection yet (will be added in T1.6)

## Gas Optimization

Arbitrum Stylus provides ~10x gas savings compared to Solidity:
- Rust compiles to efficient WASM
- Native execution on Arbitrum's WASM VM
- Optimized cryptographic operations

## Next Steps (T1.6)

- [ ] Implement full Groth16 proof verification with ark-groth16
- [ ] Add event emission for access logs
- [ ] Implement replay protection
- [ ] Add AES-256-GCM message decryption

## License

MIT
