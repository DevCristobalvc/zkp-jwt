import { motion } from 'framer-motion';
import { AlertCircle, Shield, CheckCircle2 } from 'lucide-react';

export default function Problem() {
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
          <h2 className="section-title mb-4">The Problem</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            JWT is the <span className="text-white font-semibold">most widely used authentication standard in Web2</span>, 
            powering millions of applications worldwide. But it wasn't designed for Web3's privacy requirements.
          </p>
        </motion.div>

        {/* Problem/Solution Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* The Problem */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card border-2 border-red-500/30"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">JWT in Web3</h3>
            </div>
            
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="text-red-400 mt-1">✗</span>
                <div>
                  <span className="font-semibold text-white">No Privacy Guarantees</span>
                  <p className="text-gray-400 text-sm mt-1">Tokens expose user identity and metadata on-chain</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-400 mt-1">✗</span>
                <div>
                  <span className="font-semibold text-white">Blockchain Transparency</span>
                  <p className="text-gray-400 text-sm mt-1">Every verification reveals sensitive information permanently</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-400 mt-1">✗</span>
                <div>
                  <span className="font-semibold text-white">Incompatible Standards</span>
                  <p className="text-gray-400 text-sm mt-1">Web3 solutions ignore decades of proven authentication patterns</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* The Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card border-2 border-primary-500/30"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">ZKPJWT Solution</h3>
            </div>
            
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="text-primary-400 mt-1">✓</span>
                <div>
                  <span className="font-semibold text-white">Cryptographic Privacy</span>
                  <p className="text-gray-400 text-sm mt-1">Zero-knowledge proofs hide identity while proving membership</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary-400 mt-1">✓</span>
                <div>
                  <span className="font-semibold text-white">Web2 Compatibility</span>
                  <p className="text-gray-400 text-sm mt-1">Works with existing JWT infrastructure - no need to start from scratch</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary-400 mt-1">✓</span>
                <div>
                  <span className="font-semibold text-white">Production Ready</span>
                  <p className="text-gray-400 text-sm mt-1">Battle-tested library for real-world dApps with privacy requirements</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card bg-gradient-to-br from-primary-500/10 to-blue-500/10 border-2 border-primary-500/30"
        >
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary-400" />
            <h3 className="text-2xl font-bold text-white">Our Philosophy</h3>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed">
            Instead of reinventing authentication for Web3, we <span className="text-white font-semibold">adapt the most successful Web2 standard</span>. 
            JWT has proven itself with billions of users — ZKPJWT extends it with zero-knowledge proofs, 
            giving developers a <span className="text-primary-400 font-semibold">familiar tool with Web3-native privacy</span>. 
            Don't change the rules, <span className="text-white font-semibold">adapt them</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
