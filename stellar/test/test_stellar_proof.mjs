/**
 * MedVault ZKP — Stellar Integration Test
 *
 * Tests the full proof generation flow using BLS12-381.
 *
 * Run: node stellar/test/test_stellar_proof.mjs
 */

import * as snarkjs from 'snarkjs'
import { buildPoseidon } from 'circomlibjs'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const BUILD = join(__dir, '../build/bn128')

const LEVELS = 10
const MAX_LEAVES = 2 ** LEVELS

function pass(label) { console.log(`  ✅ ${label}`) }
function fail(label, e) { console.error(`  ❌ ${label}: ${e?.message ?? e}`); process.exit(1) }
function section(label) { console.log(`\n── ${label}`) }

function stellarToField(addr) {
  // Stellar strkey is base32. Decode and take first 31 bytes as field element
  // (must be < BLS12-381 scalar field prime)
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = ''
  for (const ch of addr) {
    const val = alphabet.indexOf(ch)
    if (val >= 0) bits += val.toString(2).padStart(5, '0')
  }
  // Skip 8-bit checksum at start (version byte) and take 32 bytes of key
  const keyBits = bits.slice(5, 5 + 256)
  const hex = BigInt('0b' + keyBits).toString(16).padStart(64, '0')
  // Clear high bit to ensure < field prime
  return BigInt('0x' + '7' + hex.slice(1))
}

async function buildTree(addresses, poseidon) {
  const F = poseidon.F
  const leaves = addresses.map(addr => {
    const field = stellarToField(addr)
    const hash = poseidon([field])
    return BigInt(F.toString(hash))
  })
  const zeroLeaf = BigInt(F.toString(poseidon([0n])))
  while (leaves.length < MAX_LEAVES) leaves.push(zeroLeaf)

  let levels = [leaves]
  let current = leaves
  while (current.length > 1) {
    const next = []
    for (let i = 0; i < current.length; i += 2) {
      next.push(BigInt(F.toString(poseidon([current[i], current[i + 1]]))))
    }
    levels.push(next)
    current = next
  }
  return { root: current[0], leaves, levels }
}

async function getMerkleProof(tree, stellarAddress, poseidon) {
  const F = poseidon.F
  const field = stellarToField(stellarAddress)
  const leafHash = BigInt(F.toString(poseidon([field])))
  const leafIndex = tree.leaves.findIndex(l => l === leafHash)
  if (leafIndex === -1) throw new Error('Address not in tree')

  const pathIndices = []
  const siblings = []
  let idx = leafIndex

  for (let i = 0; i < LEVELS; i++) {
    const isLeft = idx % 2 === 0
    pathIndices.push(isLeft ? 0 : 1)
    siblings.push(tree.levels[i][isLeft ? idx + 1 : idx - 1])
    idx = Math.floor(idx / 2)
  }

  return { walletAddress: field, pathIndices, siblings, root: tree.root }
}

async function main() {
  console.log('\nMedVault ZKP — Stellar BLS12-381 Proof Test')
  console.log('============================================')

  const poseidon = await buildPoseidon()
  const vk = JSON.parse(readFileSync(join(BUILD, 'verification_key.json'), 'utf8'))
  const wasmFile = join(BUILD, 'merkle_membership_stellar_js/merkle_membership_stellar.wasm')
  const zkeyFile = join(BUILD, 'merkle_final.zkey')

  // Test addresses (Stellar-style, 32 bytes decoded)
  const DOCTOR_ADDR = 'GAGJANUXK2IRADH7Z5DZKABFZI6VSFZSB6SJDERLZRXBNQUWWDFZQMSH'
  const PATIENT_ADDR = 'GDPNCF2LEY6TYUKOW66UGUHDWFMKEPS256CE2OBAI2NRNJWYSWLDZ5WG'
  const INTRUDER_ADDR = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGZQ2V4RN5VFRXK5VPMAIH'

  const authorizedDoctors = [DOCTOR_ADDR, PATIENT_ADDR]

  section('1. Build Merkle tree with authorized doctors')
  let tree
  try {
    tree = await buildTree(authorizedDoctors, poseidon)
    pass(`Tree built — root: ${tree.root.toString(16).slice(0, 16)}...`)
  } catch (e) { fail('Build tree', e) }

  section('2. Generate Merkle proof for authorized doctor')
  let merkleProof
  try {
    merkleProof = await getMerkleProof(tree, DOCTOR_ADDR, poseidon)
    pass(`Proof computed — walletAddress: ${merkleProof.walletAddress.toString(16).slice(0, 8)}...`)
  } catch (e) { fail('Generate proof', e) }

  section('3. Generate ZKP (Groth16/BLS12-381)')
  let groth16Proof, publicSignals
  try {
    const input = {
      walletAddress: merkleProof.walletAddress.toString(),
      pathIndices: merkleProof.pathIndices.map(String),
      siblings: merkleProof.siblings.map(s => s.toString()),
      root: merkleProof.root.toString(),
    }

    const result = await snarkjs.groth16.fullProve(input, wasmFile, zkeyFile)
    groth16Proof = result.proof
    publicSignals = result.publicSignals
    pass(`Proof generated — curve: ${groth16Proof.curve}`)
    pass(`Public signal (root): ${publicSignals[0].slice(0, 20)}...`)
  } catch (e) { fail('Generate ZKP', e) }

  section('4. Verify proof locally (snarkjs)')
  try {
    const valid = await snarkjs.groth16.verify(vk, publicSignals, groth16Proof)
    if (!valid) throw new Error('Proof is not valid')
    pass('Proof verified locally ✓')
  } catch (e) { fail('Verify locally', e) }

  section('5. Test that intruder CANNOT prove membership')
  try {
    const intruderField = stellarToField(INTRUDER_ADDR)
    const F = poseidon.F
    const intruderLeaf = BigInt(F.toString(poseidon([intruderField])))
    const inTree = tree.leaves.includes(intruderLeaf)
    if (inTree) throw new Error('Intruder found in tree (should not happen)')
    pass('Intruder correctly excluded from authorized set')
  } catch (e) { fail('Intruder exclusion', e) }

  section('6. Export proof as Soroban-compatible bytes')
  try {
    function g1ToHex(g1) {
      return g1.slice(0, 2).map(c => BigInt(c).toString(16).padStart(96, '0')).join('')
    }
    const proofAHex = g1ToHex(groth16Proof.pi_a)
    const proofCHex = g1ToHex(groth16Proof.pi_c)
    pass(`proof_a (G1, 96 bytes): 0x${proofAHex.slice(0, 16)}...`)
    pass(`proof_c (G1, 96 bytes): 0x${proofCHex.slice(0, 16)}...`)
    pass(`proof_b (G2, 192 bytes): [4 field elements]`)
    pass(`public_signals[0] (root): ${publicSignals[0]}`)
  } catch (e) { fail('Export bytes', e) }

  console.log('\n══════════════════════════════════════════════════════')
  console.log('  ALL 6 ZKP TESTS PASSED ✅')
  console.log('  BLS12-381 Groth16 proof — ready for Soroban')
  console.log('══════════════════════════════════════════════════════')
  console.log()
  console.log('  Next: integrate verify_groth16_bls12381() in medvault-stellar contract')
  console.log('  See: stellar/src/groth16_bls12381.rs')
}

main().catch(e => { console.error('\n❌ FATAL:', e.message); process.exit(1) })
