import { motion } from 'framer-motion';
import { Copy, Check, Package, Code2, ExternalLink } from 'lucide-react';
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
  
  advanced: `// Advanced: Custom tree configuration
const builder = new MerkleTreeBuilder({ 
  levels: 10,
  zeroValue: 0n 
});

// Use with existing JWT claims
interface JWTClaims {
  sub: string;
  role: string;
}

const addresses = jwtUsers.map(u => u.sub);
const tree = await builder.buildTree(addresses);

// Generate proof for specific user
const proof = builder.getMerkleProof(user.sub);
const zkProof = await prover.generateProof(proof);`,
};

function CodeBlock({ code, title }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {title && <div className="text-xs text-gray-500 mb-2 font-mono">{title}</div>}
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm border border-gray-800">
        <code className="text-gray-300 font-mono">{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Library & Docs</h1>
          <p className="text-lg text-gray-400">
            TypeScript library for zero-knowledge JWT verification. Install via npm and integrate in minutes.
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* Installation */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center space-x-3 mb-6">
              <Package className="w-6 h-6 text-primary-400" />
              <h2 className="text-2xl font-bold text-white">Installation</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Install zkpjwt-core via npm or yarn:
            </p>
            <CodeBlock code={codeBlocks.install} />
            
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <a 
                href="https://www.npmjs.com/package/zkpjwt-core" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-400 hover:text-primary-300"
              >
                <ExternalLink className="w-4 h-4" />
                <span>npm package</span>
              </a>
              <span className="text-gray-600">|</span>
              <span className="text-gray-500 font-mono">v0.1.1</span>
              <span className="text-gray-600">|</span>
              <span className="text-gray-500">4.6 MB unpacked</span>
            </div>
          </motion.section>

          {/* Quick Start */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center space-x-3 mb-6">
              <Code2 className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Quick Start</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Complete workflow from tree building to on-chain verification:
            </p>
            <CodeBlock code={codeBlocks.usage} title="example.ts" />
          </motion.section>

          {/* Advanced Usage */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-white mb-6">Advanced Usage</h2>
            <CodeBlock code={codeBlocks.advanced} title="advanced.ts" />
          </motion.section>

          {/* API Reference */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-white mb-6">API Reference</h2>
            
            <div className="space-y-6">
              <div className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3 font-mono">MerkleTreeBuilder</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Builds Poseidon-based Merkle trees for address allowlists.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-900 rounded p-3">
                    <code className="text-primary-400">constructor(options: TreeOptions)</code>
                    <p className="text-gray-500 mt-1 text-xs">Initialize with levels and zero value</p>
                  </div>
                  <div className="bg-gray-900 rounded p-3">
                    <code className="text-primary-400">buildTree(addresses: string[]): Promise&lt;Tree&gt;</code>
                    <p className="text-gray-500 mt-1 text-xs">Build tree from array of addresses</p>
                  </div>
                  <div className="bg-gray-900 rounded p-3">
                    <code className="text-primary-400">getMerkleProof(address: string): MerkleProof</code>
                    <p className="text-gray-500 mt-1 text-xs">Get proof for specific address</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3 font-mono">ProofGenerator</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Generates Groth16 zero-knowledge proofs from Merkle proofs.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-900 rounded p-3">
                    <code className="text-primary-400">generateProof(merkleProof: MerkleProof): Promise&lt;ZKProof&gt;</code>
                    <p className="text-gray-500 mt-1 text-xs">Create ZK proof from Merkle proof</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3 font-mono">ProofVerifier</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Client-side Groth16 proof verification.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-900 rounded p-3">
                    <code className="text-primary-400">verifyProof(proof: ZKProof): Promise&lt;boolean&gt;</code>
                    <p className="text-gray-500 mt-1 text-xs">Verify proof client-side (~300K gas equivalent)</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3 font-mono">ContractClient</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Interact with Stylus contract on Arbitrum.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-900 rounded p-3">
                    <code className="text-primary-400">connectWallet(privateKey: string): Promise&lt;void&gt;</code>
                    <p className="text-gray-500 mt-1 text-xs">Connect wallet to Arbitrum Sepolia</p>
                  </div>
                  <div className="bg-gray-900 rounded p-3">
                    <code className="text-primary-400">setRoot(root: bigint): Promise&lt;TransactionReceipt&gt;</code>
                    <p className="text-gray-500 mt-1 text-xs">Store Merkle root on-chain (~21K gas)</p>
                  </div>
                  <div className="bg-gray-900 rounded p-3">
                    <code className="text-primary-400">verifyProof(root: bigint): Promise&lt;boolean&gt;</code>
                    <p className="text-gray-500 mt-1 text-xs">Verify root on-chain (~21K gas)</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Links */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-white mb-6">Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="https://www.npmjs.com/package/zkpjwt-core"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-800 rounded-lg p-6 hover:border-primary-500/30 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">npm Package</h3>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-primary-400" />
                </div>
                <p className="text-sm text-gray-400">Official zkpjwt-core package on npm registry</p>
              </a>

              <a 
                href="https://github.com/DevCristobalvc/zkp-jwt/tree/master/library"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-800 rounded-lg p-6 hover:border-primary-500/30 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">Source Code</h3>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-primary-400" />
                </div>
                <p className="text-sm text-gray-400">View source on GitHub</p>
              </a>

              <a 
                href="https://sepolia.arbiscan.io/address/0xa0539e9c8701e714f94400153eeed5d05af6e496"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-800 rounded-lg p-6 hover:border-primary-500/30 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">Contract</h3>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-primary-400" />
                </div>
                <p className="text-sm text-gray-400">View on Arbiscan</p>
              </a>

              <a 
                href="https://github.com/DevCristobalvc/zkp-jwt"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-800 rounded-lg p-6 hover:border-primary-500/30 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">Full Repository</h3>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-primary-400" />
                </div>
                <p className="text-sm text-gray-400">Complete project including circuits and contracts</p>
              </a>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
