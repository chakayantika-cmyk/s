import React from 'react';
import { HelpCircle, MessageSquare, Shield, Book, Star, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';
import HelpChatbot from './HelpChatbot';

const HelpSection = () => {
  const faqs = [
    { q: "How do I connect my MetaMask?", a: "Click the 'Connect Wallet' button in the top right corner. Ensure your MetaMask extension is installed and unlocked." },
    { q: "What is Sepolia Testnet?", a: "Sepolia is an Ethereum test network where you can test transactions for free using Sepolia ETH." },
    { q: "Is my donation secure?", a: "Yes, all transactions are recorded on the Ethereum blockchain, making them transparent and immutable." },
    { q: "How can I apply for a scholarship?", a: "Navigate to the 'Find Support' tab and fill out the application form with your education details." },
    { q: "Where can I get Sepolia ETH?", a: "You can use a Sepolia Faucet to get free testnet ETH for your transactions." }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Help & <span style={{ color: 'var(--accent-primary)' }}>Support Center</span>
        </h2>
        <p className="hero-subtitle" style={{ maxWidth: '700px', margin: '0 auto' }}>
          Need assistance? Explore our FAQs or chat with our automated support bot below.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        <section>
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Book color="var(--accent-primary)" /> Frequently Asked Questions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>{faq.q}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Mail color="var(--accent-primary)" /> Contact Human Support
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Mail size={18} color="var(--accent-secondary)" /> chak.ayantika@gmail.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Phone size={18} color="var(--accent-secondary)" /> 7044987173
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <MapPin size={18} color="var(--accent-secondary)" /> Decentralized Web 3.0
              </div>
            </div>
          </div>
        </section>

        <section>
          <div style={{ position: 'sticky', top: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(3, 125, 214, 0.05)', border: '1px solid var(--accent-primary)' }}>
              <MessageSquare size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
              <h3>Interactive Support Bot</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Our AI-powered chatbot is trained on platform documentation to help you instantly.
              </p>
              <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Star size={14} color="#fcd34d" /> Instant Wallet Help
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Star size={14} color="#fcd34d" /> Transaction Guidance
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={14} color="#fcd34d" /> Scholarship Status FAQ
                </p>
              </div>
              <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                &darr; Click below to start chatting &darr;
              </p>
              <button 
                onClick={() => window.dispatchEvent(new Event('toggle-support-chat'))}
                className="btn-primary" 
                style={{ marginTop: '1rem', width: 'auto', padding: '0.75rem 2rem', fontSize: '0.9rem', borderRadius: '999px' }}
              >
                Chat with Support
              </button>
            </div>
            
            <div className="glass-card" style={{ marginTop: '2rem', padding: '1.5rem', border: '1px dashed var(--border-color)' }}>
               <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>Network Status</h4>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem' }}>
                 <Shield size={16} /> All Systems Operational (Sepolia)
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpSection;
