/**
 * Merkle Tree Builder
 * 
 * Constructs Merkle trees using Poseidon hash for zero-knowledge proofs.
 * Compatible with the merkle_membership.circom circuit.
 */

import { buildPoseidon } from 'circomlibjs';
import type { MerkleTree, MerkleProof, MerkleTreeConfig } from './types';

export class MerkleTreeBuilder {
  private poseidon: any;
  private levels: number;
  private maxLeaves: number;
  private zeroValue: bigint;
  private zeroHashes: bigint[];
  private tree: bigint[][] | null = null;
  private leaves: bigint[] = [];

  constructor(config: MerkleTreeConfig = { levels: 10 }) {
    this.levels = config.levels;
    this.maxLeaves = 2 ** this.levels;
    this.zeroValue = config.zeroValue ?? 0n;
    this.zeroHashes = [];
  }

  /**
   * Initialize Poseidon hash function
   */
  async initialize(): Promise<void> {
    this.poseidon = await buildPoseidon();
    this._computeZeroHashes();
  }

  /**
   * Precompute zero hashes for each level
   */
  private _computeZeroHashes(): void {
    this.zeroHashes = new Array(this.levels + 1);
    this.zeroHashes[0] = this.zeroValue;

    for (let i = 1; i <= this.levels; i++) {
      this.zeroHashes[i] = this._hash([this.zeroHashes[i - 1], this.zeroHashes[i - 1]]);
    }
  }

  /**
   * Convert Ethereum address to field element
   */
  addressToFieldElement(address: string): bigint {
    const cleanAddress = address.toLowerCase().replace('0x', '');
    return BigInt('0x' + cleanAddress);
  }

  /**
   * Hash a value using Poseidon(1) - for leaves
   */
  private _hashLeaf(value: bigint): bigint {
    const hash = this.poseidon([value]);
    return this.poseidon.F.toObject(hash);
  }

  /**
   * Hash two values using Poseidon(2) - for internal nodes
   */
  private _hash(values: bigint[]): bigint {
    const hash = this.poseidon(values);
    return this.poseidon.F.toObject(hash);
  }

  /**
   * Build Merkle tree from addresses
   */
  async buildTree(addresses: string[]): Promise<MerkleTree> {
    if (!this.poseidon) {
      throw new Error('MerkleTreeBuilder not initialized. Call initialize() first.');
    }

    if (addresses.length === 0) {
      throw new Error('Cannot build tree with zero addresses');
    }

    if (addresses.length > this.maxLeaves) {
      throw new Error(`Too many addresses. Max: ${this.maxLeaves}, got: ${addresses.length}`);
    }

    // Convert addresses to field elements and hash as leaves
    this.leaves = addresses.map(addr => {
      const fieldElement = this.addressToFieldElement(addr);
      return this._hashLeaf(fieldElement);
    });

    // Pad with zero hash (hash of zero value)
    const zeroLeafHash = this._hashLeaf(this.zeroValue);
    while (this.leaves.length < this.maxLeaves) {
      this.leaves.push(zeroLeafHash);
    }

    // Build tree bottom-up
    this.tree = [this.leaves];

    for (let level = 0; level < this.levels; level++) {
      const currentLevel = this.tree[level];
      const nextLevel: bigint[] = [];

      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1];
        const parent = this._hash([left, right]);
        nextLevel.push(parent);
      }

      this.tree.push(nextLevel);
    }

    const root = this.tree[this.levels][0];

    return {
      root,
      leaves: this.leaves,
      levels: this.levels
    };
  }

  /**
   * Generate Merkle proof for a specific address
   */
  getMerkleProof(address: string): MerkleProof {
    if (!this.tree) {
      throw new Error('Tree not built. Call buildTree() first.');
    }

    const addressHash = this.addressToFieldElement(address);
    const leafHash = this._hashLeaf(addressHash);

    // Find leaf index
    const leafIndex = this.leaves.indexOf(leafHash);
    if (leafIndex === -1) {
      throw new Error(`Address ${address} not found in tree`);
    }

    const pathIndices: number[] = [];
    const siblings: bigint[] = [];

    let currentIndex = leafIndex;

    for (let level = 0; level < this.levels; level++) {
      const isLeftChild = currentIndex % 2 === 0;
      const siblingIndex = isLeftChild ? currentIndex + 1 : currentIndex - 1;

      pathIndices.push(isLeftChild ? 0 : 1);
      siblings.push(this.tree[level][siblingIndex]);

      currentIndex = Math.floor(currentIndex / 2);
    }

    return {
      address,
      addressHash,
      pathIndices,
      siblings,
      root: this.tree[this.levels][0],
      leafIndex
    };
  }

  /**
   * Get the root of the tree
   */
  getRoot(): bigint {
    if (!this.tree) {
      throw new Error('Tree not built');
    }
    return this.tree[this.levels][0];
  }

  /**
   * Get leaf index for an address
   */
  getLeafIndex(address: string): number {
    if (!this.tree) {
      throw new Error('Tree not built');
    }

    const addressHash = this.addressToFieldElement(address);
    const leafHash = this._hashLeaf(addressHash);
    return this.leaves.indexOf(leafHash);
  }

  /**
   * Verify a Merkle proof locally
   */
  verifyProof(proof: MerkleProof): boolean {
    let currentHash = this._hashLeaf(proof.addressHash);

    for (let i = 0; i < this.levels; i++) {
      const sibling = proof.siblings[i];
      const isLeft = proof.pathIndices[i] === 0;

      currentHash = isLeft
        ? this._hash([currentHash, sibling])
        : this._hash([sibling, currentHash]);
    }

    return currentHash === proof.root;
  }

  /**
   * Get all leaves
   */
  getLeaves(): bigint[] {
    return [...this.leaves];
  }

  /**
   * Get tree statistics
   */
  getStats() {
    return {
      levels: this.levels,
      maxLeaves: this.maxLeaves,
      currentLeaves: this.leaves.length,
      root: this.tree ? this.getRoot().toString() : 'not built',
      depth: this.tree ? this.tree.length : 0
    };
  }
}
