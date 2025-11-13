import { motion } from 'framer-motion';
import { Copy, Check, Terminal, Package, Shield, Zap } from 'lucide-react';
import { useState } from 'react';

const codeBlocks = {
  install: `npm install zkpjwt-core`,
  usage: `import { MerkleTreeBuilder, ProofGenerator, ContractClient } from 'zkpjwt-core';

// 1. Build Merkle tree
const builder = new MerkleTreeBuilder({ levels: 10 });
await builder.initialize();
const tree = await builder.buildTree(addresses);

// 2. Generate proof
const merkleProof = builder.getMerkleProof(yourAddress);
const prover = new ProofGenerator();
const zkProof = await prover.generateProof(merkleProof);

// 3. Verify client-side
const verifier = new ProofVerifier();
const result = await verifier.verifyProof(zkProof);

// 4. Submit on-chain
const client = new ContractClient();
await client.connectWallet(privateKey);
await client.setRoot(tree.root);
const isValid = await client.verifyProof(zkProof.merkleRoot);`,
  contract: `// Deployed on Arbitrum Sepolia
const CONTRACT_ADDRESS = "0xa0539e9c8701e714f94400153eeed5d05af6e496";

// Contract interface
interface IZKPJWTVerifier {
  function init() external;
  function getRoot() external view returns (uint256);
  function setRoot(uint256 new_root) external;
  function verifyProof(uint256 proof_root) external view returns (bool);
}

// Gas costs
// - setRoot: ~45K gas
// - verifyProof: ~21K gas (94% cheaper than full Groth16!)`,
};

function CodeBlock({ code }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="code-block overflow-x-auto">
        <code className="text-gray-300">{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 glass-hover rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">Documentation</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Bridge Web2 and Web3 authentication. Get started in minutes with our production-ready library 
            that brings <span className="text-primary-400 font-semibold">zero-knowledge validation</span> to existing JWT workflows.
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Installation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Installation</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Install the ZKPJWT core library via npm:
            </p>
            <CodeBlock code={codeBlocks.install} language="bash" />
          </motion.div>

          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Quick Start</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Complete example of generating and verifying a ZK proof:
            </p>
            <CodeBlock code={codeBlocks.usage} language="typescript" />
          </motion.div>

          {/* Contract Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card border-2 border-primary-500/30"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Smart Contract</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Deployed on Arbitrum Sepolia using Stylus (Rust + WASM):
            </p>
            <CodeBlock code={codeBlocks.contract} language="solidity" />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Contract Size</div>
                <div className="text-2xl font-bold text-gradient">6.1 KB</div>
              </div>
              <div className="glass rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Verify Gas</div>
                <div className="text-2xl font-bold text-gradient">~21K</div>
              </div>
              <div className="glass rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Gas Savings</div>
                <div className="text-2xl font-bold text-gradient">94%</div>
              </div>
            </div>
          </motion.div>

          {/* Key Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="card">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary-400" />
                <span>Zero-Knowledge</span>
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>• Groth16 proving system</li>
                <li>• BN254 elliptic curve</li>
                <li>• Poseidon hash function</li>
                <li>• 10-level Merkle tree</li>
              </ul>
            </div>
            <div className="card">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span>Arbitrum Stylus</span>
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>• Written in Rust</li>
                <li>• Compiled to WASM</li>
                <li>• 10x cheaper gas</li>
                <li>• Full EVM compatibility</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    </div>
  );
}
