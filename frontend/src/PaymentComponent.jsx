import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Wallet, Send, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

export default function PaymentComponent({ initialRecipient = '0xd4609A34b61c604F797FB3af3dA42ecD485D2eC0' }) { // Updated per user request
  const [recipient, setRecipient] = useState(initialRecipient);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); 

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 8000);
  };

  const checkAndSwitchNetwork = async () => {
    if (!window.ethereum) return false;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== 11155111) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      }
      return true;
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: { name: 'Sepolia ETH', symbol: 'SEP', decimals: 18 },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  };

  const confirmPayment = async (e) => {
    e.preventDefault();
    
    // 1. Show error if MetaMask is not installed
    if (!window.ethereum) {
      showMessage('MetaMask is not installed. Please install it to continue.', 'error');
      return;
    }

    // 2. Validate that the wallet address is a valid Ethereum address
    if (!ethers.isAddress(recipient)) {
      showMessage('Please enter a valid checksummed Ethereum address.', 'error');
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showMessage('Please enter a valid amount greater than 0.', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      // 3. Connect to MetaMask if not already connected (using BrowserProvider)
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      
      // 4. Ensure app uses Sepolia network (chainId 11155111)
      const switched = await checkAndSwitchNetwork();
      if (!switched) {
        showMessage('Please switch to Sepolia Testnet in MetaMask!', 'error');
        setIsLoading(false);
        return;
      }
      
      // 5. Get signer and send transaction
      const signer = await provider.getSigner();
      
      showMessage('Waiting for you to confirm the payment in MetaMask...', 'success');
      
      const tx = await signer.sendTransaction({
        to: recipient,
        // Convert input ETH amount to Wei
        value: ethers.parseEther(amount.toString())
      });
      
      showMessage('Transaction broadcasted! Waiting for network confirmation...', 'success');
      
      await tx.wait();
      showMessage(`Payment of ${amount} ETH confirmed successfully!`, 'success');
      setAmount('');
      
    } catch (error) {
      console.error(error);
      // 6. Show error if user rejects transaction or other failures
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        showMessage('Transaction was rejected by the user.', 'error');
      } else if (error.message && (error.message.includes('insufficient funds') || error.message.includes('intrinsic gas'))) {
        showMessage('Insufficient funds to cover value + gas fees.', 'error');
      } else {
        showMessage('An unknown error occurred during payment. See console.', 'error');
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="glass-card" style={{ maxWidth: 500, margin: '2rem auto', animation: 'fadeIn 0.4s ease-out' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Wallet /> Direct Payment
      </h3>
      
      {message && (
        <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', backgroundColor: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: message.type === 'error' ? '#ef4444' : '#10b981', border: `1px solid ${message.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}` }}>
          {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span style={{ fontSize: '0.9rem', flex: 1, lineHeight: '1.4' }}>{message.text}</span>
        </div>
      )}

      <form onSubmit={confirmPayment}>
        <div className="form-group">
          <label>Recipient Wallet Address (From QR/Backend)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="0x..." 
            value={recipient} 
            onChange={(e) => setRecipient(e.target.value)}
            required
            style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
          />
        </div>
        
        <div className="form-group">
          <label>Amount to Send (ETH)</label>
          <input 
            type="number" 
            step="0.000001" 
            min="0"
            className="form-input" 
            placeholder="0.05" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isLoading}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.05rem', marginTop: '1.5rem' }}
        >
          {isLoading ? <RefreshCw className="spinner" size={20} /> : <Send size={20} />}
          {isLoading ? 'Processing...' : 'Confirm via MetaMask'}
        </button>
      </form>
    </div>
  );
}
