import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ZK</span>
            </div>
            <span className="text-xl font-semibold text-gradient">ZKPJWT</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#docs" className="text-gray-300 hover:text-white transition-colors">
              Docs
            </a>
            <a href="#demo" className="text-gray-300 hover:text-white transition-colors">
              Demo
            </a>
            <a
              href="https://github.com/DevCristobalvc/zkp-jwt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://sepolia.arbiscan.io/address/0xa0539e9c8701e714f94400153eeed5d05af6e496"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              View Contract
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-white/10"
        >
          <div className="px-4 py-4 space-y-3">
            <a href="#features" className="block text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#docs" className="block text-gray-300 hover:text-white transition-colors">
              Docs
            </a>
            <a href="#demo" className="block text-gray-300 hover:text-white transition-colors">
              Demo
            </a>
            <a
              href="https://github.com/DevCristobalvc/zkp-jwt"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-300 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
