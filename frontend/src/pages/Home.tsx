import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react';
import LiveDemo from '../components/LiveDemo';

export default function Home() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section - Clean and Minimal */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 border border-primary-500/30 px-3 py-1 rounded-full mb-6"
          >
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400 font-mono">Powered by Arbitrum Stylus</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
          >
            Zero-Knowledge JWT
            <br />
            <span className="text-primary-400">Privacy for Web3 Authentication</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8"
          >
            Production-ready TypeScript library combining JWT authentication with zero-knowledge proofs. 
            Verify credentials on-chain without revealing sensitive data.
          </motion.p>

          {/* Stats - Minimal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mb-12"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">94%</div>
              <div className="text-xs text-gray-500 font-mono">Gas Savings</div>
            </div>
            <div className="text-center border-l border-r border-gray-800">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">6.1 KB</div>
              <div className="text-xs text-gray-500 font-mono">Contract Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">1024</div>
              <div className="text-xs text-gray-500 font-mono">Merkle Leaves</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/library" className="btn-primary flex items-center space-x-2 group">
              <span>Documentation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/architecture" className="btn-secondary">
              Architecture
            </Link>
            <a 
              href="https://github.com/DevCristobalvc/zkp-jwt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors"
            >
              GitHub
            </a>
          </motion.div>
        </div>
      </section>

      {/* Live Demo Section - Primary Focus */}
      <LiveDemo />

      {/* Features Grid - Minimal */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Why ZKPJWT</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Bridging Web2 authentication standards with Web3 privacy guarantees
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="border border-gray-800 rounded-lg p-6 hover:border-primary-500/30 transition-colors"
            >
              <Lock className="w-10 h-10 text-primary-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Privacy-Preserving</h3>
              <p className="text-sm text-gray-400">
                Prove JWT ownership without revealing the token or sensitive claims. 
                Zero-knowledge proofs ensure complete privacy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="border border-gray-800 rounded-lg p-6 hover:border-primary-500/30 transition-colors"
            >
              <Zap className="w-10 h-10 text-primary-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Gas Efficient</h3>
              <p className="text-sm text-gray-400">
                Arbitrum Stylus enables 94% gas savings over Solidity. 
                Only ~21K gas per verification vs 300K+ in pure Solidity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="border border-gray-800 rounded-lg p-6 hover:border-primary-500/30 transition-colors"
            >
              <Shield className="w-10 h-10 text-primary-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Production Ready</h3>
              <p className="text-sm text-gray-400">
                Complete TypeScript SDK with Merkle tree building, proof generation, 
                and contract interaction. Battle-tested cryptography.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              to="/library" 
              className="border border-gray-800 rounded-lg p-8 hover:border-primary-500/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Library & Docs</h3>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Complete API reference, installation guide, and code examples for the zkpjwt-core npm package.
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-600">npm install zkpjwt-core</span>
              </div>
            </Link>

            <Link 
              to="/architecture" 
              className="border border-gray-800 rounded-lg p-8 hover:border-primary-500/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Architecture</h3>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Technical deep dive into the hybrid verification system, ZK circuits, and Stylus contracts.
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-600">Groth16 + Poseidon + Merkle</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
