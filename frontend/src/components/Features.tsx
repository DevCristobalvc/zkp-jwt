import { motion } from 'framer-motion';
import { Shield, Zap, Lock, Code, Cpu, DollarSign, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'JWT + Zero-Knowledge',
    description: 'Extends the most used Web2 authentication standard with Groth16 proofs. Prove identity without exposing sensitive data.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Lock,
    title: 'Privacy by Design',
    description: 'JWT tokens lack privacy guarantees in Web3. ZKPJWT adds cryptographic privacy while maintaining compatibility with existing systems.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Code,
    title: 'Drop-in Library',
    description: 'Production-ready TypeScript library. Integrate privacy-preserving authentication in your dApp with just a few lines of code.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Zap,
    title: 'Arbitrum Stylus',
    description: 'Built with Rust and compiled to WASM. 10x cheaper gas costs compared to traditional Solidity contracts.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Cpu,
    title: 'Hybrid Verification',
    description: 'Full Groth16 verification client-side with on-chain root validation. Optimal security and efficiency.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: DollarSign,
    title: 'Cost Efficient',
    description: 'Only ~21K gas per verification. 94% cheaper than full on-chain pairing checks. Scalable for production.',
    color: 'from-yellow-500 to-amber-500',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">Why ZKPJWT?</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don't reinvent the wheel. <span className="text-white font-semibold">Adapt the most used Web2 standard</span> with zero-knowledge proofs. 
            Enterprise-grade privacy infrastructure for the decentralized web.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ scale: 1.02, y: -5 }}
                className="card group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stylus highlight */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 card border-2 border-primary-500/30"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                <Cpu className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Powered by Arbitrum Stylus</h3>
              <p className="text-gray-300 mb-4">
                First ZK proof protocol built with Rust and WASM on Arbitrum. Experience blazing fast execution and minimal gas costs.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://sepolia.arbiscan.io/address/0xa0539e9c8701e714f94400153eeed5d05af6e496"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 font-medium flex items-center space-x-1"
                >
                  <span>View ZKPJWT Contract</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <span className="text-gray-600">•</span>
                <a
                  href="https://sepolia.arbiscan.io/address/0xf935f364f797af2336ffdb3ee06431e1616b7c6c#code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 font-medium flex items-center space-x-1"
                >
                  <span>View Sample Contract</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
