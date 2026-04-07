import React, { useState, useEffect } from 'react';
import { History, ExternalLink, Clock, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import { ethers } from 'ethers';

const TransactionHistory = ({ walletAddress }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Note: For a production app, you'd use an environment variable for the API key.
  const ETHERSCAN_API_KEY = 'YourApiKeyToken'; // Placeholder
  const SEPOLIA_API_URL = 'https://api-sepolia.etherscan.io/api';

  useEffect(() => {
    if (walletAddress) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real scenario, use: 
      // const url = `${SEPOLIA_API_URL}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
      
      // For demonstration if no API key is provided, we simulate the fetch or use a public endpoint if available.
      // But we will implement the real logic as requested.
      const url = `${SEPOLIA_API_URL}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === '1') {
        setTransactions(data.result);
      } else {
        // If API key is missing or error, we'll show a message or use mock data for demo
        console.warn("Etherscan API Error:", data.message);
        if (data.message === "NOTOK") setError("Etherscan API limit reached or invalid key.");
      }
    } catch {
      setError("Failed to fetch transactions from Sepolia.");
    } finally {
      setLoading(false);
    }
  };

  const formatEth = (wei) => {
    return parseFloat(ethers.formatEther(wei)).toFixed(4);
  };

  const formatDate = (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  if (!walletAddress) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <Wallet size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3>Connect Wallet</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Please connect your MetaMask wallet to view your Sepolia transaction history.</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
          <History color="var(--accent-primary)" /> Sepolia Transaction History
        </h3>
        <button onClick={fetchTransactions} className="tab-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh History'}
        </button>
      </div>

      {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error} - Showing logic ready for API Key.</div>}

      <div className="txn-table-container">
        <table className="txn-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Hash</th>
              <th>Value (ETH)</th>
              <th>Time</th>
              <th>Recipient/Sender</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.hash}>
                  <td>
                    {tx.from.toLowerCase() === walletAddress.toLowerCase() ? 
                      <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ArrowUpRight size={14} /> Out</span> : 
                      <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ArrowDownLeft size={14} /> In</span>
                    }
                  </td>
                  <td>
                    <a href={`https://sepolia.etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="hash-link">
                      {tx.hash.substring(0, 10)}... <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                    </a>
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatEth(tx.value)}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> {formatDate(tx.timeStamp)}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {tx.from.toLowerCase() === walletAddress.toLowerCase() ? tx.to.substring(0, 16) + '...' : tx.from.substring(0, 16) + '...'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  {loading ? 'Fetching from Etherscan...' : 'No transactions found for this address on Sepolia.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
