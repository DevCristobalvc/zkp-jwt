import { motion } from 'framer-motion';
import { Workflow, Cpu, Server, Code2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Architecture() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">How It Works</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Understanding the complete workflow from proof generation to on-chain verification
          </p>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">System Architecture</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step 1: Client Side */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h4 className="text-xl font-semibold text-white">Client Side</h4>
              </div>

              <div className="space-y-3">
                <div className="bg-dark-800 rounded-lg p-4 border border-blue-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code2 className="w-5 h-5 text-blue-400" />
                    <h5 className="text-white font-medium">Build Merkle Tree</h5>
                  </div>
                  <p className="text-sm text-gray-400">Construct a 10-level Merkle tree with Poseidon hash from allowed addresses</p>
                  <code className="text-xs text-primary-400 mt-2 block">circomlibjs, TypeScript</code>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-gray-500 rotate-90 lg:rotate-0" />
                </div>

                <div className="bg-dark-800 rounded-lg p-4 border border-blue-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    <h5 className="text-white font-medium">Generate ZK Proof</h5>
                  </div>
                  <p className="text-sm text-gray-400">Create Groth16 proof of membership without revealing position</p>
                  <code className="text-xs text-primary-400 mt-2 block">snarkjs, circom</code>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center">
              <ArrowRight className="w-12 h-12 text-primary-500" />
            </div>

            {/* Step 2: Circuit */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h4 className="text-xl font-semibold text-white">ZK Circuit</h4>
              </div>

              <div className="space-y-3">
                <div className="bg-dark-800 rounded-lg p-4 border border-purple-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Workflow className="w-5 h-5 text-purple-400" />
                    <h5 className="text-white font-medium">Circuit Constraints</h5>
                  </div>
                  <p className="text-sm text-gray-400">Verify Merkle path from leaf to root using Poseidon hashing</p>
                  <code className="text-xs text-primary-400 mt-2 block">merkle_membership.circom</code>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-gray-500 rotate-90 lg:rotate-0" />
                </div>

                <div className="bg-dark-800 rounded-lg p-4 border border-purple-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cpu className="w-5 h-5 text-purple-400" />
                    <h5 className="text-white font-medium">Proof Output</h5>
                  </div>
                  <p className="text-sm text-gray-400">Generate compact proof (pi_a, pi_b, pi_c) with public signals</p>
                  <code className="text-xs text-primary-400 mt-2 block">Groth16 (BN254)</code>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center lg:col-span-3">
              <ArrowRight className="w-12 h-12 text-primary-500 rotate-90" />
            </div>

            {/* Step 3: Smart Contract */}
            <div className="space-y-4 lg:col-span-3">
              <div className="flex items-center space-x-3 mb-4 justify-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h4 className="text-xl font-semibold text-white">On-Chain Verification</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-800 rounded-lg p-4 border border-green-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Server className="w-5 h-5 text-green-400" />
                    <h5 className="text-white font-medium">Stylus Contract</h5>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Rust-based contract compiled to WASM for ultra-efficient verification</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Contract Size:</span>
                      <span className="text-primary-400 font-mono">6.1 KB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Gas per Verification:</span>
                      <span className="text-primary-400 font-mono">~21K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-primary-400">Arbitrum Sepolia</span>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-800 rounded-lg p-4 border border-green-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <h5 className="text-white font-medium">Verification Logic</h5>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Simple root comparison instead of expensive pairing checks</p>
                  <div className="bg-dark-900 rounded p-3 font-mono text-xs">
                    <div className="text-gray-500">// Hybrid approach:</div>
                    <div className="text-primary-400">1. Full Groth16 verify (client)</div>
                    <div className="text-blue-400">2. Root check (on-chain)</div>
                    <div className="text-green-400">3. 94% gas savings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Components */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Circuits */}
          <div className="card">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Circuits</h3>
            <p className="text-gray-400 text-sm mb-4">Zero-knowledge circuits written in circom</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="text-primary-400 mt-0.5">•</span>
                <span>merkle_membership.circom</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-400 mt-0.5">•</span>
                <span>Poseidon hash function</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-400 mt-0.5">•</span>
                <span>10-level Merkle tree (1024 leaves)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-400 mt-0.5">•</span>
                <span>Groth16 proving system</span>
              </li>
            </ul>
          </div>

          {/* Contracts */}
          <div className="card">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Smart Contract</h3>
            <p className="text-gray-400 text-sm mb-4">Arbitrum Stylus verifier in Rust</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="text-primary-400 mt-0.5">•</span>
                <span>Rust + Stylus SDK</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-400 mt-0.5">•</span>
                <span>Compiled to WASM</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-400 mt-0.5">•</span>
                <span>Root storage and verification</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-400 mt-0.5">•</span>
                <span>21K gas per verification</span>
              </li>
            </ul>
          </div>

          {/* Library */}
          <div className="card">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">TypeScript Library</h3>
            <p className="text-gray-400 text-sm mb-4">Client-side proof generation</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="text-primary-400 mt-0.5">•</span>
                <span>MerkleTreeBuilder</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-400 mt-0.5">•</span>
                <span>ProofGenerator</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-400 mt-0.5">•</span>
                <span>ProofVerifier</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-400 mt-0.5">•</span>
                <span>ContractClient</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Technical Specs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card mt-12 border-2 border-primary-500/30"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Technical Specifications</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="text-primary-400 font-semibold mb-2">Cryptography</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>Groth16 zkSNARK</li>
                <li>BN254 elliptic curve</li>
                <li>Poseidon hash</li>
                <li>Merkle tree proofs</li>
              </ul>
            </div>

            <div>
              <h4 className="text-primary-400 font-semibold mb-2">Blockchain</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>Arbitrum Sepolia</li>
                <li>Stylus (WASM)</li>
                <li>Rust smart contracts</li>
                <li>EVM compatible</li>
              </ul>
            </div>

            <div>
              <h4 className="text-primary-400 font-semibold mb-2">Performance</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>6.1 KB contract</li>
                <li>21K gas/verify</li>
                <li>94% gas savings</li>
                <li>Sub-second proofs</li>
              </ul>
            </div>

            <div>
              <h4 className="text-primary-400 font-semibold mb-2">Development</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>TypeScript library</li>
                <li>Full type safety</li>
                <li>Comprehensive docs</li>
                <li>Open source (MIT)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
