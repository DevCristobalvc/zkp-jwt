import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-primary-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">ZK</span>
              </div>
              <span className="text-xl font-semibold text-white font-mono">ZKPJWT</span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link to="/stellar" className="px-3 py-2 text-sm text-primary-400 hover:text-primary-300 transition-colors font-medium">
              Stellar
            </Link>
            <Link to="/library" className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Docs
            </Link>
            <Link to="/architecture" className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Architecture
            </Link>
            <Link to="/resources" className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Resources
            </Link>
            <a
              href="https://github.com/DevCristobalvc/zkp-jwt"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://sepolia.arbiscan.io/address/0xa0539e9c8701e714f94400153eeed5d05af6e496"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors"
            >
              Contract
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-gray-950 border-t border-gray-800"
        >
          <div className="px-4 py-4 space-y-3">
            <Link to="/stellar" className="block text-primary-400 hover:text-primary-300 transition-colors font-medium" onClick={() => setIsOpen(false)}>
              Stellar
            </Link>
            <Link to="/library" className="block text-gray-400 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
              Docs
            </Link>
            <Link to="/architecture" className="block text-gray-400 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
              Architecture
            </Link>
            <Link to="/resources" className="block text-gray-400 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
              Resources
            </Link>
            <a
              href="https://github.com/DevCristobalvc/zkp-jwt"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              GitHub
            </a>
            <a
              href="https://sepolia.arbiscan.io/address/0xa0539e9c8701e714f94400153eeed5d05af6e496"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 bg-primary-500 text-white rounded text-center"
              onClick={() => setIsOpen(false)}
            >
              Contract
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
