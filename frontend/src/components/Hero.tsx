import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-blue-900/20" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-gray-300">Powered by Arbitrum Stylus</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="block text-white mb-2">ZKP + JWT</span>
          <span className="block text-gradient glow-text">Web2 Privacy for Web3</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
        >
          <span className="text-white font-semibold">JWT is the most used Web2 standard</span>, but it doesn't guarantee privacy in Web3. 
          Instead of redefining the rules, we adapt them. <span className="text-primary-400 font-semibold">ZKPJWT brings zero-knowledge proofs to JWT</span> — 
          a production-ready library for privacy-preserving authentication.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a href="#demo" className="btn-primary flex items-center space-x-2 group">
            <span>Try Live Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#docs" className="btn-secondary">
            Read Documentation
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto"
        >
          <div className="card text-center">
            <div className="text-4xl font-bold text-gradient mb-2">94%</div>
            <div className="text-gray-400">Gas Savings</div>
            <div className="text-sm text-gray-500 mt-1">21K vs 300K gas</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-gradient mb-2">6.1 KB</div>
            <div className="text-gray-400">Contract Size</div>
            <div className="text-sm text-gray-500 mt-1">Ultra efficient WASM</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-gradient mb-2">1024</div>
            <div className="text-gray-400">Addresses</div>
            <div className="text-sm text-gray-500 mt-1">10-level Merkle tree</div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-primary-400 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
