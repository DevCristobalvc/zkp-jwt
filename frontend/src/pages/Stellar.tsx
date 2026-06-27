import { motion } from 'framer-motion';
import { Star, Shield, Eye, Cpu, ExternalLink, ArrowRight } from 'lucide-react';
import MermaidDiagram from '../components/MermaidDiagram';

const CONTRACT_ID = 'CBYNTUAVZ4OSILWID7HE6AYF7FNOJTT2M77TZJ6GUU32VGBXUCMIUBBK';
const EXPLORER_URL = `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`;
const MEDVAULT_REPO = 'https://github.com/DevCristobalvc/medvault-stellar';
const MEDVAULT_DEMO = 'https://medvault-stellar.vercel.app';
const STELLAR_DOCS = 'https://github.com/DevCristobalvc/zkp-jwt/tree/Master/stellar';

export default function StellarPage() {
  const simpleFlow = `
flowchart LR
    A[Doctor wallet<br/>private] --> P((ZK proof))
    R[Merkle root<br/>public, on-chain] --> P
    P --> V{verify_zkp_proof<br/>on Soroban}
    V -->|true| OK[Authorized<br/>identity hidden]
    V -->|false| NO[Rejected]

    style A fill:#1e293b,stroke:#3b82f6
    style P fill:#1e293b,stroke:#6366f1
    style V fill:#1e293b,stroke:#8b5cf6
    style OK fill:#1e293b,stroke:#10b981
    style NO fill:#1e293b,stroke:#ef4444
  `;

  const circuit = `
flowchart TB
    WA["walletAddress<br/>(private)"] --> LH["Poseidon(1)<br/>leaf hash"]
    LH --> CH0["computedHash[0]"]

    subgraph LEVEL["per level i = 0 .. 9"]
        direction TB
        PI["pathIndices[i]<br/>(private)"] --> BC{{"pathIndices[i] · (1 - pathIndices[i]) === 0<br/>booleanity constraint"}}
        SIB["siblings[i]<br/>(private)"] --> MUXL["Mux1 left"]
        CHi["computedHash[i]"] --> MUXL
        SIB --> MUXR["Mux1 right"]
        CHi --> MUXR
        BC -. selector .-> MUXL
        BC -. selector .-> MUXR
        MUXL --> H["Poseidon(2)"]
        MUXR --> H
        H --> CHnext["computedHash[i+1]"]
    end

    CH0 --> LEVEL
    LEVEL --> ROOT{{"root === computedHash[10]<br/>membership constraint"}}
    RT["root (public input)"] --> ROOT
    ROOT --> OUT["proof valid"]

    style WA fill:#1e293b,stroke:#3b82f6
    style BC fill:#1e293b,stroke:#f59e0b
    style ROOT fill:#1e293b,stroke:#10b981
    style OUT fill:#1e293b,stroke:#10b981
  `;

  const ux = `
sequenceDiagram
    participant U as Doctor (browser)
    participant SJ as snarkjs (wasm + zkey)
    participant RPC as Soroban RPC
    participant SC as MedVault contract

    U->>U: Build Merkle tree of authorized doctors
    U->>U: Get my path (siblings and indices)
    U->>SJ: groth16.fullProve(wallet, path, root)
    Note over SJ: Poseidon over BLS12-381<br/>about 2s in-browser
    SJ-->>U: proof (A B C) + public root
    U->>U: Local snarkjs verify (sanity check)
    U->>RPC: verify_zkp_proof(vk, proof, root)
    RPC->>SC: pairing_check (CAP-0052)
    SC-->>U: true - authorized doctor, identity not revealed
  `;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-mono text-primary-400 uppercase tracking-wider">Stellar Adaptation</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">ZKPJWT on Stellar</h1>
          <p className="text-lg text-gray-400 max-w-3xl">
            The same zero-knowledge membership idea, ported from Arbitrum/Stylus to the Stellar network. A doctor proves
            they belong to an authorized provider set <span className="text-white">without revealing which member they are</span>.
            The proof is generated in the browser and verified <span className="text-white">on-chain</span> by a Soroban
            smart contract using Stellar's native BLS12-381 pairing host function (CAP-0052).
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href={MEDVAULT_DEMO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors">
              MedVault Live Demo <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a href={EXPLORER_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 text-sm border border-gray-700 hover:border-gray-500 text-gray-300 rounded transition-colors">
              View Contract on Stellar Expert <ExternalLink className="w-3 h-3 ml-2" />
            </a>
          </div>
        </motion.div>

        {/* What it is */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-800 rounded-lg p-6">
              <Eye className="w-8 h-8 text-primary-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Anonymous membership</h3>
              <p className="text-sm text-gray-400">
                A clinic publishes a Merkle root of credentialed doctors. A doctor proves their wallet is one of the
                leaves under that root. The contract learns <span className="text-white">that</span> they are authorized,
                never <span className="text-white">which</span> doctor.
              </p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <Shield className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Verified on-chain</h3>
              <p className="text-sm text-gray-400">
                The full Groth16 pairing equation runs inside the Soroban contract via Stellar's native BLS12-381 host
                functions. No off-chain trust, no oracle.
              </p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <Cpu className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Proven in the browser</h3>
              <p className="text-sm text-gray-400">
                snarkjs generates the proof client-side in about two seconds. The verification key is passed as a call
                argument, so rotating the circuit needs no contract redeploy.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Simple flow */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">The idea</h2>
          <p className="text-gray-400 mb-6">What stays private: the wallet address and its position in the tree. What is public: only the Merkle root and the yes/no result.</p>
          <div className="border border-gray-800 rounded-lg p-6">
            <MermaidDiagram chart={simpleFlow} />
          </div>
        </motion.section>

        {/* Circuit */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">The circuit</h2>
          <p className="text-gray-400 mb-6">
            <code className="text-primary-400 font-mono">MerkleMembershipStellar(levels=10)</code> hashes the wallet into a
            leaf, walks 10 levels up the tree hashing with the correct sibling order, and asserts the recomputed root
            equals the public root.
          </p>
          <div className="border border-gray-800 rounded-lg p-6 mb-6">
            <MermaidDiagram chart={circuit} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Membership constraint</h3>
              <p className="text-sm text-gray-400"><code className="text-primary-400 font-mono">root === computedHash[levels]</code>. The witness only satisfies this if the leaf truly hashes up to the published root.</p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Booleanity constraint</h3>
              <p className="text-sm text-gray-400"><code className="text-amber-400 font-mono">pathIndices[i] · (1 - pathIndices[i]) === 0</code>. Added after an audit: circomlib's Mux1 does not range-check its selector, so without this a prover could pick a non-binary selector to forge a path. This closes that under-constraint.</p>
            </div>
          </div>
        </motion.section>

        {/* UX */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">End-to-end flow</h2>
          <p className="text-gray-400 mb-6">In-browser proving on the MedVault Protocol page, then live on-chain verification. No backend, no trusted prover.</p>
          <div className="border border-gray-800 rounded-lg p-6">
            <MermaidDiagram chart={ux} />
          </div>
        </motion.section>

        {/* Arbitrum vs Stellar */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Arbitrum vs Stellar</h2>
          <div className="border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-white"></th>
                  <th className="px-6 py-4 text-left text-white">Arbitrum / Stylus</th>
                  <th className="px-6 py-4 text-left text-primary-400">Stellar / Soroban</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs sm:text-sm">
                <tr className="border-b border-gray-800">
                  <td className="px-6 py-4 text-gray-300">Curve</td>
                  <td className="px-6 py-4 text-gray-400">BN254</td>
                  <td className="px-6 py-4 text-white">BLS12-381</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="px-6 py-4 text-gray-300">Hash</td>
                  <td className="px-6 py-4 text-gray-400">Poseidon (BN254)</td>
                  <td className="px-6 py-4 text-white">Poseidon (BLS12-381)</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="px-6 py-4 text-gray-300">Verification</td>
                  <td className="px-6 py-4 text-gray-400">Root comparison on-chain (hybrid)</td>
                  <td className="px-6 py-4 text-white">Full Groth16 pairing on-chain (CAP-0052)</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="px-6 py-4 text-gray-300">Contract</td>
                  <td className="px-6 py-4 text-gray-400">Rust to WASM (Stylus)</td>
                  <td className="px-6 py-4 text-white">Rust (Soroban, no_std)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-300">Constraints</td>
                  <td className="px-6 py-4 text-gray-400">~1024 leaves, 10 levels</td>
                  <td className="px-6 py-4 text-white">5615 constraints, 10 levels</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* On-chain verification */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">On-chain verification</h2>
          <div className="border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-4">
              <code className="text-primary-400 font-mono">verify_zkp_proof</code> runs the full Groth16 equation on
              Stellar's native BLS12-381 host functions:
            </p>
            <div className="bg-gray-900 rounded p-4 font-mono text-xs sm:text-sm text-primary-300 overflow-x-auto">
              e(-A, B) · e(alpha, beta) · e(L, gamma) · e(C, delta) == 1&nbsp;&nbsp;&nbsp;&nbsp;where&nbsp;&nbsp;L = IC0 + root · IC1
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gray-400 list-disc list-inside">
              <li>G1 points: 96 bytes. G2 points: 192 bytes, Fp2 in c1-first order, matching Stellar's zkcrypto serialization.</li>
              <li>Single public input: the Merkle <code className="text-white font-mono">root</code>.</li>
              <li>Verification key passed as a call argument, so rotating the circuit needs no contract redeploy.</li>
            </ul>
            <div className="mt-4 bg-gray-900 rounded p-3 font-mono text-xs text-gray-400 break-all">
              <span className="text-gray-500">contract: </span><span className="text-green-400">{CONTRACT_ID}</span>
            </div>
          </div>
        </motion.section>

        {/* Links */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border border-primary-500/30 rounded-lg p-8 bg-primary-500/5">
          <h2 className="text-2xl font-bold text-white mb-2">MedVault</h2>
          <p className="text-sm text-gray-300 mb-6">
            This Stellar adaptation powers MedVault, a privacy-preserving medical records dApp built for the Stellar
            PULSO Hackathon (LATAM 2026). Doctors prove their credentials anonymously before accessing encrypted patient records.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={MEDVAULT_DEMO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors">
              Live Demo <ExternalLink className="w-3 h-3 ml-2" />
            </a>
            <a href={MEDVAULT_REPO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 text-sm border border-gray-700 hover:border-gray-500 text-gray-300 rounded transition-colors">
              MedVault Repo <ExternalLink className="w-3 h-3 ml-2" />
            </a>
            <a href={STELLAR_DOCS} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 text-sm border border-gray-700 hover:border-gray-500 text-gray-300 rounded transition-colors">
              ZK Layer Docs <ExternalLink className="w-3 h-3 ml-2" />
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
