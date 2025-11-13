/**
 * Contract Client
 * 
 * Interacts with the ZKPJWTVerifier contract deployed on Arbitrum Stylus.
 * Handles root updates, proof verification, and transaction management.
 */

import { ethers, Contract, Wallet, BrowserProvider, JsonRpcProvider, TransactionResponse } from 'ethers';
import type { ContractConfig, TransactionResult } from './types';
import { CONTRACT_ABI, DEFAULT_CONTRACT_CONFIG } from './constants';

export class ContractClient {
  private provider: JsonRpcProvider | BrowserProvider;
  private contract: Contract;
  private signer: Wallet | ethers.Signer | null = null;
  private config: ContractConfig;

  constructor(config?: Partial<ContractConfig>, provider?: JsonRpcProvider | BrowserProvider) {
    this.config = {
      ...DEFAULT_CONTRACT_CONFIG,
      ...config
    };

    if (provider) {
      this.provider = provider;
    } else {
      this.provider = new JsonRpcProvider(this.config.rpcUrl);
    }

    this.contract = new Contract(
      this.config.address,
      CONTRACT_ABI,
      this.provider
    );
  }

  /**
   * Connect wallet (for write operations)
   */
  async connectWallet(walletOrPrivateKey: string | Wallet | ethers.Signer): Promise<void> {
    if (typeof walletOrPrivateKey === 'string') {
      // Private key provided
      this.signer = new Wallet(walletOrPrivateKey, this.provider);
    } else {
      // Wallet or Signer object provided
      this.signer = walletOrPrivateKey;
    }

    this.contract = this.contract.connect(this.signer) as Contract;
  }

  /**
   * Connect browser wallet (MetaMask, etc.)
   */
  async connectBrowserWallet(): Promise<string> {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('No browser wallet detected. Please install MetaMask.');
    }

    const provider = new BrowserProvider((window as any).ethereum);
    await provider.send('eth_requestAccounts', []);
    
    const signer = await provider.getSigner();
    this.signer = signer;
    this.provider = provider;
    this.contract = this.contract.connect(signer) as Contract;

    return await signer.getAddress();
  }

  /**
   * Get current Merkle root from contract
   */
  async getRoot(): Promise<bigint> {
    const root = await this.contract.getRoot();
    return BigInt(root.toString());
  }

  /**
   * Set new Merkle root (owner only)
   */
  async setRoot(newRoot: bigint): Promise<TransactionResult> {
    if (!this.signer) {
      throw new Error('Wallet not connected. Call connectWallet() first.');
    }

    try {
      const tx: TransactionResponse = await this.contract.setRoot(newRoot);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt!.hash,
        gasUsed: receipt!.gasUsed
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Verify proof on-chain (checks if root matches)
   */
  async verifyProof(merkleRoot: bigint): Promise<boolean> {
    try {
      const isValid = await this.contract.verifyProof(merkleRoot);
      return Boolean(isValid);
    } catch (error) {
      // Contract reverts if root doesn't match
      if (error instanceof Error && error.message.includes('Merkle root does not match')) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get contract owner
   */
  async getOwner(): Promise<string> {
    return await this.contract.getOwner();
  }

  /**
   * Transfer ownership (owner only)
   */
  async transferOwnership(newOwner: string): Promise<TransactionResult> {
    if (!this.signer) {
      throw new Error('Wallet not connected. Call connectWallet() first.');
    }

    try {
      const tx: TransactionResponse = await this.contract.transferOwnership(newOwner);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt!.hash,
        gasUsed: receipt!.gasUsed
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Initialize contract (one-time setup)
   */
  async initialize(): Promise<TransactionResult> {
    if (!this.signer) {
      throw new Error('Wallet not connected. Call connectWallet() first.');
    }

    try {
      const tx: TransactionResponse = await this.contract.init();
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt!.hash,
        gasUsed: receipt!.gasUsed
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Estimate gas for setRoot operation
   */
  async estimateSetRootGas(newRoot: bigint): Promise<bigint> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    const estimate = await this.contract.setRoot.estimateGas(newRoot);
    return estimate;
  }

  /**
   * Get contract address
   */
  getContractAddress(): string {
    return this.config.address;
  }

  /**
   * Get network configuration
   */
  getNetworkConfig(): ContractConfig {
    return { ...this.config };
  }

  /**
   * Get explorer URL for transaction
   */
  getExplorerUrl(txHash: string): string {
    const explorerUrl = this.config.chainId === 421614
      ? 'https://sepolia.arbiscan.io'
      : 'https://arbiscan.io';
    return `${explorerUrl}/tx/${txHash}`;
  }

  /**
   * Get signer address
   */
  async getSignerAddress(): Promise<string | null> {
    if (!this.signer) return null;
    if ('getAddress' in this.signer) {
      return await this.signer.getAddress();
    }
    return null;
  }

  /**
   * Check if wallet is connected
   */
  isWalletConnected(): boolean {
    return this.signer !== null;
  }
}
