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

// Export main modules (will be implemented in T2.2-T2.4)
// export { MerkleTreeBuilder } from './merkle';
// export { ProofGenerator } from './prover';
// export { ProofVerifier } from './verifier';
// export { ContractClient } from './contract';

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
