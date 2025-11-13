/**
 * ZKPJWT Core Library
 * 
 * Privacy-preserving access control using Zero-Knowledge Proofs
 * on Arbitrum Stylus.
 * 
 * @module @zkpjwt/core
 */

// Export types
export type {
  MerkleTreeConfig,
  MerkleTree,
  MerkleProof,
  Groth16Proof,
  PublicSignals,
  ZKProof,
  VerificationResult,
  ContractConfig,
  ZKPJWTConfig,
  ProofInput,
  TransactionResult
} from './types';

// Export main modules
export { MerkleTreeBuilder } from './merkle';
// export { ProofGenerator } from './prover'; // T2.3
// export { ProofVerifier } from './verifier'; // T2.3
// export { ContractClient } from './contract'; // T2.4

// Export constants
export { CIRCUIT_ARTIFACTS, CONTRACT_ABI, DEFAULT_CONTRACT_CONFIG } from './constants';

/**
 * Library version
 */
export const VERSION = '0.1.0';

/**
 * Default configuration
 */
export const DEFAULT_CONFIG = {
  MERKLE_TREE_LEVELS: 10,
  MAX_LEAVES: 1024,
  ZERO_VALUE: 0n
} as const;
