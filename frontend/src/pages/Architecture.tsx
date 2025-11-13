import { motion } from 'framer-motion';
import { Code2, Shield, Zap, CheckCircle2 } from 'lucide-react';
import MermaidDiagram from '../components/MermaidDiagram';

export default function ArchitecturePage() {
  const flowDiagram = `
graph TB
    A[User Address] --> B[Build Merkle Tree]
    B --> C[Generate Merkle Proof]
    C --> D[Create ZK Proof]
    D --> E[Client Verification]
    E --> F{Valid?}
    F -->|Yes| G[Submit to Contract]
    F -->|No| H[Reject]
    G --> I[On-Chain Verification]
    I --> J[Access Granted]
    
    style A fill:#1e293b,stroke:#3b82f6
    style D fill:#1e293b,stroke:#6366f1
    style I fill:#1e293b,stroke:#10b981
    style J fill:#1e293b,stroke:#10b981
  `;

  const hybridArchitecture = `
sequenceDiagram
    participant User
    participant Client
    participant Circuit
    participant Contract
    
    User->>Client: Provide Address
    Client->>Client: Build Merkle Tree (1024 leaves)
    Client->>Circuit: Generate ZK Proof (Groth16)
    Circuit-->>Client: Proof + Public Signals
    Client->>Client: Full Verification (~300K gas)
    Client->>Contract: Submit Proof + Root
    Contract->>Contract: Verify Root Only (~21K gas)
    Contract-->>User: Access Granted
    
    Note over Client,Circuit: Off-chain: Full ZK verification
    Note over Contract: On-chain: Root comparison only
  `;

  const dataFlow = `
graph LR
    A[Addresses Array] --> B[Poseidon Hash]
    B --> C[Merkle Tree]
    C --> D[Root + Proof]
    D --> E[Circom Circuit]
    E --> F[Groth16 Proof]
    F --> G[pi_a, pi_b, pi_c]
    G --> H[Stylus Contract]
    H --> I[Verification Result]
    
    style A fill:#1e293b,stroke:#3b82f6
    style C fill:#1e293b,stroke:#6366f1
    style F fill:#1e293b,stroke:#8b5cf6
    style H fill:#1e293b,stroke:#10b981
  `;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Architecture</h1>
          <p className="text-lg text-gray-400 max-w-3xl">
            Deep dive into the hybrid verification system combining off-chain ZK proofs with on-chain root verification.
          </p>
        </motion.div>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Complete Verification Flow</h2>
          <div className="border border-gray-800 rounded-lg p-6">
            <MermaidDiagram chart={flowDiagram} />
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Hybrid Architecture</h2>
          <div className="border border-gray-800 rounded-lg p-6 mb-6">
            <MermaidDiagram chart={hybridArchitecture} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-800 rounded-lg p-6">
              <Shield className="w-8 h-8 text-primary-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Off-Chain: Full ZK Verification</h3>
              <p className="text-sm text-gray-400 mb-4">
                Complete Groth16 verification client-side. Includes proof verification, public signals, and Merkle root validation.
              </p>
              <code className="text-xs text-primary-400 font-mono">snarkjs, circomlibjs</code>
            </div>

            <div className="border border-gray-800 rounded-lg p-6">
              <Zap className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">On-Chain: Root Comparison</h3>
              <p className="text-sm text-gray-400 mb-4">
                Only Merkle root verified on-chain. Stylus contract costs just ~21K gas - 94% cheaper.
              </p>
              <code className="text-xs text-green-400 font-mono">Arbitrum Stylus (Rust)</code>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Data Flow</h2>
          <div className="border border-gray-800 rounded-lg p-6">
            <MermaidDiagram chart={dataFlow} />
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Technical Specifications</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-800 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <Code2 className="w-6 h-6 text-blue-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">ZK Circuit</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Written in Circom, compiled to R1CS. Verifies Merkle membership with Poseidon hash.
                  </p>
                  <div className="bg-gray-900 rounded p-3 font-mono text-xs">
                    <div className="text-gray-500">// Circuit inputs</div>
                    <div className="text-primary-400">signal input leaf;</div>
                    <div className="text-primary-400">signal input root;</div>
                    <div className="text-primary-400">signal input pathElements[10];</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-800 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Merkle Tree</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    10-level tree, 1024 addresses. Poseidon hash for ZK compatibility.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">Levels:</span><span className="text-white ml-2">10</span></div>
                    <div><span className="text-gray-500">Addresses:</span><span className="text-white ml-2">1024</span></div>
                    <div><span className="text-gray-500">Hash:</span><span className="text-white ml-2">Poseidon</span></div>
                    <div><span className="text-gray-500">Proof:</span><span className="text-white ml-2">~320 bytes</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-800 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <Zap className="w-6 h-6 text-purple-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Stylus Contract</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Rust → WASM on Arbitrum Stylus. Ultra-efficient root verification.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">Language:</span><span className="text-white ml-2">Rust</span></div>
                    <div><span className="text-gray-500">Size:</span><span className="text-white ml-2">6.1 KB</span></div>
                    <div><span className="text-gray-500">setRoot:</span><span className="text-white ml-2">~21K gas</span></div>
                    <div><span className="text-gray-500">verify:</span><span className="text-white ml-2">~21K gas</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-white mb-6">Gas Cost Comparison</h2>
          
          <div className="border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-white">Operation</th>
                  <th className="px-6 py-4 text-right text-white">Solidity</th>
                  <th className="px-6 py-4 text-right text-white">Stylus</th>
                  <th className="px-6 py-4 text-right text-white">Savings</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr className="border-b border-gray-800">
                  <td className="px-6 py-4 text-gray-300">Set Root</td>
                  <td className="px-6 py-4 text-right text-gray-400">~25K</td>
                  <td className="px-6 py-4 text-right text-green-400">~21K</td>
                  <td className="px-6 py-4 text-right text-green-400">16%</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="px-6 py-4 text-gray-300">Verify (Full)</td>
                  <td className="px-6 py-4 text-right text-gray-400">~350K</td>
                  <td className="px-6 py-4 text-right text-green-400">~21K</td>
                  <td className="px-6 py-4 text-right text-green-400">94%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-300">1000 verifications</td>
                  <td className="px-6 py-4 text-right text-gray-400">~350M</td>
                  <td className="px-6 py-4 text-right text-green-400">~21M</td>
                  <td className="px-6 py-4 text-right text-green-400 font-bold">94%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 border border-primary-500/30 rounded-lg p-6 bg-primary-500/5">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-primary-400">Key:</span> Hybrid architecture achieves 94% gas savings by moving full ZK verification off-chain.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
