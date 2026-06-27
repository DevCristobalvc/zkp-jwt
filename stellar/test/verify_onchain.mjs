/**
 * MedVault ZKP — on-chain verification against the deployed Soroban contract.
 *
 * Generates a real BLS12-381 Groth16 proof of Merkle membership and calls
 * verify_zkp_proof on the live contract. This validates the proof <-> contract
 * byte encoding end-to-end (the existing test only verified locally with snarkjs).
 *
 * Run: CONTRACT_ID=<id> node stellar/test/verify_onchain.mjs
 *      G2ORDER=c1 (default) | c0   to flip Fp2 component order
 */
import * as snarkjs from 'snarkjs'
import { buildBlsPoseidon } from './bls_poseidon.mjs'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execFileSync } from 'child_process'

const __dir = dirname(fileURLToPath(import.meta.url))
const BUILD = join(__dir, '../build')
const CONTRACT_ID = process.env.CONTRACT_ID || 'CBYNTUAVZ4OSILWID7HE6AYF7FNOJTT2M77TZJ6GUU32VGBXUCMIUBBK'
const G2ORDER = process.env.G2ORDER || 'c1'
const SOURCE = process.env.SOURCE || 'doctor'
const NETWORK = process.env.NETWORK || 'testnet'

const LEVELS = 10
const MAX_LEAVES = 2 ** LEVELS

const DOCTOR_ADDR = 'GAGJANUXK2IRADH7Z5DZKABFZI6VSFZSB6SJDERLZRXBNQUWWDFZQMSH'
const PATIENT_ADDR = 'GDPNCF2LEY6TYUKOW66UGUHDWFMKEPS256CE2OBAI2NRNJWYSWLDZ5WG'

function stellarToField(addr) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = ''
  for (const ch of addr) {
    const val = alphabet.indexOf(ch)
    if (val >= 0) bits += val.toString(2).padStart(5, '0')
  }
  const keyBits = bits.slice(5, 5 + 256)
  const hex = BigInt('0b' + keyBits).toString(16).padStart(64, '0')
  return BigInt('0x' + '7' + hex.slice(1))
}

async function buildTree(addresses, poseidon) {
  const F = poseidon.F
  const leaves = addresses.map((a) => BigInt(F.toString(poseidon([stellarToField(a)]))))
  const zeroLeaf = BigInt(F.toString(poseidon([0n])))
  while (leaves.length < MAX_LEAVES) leaves.push(zeroLeaf)
  const levels = [leaves]
  let current = leaves
  while (current.length > 1) {
    const next = []
    for (let i = 0; i < current.length; i += 2)
      next.push(BigInt(F.toString(poseidon([current[i], current[i + 1]]))))
    levels.push(next)
    current = next
  }
  return { root: current[0], leaves, levels }
}

function getMerkleProof(tree, addr, poseidon) {
  const F = poseidon.F
  const field = stellarToField(addr)
  const leafHash = BigInt(F.toString(poseidon([field])))
  const leafIndex = tree.leaves.findIndex((l) => l === leafHash)
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

const fp = (s) => BigInt(s).toString(16).padStart(96, '0')        // 48-byte Fp
const fr = (s) => BigInt(s).toString(16).padStart(64, '0')        // 32-byte Fr
const g1 = (p) => fp(p[0]) + fp(p[1])                              // x || y
const g2 = (p) =>
  G2ORDER === 'c0'
    ? fp(p[0][0]) + fp(p[0][1]) + fp(p[1][0]) + fp(p[1][1])        // x.c0 x.c1 y.c0 y.c1
    : fp(p[0][1]) + fp(p[0][0]) + fp(p[1][1]) + fp(p[1][0])        // x.c1 x.c0 y.c1 y.c0

async function main() {
  console.log(`\nOn-chain ZKP verification (G2ORDER=${G2ORDER}) against ${CONTRACT_ID}`)
  const poseidon = await buildBlsPoseidon()
  const vk = JSON.parse(readFileSync(join(BUILD, 'verification_key_bls12381.json'), 'utf8'))
  const wasm = join(BUILD, 'merkle_membership_stellar_js/merkle_membership_stellar.wasm')
  const zkey = join(BUILD, 'merkle_bls12381_final.zkey')

  const tree = await buildTree([DOCTOR_ADDR, PATIENT_ADDR], poseidon)
  const mp = getMerkleProof(tree, DOCTOR_ADDR, poseidon)

  const input = {
    walletAddress: mp.walletAddress.toString(),
    pathIndices: mp.pathIndices.map(String),
    siblings: mp.siblings.map(String),
    root: mp.root.toString(),
  }
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasm, zkey)
  const localOk = await snarkjs.groth16.verify(vk, publicSignals, proof)
  console.log(`  local snarkjs verify: ${localOk}`)
  if (!localOk) throw new Error('local verification failed — bad artifacts')

  const args = {
    merkle_root: fr(publicSignals[0]),
    proof_a: g1(proof.pi_a),
    proof_b: g2(proof.pi_b),
    proof_c: g1(proof.pi_c),
    ic_0: g1(vk.IC[0]),
    ic_1: g1(vk.IC[1]),
    alpha_g1: g1(vk.vk_alpha_1),
    beta_g2: g2(vk.vk_beta_2),
    gamma_g2: g2(vk.vk_gamma_2),
    delta_g2: g2(vk.vk_delta_2),
  }

  const cli = [
    'contract', 'invoke', '--id', CONTRACT_ID, '--source', SOURCE, '--network', NETWORK, '--',
    'verify_zkp_proof',
    '--merkle_root', args.merkle_root,
    '--proof_a', args.proof_a,
    '--proof_b', args.proof_b,
    '--proof_c', args.proof_c,
    '--ic_0', args.ic_0,
    '--ic_1', args.ic_1,
    '--alpha_g1', args.alpha_g1,
    '--beta_g2', args.beta_g2,
    '--gamma_g2', args.gamma_g2,
    '--delta_g2', args.delta_g2,
  ]

  console.log('  invoking verify_zkp_proof on-chain...')
  let onchain = ''
  try {
    onchain = execFileSync('stellar', cli, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
    console.log(`  on-chain result: ${onchain}`)
  } catch (e) {
    console.log(`  on-chain ERROR: ${(e.stderr || e.message || '').toString().trim().split('\n').slice(-3).join(' | ')}`)
  }

  if (process.env.DUMP_FIXTURE && onchain === 'true') {
    const fixture = { contract_id: CONTRACT_ID, g2_order: G2ORDER, ...args }
    const out = join(__dir, 'zkp_fixture.json')
    writeFileSync(out, JSON.stringify(fixture, null, 2))
    console.log(`  fixture written: ${out}`)
  }
  process.exit(onchain === 'true' ? 0 : 1)
}

main().catch((e) => { console.error('FATAL:', e.message); process.exit(1) })
