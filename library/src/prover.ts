/**
 * Proof Generator and Verifier
 * 
 * Generates and verifies Groth16 zero-knowledge proofs using snarkjs.
 * Implements client-side verification before on-chain submission.
 */

import { groth16 } from 'snarkjs';
import type { MerkleProof, ZKProof, VerificationResult, Groth16Proof, PublicSignals } from './types';
import { CIRCUIT_ARTIFACTS } from './constants';

export class ProofGenerator {
  private wasmPath: string;
  private zkeyPath: string;
  private wasmBuffer: Uint8Array | null = null;
  private zkeyBuffer: Uint8Array | null = null;

  constructor(wasmPath?: string, zkeyPath?: string) {
    this.wasmPath = wasmPath ?? CIRCUIT_ARTIFACTS.WASM;
    this.zkeyPath = zkeyPath ?? CIRCUIT_ARTIFACTS.ZKEY;
  }

  /**
   * Load circuit artifacts
   */
  async loadArtifacts(): Promise<void> {
    if (typeof window !== 'undefined') {
      // Browser environment - fetch from public assets
      const [wasmRes, zkeyRes] = await Promise.all([
        fetch(this.wasmPath),
        fetch(this.zkeyPath)
      ]);

      this.wasmBuffer = new Uint8Array(await wasmRes.arrayBuffer());
      this.zkeyBuffer = new Uint8Array(await zkeyRes.arrayBuffer());
    } else {
      // Node.js environment - read from filesystem
      const fs = await import('fs');
      const path = await import('path');

      const wasmFullPath = path.resolve(process.cwd(), this.wasmPath.replace('/assets/', 'assets/'));
      const zkeyFullPath = path.resolve(process.cwd(), this.zkeyPath.replace('/assets/', 'assets/'));

      this.wasmBuffer = fs.readFileSync(wasmFullPath);
      this.zkeyBuffer = fs.readFileSync(zkeyFullPath);
    }
  }

  /**
   * Generate ZK proof from Merkle proof
   */
  async generateProof(merkleProof: MerkleProof): Promise<ZKProof> {
    if (!this.wasmBuffer || !this.zkeyBuffer) {
      await this.loadArtifacts();
    }

    // Prepare circuit input
    const input = {
      address: merkleProof.addressHash.toString(),
      pathIndices: merkleProof.pathIndices,
      siblings: merkleProof.siblings.map(s => s.toString()),
      root: merkleProof.root.toString()
    };

    // Generate proof with snarkjs
    const { proof, publicSignals } = await groth16.fullProve(
      input,
      this.wasmBuffer!,
      this.zkeyBuffer!
    );

    return {
      proof: proof as Groth16Proof,
      publicSignals: publicSignals as PublicSignals,
      merkleRoot: BigInt(publicSignals[0])
    };
  }

  /**
   * Export proof for Solidity contract (if needed)
   */
  async exportSolidityCallData(zkProof: ZKProof): Promise<string> {
    return await groth16.exportSolidityCallData(zkProof.proof, zkProof.publicSignals);
  }
}

export class ProofVerifier {
  private vkeyPath: string;
  private verificationKey: any = null;

  constructor(vkeyPath?: string) {
    this.vkeyPath = vkeyPath ?? CIRCUIT_ARTIFACTS.VERIFICATION_KEY;
  }

  /**
   * Load verification key
   */
  async loadVerificationKey(): Promise<void> {
    if (typeof window !== 'undefined') {
      // Browser environment
      const res = await fetch(this.vkeyPath);
      this.verificationKey = await res.json();
    } else {
      // Node.js environment
      const fs = await import('fs');
      const path = await import('path');

      const vkeyFullPath = path.resolve(
        process.cwd(),
        this.vkeyPath.replace('/assets/', 'assets/')
      );

      const vkeyData = fs.readFileSync(vkeyFullPath, 'utf8');
      this.verificationKey = JSON.parse(vkeyData);
    }
  }

  /**
   * Verify ZK proof client-side (FULL Groth16 verification)
   * 
   * This implements the complete pairing-based verification before
   * on-chain submission, as per ADR-001 hybrid verification strategy.
   */
  async verifyProof(zkProof: ZKProof): Promise<VerificationResult> {
    try {
      if (!this.verificationKey) {
        await this.loadVerificationKey();
      }

      const isValid = await groth16.verify(
        this.verificationKey,
        zkProof.publicSignals,
        zkProof.proof
      );

      return {
        isValid,
        error: isValid ? undefined : 'Proof verification failed'
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown verification error'
      };
    }
  }

  /**
   * Batch verify multiple proofs
   */
  async verifyBatch(zkProofs: ZKProof[]): Promise<VerificationResult[]> {
    if (!this.verificationKey) {
      await this.loadVerificationKey();
    }

    return Promise.all(zkProofs.map(proof => this.verifyProof(proof)));
  }

  /**
   * Get verification key
   */
  getVerificationKey(): any {
    return this.verificationKey;
  }
}
