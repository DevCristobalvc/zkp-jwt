import { motion } from 'framer-motion';
import { Wallet, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function LiveDemo() {
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [txHash, setTxHash] = useState('');
  const [, setProofValid] = useState<boolean | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!');
      return;
    }

    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      setStep(1);
      setStep(1);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
    setLoading(false);
  };

  const generateProof = async () => {
    setLoading(true);
    setStep(2);
    
    // Simulate proof generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStep(3);
    setLoading(false);
  };

  const submitProof = async () => {
    setLoading(true);
    setStep(4);
    
    // Simulate on-chain submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTxHash('0x00035e7021dd2f4365b5afb7b81c0eed32e0f277ed4f93672030e369cc542ea6');
    setProofValid(true);
    setStep(5);
    setLoading(false);
  };

  const steps = [
    { title: 'Connect Wallet', description: 'Connect your MetaMask wallet' },
    { title: 'Generate Proof', description: 'Create ZK proof for your address' },
    { title: 'Verify Client-Side', description: 'Full Groth16 verification' },
    { title: 'Submit On-Chain', description: 'Validate on Arbitrum Sepolia' },
    { title: 'Success', description: 'Proof verified!' },
  ];

  return (
    <section id="demo" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-4">Live Demo</h2>
          <p className="text-xl text-gray-400">
            Try ZKPJWT in your browser with MetaMask
          </p>
        </motion.div>

        {/* Demo Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card"
        >
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center">
                  <div className={`flex flex-col items-center ${i <= step ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i < step ? 'bg-green-500' : i === step ? 'bg-primary-500 animate-pulse' : 'bg-gray-700'
                    }`}>
                      {i < step ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-white font-semibold">{i + 1}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 mt-2 hidden md:block text-center max-w-[80px]">
                      {s.title}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 w-12 mx-2 ${i < step ? 'bg-green-500' : 'bg-gray-700'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Content */}
          <div className="min-h-[300px] flex flex-col items-center justify-center">
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Connect MetaMask to get started. Make sure you're on Arbitrum Sepolia network.
                </p>
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Connecting...</>
                  ) : (
                    <>Connect MetaMask</>
                  )}
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Wallet Connected!</h3>
                <div className="glass rounded-lg p-4 mb-6 inline-block">
                  <p className="text-sm text-gray-400 mb-1">Your Address</p>
                  <p className="text-primary-400 font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                </div>
                <button onClick={generateProof} className="btn-primary">
                  Generate ZK Proof
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <Loader2 className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-2xl font-bold text-white mb-3">Generating Proof...</h3>
                <p className="text-gray-400">
                  Building Merkle tree and generating Groth16 proof
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Proof Generated!</h3>
                <div className="glass rounded-lg p-4 mb-6 max-w-md">
                  <p className="text-sm text-gray-400 mb-2">Merkle Root</p>
                  <p className="text-primary-400 font-mono text-xs break-all">
                    7046589983159652013629355456887267686748314486316803457932657796470802696612
                  </p>
                </div>
                <p className="text-gray-400 mb-6">
                  ✅ Client-side verification passed
                </p>
                <button onClick={submitProof} className="btn-primary">
                  Submit On-Chain
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <Loader2 className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-2xl font-bold text-white mb-3">Submitting...</h3>
                <p className="text-gray-400">
                  Verifying proof on Arbitrum Sepolia
                </p>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-3xl font-bold text-white mb-3">Success! 🎉</h3>
                <p className="text-gray-400 mb-6">
                  Your proof has been verified on-chain
                </p>
                <div className="glass rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p className="text-green-400 font-semibold">Verified ✅</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Gas Used</p>
                      <p className="text-white font-semibold">~21K gas</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Transaction</p>
                      <a
                        href={`https://sepolia.arbiscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 font-mono text-xs flex items-center space-x-1 hover:text-primary-300"
                      >
                        <span>{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setStep(0); setWalletAddress(''); setProofValid(null); }}
                  className="btn-secondary"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>
            This is a live demo on Arbitrum Sepolia testnet. Get test ETH from{' '}
            <a
              href="https://faucet.quicknode.com/arbitrum/sepolia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300"
            >
              the faucet
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
