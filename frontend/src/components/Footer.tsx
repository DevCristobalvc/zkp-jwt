import { Github, Twitter, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ZK</span>
              </div>
              <span className="text-xl font-semibold text-gradient">ZKPJWT</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Privacy-preserving access control using Zero-Knowledge Proofs on Arbitrum Stylus.
              Built for the future of Web3.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#docs" className="text-gray-400 hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/DevCristobalvc/zkp-jwt" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://sepolia.arbiscan.io/address/0xa0539e9c8701e714f94400153eeed5d05af6e496" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  Contract
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/DevCristobalvc/zkp-jwt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass-hover rounded-lg flex items-center justify-center group"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass-hover rounded-lg flex items-center justify-center group"
              >
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#docs"
                className="w-10 h-10 glass-hover rounded-lg flex items-center justify-center group"
              >
                <FileText className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 ZKPJWT. Built with ❤️ for Arbitrum.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="https://arbitrum.io" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400 text-sm">
                Powered by Arbitrum Stylus
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
