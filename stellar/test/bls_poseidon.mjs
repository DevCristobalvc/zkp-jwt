import { getCurveFromName } from 'ffjavascript'
import { dirname, join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const constPath = join(__dir, '../node_modules/circomlibjs/src/poseidon_constants_opt.js')
const poseidonConstants = (await import(pathToFileURL(constPath).href)).default

function unstringify(Fr, o) {
  if (typeof o === 'string' && (/^[0-9]+$/.test(o) || /^0x[0-9a-fA-F]+$/.test(o))) return Fr.e(o)
  if (Array.isArray(o)) return o.map((x) => unstringify(Fr, x))
  if (typeof o === 'object' && o !== null) {
    const r = {}
    for (const k of Object.keys(o)) r[k] = unstringify(Fr, o[k])
    return r
  }
  return o
}

const N_ROUNDS_F = 8
const N_ROUNDS_P = [56, 57, 56, 60, 60, 63, 64, 63, 60, 66, 60, 65, 70, 60, 64, 68]

export async function buildBlsPoseidon() {
  const bls = await getCurveFromName('bls12381', true)
  const F = bls.Fr
  const opt = unstringify(F, poseidonConstants)
  const pow5 = (a) => F.mul(a, F.square(F.square(a)))

  function poseidon(inputs) {
    const t = inputs.length + 1
    const nRoundsF = N_ROUNDS_F
    const nRoundsP = N_ROUNDS_P[t - 2]
    const C = opt.C[t - 2]
    const S = opt.S[t - 2]
    const M = opt.M[t - 2]
    const P = opt.P[t - 2]

    let state = [F.zero, ...inputs.map((a) => F.e(a))]
    state = state.map((a, i) => F.add(a, C[i]))

    for (let r = 0; r < nRoundsF / 2 - 1; r++) {
      state = state.map(pow5)
      state = state.map((a, i) => F.add(a, C[(r + 1) * t + i]))
      state = state.map((_, i) => state.reduce((acc, a, j) => F.add(acc, F.mul(M[j][i], a)), F.zero))
    }
    state = state.map(pow5)
    state = state.map((a, i) => F.add(a, C[(nRoundsF / 2 - 1 + 1) * t + i]))
    state = state.map((_, i) => state.reduce((acc, a, j) => F.add(acc, F.mul(P[j][i], a)), F.zero))

    for (let r = 0; r < nRoundsP; r++) {
      state[0] = pow5(state[0])
      state[0] = F.add(state[0], C[(nRoundsF / 2 + 1) * t + r])
      const s0 = state.reduce((acc, a, j) => F.add(acc, F.mul(S[(t * 2 - 1) * r + j], a)), F.zero)
      for (let k = 1; k < t; k++) {
        state[k] = F.add(state[k], F.mul(state[0], S[(t * 2 - 1) * r + t + k - 1]))
      }
      state[0] = s0
    }
    for (let r = 0; r < nRoundsF / 2 - 1; r++) {
      state = state.map(pow5)
      state = state.map((a, i) => F.add(a, C[(nRoundsF / 2 + 1) * t + nRoundsP + r * t + i]))
      state = state.map((_, i) => state.reduce((acc, a, j) => F.add(acc, F.mul(M[j][i], a)), F.zero))
    }
    state = state.map(pow5)
    state = state.map((_, i) => state.reduce((acc, a, j) => F.add(acc, F.mul(M[j][i], a)), F.zero))

    return state[0]
  }

  poseidon.F = F
  return poseidon
}
