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
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ZK</span>
              </div>
              <span className="text-xl font-semibold text-gradient">ZKPJWT</span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/jwt" className="text-gray-300 hover:text-white transition-colors">
              JWT
            </Link>
            <Link to="/zkp" className="text-gray-300 hover:text-white transition-colors">
              ZK Proofs
            </Link>
            <Link to="/library" className="text-gray-300 hover:text-white transition-colors">
              Library
            </Link>
            <Link to="/architecture" className="text-gray-300 hover:text-white transition-colors">
              Architecture
            </Link>
            <Link to="/resources" className="text-gray-300 hover:text-white transition-colors">
              Resources
            </Link>
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
              className="btn-primary text-sm px-4 py-2"
            >
              Contract
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
            <Link to="/jwt" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
              JWT
            </Link>
            <Link to="/zkp" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
              ZK Proofs
            </Link>
            <Link to="/library" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
              Library
            </Link>
            <Link to="/architecture" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
              Architecture
            </Link>
            <Link to="/resources" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
              Resources
            </Link>
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
