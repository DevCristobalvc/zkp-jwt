import { motion } from 'framer-motion';
import { GitBranch, Book, FileCode, ExternalLink, Package, FileText } from 'lucide-react';

const resources = [
  {
    category: 'GitHub Repositories',
    icon: GitBranch,
    color: 'from-purple-500 to-pink-500',
    links: [
      {
        name: 'zkp-jwt (Main Repository)',
        url: 'https://github.com/DevCristobalvc/zkp-jwt',
        description: 'Complete monorepo with circuits, contracts, library, and frontend'
      },
      {
        name: 'Circuits (circom)',
        url: 'https://github.com/DevCristobalvc/zkp-jwt/tree/Master/circuits',
        description: 'Zero-knowledge circuit implementations with Groth16'
      },
      {
        name: 'Smart Contracts (Rust)',
        url: 'https://github.com/DevCristobalvc/zkp-jwt/tree/Master/contracts/zkpjwt-verifier',
        description: 'Arbitrum Stylus verifier contract'
      },
      {
        name: 'TypeScript Library',
        url: 'https://github.com/DevCristobalvc/zkp-jwt/tree/Master/library',
        description: 'Production-ready client library'
      }
    ]
  },
  {
    category: 'Smart Contract',
    icon: FileCode,
    color: 'from-blue-500 to-cyan-500',
    links: [
      {
        name: 'Contract on Arbiscan',
        url: 'https://sepolia.arbiscan.io/address/0xa0539e9c8701e714f94400153eeed5d05af6e496',
        description: 'Verified contract on Arbitrum Sepolia testnet'
      },
      {
        name: 'Contract Source Code',
        url: 'https://github.com/DevCristobalvc/zkp-jwt/blob/Master/contracts/zkpjwt-verifier/src/lib.rs',
        description: 'Rust implementation with Stylus SDK'
      },
      {
        name: 'Deployment Config',
        url: 'https://github.com/DevCristobalvc/zkp-jwt/blob/Master/contracts/deployment-config.json',
        description: 'Network configuration and addresses'
      }
    ]
  },
  {
    category: 'Package & Library',
    icon: Package,
    color: 'from-green-500 to-emerald-500',
    links: [
      {
        name: 'npm Package (Coming Soon)',
        url: 'https://www.npmjs.com/package/zkpjwt-core',
        description: 'Install via npm install zkpjwt-core'
      },
      {
        name: 'Library Documentation',
        url: 'https://github.com/DevCristobalvc/zkp-jwt/blob/Master/library/README.md',
        description: 'API reference and usage examples'
      },
      {
        name: 'Type Definitions',
        url: 'https://github.com/DevCristobalvc/zkp-jwt/blob/Master/library/src/types.ts',
        description: 'TypeScript interfaces and types'
      }
    ]
  },
  {
    category: 'Documentation',
    icon: Book,
    color: 'from-orange-500 to-red-500',
    links: [
      {
        name: 'Protocol Specification',
        url: 'https://github.com/DevCristobalvc/zkp-jwt/blob/Master/docs/PROTOCOL_SPEC.md',
        description: 'Technical specification and cryptographic design'
      },
      {
        name: 'ADR-001: Verification Strategy',
        url: 'https://github.com/DevCristobalvc/zkp-jwt/blob/Master/docs/ADR-001-verification-strategy.md',
        description: 'Architecture decision record'
      },
      {
        name: 'Project Context',
        url: 'https://github.com/DevCristobalvc/zkp-jwt/blob/Master/contexto.md',
        description: 'Project background and motivation'
      },
      {
        name: 'Tasks & Roadmap',
        url: 'https://github.com/DevCristobalvc/zkp-jwt/blob/Master/TASKS.md',
        description: 'Development tasks and progress'
      }
    ]
  },
  {
    category: 'Technical Papers',
    icon: FileText,
    color: 'from-indigo-500 to-blue-500',
    links: [
      {
        name: 'Groth16 Paper',
        url: 'https://eprint.iacr.org/2016/260.pdf',
        description: 'Original Groth16 zero-knowledge proof system'
      },
      {
        name: 'circom Documentation',
        url: 'https://docs.circom.io/',
        description: 'Circuit compiler for zero-knowledge proofs'
      },
      {
        name: 'snarkjs Library',
        url: 'https://github.com/iden3/snarkjs',
        description: 'JavaScript implementation of zkSNARK'
      },
      {
        name: 'Arbitrum Stylus Docs',
        url: 'https://docs.arbitrum.io/stylus/stylus-gentle-introduction',
        description: 'WASM smart contracts on Arbitrum'
      },
      {
        name: 'JWT RFC 7519',
        url: 'https://datatracker.ietf.org/doc/html/rfc7519',
        description: 'JSON Web Token standard specification'
      }
    ]
  }
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">Resources & Links</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore the codebase, documentation, and technical resources
          </p>
        </motion.div>

        {/* Resources Grid */}
        <div className="space-y-12">
          {resources.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="card"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{category.category}</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {category.links.map((link, linkIdx) => (
                    <a
                      key={linkIdx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between p-4 bg-dark-800 hover:bg-dark-700 rounded-lg border border-gray-700 hover:border-primary-500/50 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-white font-medium group-hover:text-primary-400 transition-colors">
                            {link.name}
                          </h4>
                          <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition-colors" />
                        </div>
                        <p className="text-sm text-gray-400">{link.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <a
            href="https://github.com/DevCristobalvc/zkp-jwt"
            target="_blank"
            rel="noopener noreferrer"
            className="card hover:border-primary-500/50 transition-all group text-center"
          >
            <GitBranch className="w-8 h-8 text-primary-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2 group-hover:text-primary-400 transition-colors">Star on GitHub</h4>
            <p className="text-sm text-gray-400">Contribute to the project</p>
          </a>

          <a
            href="https://sepolia.arbiscan.io/address/0xa0539e9c8701e714f94400153eeed5d05af6e496"
            target="_blank"
            rel="noopener noreferrer"
            className="card hover:border-primary-500/50 transition-all group text-center"
          >
            <FileCode className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2 group-hover:text-primary-400 transition-colors">View Contract</h4>
            <p className="text-sm text-gray-400">Explore on Arbiscan</p>
          </a>

          <a
            href="https://github.com/DevCristobalvc/zkp-jwt/blob/Master/docs/PROTOCOL_SPEC.md"
            target="_blank"
            rel="noopener noreferrer"
            className="card hover:border-primary-500/50 transition-all group text-center"
          >
            <Book className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2 group-hover:text-primary-400 transition-colors">Read Docs</h4>
            <p className="text-sm text-gray-400">Technical specification</p>
          </a>
        </motion.div>
      </div>
    </section>
    </div>
  );
}
