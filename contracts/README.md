# Smart Contracts - Arbitrum Stylus

This directory contains the Rust smart contracts for on-chain ZK proof verification.

## 📁 Structure

```
contracts/
├── Cargo.toml                 # Rust dependencies (to be created)
├── src/
│   ├── lib.rs                # Main contract (to be implemented)
│   └── verifier.rs           # Groth16 verifier (to be implemented)
└── DEPLOYMENT.md             # Deployment guide (to be created)
```

## 🔧 Prerequisites

1. Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Install Cargo Stylus:
```bash
cargo install cargo-stylus
```

3. Add WASM target:
```bash
rustup target add wasm32-unknown-unknown
```

## 🚀 Build & Deploy

```bash
# Build
cargo build --target wasm32-unknown-unknown

# Check contract
cargo stylus check

# Deploy to Arbitrum Sepolia
cargo stylus deploy --private-key <YOUR_PRIVATE_KEY>
```

## 📖 Contract Overview

### Main Functions

- `set_root(bytes32 root)` - Store a Merkle root on-chain
- `unlock_message(bytes proof, bytes32 root)` - Verify ZK proof and grant access
- `verify_proof(bytes proof, bytes32[] public_inputs)` - Internal Groth16 verifier

### Events

- `AccessGranted(address user, bytes32 root)` - Emitted when proof is valid
- `AccessDenied(address user)` - Emitted when proof is invalid

---

**Status:** 🚧 To be implemented in Tasks T1.5 & T1.6
