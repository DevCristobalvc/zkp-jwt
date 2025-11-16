# 🔐 ZKPJWT - Zero-Knowledge Proof JSON Web Token Protocol

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Arbitrum](https://img.shields.io/badge/Arbitrum-Stylus-blue)](https://arbitrum.io/)
[![Circom](https://img.shields.io/badge/Circom-ZK-purple)](https://docs.circom.io/)

**Privacy-preserving access control protocol using Zero-Knowledge Proofs and Arbitrum Stylus**

--

```
// OFF-CHAIN: Encryption
const encrypted = encryptMessage(message); // AES-256-GCM local

// ON-CHAIN: Solo se publica el root
await contract.publishRoot(merkleRoot);
```
```
wallets → [hash(w1), hash(w2), hash(w3)]
       ↓
   Merkle Tree
       ↓
   Root (on-chain)
```
```
         ROOT
        /    \
      H1      H2
     / \     / \
    A   B   C   D
```

To prove you are the child of "ROOT", you only need:
- Your birth certificate (leaf)
- Your sibling's birth certificate (proof[0])
- Your uncles' birth certificates (proof[1])

With these documents, you can reconstruct the entire family
and prove you belong to the family tree without showing the ENTIRE family.
---

## 🎯 What is ZKPJWT?

ZKPJWT is a decentralized protocol that enables **privacy-preserving access control** to encrypted data. Users can prove they belong to an authorized group without revealing their specific identity, with verification happening on-chain via Arbitrum Stylus smart contracts.

### The Problem
Traditional access control systems require:
- 🔴 Centralized servers to verify permissions
- 🔴 Revealing your identity to prove access rights
- 🔴 No public auditability without compromising privacy
- 🔴 No blockchain integration for programmable rules

### The Solution
ZKPJWT enables:
- ✅ **Privacy-Preserving Verification**: Prove membership without revealing which member you are
- ✅ **Decentralized**: Smart contracts verify proofs on Arbitrum Stylus
- ✅ **Programmable Access**: Define complex rules using blockchain logic
- ✅ **Auditable**: Anyone can verify access rules while preserving individual privacy

---

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Sender    │────────▶│  ZK Circuit  │────────▶│ Stylus Contract │
│  (Encrypt)  │         │   (Circom)   │         │  (Rust Verify)  │
└─────────────┘         └──────────────┘         └─────────────────┘
      │                        │                          │
      │ Creates List           │ Generates Proof π        │ Verifies π
      │ Merkle Root R          │ Private: wallet + path   │ Emits Event
      │ Encrypt with K         │ Public: root R           │ Returns K
      │                        │                          │
      └────────────────────────┴──────────────────────────┘
                    ZKPJWT Token Flow
```

### Components

1. **ZK Circuit** (`circuits/`) - Circom circuit for Merkle membership proof
2. **Stylus Contract** (`contracts/`) - Rust smart contract for on-chain verification
3. **TypeScript Library** (`library/`) - NPM package for developers
4. **Frontend Demo** (`frontend/`) - React app demonstrating the protocol

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Rust >= 1.75.0
- Circom >= 2.1.6
- Cargo Stylus CLI
- MetaMask with Arbitrum Sepolia testnet

### Installation

```bash
# Clone the repository
git clone https://github.com/DevCristobalvc/zkp-jwt.git
cd zkp-jwt

# Install dependencies
npm install

# Setup circuits (generates .zkey and .wasm files)
npm run setup:circuits

# Build the library
npm run build:library

# Run frontend demo
npm run dev:frontend
```

---

## 📁 Project Structure

```
zkp-jwt/
├── circuits/                    # 🔐 ZK Circuits (Circom)
│   ├── merkle_membership.circom # Main circuit
│   ├── setup.sh                 # Trusted setup script
│   ├── test/                    # Circuit tests
│   └── build/                   # Compiled outputs (.wasm, .zkey)
│
├── contracts/                   # 📝 Smart Contracts (Rust/Stylus)
│   ├── src/
│   │   ├── lib.rs              # Main contract logic
│   │   └── verifier.rs         # Groth16 verifier
│   ├── Cargo.toml
│   └── DEPLOYMENT.md           # Deployment instructions
│
├── library/                     # 📚 TypeScript Library
│   ├── src/
│   │   ├── merkle.ts           # Merkle tree operations
│   │   ├── encryption.ts       # AES-256-GCM encryption
│   │   ├── zkpjwt.ts          # Token generation/parsing
│   │   ├── proof.ts            # ZK proof generation
│   │   └── index.ts            # Public API
│   ├── tests/                  # Unit tests
│   └── package.json
│
├── frontend/                    # 🖥️ Demo Application (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── SenderPanel.tsx
│   │   │   └── ReceiverPanel.tsx
│   │   └── App.tsx
│   └── package.json
│
├── tests/                       # 🧪 E2E Tests
│   └── e2e_backend.js
│
├── docs/                        # 📖 Documentation
│   ├── PROTOCOL_SPEC.md
│   └── GAS_ANALYSIS.md
│
├── TASKS.md                     # Task tracker
└── README.md
```

---

## 🔄 How It Works

### 1️⃣ Sender Flow

```typescript
import { createZKPJWT, createMerkleTree } from 'zkpjwt';

// 1. Define authorized wallets
const authorizedWallets = [
  '0xAAA...', 
  '0xBBB...', 
  '0xCCC...'
];

// 2. Create Merkle tree and get root
const tree = createMerkleTree(authorizedWallets);
const root = getMerkleRoot(tree);

// 3. Encrypt message
const token = createZKPJWT('Secret message', authorizedWallets);

// 4. Publish root on-chain
await contract.set_root(root);

// 5. Share ZKPJWT token
console.log(token); // Distribute to receivers
```

### 2️⃣ Receiver Flow

```typescript
import { parseZKPJWT, generateProof } from 'zkpjwt';

// 1. Parse received token
const token = parseZKPJWT(tokenString);

// 2. Generate ZK proof (wallet must be in authorized list)
const proof = await generateProof(myWallet, tree);

// 3. Submit proof to contract
await contract.unlock_message(proof, token.merkle_root);

// 4. Listen for AccessGranted event
contract.on('AccessGranted', (key) => {
  // 5. Decrypt message
  const message = decryptMessage(token.encrypted_message, key);
  console.log(message); // "Secret message"
});
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Blockchain** | Arbitrum Sepolia (Stylus) | Low-cost ZK verification |
| **Smart Contract** | Rust | ~10x cheaper gas than Solidity |
| **ZK Circuits** | Circom | Merkle membership proof |
| **Proof System** | Groth16 (SnarkJS) | Fast verification |
| **Library** | TypeScript | Developer-friendly API |
| **Encryption** | AES-256-GCM | Message encryption |
| **Hashing** | Poseidon | ZK-friendly hash function |
| **Frontend** | React + Vite | Demo application |

---

## 📊 Performance

### Gas Costs (Arbitrum Sepolia)

| Operation | Stylus (Rust) | Solidity | Savings |
|-----------|---------------|----------|---------|
| `set_root()` | ~50k gas | ~50k gas | - |
| `verify_proof()` | ~350k gas | ~2.5M gas | **~85%** |
| Total per unlock | ~400k gas | ~2.5M gas | **~84%** |

### Timings

- **Proof Generation**: ~3-5 seconds
- **On-Chain Verification**: <1 second
- **End-to-End Flow**: <10 seconds

---

## 🧪 Testing

```bash
# Run library tests
npm run test:library

# Run E2E backend tests
npm run test:e2e

# Test circuits
cd circuits && npm test

# Deploy and test contract
cd contracts && cargo stylus deploy
```

---

## 📖 Documentation

- **[Protocol Specification](docs/PROTOCOL_SPEC.md)** - Technical details
- **[API Reference](library/README.md)** - Library documentation
- **[Gas Analysis](docs/GAS_ANALYSIS.md)** - Performance metrics
- **[Task Tracker](TASKS.md)** - Development progress

---

## 🎥 Demo

🔗 **Live Demo**: [Coming Soon]  
📹 **Video Tutorial**: [Coming Soon]

---

## 🚧 Development Status

This project is part of [ARG25 - Arbitrum Research Grant](https://github.com/invisible-garden/arg25-projects).

**Current Phase**: Week 2/3 - Implementation in progress

See [TASKS.md](TASKS.md) for detailed progress tracking.

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **GitHub**: [DevCristobalvc/zkp-jwt](https://github.com/DevCristobalvc/zkp-jwt)
- **Arbitrum Stylus Docs**: [docs.arbitrum.io/stylus](https://docs.arbitrum.io/stylus/stylus-gentle-introduction)
- **Circom Docs**: [docs.circom.io](https://docs.circom.io/)
- **ARG25 Projects**: [invisible-garden/arg25-projects](https://github.com/invisible-garden/arg25-projects)

---

## 👤 Author

**DevCristobalvc**
- GitHub: [@DevCristobalvc](https://github.com/DevCristobalvc)
- Devfolio: [@DevCristobalvc](https://devfolio.co/@DevCristobalvc)

---

## 🙏 Acknowledgments

- Arbitrum Foundation for the ARG25 program
- Invisible Garden community
- Circom & SnarkJS developers
- Stylus team at Offchain Labs

---

**Built with ❤️ for privacy-preserving decentralized systems**
