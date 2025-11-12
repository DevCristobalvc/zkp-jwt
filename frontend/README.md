# ZKPJWT Frontend Demo

React + TypeScript demo application for the ZKPJWT protocol.

## 📁 Structure

```
frontend/
├── src/
│   ├── App.tsx               # Main application (to be created)
│   ├── components/
│   │   ├── ConnectWallet.tsx # Wallet connection (to be implemented)
│   │   ├── SenderPanel.tsx   # Sender UI (to be implemented)
│   │   └── ReceiverPanel.tsx # Receiver UI (to be implemented)
│   ├── hooks/
│   │   └── useContract.ts    # Contract interaction hook (to be implemented)
│   └── lib/
│       └── zkpjwt.ts        # Library wrapper (to be implemented)
├── package.json              # To be created
├── vite.config.ts            # To be created
└── tsconfig.json             # To be created
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🔧 Prerequisites

- MetaMask installed
- Connected to Arbitrum Sepolia testnet
- Some testnet ETH (get from faucet)

## 📖 Features

### Sender Panel
- Enter message to encrypt
- Input list of authorized wallets
- Generate ZKPJWT token
- Publish Merkle root on-chain

### Receiver Panel
- Paste ZKPJWT token
- Generate ZK proof with connected wallet
- Submit proof on-chain
- Automatically decrypt message on success

---

**Status:** 🚧 To be implemented in Hito 3 (Tasks T3.1-T3.6)
