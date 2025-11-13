import { motion } from 'framer-motion';
import { GitBranch, Book, FileCode, ExternalLink, Package, Users, FileText } from 'lucide-react';

const resources = [
  {
    category: 'Project',
    icon: GitBranch,
    links: [
      { name: 'GitHub Repository', url: 'https://github.com/DevCristobalvc/zkp-jwt', description: 'Complete source code' },
      { name: 'npm Package', url: 'https://www.npmjs.com/package/zkpjwt-core', description: 'zkpjwt-core v0.1.1' },
      { name: 'Live Demo', url: 'https://zkpjwt.vercel.app', description: 'Interactive demo' }
    ]
  },
  {
    category: 'Smart Contract',
    icon: FileCode,
    links: [
      { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io/address/0xa0539e9c8701e714f94400153eeed5d05af6e496', description: 'Stylus verifier - 6.1 KB' },
      { name: 'Source Code', url: 'https://github.com/DevCristobalvc/zkp-jwt/tree/master/contracts', description: 'Rust implementation' }
    ]
  },
  {
    category: 'Documentation',
    icon: Book,
    links: [
      { name: 'Library README', url: 'https://github.com/DevCristobalvc/zkp-jwt/blob/master/library/README.md', description: 'API reference' },
      { name: 'Project Context', url: 'https://github.com/DevCristobalvc/zkp-jwt/blob/master/contexto.md', description: 'Background' },
      { name: 'Circuits', url: 'https://github.com/DevCristobalvc/zkp-jwt/tree/master/circuits', description: 'Circom code' }
    ]
  },
  {
    category: 'Libraries',
    icon: Package,
    links: [
      { name: 'circom', url: 'https://docs.circom.io/', description: 'Circuit compiler' },
      { name: 'snarkjs', url: 'https://github.com/iden3/snarkjs', description: 'JS zkSNARK' },
      { name: 'circomlibjs', url: 'https://github.com/iden3/circomlibjs', description: 'Poseidon hash' },
      { name: 'Stylus', url: 'https://docs.arbitrum.io/stylus/stylus-gentle-introduction', description: 'WASM contracts' }
    ]
  },
  {
    category: 'Research',
    icon: FileText,
    links: [
      { name: 'Groth16', url: 'https://eprint.iacr.org/2016/260.pdf', description: 'zkSNARK paper' },
      { name: 'JWT RFC', url: 'https://datatracker.ietf.org/doc/html/rfc7519', description: 'JWT standard' }
    ]
  },
  {
    category: 'Community',
    icon: Users,
    links: [
      { name: 'ARG25', url: 'https://hackathon.arg.org', description: 'November 2025' },
      { name: 'Developer', url: 'https://github.com/DevCristobalvc', description: 'Cristobal Valencia' }
    ]
  }
];

function ResourceCard({ category, icon: Icon, links }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border border-gray-800 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon className="w-5 h-5 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">{category}</h3>
      </div>
      <div className="space-y-4">
        {links.map((link: any, idx: number) => (
          <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="block group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-white group-hover:text-primary-400 transition-colors">{link.name}</span>
                  <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                <p className="text-sm text-gray-500">{link.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Resources</h1>
          <p className="text-lg text-gray-400">Links to documentation, research papers, and community.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, idx) => (<ResourceCard key={idx} {...resource} />))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 border border-primary-500/30 rounded-lg p-8 bg-primary-500/5">
          <h2 className="text-2xl font-bold text-white mb-6">Project Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div><div className="text-3xl font-bold text-primary-400 mb-1">94%</div><div className="text-sm text-gray-400">Gas Savings</div></div>
            <div><div className="text-3xl font-bold text-primary-400 mb-1">6.1 KB</div><div className="text-sm text-gray-400">Contract</div></div>
            <div><div className="text-3xl font-bold text-primary-400 mb-1">1024</div><div className="text-sm text-gray-400">Leaves</div></div>
            <div><div className="text-3xl font-bold text-primary-400 mb-1">~21K</div><div className="text-sm text-gray-400">Gas/Verify</div></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
