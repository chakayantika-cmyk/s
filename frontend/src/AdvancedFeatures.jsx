import React from 'react';
import GuidedTransactionBot from './GuidedTransactionBot';
import { Sparkles, Terminal, ShieldCheck, Cpu } from 'lucide-react';

const AdvancedFeatures = ({ walletAddress }) => {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Advanced <span style={{ color: 'var(--accent-primary)' }}>Blockchain Node</span>
        </h2>
        <p className="hero-subtitle" style={{ maxWidth: '800px', margin: '0 auto' }}>
          Explore localized Sepolia analytics and interact with our automated transaction engine. 
          All tools here utilize direct Sepolia RPC connections via MetaMask.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--accent-primary)', background: 'rgba(3, 125, 214, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
            <Cpu size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Engine Status</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Etherscan API:</span>
            <span style={{ color: '#34d399' }}>Connected</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>System Identity:</span>
            <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{walletAddress ? walletAddress.substring(0, 10) + '...' : 'Disconnected'}</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid #7c3aed', background: 'rgba(124, 58, 237, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#7c3aed', marginBottom: '1rem' }}>
            <ShieldCheck size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Security Layer</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Signer Protocol:</span>
            <span style={{ color: '#7c3aed' }}>ECDSA (P-256)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Network Verification:</span>
            <span style={{ color: 'var(--text-primary)' }}>Level 3 (Sepolia Optimized)</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <GuidedTransactionBot walletAddress={walletAddress} />
      </div>

      <div style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.6, fontSize: '0.8rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
        <p>ScholarChain Advanced Node Interface v1.0.4 - All calls routed through window.ethereum</p>
      </div>
    </div>
  );
};

export default AdvancedFeatures;
