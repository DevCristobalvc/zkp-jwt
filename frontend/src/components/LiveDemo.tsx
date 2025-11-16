import { motion } from 'framer-motion';

export default function LiveDemo() {
  return (
    <section id="demo" className="py-20 relative border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Try It Live</h2>
          <p className="text-gray-400">
            Interactive demo with MetaMask on Arbitrum Sepolia
          </p>
        </motion.div>

        {/* Iframe Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-gray-800 rounded-lg overflow-hidden"
          style={{ height: '800px' }}
        >
          <iframe
            src="https://zkp-jwt-mvp.vercel.app/"
            className="w-full h-full"
            title="ZKP JWT Live Demo"
            allow="clipboard-read; clipboard-write"
          />
        </motion.div>
      </div>
    </section>
  );
}
