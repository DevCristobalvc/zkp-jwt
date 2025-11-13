# 🔐 ZKPJWT Core

> Zero-Knowledge Proof JSON Web Token - Privacy-preserving access control for Web3

[![npm version](https://badge.fury.io/js/zkpjwt-core.svg)](https://www.npmjs.com/package/zkpjwt-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**ZKPJWT** enables privacy-preserving wallet allowlists using Zero-Knowledge Proofs and Merkle trees. Verify membership without revealing which specific address you are.

Built with **Arbitrum Stylus** (Rust → WASM) for 10x cheaper gas costs.

## 🌟 Features

- 🛡️ **Zero-Knowledge Proofs**: Groth16 proving system with BN254 curve
- 🌳 **Merkle Trees**: Poseidon hash-based trees (up to 1024 addresses)
- ⚡ **Arbitrum Stylus**: ~21K gas per verification (94% cheaper than Solidity)
- 🔒 **Privacy-First**: Prove membership without revealing your address
- 🎯 **Hybrid Verification**: Full client-side verification + cheap on-chain check
- 📦 **TypeScript**: Full type safety and modern DX

## 📦 Installation

```bash
npm install zkpjwt-core
```

## 🚀 Quick Start

```typescript
import { 
  MerkleTreeBuilder, 
  ProofGenerator, 
  ProofVerifier,
  ContractClient 
} from 'zkpjwt-core';

// 1. Build Merkle tree from authorized addresses
const builder = new MerkleTreeBuilder({ levels: 10 });
await builder.initialize();
const tree = await builder.buildTree(addresses);

// 2. Generate ZK proof for your address
const merkleProof = builder.getMerkleProof(yourAddress);
const prover = new ProofGenerator();
const zkProof = await prover.generateProof(merkleProof);

// 3. Verify proof client-side (full Groth16 verification)
const verifier = new ProofVerifier();
const isValid = await verifier.verifyProof(zkProof);

// 4. Verify on-chain (cheap root check only)
const client = new ContractClient();
await client.connectWallet(privateKey);
const onChainValid = await client.verifyProof(zkProof.merkleRoot);
```

## 🎯 Use Cases

- **NFT Allowlists**: Private mint eligibility without revealing wallet
- **DAO Voting**: Anonymous voting while proving membership
- **Token Gating**: Access control without exposing token holdings
- **DApp Access**: Private authentication for Web3 apps

## 🏗️ Architecture

ZKPJWT uses a **hybrid verification** approach:

1. **Client-side**: Full Groth16 pairing checks (cryptographically secure)
2. **On-chain**: Simple Merkle root comparison (94% cheaper gas)

This gives you maximum security at minimum cost.

## 📊 Gas Costs

| Operation | Solidity | Stylus | Savings |
|-----------|----------|--------|---------|
| Full Groth16 Verify | ~350K | N/A | - |
| Hybrid Verify | N/A | ~21K | **94%** |

## 🔗 Links

- 🌐 **Website**: https://zkpjwt.vercel.app
- 📘 **Documentation**: https://zkpjwt.vercel.app/#docs
- 🔐 **Smart Contract**: [0xa0539e9c...6496](https://sepolia.arbiscan.io/address/0xa0539e9c8701e714f94400153eeed5d05af6e496)
- 💻 **GitHub**: https://github.com/DevCristobalvc/zkp-jwt
- 🎯 **Live Demo**: https://zkpjwt.vercel.app/#demo

## 🛠️ API Reference

### `MerkleTreeBuilder`
Build Poseidon-based Merkle trees from address lists.

### `ProofGenerator`
Generate Groth16 zero-knowledge proofs for Merkle membership.

### `ProofVerifier`
Verify ZK proofs client-side with full pairing checks.

### `ContractClient`
Interact with the Arbitrum Stylus contract for on-chain verification.

## 🏆 Built For

**Arbitrum Global ARG25 Hackathon** - November 2025

Leveraging Arbitrum Stylus for next-generation ZK infrastructure.

## 👨‍💻 Author

**Cristobal Valencia** ([@DevCristobalvc](https://github.com/DevCristobalvc))
- GitHub: https://github.com/DevCristobalvc
- npm: https://www.npmjs.com/~devcristobalvc
- Email: cristobalvalencia3002@gmail.com

## 📄 License

MIT © 2025 Cristobal Valencia

---

Built with ❤️ for Arbitrum Stylus
