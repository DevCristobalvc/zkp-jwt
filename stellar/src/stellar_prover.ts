import * as snarkjs from 'snarkjs'
import { buildPoseidon } from 'circomlibjs'

const LEVELS = 10
const MAX_LEAVES = 2 ** LEVELS

export interface MerkleTree {
  root: bigint
  leaves: bigint[]
}

export interface MerkleProof {
  walletAddress: bigint
  pathIndices: number[]
  siblings: bigint[]
  root: bigint
}

export interface Groth16Proof {
  proof: {
    pi_a: string[]
    pi_b: string[][]
    pi_c: string[]
    protocol: string
    curve: string
  }
  publicSignals: string[]
}

let poseidonInstance: any = null

async function getPoseidon() {
  if (!poseidonInstance) poseidonInstance = await buildPoseidon()
  return poseidonInstance
}

function stellarAddressToField(stellarAddress: string): bigint {
  const bytes = Buffer.from(stellarAddress, 'base64')
  const hex = bytes.slice(0, 32).toString('hex')
  return BigInt('0x' + hex)
}

export async function buildMerkleTree(stellarAddresses: string[]): Promise<MerkleTree> {
  const poseidon = await getPoseidon()
  const F = poseidon.F

  const leaves = stellarAddresses.map((addr) => {
    const field = stellarAddressToField(addr)
    const hash = poseidon([field])
    return BigInt(F.toString(hash))
  })

  const paddedLeaves = [...leaves]
  const zeroLeaf = BigInt(F.toString(poseidon([0n])))
  while (paddedLeaves.length < MAX_LEAVES) paddedLeaves.push(zeroLeaf)

  let currentLevel = paddedLeaves
  while (currentLevel.length > 1) {
    const nextLevel: bigint[] = []
    for (let i = 0; i < currentLevel.length; i += 2) {
      const h = poseidon([currentLevel[i], currentLevel[i + 1]])
      nextLevel.push(BigInt(F.toString(h)))
    }
    currentLevel = nextLevel
  }

  return { root: currentLevel[0], leaves: paddedLeaves }
}

export async function generateMerkleProof(
  tree: MerkleTree,
  stellarAddress: string
): Promise<MerkleProof> {
  const poseidon = await getPoseidon()
  const F = poseidon.F

  const field = stellarAddressToField(stellarAddress)
  const leafHash = BigInt(F.toString(poseidon([field])))
  const leafIndex = tree.leaves.indexOf(leafHash)

  if (leafIndex === -1) throw new Error(`Address not found in Merkle tree`)

  const pathIndices: number[] = []
  const siblings: bigint[] = []
  let currentIndex = leafIndex
  let currentLevel = [...tree.leaves]

  for (let i = 0; i < LEVELS; i++) {
    const isLeft = currentIndex % 2 === 0
    pathIndices.push(isLeft ? 0 : 1)
    siblings.push(currentLevel[isLeft ? currentIndex + 1 : currentIndex - 1])

    const nextLevel: bigint[] = []
    for (let j = 0; j < currentLevel.length; j += 2) {
      const h = poseidon([currentLevel[j], currentLevel[j + 1]])
      nextLevel.push(BigInt(F.toString(h)))
    }
    currentLevel = nextLevel
    currentIndex = Math.floor(currentIndex / 2)
  }

  return {
    walletAddress: field,
    pathIndices,
    siblings,
    root: tree.root,
  }
}

export async function generateProof(
  proof: MerkleProof,
  wasmPath: string,
  zkeyPath: string
): Promise<Groth16Proof> {
  const input = {
    walletAddress: proof.walletAddress.toString(),
    pathIndices: proof.pathIndices.map(String),
    siblings: proof.siblings.map(String),
    root: proof.root.toString(),
  }

  const { proof: groth16Proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    wasmPath,
    zkeyPath
  )

  return { proof: groth16Proof, publicSignals }
}

export async function verifyProofLocally(
  proof: Groth16Proof,
  verificationKeyPath: string
): Promise<boolean> {
  const vk = JSON.parse(require('fs').readFileSync(verificationKeyPath, 'utf8'))
  return snarkjs.groth16.verify(vk, proof.publicSignals, proof.proof)
}

export function proofToSorobanBytes(proof: Groth16Proof): {
  proofA: Uint8Array
  proofB: Uint8Array
  proofC: Uint8Array
  publicSignals: Uint8Array[]
} {
  function g1ToBytes(g1: string[]): Uint8Array {
    const x = BigInt(g1[0])
    const y = BigInt(g1[1])
    const result = new Uint8Array(96)
    const xBytes = x.toString(16).padStart(96, '0')
    const yBytes = y.toString(16).padStart(96, '0')
    for (let i = 0; i < 48; i++) {
      result[i] = parseInt(xBytes.slice(i * 2, i * 2 + 2), 16)
      result[i + 48] = parseInt(yBytes.slice(i * 2, i * 2 + 2), 16)
    }
    return result
  }

  function g2ToBytes(g2: string[][]): Uint8Array {
    const result = new Uint8Array(192)
    const coords = [g2[0][0], g2[0][1], g2[1][0], g2[1][1]]
    coords.forEach((c, idx) => {
      const hex = BigInt(c).toString(16).padStart(96, '0')
      for (let i = 0; i < 48; i++) {
        result[idx * 48 + i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
      }
    })
    return result
  }

  function fieldToBytes(s: string): Uint8Array {
    const hex = BigInt(s).toString(16).padStart(64, '0')
    return Uint8Array.from(Buffer.from(hex, 'hex'))
  }

  return {
    proofA: g1ToBytes(proof.proof.pi_a),
    proofB: g2ToBytes(proof.proof.pi_b),
    proofC: g1ToBytes(proof.proof.pi_c),
    publicSignals: proof.publicSignals.map(fieldToBytes),
  }
}
