import * as snarkjs from 'snarkjs'
import { buildBlsPoseidon } from './bls_poseidon.mjs'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const BUILD = join(__dir, '../build')
const LEVELS = 10
const MAX_LEAVES = 2 ** LEVELS

const DOCTOR = 'GAGJANUXK2IRADH7Z5DZKABFZI6VSFZSB6SJDERLZRXBNQUWWDFZQMSH'
const PATIENT = 'GDPNCF2LEY6TYUKOW66UGUHDWFMKEPS256CE2OBAI2NRNJWYSWLDZ5WG'
const INTRUDER = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGZQ2V4RN5VFRXK5VPMAIH'

let P
const F = (x) => P.F.toObject(x)
const pos = (arr) => F(P(arr))

function stellarToField(addr) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = ''
  for (const ch of addr) { const v = alphabet.indexOf(ch); if (v >= 0) bits += v.toString(2).padStart(5, '0') }
  const keyBits = bits.slice(5, 5 + 256)
  const hex = BigInt('0b' + keyBits).toString(16).padStart(64, '0')
  return BigInt('0x' + '7' + hex.slice(1))
}

function buildTree(addresses) {
  const leaves = addresses.map((a) => pos([stellarToField(a)]))
  const zero = pos([0n])
  while (leaves.length < MAX_LEAVES) leaves.push(zero)
  const levels = [leaves]
  let cur = leaves
  while (cur.length > 1) {
    const nxt = []
    for (let i = 0; i < cur.length; i += 2) nxt.push(pos([cur[i], cur[i + 1]]))
    levels.push(nxt); cur = nxt
  }
  return { root: cur[0], leaves, levels }
}

function merkleProof(tree, addr) {
  const leaf = pos([stellarToField(addr)])
  const idx0 = tree.leaves.findIndex((l) => l === leaf)
  if (idx0 === -1) throw new Error('not in tree')
  const pathIndices = [], siblings = []
  let idx = idx0
  for (let i = 0; i < LEVELS; i++) {
    const isLeft = idx % 2 === 0
    pathIndices.push(isLeft ? 0 : 1)
    siblings.push(tree.levels[i][isLeft ? idx + 1 : idx - 1])
    idx = Math.floor(idx / 2)
  }
  return { walletAddress: stellarToField(addr), pathIndices, siblings, root: tree.root }
}

const wasm = join(BUILD, 'merkle_membership_stellar_js/merkle_membership_stellar.wasm')
const zkey = join(BUILD, 'merkle_bls12381_final.zkey')
const vk = JSON.parse(readFileSync(join(BUILD, 'verification_key_bls12381.json'), 'utf8'))

const toInput = (mp) => ({
  walletAddress: mp.walletAddress.toString(),
  pathIndices: mp.pathIndices.map(String),
  siblings: mp.siblings.map(String),
  root: mp.root.toString(),
})

let pass = 0, fail = 0
const ok = (m) => { pass++; console.log(`  PASS: ${m}`) }
const bad = (m) => { fail++; console.log(`  FAIL: ${m}`) }

async function main() {
  P = await buildBlsPoseidon()
  console.log('\nZK CIRCUIT VALIDATION — merkle_membership_stellar (BLS12-381, levels=10)\n')

  const tree = buildTree([DOCTOR, PATIENT])
  console.log(`tree root: ${tree.root.toString(16).slice(0, 24)}…\n`)

  // 1. COMPLETENESS — an authorized member produces a proof that verifies
  console.log('1) Completeness: authorized member -> valid proof')
  const mp = merkleProof(tree, DOCTOR)
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(toInput(mp), wasm, zkey)
  const okLocal = await snarkjs.groth16.verify(vk, publicSignals, proof)
  okLocal ? ok('honest proof verifies') : bad('honest proof did NOT verify')
  BigInt(publicSignals[0]) === tree.root ? ok('public signal == on-chain root') : bad('public root mismatch')

  // 2. SOUNDNESS (honest format) — a non-member cannot make the public root match
  console.log('\n2) Soundness: non-member with honest-format witness fails')
  const intruderLeaf = pos([stellarToField(INTRUDER)])
  if (tree.leaves.includes(intruderLeaf)) { bad('intruder unexpectedly in tree') }
  else {
    // Force intruder leaf onto the real doctor path (a forgery attempt).
    const forged = { walletAddress: stellarToField(INTRUDER), pathIndices: mp.pathIndices, siblings: mp.siblings, root: tree.root }
    try {
      await snarkjs.groth16.fullProve(toInput(forged), wasm, zkey)
      bad('forged proof was generated (circuit accepted a non-member!)')
    } catch {
      ok('circuit rejects non-member on the real root (constraint root===computedHash holds)')
    }
  }

  // 3. UNDER-CONSTRAINT — selector pathIndices is NOT range-checked to {0,1}
  // circomlib Mux1 computes out = c0 + s*(c1-c0) with no s*(1-s)===0 constraint.
  // We craft a witness with a non-boolean selector and show the R1CS still accepts it.
  console.log('\n3) Selector booleanity: is pathIndices constrained to {0,1}?')
  const leaf = pos([stellarToField(DOCTOR)])
  const s0 = 2n                                  // illegal non-boolean selector
  const sib0 = mp.siblings[0]
  // replicate circuit Mux math for level 0
  const sub = (a, b) => ((a - b) % p() + p()) % p()
  const add = (a, b) => (a + b) % p()
  const mul = (a, b) => (a * b) % p()
  const left0 = add(leaf, mul(s0, sub(sib0, leaf)))   // c0 + s*(c1-c0), c0=ch,c1=sib
  const right0 = add(sib0, mul(s0, sub(leaf, sib0)))  // c0 + s*(c1-c0), c0=sib,c1=ch
  let h = pos([left0, right0])
  // carry the remaining levels honestly (boolean) to get a consistent root
  const idxStart = tree.leaves.findIndex((l) => l === leaf)
  let idx = Math.floor(idxStart / 2)
  for (let i = 1; i < LEVELS; i++) {
    const isLeft = idx % 2 === 0
    const sib = mp.siblings[i]
    h = isLeft ? pos([h, sib]) : pos([sib, h])
    idx = Math.floor(idx / 2)
  }
  const ncInput = {
    walletAddress: stellarToField(DOCTOR).toString(),
    pathIndices: ['2', ...mp.pathIndices.slice(1).map(String)],
    siblings: mp.siblings.map(String),
    root: h.toString(),
  }
  try {
    const r = await snarkjs.groth16.fullProve(ncInput, wasm, zkey)
    const v = await snarkjs.groth16.verify(vk, r.publicSignals, r.proof)
    if (v) bad('circuit ACCEPTS pathIndices[0]=2 (under-constrained: missing s*(1-s)===0)')
    else bad('proof generated but did not verify (unexpected)')
  } catch (e) {
    ok('circuit rejects non-boolean selector (booleanity IS enforced): ' + (e.message || e).slice(0, 60))
  }

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`)
  console.log('NOTE: test 3 reports a FAIL when the selector is NOT range-checked — that is the finding, not a test error.')
}
function p() { return 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n }
main().catch((e) => { console.error('FATAL:', e.message || e); process.exit(1) })
