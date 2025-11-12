# ZKPJWT TypeScript Library

TypeScript library for creating and verifying ZKPJWT tokens.

## 📁 Structure

```
library/
├── src/
│   ├── index.ts              # Public API exports (to be created)
│   ├── types.ts              # TypeScript types (to be created)
│   ├── merkle.ts             # Merkle tree operations (to be implemented)
│   ├── encryption.ts         # AES-256-GCM encryption (to be implemented)
│   ├── zkpjwt.ts            # Token generation/parsing (to be implemented)
│   └── proof.ts              # ZK proof generation (to be implemented)
├── tests/                    # Unit tests (to be created)
├── build/                    # Circuit files (.wasm, .zkey)
├── package.json              # To be created
└── tsconfig.json             # To be created
```

## 🚀 Installation

```bash
npm install zkpjwt
```

## 📖 Usage

### Sender (Encrypt Message)

```typescript
import { createZKPJWT, createMerkleTree, getMerkleRoot } from 'zkpjwt';

const wallets = ['0xAAA...', '0xBBB...', '0xCCC...'];
const token = createZKPJWT('Secret message', wallets);
const tree = createMerkleTree(wallets);
const root = getMerkleRoot(tree);

console.log(token);
// Publish root on-chain: await contract.set_root(root);
```

### Receiver (Verify & Decrypt)

```typescript
import { parseZKPJWT, generateProof, decryptMessage } from 'zkpjwt';

const token = parseZKPJWT(tokenString);
const proof = await generateProof(myWallet, tree);

// Submit proof on-chain: await contract.unlock_message(proof, root);
// Listen for AccessGranted event with key K
const message = decryptMessage(token.encrypted_message, key);
```

## 🧪 Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Watch mode
npm run dev
```

---

**Status:** 🚧 To be implemented in Hito 2 (Tasks T2.1-T2.6)
