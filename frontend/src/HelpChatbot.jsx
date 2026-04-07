import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, MessageCircle, Send, X, Shield, Activity, HelpCircle as HelpIcon, FileText, Wallet, User, Bot, Sparkles, RefreshCw, Copy } from 'lucide-react';

const HelpChatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your ScholarChain AI assistant. How can I help you today with decentralized education funding?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState("");

  const resetChat = () => {
    setMessages([{ text: "Hello! I'm your ScholarChain AI assistant. Everything is reset. How can I help you now?", sender: 'bot' }]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could show a small "Copied!" toast here
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('toggle-support-chat', handleOpen);
    if (isOpen) scrollToBottom();
    return () => window.removeEventListener('toggle-support-chat', handleOpen);
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let response = "I'm here to help with ScholarChain! You can ask about linking your wallet, applying for scholarships, or how blockchain ensures transparency. What specific part can I explain for you?";
      
      const lowerInput = userMessage.toLowerCase();
      
      if (lowerInput.includes('step') || lowerInput.includes('instructions') || lowerInput.includes('how to') || lowerInput.includes('guide')) {
        response = "Here are the step-by-step instructions to get started: \n\n1. Connect your MetaMask wallet (ensure you're on the Sepolia Testnet). \n2. Go to the 'Find Support' tab if you're a student, or 'Inspire a Student' if you're a donor. \n3. For students: Create an application. For donors: Select a student and click 'Secure Funding'. \n4. Confirm the transaction in your MetaMask popup. \n5. Once confirmed, check the 'Transparency Record' to see the public receipt on the blockchain!";
      } else if (lowerInput.includes('sepolia')) {
        response = "Sepolia is an Ethereum test network. It works exactly like the real Ethereum network but uses 'fake' ETH, which you can get for free from a 'faucet'. This allows you to test ScholarChain without any real cost. Would you like to know where to find a faucet?";
      } else if (lowerInput.includes('metamask') || lowerInput.includes('wallet') || lowerInput.includes('link')) {
        response = "MetaMask is a browser extension that acts as your digital identity on ScholarChain. To link it, click the 'Link Wallet' button in the header. If you don't have MetaMask installed, you can download it at metamask.io.";
      } else if (lowerInput.includes('fund') || lowerInput.includes('donor') || lowerInput.includes('donate')) {
        response = "Donors can directly fund students via the 'Inspire a Student' tab. Every transaction goes directly from your wallet to the student's wallet—no middlemen involved! You can also use the 'Fuel Our Mission' section to support the platform itself.";
      } else if (lowerInput.includes('apply') || lowerInput.includes('scholarship') || lowerInput.includes('student')) {
        response = "Students can apply for support in the 'Find Support' tab. You'll need to provide details about your academic goals. Once submitted, your request becomes visible to our global community of donors.";
      } else if (lowerInput.includes('transparency') || lowerInput.includes('record') || lowerInput.includes('receipt')) {
        response = "Every transaction on ScholarChain is recorded on the blockchain. The 'Transparency Record' tab shows these public receipts. You can click on any 'Public Receipt' ID to view the live data on Etherscan!";
      } else if (lowerInput.includes('profile') || lowerInput.includes('picture') || lowerInput.includes('photo')) {
        response = "You can set your profile picture during registration. Once logged in, your picture appears in the top-right header, alongside your wallet address, so you always know which identity is active.";
      } else if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey')) {
        response = "Hello! I'm your ScholarChain AI. I'm ready to help you navigate our decentralized scholarship platform. What would you like to explore first?";
      } else if (lowerInput.includes('who') || lowerInput.includes('what is this') || lowerInput.includes('about')) {
        response = "ScholarChain is a next-generation platform for education funding. We use blockchain to eliminate administrative overhead, ensuring 100% of donor funds reach students. It's direct, transparent, and secure.";
      } else if (lowerInput.includes('error') || lowerInput.includes('fail') || lowerInput.includes('not working')) {
        response = "I'm sorry you're having trouble. Most issues are related to MetaMask not being on the Sepolia network or having insufficient test ETH. Check your wallet status in the header!";
      }
      
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="chatbot-toggle"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            padding: '1.25rem',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(3, 125, 214, 0.4)',
            zIndex: 10000,
            animation: 'fadeIn 0.5s ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '380px',
          height: '550px',
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10000,
          animation: 'fadeIn 0.4s ease-out',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '1.25rem',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #1e40af 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'white'
          }}>
            <Sparkles size={20} />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>ScholarChain AI</h4>
              <span style={{ fontSize: '0.7rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }}></div>
                Always active for you
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={resetChat} title="Reset Chat" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <RefreshCw size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                title="Exit Chat"
                style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  border: 'none', 
                  color: 'white', 
                  cursor: 'pointer', 
                  padding: '0.5rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                 <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            background: 'var(--surface-color)'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '0.75rem',
                flexDirection: msg.sender === 'bot' ? 'row' : 'row-reverse',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: msg.sender === 'bot' ? 'var(--accent-primary)' : 'var(--surface-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid var(--border-color)'
                }}>
                  {msg.sender === 'bot' ? <Bot size={18} color="white" /> : <User size={18} color="var(--text-secondary)" />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxWidth: '80%' }}>
                  <div style={{
                    padding: '0.85rem 1.1rem',
                    borderRadius: msg.sender === 'bot' ? '0 16px 16px 16px' : '16px 0 16px 16px',
                    background: msg.sender === 'bot' ? 'var(--surface-secondary)' : 'var(--accent-primary)',
                    color: msg.sender === 'bot' ? 'var(--text-primary)' : 'white',
                    fontSize: '0.92rem',
                    lineHeight: '1.5',
                    border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    position: 'relative'
                  }}>
                    {msg.text}
                  </div>
                  {msg.sender === 'bot' && (
                    <button 
                      onClick={() => copyToClipboard(msg.text)}
                      style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.2rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem', opacity: 0.6 }}
                      title="Copy to clipboard"
                    >
                      <Copy size={12} /> Copy
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={18} color="white" />
                    </div>
                    <div style={{ padding: '0.8rem 1rem', background: 'var(--surface-secondary)', borderRadius: '0 16px 16px 16px', border: '1px solid var(--border-color)' }}>
                        <div className="typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form */}
          <form 
            onSubmit={handleSend}
            style={{
              padding: '1.25rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '0.75rem',
              background: 'var(--surface-color)'
            }}
          >
            <input 
              type="text" 
              placeholder="How can I help you?"
              style={{
                flex: 1,
                background: 'var(--surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0.8rem 1.2rem',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              style={{
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '0.8rem',
                cursor: 'pointer',
                opacity: inputValue.trim() && !isTyping ? 1 : 0.5,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default HelpChatbot;
