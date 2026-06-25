import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const R = 52435875175126190479447740508185965837690552500527637822603658699938581184513n

const src = (await import(pathToFileURL(join(__dir, '../node_modules/circomlibjs/src/poseidon_constants_opt.js')).href)).default

function toFr(o) {
  if (typeof o === 'string') {
    let v = /^0x/.test(o) ? BigInt(o) : BigInt(o)
    v = ((v % R) + R) % R
    return '0x' + v.toString(16)
  }
  if (Array.isArray(o)) return o.map(toFr)
  throw new Error('unexpected ' + typeof o)
}

const min = {
  C: [toFr(src.C[0]), toFr(src.C[1])],
  M: [toFr(src.M[0]), toFr(src.M[1])],
  P: [toFr(src.P[0]), toFr(src.P[1])],
  S: [toFr(src.S[0]), toFr(src.S[1])],
}

const out = join(__dir, 'poseidon_bls_min.json')
writeFileSync(out, JSON.stringify(min))
console.log('written', out)
console.log('bytes', JSON.stringify(min).length)
