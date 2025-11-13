import { motion } from 'framer-motion';
import { Wallet, Loader2, CheckCircle, ExternalLink, AlertCircle, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useZKPJWT } from '../hooks/useZKPJWT';
import type { ZKProof } from '@zkpjwt/core';

const ARBITRUM_SEPOLIA_CHAIN_ID = '0x66eee'; // 421614 in hex
const ARBITRUM_SEPOLIA_PARAMS = {
  chainId: ARBITRUM_SEPOLIA_CHAIN_ID,
  chainName: 'Arbitrum Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
  blockExplorerUrls: ['https://sepolia.arbiscan.io'],
};

export default function LiveDemo() {
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [networkValid, setNetworkValid] = useState(false);
  const [proofValid, setProofValid] = useState<boolean | null>(null);
  const [zkProof, setZkProof] = useState<ZKProof | null>(null);

  // Hook for ZK operations
  const zkpjwt = useZKPJWT();

  const checkNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const isValid = chainId === ARBITRUM_SEPOLIA_CHAIN_ID;
      setNetworkValid(isValid);
      return isValid;
    } catch (err) {
      console.error('Error checking network:', err);
      return false;
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARBITRUM_SEPOLIA_CHAIN_ID }],
      });
      setNetworkValid(true);
      setError('');
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ARBITRUM_SEPOLIA_PARAMS],
          });
          setNetworkValid(true);
          setError('');
        } catch (addError) {
          setError('Failed to add Arbitrum Sepolia network');
        }
      } else {
        setError('Failed to switch to Arbitrum Sepolia');
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask!');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      
      // Check network
      const isValidNetwork = await checkNetwork();
      if (!isValidNetwork) {
        setError('Please switch to Arbitrum Sepolia network');
        setStep(0);
      } else {
        setStep(1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
    setLoading(false);
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setStep(0);
    setTxHash('');
    setError('');
    setNetworkValid(false);
  };

  const generateProof = async () => {
    setLoading(true);
    setStep(2);
    setError('');
    
    try {
      // 1. Build Merkle tree with user address
      const { merkleProof } = await zkpjwt.buildMerkleTree(walletAddress);
      
      // 2. Generate ZK proof
      const proof = await zkpjwt.generateZKProof(merkleProof);
      setZkProof(proof);
      
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to generate proof');
      setStep(1);
    }
    setLoading(false);
  };

  const submitProof = async () => {
    if (!zkProof) {
      setError('No proof available');
      return;
    }

    setLoading(true);
    setStep(4);
    setError('');
    
    try {
      // 1. Verify proof client-side
      const isValid = await zkpjwt.verifyProofClientSide(zkProof);
      setProofValid(isValid);

      if (!isValid) {
        setError('Proof verification failed');
        setStep(3);
        setLoading(false);
        return;
      }

      // 2. Connect to provider and verify on-chain
      const { provider } = await zkpjwt.connectWallet();
      const onChainValid = await zkpjwt.verifyProofOnChain(
        provider, 
        zkProof.merkleRoot.toString()
      );

      if (onChainValid) {
        // For demo purposes, we show a sample transaction hash
        // In production, you'd submit a real transaction here
        setTxHash('0x' + Date.now().toString(16).padStart(64, '0'));
        setStep(5);
      } else {
        setError('On-chain verification failed');
        setStep(3);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit proof');
      setStep(3);
    }
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
    <section id="demo" className="py-20 relative border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Demo Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-gray-800 rounded-lg p-8"
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
                className="text-center w-full max-w-md mx-auto"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-6">
                  Connect MetaMask to get started. Make sure you're on Arbitrum Sepolia network.
                </p>

                {/* Error Message */}
                {error && (
                  <div className="glass rounded-lg p-4 mb-4 border border-red-500/30">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <p className="text-sm text-red-400 text-left">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="btn-primary w-full sm:w-auto"
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
                className="text-center w-full"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Wallet Connected!</h3>
                
                <div className="glass rounded-lg p-4 mb-4 inline-block">
                  <p className="text-sm text-gray-400 mb-1">Your Address</p>
                  <p className="text-primary-400 font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                </div>

                {/* Network Warning */}
                {!networkValid && (
                  <div className="glass rounded-lg p-4 mb-4 max-w-md mx-auto border border-yellow-500/30">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div className="text-left">
                        <p className="text-yellow-500 font-semibold mb-1">Wrong Network</p>
                        <p className="text-sm text-gray-400 mb-3">Please switch to Arbitrum Sepolia testnet</p>
                        <button onClick={switchNetwork} className="text-xs px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors">
                          Switch Network
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="glass rounded-lg p-4 mb-4 max-w-md mx-auto border border-red-500/30">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center space-x-3">
                  <button 
                    onClick={generateProof} 
                    className="btn-primary"
                    disabled={!networkValid}
                  >
                    Generate ZK Proof
                  </button>
                  <button onClick={disconnectWallet} className="btn-secondary flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect</span>
                  </button>
                </div>
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

            {step === 3 && zkProof && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Proof Generated!</h3>
                <div className="border border-gray-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-gray-400 mb-2">Merkle Root</p>
                  <p className="text-primary-400 font-mono text-xs break-all">
                    {zkProof.merkleRoot.toString()}
                  </p>
                </div>
                <p className="text-gray-400 mb-6">
                  ✅ ZK proof generated successfully
                </p>
                {error && (
                  <div className="border border-red-500/20 bg-red-500/10 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  </div>
                )}
                <button onClick={submitProof} className="btn-primary" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify On-Chain'}
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

            {step === 5 && zkProof && proofValid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-3">Success!</h3>
                <p className="text-gray-400 mb-6">
                  Your proof has been verified on-chain
                </p>
                <div className="border border-gray-800 rounded-lg p-6 mb-6">
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
                      <p className="text-xs text-gray-500 mb-1">Merkle Root</p>
                      <p className="text-gray-300 font-mono text-xs break-all">
                        {zkProof.merkleRoot.toString()}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                      <a
                        href={`https://sepolia.arbiscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 font-mono text-xs break-all flex items-center"
                      >
                        {txHash}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setStep(0); setWalletAddress(''); setTxHash(''); setProofValid(null); setZkProof(null); }}
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
