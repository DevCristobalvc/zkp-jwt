import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Code2, Book } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
            <Link to="/docs" className="btn-primary flex items-center space-x-2 group">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/architecture" className="btn-secondary">
              How It Works
            </Link>
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
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white text-center mb-12"
          >
            Explore the Project
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/jwt" className="card group hover:border-primary-500/50 transition-all">
              <Shield className="w-12 h-12 text-primary-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Understanding JWT</h3>
              <p className="text-gray-400 text-sm mb-4">Learn why JWT needs privacy and how ZKPJWT solves it</p>
              <div className="flex items-center text-primary-400 text-sm">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/zkp" className="card group hover:border-primary-500/50 transition-all">
              <Code2 className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Zero-Knowledge Proofs</h3>
              <p className="text-gray-400 text-sm mb-4">Deep dive into Groth16, Poseidon, and Merkle trees</p>
              <div className="flex items-center text-primary-400 text-sm">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/library" className="card group hover:border-primary-500/50 transition-all">
              <Book className="w-12 h-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Library & SDK</h3>
              <p className="text-gray-400 text-sm mb-4">TypeScript library, API reference, and integration guide</p>
              <div className="flex items-center text-primary-400 text-sm">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/architecture" className="card group hover:border-primary-500/50 transition-all">
              <Shield className="w-12 h-12 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Architecture</h3>
              <p className="text-gray-400 text-sm mb-4">System design, workflows, and technical specifications</p>
              <div className="flex items-center text-primary-400 text-sm">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
