# ZKPJWT Protocol Specification

> **Status:** Draft - To be finalized during implementation

## Overview

ZKPJWT (Zero-Knowledge Proof JSON Web Token) is a decentralized protocol for privacy-preserving access control using Zero-Knowledge Proofs and blockchain verification.

## Token Format

### ZKPJWT Token Structure

```typescript
interface ZKPJWTToken {
  version: string;                    // Protocol version (e.g., "1.0")
  merkle_root: string;               // Hex-encoded Merkle root
  encrypted_message: {
    ciphertext: string;              // Base64-encoded encrypted data
    iv: string;                      // Base64-encoded initialization vector
    auth_tag: string;                // Base64-encoded authentication tag
  };
  metadata?: {
    timestamp: number;               // Unix timestamp
    expires?: number;                // Expiration timestamp (optional)
    creator?: string;                // Creator address (optional)
  };
}
```

### Example Token

```json
{
  "version": "1.0",
  "merkle_root": "0x1234567890abcdef...",
  "encrypted_message": {
    "ciphertext": "base64encodeddata...",
    "iv": "base64encodediv...",
    "auth_tag": "base64encodedtag..."
  },
  "metadata": {
    "timestamp": 1699999999,
    "expires": 1700086399
  }
}
```

## Cryptographic Primitives

### Hashing
- **Poseidon Hash**: Used in ZK circuits for Merkle tree
- **Keccak256**: Used for Ethereum address hashing

### Encryption
- **Algorithm**: AES-256-GCM
- **Key Size**: 256 bits
- **IV Size**: 96 bits (12 bytes)
- **Auth Tag Size**: 128 bits (16 bytes)

### Zero-Knowledge Proof
- **Proving System**: Groth16
- **Curve**: BN254 (alt_bn128)
- **Circuit**: Merkle membership verification

## Protocol Flow

### Phase 1: Setup (Sender)

1. **Define Access List**
   ```
   wallets = [addr1, addr2, ..., addrN]
   ```

2. **Build Merkle Tree**
   ```
   leaves = wallets.map(addr => poseidon(addr))
   tree = buildMerkleTree(leaves)
   root = tree.getRoot()
   ```

3. **Encrypt Message**
   ```
   key = randomBytes(32)
   iv = randomBytes(12)
   ciphertext, authTag = AES-GCM.encrypt(message, key, iv)
   ```

4. **Create Token**
   ```
   token = {
     version: "1.0",
     merkle_root: root,
     encrypted_message: {
       ciphertext: base64(ciphertext),
       iv: base64(iv),
       auth_tag: base64(authTag)
     }
   }
   ```

5. **Publish Root On-Chain**
   ```
   contract.set_root(root)
   ```

### Phase 2: Access (Receiver)

1. **Receive Token**
   ```
   token = parseZKPJWT(tokenString)
   ```

2. **Generate ZK Proof**
   ```
   myAddress = wallet.getAddress()
   path = tree.getProof(myAddress)
   proof = generateGroth16Proof({
     private: { address: myAddress, siblings: path },
     public: { root: token.merkle_root }
   })
   ```

3. **Submit Proof On-Chain**
   ```
   tx = contract.unlock_message(proof, token.merkle_root)
   await tx.wait()
   ```

4. **Listen for Event**
   ```
   contract.on('AccessGranted', (key) => {
     message = AES-GCM.decrypt(
       token.encrypted_message.ciphertext,
       key,
       token.encrypted_message.iv,
       token.encrypted_message.auth_tag
     )
   })
   ```

## Smart Contract Interface

### Functions

```solidity
// Store a Merkle root
function set_root(bytes32 root) external;

// Verify proof and grant access
function unlock_message(
    bytes calldata proof,
    bytes32 root
) external returns (bool);

// Get root status
function isRootValid(bytes32 root) external view returns (bool);
```

### Events

```solidity
event AccessGranted(
    address indexed user,
    bytes32 indexed root,
    uint256 timestamp
);

event AccessDenied(
    address indexed user,
    bytes32 indexed root,
    string reason
);

event RootPublished(
    bytes32 indexed root,
    address indexed publisher,
    uint256 timestamp
);
```

## Security Considerations

### Threat Model

1. **Malicious Receiver**: Cannot decrypt without valid proof
2. **Man-in-the-Middle**: Token can be intercepted but not decrypted
3. **Replay Attacks**: Root can be used multiple times (by design)
4. **Brute Force**: AES-256 provides 2^256 security

### Best Practices

- Use fresh random keys for each message
- Set expiration timestamps in metadata
- Validate all inputs in smart contract
- Use secure random number generation
- Implement rate limiting if needed

## Gas Optimization

### Stylus vs Solidity

| Operation | Stylus (Rust) | Solidity | Improvement |
|-----------|---------------|----------|-------------|
| Proof Verification | ~350k | ~2.5M | **~85%** |
| Root Storage | ~50k | ~50k | Same |

### Optimization Techniques

1. **Batch Verification**: Verify multiple proofs in one transaction
2. **Calldata Compression**: Compress proof data
3. **Storage Optimization**: Use mapping instead of arrays

## Limitations

- **Tree Size**: Maximum 2^10 (1024) wallets per tree
- **Proof Time**: ~3-5 seconds on consumer hardware
- **Gas Cost**: ~400k gas per unlock (Arbitrum Sepolia)

## Future Improvements

1. **Recursive Proofs**: Aggregate multiple proofs
2. **PLONK**: Alternative proving system for flexibility
3. **Multi-Chain**: Deploy on multiple networks
4. **Revocation**: Mechanism to revoke access

---

**Version:** 1.0-draft  
**Last Updated:** November 12, 2025  
**Status:** 🚧 Under Development
