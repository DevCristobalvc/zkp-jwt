/**
 * ZKPJWT Core Library - Type Definitions
 */

/**
 * Merkle tree configuration
 */
export interface MerkleTreeConfig {
  levels: number;
  zeroValue?: bigint;
}

/**
 * Merkle tree structure
 */
export interface MerkleTree {
  root: bigint;
  leaves: bigint[];
  levels: number;
}

/**
 * Merkle proof for a specific leaf
 */
export interface MerkleProof {
  address: string;
  addressHash: bigint;
  pathIndices: number[];
  siblings: bigint[];
  root: bigint;
  leafIndex: number;
}

/**
 * Groth16 proof structure (snarkjs format)
 */
export interface Groth16Proof {
  pi_a: [string, string, string];
  pi_b: [[string, string], [string, string], [string, string]];
  pi_c: [string, string, string];
  protocol: string;
  curve: string;
}

/**
 * Public signals for the circuit
 */
export type PublicSignals = string[];

/**
 * Full ZK proof data
 */
export interface ZKProof {
  proof: Groth16Proof;
  publicSignals: PublicSignals;
  merkleRoot: bigint;
}

/**
 * Verification result
 */
export interface VerificationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Contract configuration
 */
export interface ContractConfig {
  address: string;
  rpcUrl: string;
  chainId: number;
}

/**
 * Library configuration
 */
export interface ZKPJWTConfig {
  circuitWasmPath: string;
  zkeyPath: string;
  verificationKeyPath: string;
  contract?: ContractConfig;
}

/**
 * Proof generation input
 */
export interface ProofInput {
  address: string;
  pathIndices: number[];
  siblings: string[];
  root: string;
}

/**
 * Contract interaction result
 */
export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  gasUsed?: bigint;
}
