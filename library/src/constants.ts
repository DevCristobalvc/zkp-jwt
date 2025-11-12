/**
 * Circuit artifacts configuration
 * 
 * These paths point to the compiled circuit files needed for
 * proof generation and verification.
 */

export const CIRCUIT_ARTIFACTS = {
  WASM: '/assets/merkle_membership.wasm',
  ZKEY: '/assets/merkle_final.zkey',
  VERIFICATION_KEY: '/assets/verification_key.json'
} as const;

/**
 * Contract ABI for ZKPJWTVerifier
 */
export const CONTRACT_ABI = [
  "function init() external",
  "function getRoot() external view returns (uint256)",
  "function setRoot(uint256 new_root) external",
  "function getOwner() external view returns (address)",
  "function transferOwnership(address new_owner) external",
  "function verifyProof(uint256 proof_root) external view returns (bool)"
] as const;

/**
 * Default contract configuration for Arbitrum Sepolia
 */
export const DEFAULT_CONTRACT_CONFIG = {
  chainId: 421614,
  rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
  address: '0xa0539e9c8701e714f94400153eeed5d05af6e496', // Deployed contract
  explorerUrl: 'https://sepolia.arbiscan.io'
} as const;
