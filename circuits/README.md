# Circuits - Zero-Knowledge Proofs

This directory contains the Circom circuits for the ZKPJWT protocol.

## 📁 Structure

```
circuits/
├── merkle_membership.circom   # Main circuit (to be implemented)
├── setup.sh                   # Trusted setup script (to be created)
├── test/                      # Test scripts
│   └── generate_proof.js     # Proof generation test (to be implemented)
└── build/                     # Compiled outputs (.wasm, .zkey, .r1cs)
    └── .gitkeep
```

## 🔧 Setup

1. Install Circom and SnarkJS:
```bash
npm install -g circom snarkjs
```

2. Run trusted setup:
```bash
./setup.sh
```

## 🧪 Testing

Generate a test proof:
```bash
node test/generate_proof.js
```

## 📖 Circuit Details

The `merkle_membership.circom` circuit proves that a wallet address is part of a Merkle tree without revealing which specific leaf it is.

**Inputs:**
- `wallet_address` (private) - The wallet to prove membership for
- `merkle_siblings[10]` (private) - The Merkle path siblings
- `merkle_root` (public) - The root hash to verify against

**Output:**
- Valid proof π if the wallet is in the tree

---

**Status:** 🚧 To be implemented in Task T1.2
