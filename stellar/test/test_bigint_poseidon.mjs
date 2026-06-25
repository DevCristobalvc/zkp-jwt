import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { buildBlsPoseidon } from './bls_poseidon.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const R = 52435875175126190479447740508185965837690552500527637822603658699938581184513n
const C0 = JSON.parse(readFileSync(join(__dir, 'poseidon_bls_min.json'), 'utf8'))
const opt = {
  C: C0.C.map((a) => a.map(BigInt)),
  M: C0.M.map((m) => m.map((r) => r.map(BigInt))),
  P: C0.P.map((m) => m.map((r) => r.map(BigInt))),
  S: C0.S.map((a) => a.map(BigInt)),
}

const N_ROUNDS_F = 8
const N_ROUNDS_P = [56, 57]
const mod = (a) => ((a % R) + R) % R
const mul = (a, b) => mod(a * b)
const add = (a, b) => mod(a + b)
const pow5 = (a) => { const a2 = mul(a, a); return mul(mul(a2, a2), a) }

function poseidon(inputs) {
  const t = inputs.length + 1
  const nRoundsF = N_ROUNDS_F
  const nRoundsP = N_ROUNDS_P[t - 2]
  const C = opt.C[t - 2], S = opt.S[t - 2], M = opt.M[t - 2], P = opt.P[t - 2]
  let state = [0n, ...inputs.map((a) => mod(a))]
  state = state.map((a, i) => add(a, C[i]))
  for (let r = 0; r < nRoundsF / 2 - 1; r++) {
    state = state.map(pow5)
    state = state.map((a, i) => add(a, C[(r + 1) * t + i]))
    state = state.map((_, i) => state.reduce((acc, a, j) => add(acc, mul(M[j][i], a)), 0n))
  }
  state = state.map(pow5)
  state = state.map((a, i) => add(a, C[(nRoundsF / 2 - 1 + 1) * t + i]))
  state = state.map((_, i) => state.reduce((acc, a, j) => add(acc, mul(P[j][i], a)), 0n))
  for (let r = 0; r < nRoundsP; r++) {
    state[0] = pow5(state[0])
    state[0] = add(state[0], C[(nRoundsF / 2 + 1) * t + r])
    const s0 = state.reduce((acc, a, j) => add(acc, mul(S[(t * 2 - 1) * r + j], a)), 0n)
    for (let k = 1; k < t; k++) state[k] = add(state[k], mul(state[0], S[(t * 2 - 1) * r + t + k - 1]))
    state[0] = s0
  }
  for (let r = 0; r < nRoundsF / 2 - 1; r++) {
    state = state.map(pow5)
    state = state.map((a, i) => add(a, C[(nRoundsF / 2 + 1) * t + nRoundsP + r * t + i]))
    state = state.map((_, i) => state.reduce((acc, a, j) => add(acc, mul(M[j][i], a)), 0n))
  }
  state = state.map(pow5)
  state = state.map((_, i) => state.reduce((acc, a, j) => add(acc, mul(M[j][i], a)), 0n))
  return state[0]
}

const LEVELS = 10
const MAX_LEAVES = 2 ** LEVELS
const DOCTOR_ADDR = 'GAGJANUXK2IRADH7Z5DZKABFZI6VSFZSB6SJDERLZRXBNQUWWDFZQMSH'
const PATIENT_ADDR = 'GDPNCF2LEY6TYUKOW66UGUHDWFMKEPS256CE2OBAI2NRNJWYSWLDZ5WG'

function stellarToField(addr) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = ''
  for (const ch of addr) { const v = alphabet.indexOf(ch); if (v >= 0) bits += v.toString(2).padStart(5, '0') }
  const keyBits = bits.slice(5, 5 + 256)
  const hex = BigInt('0b' + keyBits).toString(16).padStart(64, '0')
  return BigInt('0x' + '7' + hex.slice(1))
}

function buildTree(addresses) {
  const leaves = addresses.map((a) => poseidon([stellarToField(a)]))
  const zeroLeaf = poseidon([0n])
  while (leaves.length < MAX_LEAVES) leaves.push(zeroLeaf)
  const levels = [leaves]
  let current = leaves
  while (current.length > 1) {
    const next = []
    for (let i = 0; i < current.length; i += 2) next.push(poseidon([current[i], current[i + 1]]))
    levels.push(next)
    current = next
  }
  return { root: current[0], leaves, levels }
}

async function main() {
  const ref = await buildBlsPoseidon()
  const F = ref.F
  const a = poseidon([1n]).toString()
  const b = F.toString(ref([1n]))
  console.log('poseidon([1]) bigint == ffjs:', a === b)
  const a2 = poseidon([1n, 2n]).toString()
  const b2 = F.toString(ref([1n, 2n]))
  console.log('poseidon([1,2]) bigint == ffjs:', a2 === b2)

  const tree = buildTree([DOCTOR_ADDR, PATIENT_ADDR])
  console.log('tree root (bigint):', tree.root.toString(16))
  console.log('expected fixture root: 1e3e9f20dff428bfc52227d2f3a251cf7c10751d618e59e3311d0a09c68a50cb')
  console.log('MATCH:', tree.root.toString(16) === '1e3e9f20dff428bfc52227d2f3a251cf7c10751d618e59e3311d0a09c68a50cb')
}
main()
