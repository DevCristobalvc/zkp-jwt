import { useState } from 'react';
import { ethers } from 'ethers';

// Importar la librería local y sus tipos
import { 
  MerkleTreeBuilder, 
  ProofGenerator, 
  ProofVerifier,
  type ZKProof
} from '@zkpjwt/core';

// Contract address on Arbitrum Sepolia
const CONTRACT_ADDRESS = '0xa0539e9c8701e714f94400153eeed5d05af6e496';

// Contract ABI - solo las funciones que necesitamos
const CONTRACT_ABI = [
  'function getRoot() external view returns (uint256)',
  'function setRoot(uint256 new_root) external',
  'function verifyProof(uint256 proof_root) external view returns (bool)'
];

export function useZKPJWT() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Connect wallet
  async function connectWallet() {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      
      return {
        address: accounts[0],
        provider,
        signer
      };
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  // Build Merkle tree with sample addresses
  async function buildMerkleTree(userAddress: string) {
    try {
      setLoading(true);
      setError(null);

      // Create sample allowlist with user address
      const addresses = [
        userAddress.toLowerCase(),
        '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        '0x1234567890123456789012345678901234567890',
        '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
      ];

      const builder = new MerkleTreeBuilder({ levels: 10 });
      await builder.initialize();
      
      const tree = await builder.buildTree(addresses);
      const merkleProof = builder.getMerkleProof(userAddress.toLowerCase());

      setLoading(false);
      return {
        tree,
        merkleProof,
        root: tree.root
      };
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  }

  // Generate ZK proof
  async function generateZKProof(merkleProof: any): Promise<ZKProof> {
    try {
      setLoading(true);
      setError(null);

      // Create prover with custom paths (files are in /circuits/ folder)
      const prover = new ProofGenerator('/circuits/circuit.wasm', '/circuits/proving_key.zkey');
      const zkProof = await prover.generateProof(merkleProof);

      setLoading(false);
      return zkProof;
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  }

  // Verify proof client-side
  async function verifyProofClientSide(zkProof: ZKProof): Promise<boolean> {
    try {
      setLoading(true);
      setError(null);

      // Create verifier with custom verification key path
      const verifier = new ProofVerifier('/circuits/verification_key.json');
      const result = await verifier.verifyProof(zkProof);

      setLoading(false);
      return result.isValid;
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  }

  // Set root on contract (requires admin)
  async function setRootOnChain(signer: ethers.Signer, root: string) {
    try {
      setLoading(true);
      setError(null);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.setRoot(root);
      const receipt = await tx.wait();

      setLoading(false);
      return receipt;
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  }

  // Verify proof on-chain
  async function verifyProofOnChain(provider: ethers.Provider, root: string): Promise<boolean> {
    try {
      setLoading(true);
      setError(null);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const isValid = await contract.verifyProof(root);

      setLoading(false);
      return isValid;
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  }

  // Get current root from contract
  async function getCurrentRoot(provider: ethers.Provider): Promise<string> {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const root = await contract.getRoot();
      return root.toString();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  return {
    loading,
    error,
    connectWallet,
    buildMerkleTree,
    generateZKProof,
    verifyProofClientSide,
    setRootOnChain,
    verifyProofOnChain,
    getCurrentRoot
  };
}
