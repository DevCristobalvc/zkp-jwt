import { motion } from 'framer-motion';
import { Users, Vote, Key, Building2 } from 'lucide-react';

const useCases = [
  {
    icon: Users,
    title: 'NFT Allowlist',
    description: 'Private presale access without revealing your wallet address. Prove you\'re on the list without doxxing your holdings.',
    example: 'Bored Ape presale: 10K wallets whitelisted → Mint without exposing which whale you are',
    color: 'from-purple-500 to-pink-500',
    stats: '🔒 Full Privacy',
  },
  {
    icon: Vote,
    title: 'Anonymous DAO Voting',
    description: 'Vote on proposals without linking your identity to your choice. Maintain privacy while participating in governance.',
    example: 'Snapshot voting: Prove token ownership → Vote anonymously → Results verified on-chain',
    color: 'from-blue-500 to-cyan-500',
    stats: '🗳️ Democratic',
  },
  {
    icon: Key,
    title: 'Token Gating',
    description: 'Access exclusive content or communities by proving token ownership privately. No need to expose your entire wallet.',
    example: 'Discord roles: Hold >100 tokens → Get access → Balance stays private',
    color: 'from-green-500 to-emerald-500',
    stats: '🎫 Exclusive',
  },
  {
    icon: Building2,
    title: 'Enterprise Access Control',
    description: 'Corporate credential verification without exposing employee details. Perfect for B2B authentication and compliance.',
    example: 'Company portal: Prove employment → Access resources → Identity protected',
    color: 'from-orange-500 to-red-500',
    stats: '🏢 Professional',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export default function UseCases() {
  return (
    <section id="use-cases" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">Real-World Use Cases</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Privacy-preserving solutions for the next generation of Web3 applications
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                className="card group hover:scale-[1.02] transition-transform duration-300"
              >
                {/* Icon and Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${useCase.color} p-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <span className="text-xs px-3 py-1 glass rounded-full text-gray-300 font-medium">
                    {useCase.stats}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3">{useCase.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {useCase.description}
                </p>

                {/* Example */}
                <div className="glass rounded-lg p-4 border-l-4 border-primary-500">
                  <p className="text-sm text-gray-400 mb-1 font-semibold">Example:</p>
                  <p className="text-sm text-gray-300">{useCase.example}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Why It Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 card bg-gradient-to-br from-primary-900/20 to-blue-900/20 border-primary-500/20"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Why Privacy Matters in Web3</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div>
                <div className="text-3xl font-bold text-gradient mb-2">100%</div>
                <p className="text-gray-300">Privacy Preserved</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient mb-2">94%</div>
                <p className="text-gray-300">Gas Savings vs Full ZK</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient mb-2">1024</div>
                <p className="text-gray-300">Max Addresses per Tree</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
