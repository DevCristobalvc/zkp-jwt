import { motion } from 'framer-motion';
import { Lock, Key, Binary, GitBranch, ExternalLink, Shield, AlertCircle } from 'lucide-react';

export default function ZKPPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Zero-Knowledge Proofs
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Understanding the cryptographic foundation of ZKPJWT: Groth16, Poseidon, and Merkle trees
          </p>
        </motion.div>

        {/* What are ZKPs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">What are Zero-Knowledge Proofs?</h2>
          </div>

          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">
              A <span className="text-white font-semibold">zero-knowledge proof (ZKP)</span> is a cryptographic method by which one party (the prover) 
              can prove to another party (the verifier) that a statement is true, <span className="text-primary-400 font-semibold">without revealing any information</span> beyond 
              the validity of the statement itself.
            </p>

            <div className="bg-dark-800 rounded-lg p-6 border border-primary-500/30">
              <h3 className="text-white font-semibold mb-4">Three Core Properties:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-primary-400 font-semibold mb-2">Completeness</div>
                  <p className="text-sm text-gray-400">If the statement is true, an honest verifier will be convinced by an honest prover</p>
                </div>
                <div>
                  <div className="text-blue-400 font-semibold mb-2">Soundness</div>
                  <p className="text-sm text-gray-400">If the statement is false, no cheating prover can convince the verifier (except with negligible probability)</p>
                </div>
                <div>
                  <div className="text-green-400 font-semibold mb-2">Zero-Knowledge</div>
                  <p className="text-sm text-gray-400">The verifier learns nothing beyond the truth of the statement</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Groth16 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Groth16: The Proof System</h2>
          </div>

          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">
              <span className="text-white font-semibold">Groth16</span> is a zkSNARK (zero-knowledge Succinct Non-interactive Argument of Knowledge) protocol. 
              It's one of the most efficient proving systems, producing <span className="text-primary-400 font-semibold">constant-size proofs</span> (around 200 bytes) 
              regardless of computation complexity.
            </p>

            {/* Groth16 Diagram */}
            <div className="bg-dark-800 rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-white font-semibold mb-4">Groth16 Workflow:</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-3 text-white font-bold">
                    1
                  </div>
                  <h4 className="text-white font-medium mb-2">Circuit</h4>
                  <p className="text-sm text-gray-400">Define computation as arithmetic circuit</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 text-white font-bold">
                    2
                  </div>
                  <h4 className="text-white font-medium mb-2">Setup</h4>
                  <p className="text-sm text-gray-400">Generate proving & verification keys</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-3 text-white font-bold">
                    3
                  </div>
                  <h4 className="text-white font-medium mb-2">Prove</h4>
                  <p className="text-sm text-gray-400">Generate proof (π) with witness</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-3 text-white font-bold">
                    4
                  </div>
                  <h4 className="text-white font-medium mb-2">Verify</h4>
                  <p className="text-sm text-gray-400">Check proof validity</p>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-800 rounded-lg p-6 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">Key Features</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-400">•</span>
                    <span><span className="text-white">Constant proof size:</span> ~200 bytes regardless of circuit size</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-400">•</span>
                    <span><span className="text-white">Fast verification:</span> O(1) pairing checks on elliptic curves</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-400">•</span>
                    <span><span className="text-white">BN254 curve:</span> 254-bit Barreto-Naehrig pairing-friendly curve</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-400">•</span>
                    <span><span className="text-white">Trusted setup:</span> Requires one-time setup ceremony</span>
                  </li>
                </ul>
              </div>

              <div className="bg-dark-800 rounded-lg p-6 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">Proof Structure</h4>
                <div className="font-mono text-sm space-y-2">
                  <div className="text-gray-400">
                    <span className="text-primary-400">π =</span> (π_a, π_b, π_c)
                  </div>
                  <div className="text-gray-400 text-xs pl-4">
                    <div><span className="text-blue-400">π_a:</span> G1 point (2 field elements)</div>
                    <div><span className="text-purple-400">π_b:</span> G2 point (4 field elements)</div>
                    <div><span className="text-green-400">π_c:</span> G1 point (2 field elements)</div>
                  </div>
                  <div className="text-gray-400 mt-3 text-xs">
                    Total: ~200 bytes for entire proof
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://eprint.iacr.org/2016/260.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-lg hover:bg-primary-500/20 transition-colors"
              >
                <span className="text-primary-400 text-sm">Original Groth16 Paper</span>
                <ExternalLink className="w-4 h-4 text-primary-400" />
              </a>
              <a
                href="https://github.com/iden3/snarkjs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-lg hover:bg-primary-500/20 transition-colors"
              >
                <span className="text-primary-400 text-sm">snarkjs Library</span>
                <ExternalLink className="w-4 h-4 text-primary-400" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Poseidon Hash */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Binary className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Poseidon: The Hash Function</h2>
          </div>

          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">
              <span className="text-white font-semibold">Poseidon</span> is a family of hash functions designed specifically for use in <span className="text-primary-400 font-semibold">zero-knowledge proof systems</span>. 
              Unlike traditional hash functions (SHA-256, Keccak), Poseidon is optimized for arithmetic circuits, making it much more efficient in zkSNARKs.
            </p>

            {/* Why Poseidon */}
            <div className="bg-dark-800 rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-white font-semibold mb-4">Why Use Poseidon in ZK Circuits?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-blue-400 font-medium mb-3">Traditional Hashes (SHA-256)</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Designed for CPUs, not circuits</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Require ~25,000 constraints per hash</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Slow proving time, large circuits</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-green-400 font-medium mb-3">Poseidon Hash</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Optimized for arithmetic circuits</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Only ~150-200 constraints per hash</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>100x faster in ZK proofs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Explanation */}
            <div className="bg-dark-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-white font-semibold mb-4">How Poseidon Works</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300 text-sm mb-3">
                    Poseidon uses a <span className="text-primary-400 font-semibold">sponge construction</span> with a permutation function based on:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-dark-900 rounded p-3">
                      <div className="text-primary-400 font-mono text-sm mb-1">S-box Layer</div>
                      <p className="text-xs text-gray-500">Non-linear transformation (x^5 over field)</p>
                    </div>
                    <div className="bg-dark-900 rounded p-3">
                      <div className="text-blue-400 font-mono text-sm mb-1">MDS Matrix</div>
                      <p className="text-xs text-gray-500">Maximum Distance Separable mixing</p>
                    </div>
                    <div className="bg-dark-900 rounded p-3">
                      <div className="text-green-400 font-mono text-sm mb-1">Round Constants</div>
                      <p className="text-xs text-gray-500">Prevent symmetry attacks</p>
                    </div>
                  </div>
                </div>

                <div className="font-mono text-sm text-gray-400 bg-dark-900 rounded p-4">
                  <div className="text-gray-500 mb-2">// Poseidon hash in circuits</div>
                  <div className="text-primary-400">hash = Poseidon([input1, input2])</div>
                  <div className="text-gray-500 mt-2">// Output: field element on BN254</div>
                  <div className="text-green-400">// Constraints: ~150-200 (vs 25,000 for SHA-256)</div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://eprint.iacr.org/2019/458.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-lg hover:bg-primary-500/20 transition-colors"
              >
                <span className="text-primary-400 text-sm">Poseidon Paper</span>
                <ExternalLink className="w-4 h-4 text-primary-400" />
              </a>
              <a
                href="https://github.com/iden3/circomlibjs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-lg hover:bg-primary-500/20 transition-colors"
              >
                <span className="text-primary-400 text-sm">circomlibjs (Poseidon JS)</span>
                <ExternalLink className="w-4 h-4 text-primary-400" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Merkle Trees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Merkle Trees: Privacy-Preserving Membership</h2>
          </div>

          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">
              A <span className="text-white font-semibold">Merkle tree</span> is a binary tree where each leaf node is a hash of data, 
              and each non-leaf node is a hash of its children. ZKPJWT uses a <span className="text-primary-400 font-semibold">10-level Merkle tree</span> with 
              Poseidon hash to store up to 1024 addresses.
            </p>

            {/* Merkle Tree Diagram */}
            <div className="bg-dark-800 rounded-lg p-6 border border-green-500/30">
              <h3 className="text-white font-semibold mb-6">Merkle Tree Structure (10 levels, 1024 leaves):</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-block px-4 py-2 bg-green-500/20 border border-green-500 rounded text-green-400 font-mono text-sm">
                    Root Hash
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Level 0 (1 node)</div>
                </div>

                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500 rounded text-blue-400 font-mono text-xs">H(L,R)</div>
                  </div>
                  <div className="text-center">
                    <div className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500 rounded text-blue-400 font-mono text-xs">H(L,R)</div>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-500">Level 1 (2 nodes)</div>

                <div className="flex justify-center space-x-2">
                  <div className="inline-block px-2 py-1 bg-purple-500/20 border border-purple-500 rounded text-purple-400 font-mono text-xs">H</div>
                  <div className="inline-block px-2 py-1 bg-purple-500/20 border border-purple-500 rounded text-purple-400 font-mono text-xs">H</div>
                  <div className="inline-block px-2 py-1 bg-purple-500/20 border border-purple-500 rounded text-purple-400 font-mono text-xs">H</div>
                  <div className="inline-block px-2 py-1 bg-purple-500/20 border border-purple-500 rounded text-purple-400 font-mono text-xs">H</div>
                </div>
                <div className="text-center text-xs text-gray-500">Level 2 (4 nodes)</div>

                <div className="text-center text-gray-600">⋮</div>
                <div className="text-center text-xs text-gray-500">Levels 3-9...</div>

                <div className="flex justify-center flex-wrap gap-1 max-w-4xl mx-auto">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="inline-block px-2 py-1 bg-orange-500/20 border border-orange-500 rounded text-orange-400 font-mono text-xs">
                      Leaf {i}
                    </div>
                  ))}
                  <div className="inline-block px-2 py-1 text-gray-600 text-xs">... (1024 total)</div>
                </div>
                <div className="text-center text-xs text-gray-500">Level 10 (1024 leaves - wallet addresses)</div>
              </div>
            </div>

            {/* How Membership Proofs Work */}
            <div className="bg-dark-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-white font-semibold mb-4">How Membership Proofs Work</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-primary-400 font-medium mb-2">1. Tree Construction</div>
                  <p className="text-sm text-gray-400 mb-2">Hash each wallet address as a leaf node using Poseidon</p>
                  <div className="font-mono text-xs text-gray-500 bg-dark-900 rounded p-2">
                    leaf = Poseidon(walletAddress)
                  </div>
                </div>

                <div>
                  <div className="text-blue-400 font-medium mb-2">2. Generate Merkle Path</div>
                  <p className="text-sm text-gray-400 mb-2">To prove membership, collect sibling hashes from leaf to root (10 siblings for 10-level tree)</p>
                  <div className="font-mono text-xs text-gray-500 bg-dark-900 rounded p-2">
                    path = [sibling_0, sibling_1, ..., sibling_9]
                  </div>
                </div>

                <div>
                  <div className="text-green-400 font-medium mb-2">3. Create ZK Proof</div>
                  <p className="text-sm text-gray-400 mb-2">Use Groth16 to prove knowledge of path from your leaf to the root</p>
                  <div className="font-mono text-xs text-gray-500 bg-dark-900 rounded p-2">
                    <div>// Circuit verifies:</div>
                    <div className="text-primary-400">currentHash = Poseidon(yourAddress)</div>
                    <div className="text-blue-400">for each level: currentHash = Poseidon(currentHash, sibling)</div>
                    <div className="text-green-400">assert(currentHash == rootHash)</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded p-4">
                  <div className="flex items-start space-x-3">
                    <Key className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium mb-1">Privacy Guarantee</div>
                      <p className="text-sm text-gray-400">
                        The proof reveals ONLY that your address is in the tree. The verifier learns nothing about:
                        which leaf position you are, other addresses in the tree, or the Merkle path itself.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card text-center">
                <div className="text-3xl font-bold text-gradient mb-2">1024</div>
                <div className="text-gray-400 text-sm">Maximum Addresses</div>
                <div className="text-xs text-gray-500 mt-1">2^10 leaves</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-gradient mb-2">10</div>
                <div className="text-gray-400 text-sm">Proof Elements</div>
                <div className="text-xs text-gray-500 mt-1">Sibling hashes</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-gradient mb-2">~2s</div>
                <div className="text-gray-400 text-sm">Proof Generation</div>
                <div className="text-xs text-gray-500 mt-1">Client-side</div>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/DevCristobalvc/zkp-jwt/tree/Master/circuits"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-lg hover:bg-primary-500/20 transition-colors"
              >
                <span className="text-primary-400 text-sm">View Our Circuit Implementation</span>
                <ExternalLink className="w-4 h-4 text-primary-400" />
              </a>
              <a
                href="https://docs.circom.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-lg hover:bg-primary-500/20 transition-colors"
              >
                <span className="text-primary-400 text-sm">circom Documentation</span>
                <ExternalLink className="w-4 h-4 text-primary-400" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card border-2 border-primary-500/30"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Putting It All Together</h2>
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              ZKPJWT combines these three cryptographic primitives to create a <span className="text-white font-semibold">privacy-preserving authentication system</span>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark-800 rounded-lg p-4 border border-purple-500/30">
                <Lock className="w-8 h-8 text-purple-400 mb-3" />
                <div className="text-white font-semibold mb-2">Groth16</div>
                <p className="text-sm text-gray-400">Generates succinct, constant-size proofs (~200 bytes) that can be verified efficiently</p>
              </div>

              <div className="bg-dark-800 rounded-lg p-4 border border-blue-500/30">
                <Binary className="w-8 h-8 text-blue-400 mb-3" />
                <div className="text-white font-semibold mb-2">Poseidon</div>
                <p className="text-sm text-gray-400">Enables fast hashing in circuits (100x faster than SHA-256 in ZK)</p>
              </div>

              <div className="bg-dark-800 rounded-lg p-4 border border-green-500/30">
                <GitBranch className="w-8 h-8 text-green-400 mb-3" />
                <div className="text-white font-semibold mb-2">Merkle Trees</div>
                <p className="text-sm text-gray-400">Proves set membership without revealing which element you are</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-500/10 to-blue-500/10 rounded-lg p-6 border border-primary-500/30 mt-6">
              <p className="text-white font-semibold mb-2">The Result:</p>
              <p className="text-gray-300 leading-relaxed">
                Users can prove they're authorized (their address is in the Merkle tree) without revealing their identity, 
                which leaf position they occupy, or any other information. The proof is verified in constant time with minimal gas cost (~21K).
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
