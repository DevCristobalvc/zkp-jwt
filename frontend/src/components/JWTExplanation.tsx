import { motion } from 'framer-motion';
import { Key, Database, AlertTriangle, Shield } from 'lucide-react';

export default function JWTExplanation() {
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
          <h2 className="section-title mb-4">Understanding JWT</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            JSON Web Tokens (JWT) is the industry standard for secure authentication in modern web applications
          </p>
        </motion.div>

        {/* What is JWT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">What is JWT?</h3>
          </div>
          
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
              <span className="text-white font-semibold">JSON Web Token (RFC 7519)</span> is an open standard that defines a compact and self-contained way 
              for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.
            </p>
            
            <div className="bg-dark-800 rounded-lg p-6 border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Typical JWT structure:</p>
              <code className="text-primary-400 text-sm break-all">
                eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
              </code>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-red-400 font-mono">Header</span>
                  <p className="text-gray-500 mt-1">Algorithm & token type</p>
                </div>
                <div>
                  <span className="text-purple-400 font-mono">Payload</span>
                  <p className="text-gray-500 mt-1">Claims & user data</p>
                </div>
                <div>
                  <span className="text-blue-400 font-mono">Signature</span>
                  <p className="text-gray-500 mt-1">Verification</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Why JWT is Popular */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Why JWT Dominates Web2</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Stateless Authentication</h4>
                <p className="text-gray-400 text-sm">No server-side session storage required. Token contains all necessary information.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Cross-Domain/CORS</h4>
                <p className="text-gray-400 text-sm">Works seamlessly across different domains and services.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Mobile Friendly</h4>
                <p className="text-gray-400 text-sm">Perfect for mobile apps and single-page applications (SPAs).</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Scalability</h4>
                <p className="text-gray-400 text-sm">Easily scales horizontally without shared session state.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Industry Standard</h4>
                <p className="text-gray-400 text-sm">Used by Google, Microsoft, Auth0, and millions of applications worldwide.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Well-Documented</h4>
                <p className="text-gray-400 text-sm">Mature ecosystem with libraries in every programming language.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
            <p className="text-primary-300 text-sm">
              <span className="font-semibold">Market Adoption:</span> JWT is used in over 70% of modern web applications and processes billions of authentication requests daily.
            </p>
          </div>
        </motion.div>

        {/* The Web3 Problem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card border-2 border-red-500/30 mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">The Web3 Privacy Gap</h3>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-3">JWT Limitations in Blockchain Context</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                  <div>
                    <span className="text-white font-medium">Public Verification</span>
                    <p className="text-gray-400 text-sm mt-1">Standard JWT verification exposes user identity and claims on-chain permanently</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                  <div>
                    <span className="text-white font-medium">No Cryptographic Privacy</span>
                    <p className="text-gray-400 text-sm mt-1">JWT signatures prove authenticity but don't hide the payload data</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                  <div>
                    <span className="text-white font-medium">Blockchain Transparency</span>
                    <p className="text-gray-400 text-sm mt-1">Every transaction is public and immutable, creating permanent privacy risks</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                  <div>
                    <span className="text-white font-medium">Compliance Issues</span>
                    <p className="text-gray-400 text-sm mt-1">GDPR and data protection regulations require user privacy guarantees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card border-2 border-primary-500/30"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">ZKPJWT: The Bridge</h3>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Instead of abandoning JWT and starting from scratch, <span className="text-white font-semibold">ZKPJWT extends the proven standard</span> with 
              zero-knowledge proof technology. This approach provides:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-dark-800 rounded-lg p-4 border border-primary-500/30">
                <h4 className="text-primary-400 font-semibold mb-2">Cryptographic Privacy</h4>
                <p className="text-gray-400 text-sm">Groth16 zero-knowledge proofs allow verification without revealing sensitive data</p>
              </div>
              <div className="bg-dark-800 rounded-lg p-4 border border-primary-500/30">
                <h4 className="text-primary-400 font-semibold mb-2">JWT Compatibility</h4>
                <p className="text-gray-400 text-sm">Works alongside existing JWT infrastructure and authentication flows</p>
              </div>
              <div className="bg-dark-800 rounded-lg p-4 border border-primary-500/30">
                <h4 className="text-primary-400 font-semibold mb-2">On-Chain Efficiency</h4>
                <p className="text-gray-400 text-sm">Only 21K gas per verification using Arbitrum Stylus optimization</p>
              </div>
              <div className="bg-dark-800 rounded-lg p-4 border border-primary-500/30">
                <h4 className="text-primary-400 font-semibold mb-2">Production Ready</h4>
                <p className="text-gray-400 text-sm">Battle-tested library with TypeScript support and comprehensive documentation</p>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-br from-primary-500/10 to-blue-500/10 rounded-lg p-6 border border-primary-500/30">
              <p className="text-white font-semibold mb-2">Our Philosophy</p>
              <p className="text-gray-300 leading-relaxed">
                Don't reinvent authentication. <span className="text-primary-400 font-semibold">Adapt the world's most successful standard</span> with 
                cryptographic privacy guarantees. ZKPJWT gives developers familiar tools with Web3-native security.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
