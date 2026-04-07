import React, { useState, useEffect } from 'react';
import { MessageSquare, RefreshCw, Send, ShieldCheck, Wallet, ChevronRight, Activity, Terminal } from 'lucide-react';
import { ethers } from 'ethers';

const GuidedTransactionBot = ({ walletAddress }) => {
  const [step, setStep] = useState(0); // 0: Connect/Start, 1: Check Network, 2: Enter Amount, 3: Confirm, 4: Success
  const [amount, setAmount] = useState('0.001');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [logs, setLogs] = useState(["AI: Hello! Start by connecting your wallet to the Sepolia network."]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, `AI: ${msg}`]);
  };

  const checkNetwork = async () => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (Number(network.chainId) === 11155111) {
        addLog("Network verified! You are on Sepolia Testnet.");
        setStep(2);
      } else {
        addLog("You're on the wrong network. Switching to Sepolia...");
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
        });
        setStep(2);
      }
    } catch {
      addLog("Network check failed. Make sure MetaMask is open and connected to Sepolia.");
    }
  };

  const sendTransaction = async () => {
    if (!window.ethereum || !walletAddress) return;
    setLoading(true);
    addLog(`Initiating transaction for ${amount} ETH to dead address...`);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: "0x000000000000000000000000000000000000dEaD",
        value: ethers.parseEther(amount)
      });

      addLog(`Transaction broadcasted. Hash: ${tx.hash.substring(0, 10)}... Waiting for confirmation.`);
      setTxHash(tx.hash);
      const receipt = await tx.wait();
      
      addLog(`Success! Transaction confirmed in block ${receipt.blockNumber}.`);
      setStep(4);
    } catch (err) {
      console.error(err);
      addLog("Transaction failed or was rejected. Check your balance or terminal logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress && step === 0) {
      setStep(1);
      addLog("Wallet connected! Ready to verify network.");
    }
  }, [walletAddress, step]);

  return (
    <div className="glass-card" style={{ height: '500px', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-out', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <MessageSquare color="var(--accent-primary)" />
        <h3 style={{ margin: 0 }}>Transaction Guide Bot</h3>
        <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', marginLeft: 'auto' }}>
          <Activity size={10} style={{ marginRight: '0.3rem' }} /> Live on Sepolia
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ 
            background: 'var(--surface-secondary)', 
            padding: '0.8rem 1rem', 
            borderRadius: '12px 12px 12px 0', 
            fontSize: '0.9rem', 
            maxWidth: '90%', 
            alignSelf: 'flex-start',
            border: '1px solid var(--border-color)',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.1)'
          }}>
            {log}
          </div>
        ))}
        {loading && (
          <div className="spinner" style={{ alignSelf: 'flex-start', marginLeft: '1rem' }}>
            <RefreshCw size={16} />
          </div>
        )}
      </div>

      <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        {step === 0 && (
           <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>Connect your MetaMask wallet in the top header to begin.</p>
        )}
        {step === 1 && (
          <button onClick={checkNetwork} className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} /> Verify Network Stack
          </button>
        )}
        {step === 2 && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="number" 
              style={{ flex: 1, background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0 1rem', color: 'white' }} 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              step="0.001" 
              placeholder="Amount in ETH" 
            />
            <button onClick={() => { setStep(3); addLog(`Amount entered: ${amount} ETH. Ready to confirm?`); }} className="btn-primary" style={{ width: 'auto', padding: '0 1.5rem' }}>Next</button>
          </div>
        )}
        {step === 3 && (
          <button onClick={sendTransaction} className="btn-primary" disabled={loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            {loading ? <RefreshCw className="spinner" size={18} /> : <Send size={18} />}
            Confirm in MetaMask
          </button>
        )}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#34d399', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Transaction Successful!</p>
            <button onClick={() => setStep(1)} className="tab-btn" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Start New Transaction</button>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '1rem', background: '#1c1c1c', padding: '0.5rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.7rem', color: '#10b981' }}>
        <Terminal size={12} style={{ marginRight: '0.4rem' }} /> terminal &gt; Status: {step === 4 ? 'COMPLETE' : step === 0 ? 'WAITING' : 'ACTIVE'} {txHash && `| Hash: ${txHash.substring(0,8)}...`}
      </div>
    </div>
  );
};

export default GuidedTransactionBot;
