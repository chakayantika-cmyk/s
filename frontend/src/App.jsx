import React, { useState, useEffect } from 'react';
import { Wallet, LogIn, UserPlus, FileText, Send, CheckCircle, HeartHandshake, Users, Activity, ShieldCheck, Clock, Check, AlertCircle, RefreshCw, GraduationCap, Link as LinkIcon, Lock, Sun, Moon, ExternalLink, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { ethers } from 'ethers';
import Web3 from 'web3';
import PaymentComponent from './PaymentComponent';
import AdvancedFeatures from './AdvancedFeatures';
import HelpChatbot from './HelpChatbot';
import HelpSection from './HelpSection';

const API_URL = 'http://localhost:5000/api';

const MOCK_TRANSACTIONS = [
  {
    hash: '0x80bb7fdd5b5515902563d7921a3f9ab15fe0ed7c30bb7bde975db51be841107a',
    method: 'Fund',
    block: '4839211',
    age: '2 mins ago',
    to: '0xf1054b56b2bcfc33318e5dba44f3b228ddcf4b78',
    value: '0.5 ETH',
    fee: '0.00014'
  },
  {
    hash: '0xac2f1b6b0165c1ffcc6f0338303cf177b6d76b0e6d74078bd5d192d26c87fd68',
    method: 'SubmitApp',
    block: '4839180',
    age: '1 hr ago',
    to: '0xe8758d845678d21a4b2237e885615d2c209bde05',
    value: '0 ETH',
    fee: '0.00008'
  },
  {
    hash: '0x709d9cad77c718a332ec0b4fec567a7f89d50a1d0c248ddcfd6516bb3b43fda2',
    method: 'Approve',
    block: '4835012',
    age: '3 hrs ago',
    to: '0xfabd7780f3b739d26762816cae72e1a095cc7c2a',
    value: '0 ETH',
    fee: '0.00005'
  },
  {
    hash: '0x68b2c1fe7e0faf6009545cc3b9b3726be2e9435ffcc4c103a226028c0fd2ff15',
    method: 'Fund',
    block: '4832100',
    age: '5 hrs ago',
    to: '0x4231396df13accd9c1ab682d69adefcf9aa4463e',
    value: '1.2 ETH',
    fee: '0.00015'
  },
  {
    hash: '0xa57adf27e10170611ff721d169b78b42664b191f808d51abecca5718f44ac51f',
    method: 'DonateFiat',
    block: '4831999',
    age: '8 hrs ago',
    to: '0xad3aa0687ba13e145256e574f7b5fa29544e84a6',
    value: '0.05 ETH',
    fee: '0.00011'
  },
  {
    hash: '0x5cf67a8d203308939b5edca7eb446e2c16a1219547845f52ff34ec504d48ee33',
    method: 'SubmitApp',
    block: '4831000',
    age: '12 hrs ago',
    to: '0xff00000000000000000000000000000000084532',
    value: '0 ETH',
    fee: '0.00007'
  },
  {
    hash: '0xcf0ff3466e3a5b3efcd9c15611ff7ae4c4dec78752da8a99352c7683802b3e49',
    method: 'Fund',
    block: '4830101',
    age: '1 day ago',
    to: '0x00d4a6e3f0112cce409d3a80c0e7e96900d573d8',
    value: '2.5 ETH',
    fee: '0.00030'
  },
  {
    hash: '0x7c495b590a210a7bc5307c53dd6762bdc1c6e9325bcf45896a7fdc7f33171a38',
    method: 'Approve',
    block: '4829999',
    age: '2 days ago',
    to: '0x10c15c29fb208047df6247514c0416c217e6f6e2',
    value: '0 ETH',
    fee: '0.00003'
  },
  {
    hash: '0x3d624654cb87023258042eebf5ea4d4cbe7c3ed97b7d7da4b9f7b9f55bdbcfa0',
    method: 'Fund',
    block: '4825000',
    age: '3 days ago',
    to: '0xea30c4b8b44078bbf8a6ef5b9f1ec1626c7848d9',
    value: '0.1 ETH',
    fee: '0.00005'
  },
  {
    hash: '0x1630b04fdf3d280900673267cef11277418628298c0169bce15485e6d0103c61',
    method: 'DonateFiat',
    block: '4821000',
    age: '5 days ago',
    to: '0x0578e5ea652c62db20f4475f685a4b587314a30f',
    value: '0.005 ETH',
    fee: '0.00002'
  },
  {
    hash: '0xce91811e56b823e4259bdf1df1e626e2a22530c1737edecab2aebb301540ca38',
    method: 'Fund',
    block: '4819542',
    age: '6 days ago',
    to: '0xb20b8f1bc41f238af107dded17d7b32c66d15aef',
    value: '0.8 ETH',
    fee: '0.00010'
  },
  {
    hash: '0x32168a1f81bd69fc25a5857e3f2fb19cb8d9cd26eb2a32c25ae90eefa6a8ae4a',
    method: 'Approve',
    block: '4817200',
    age: '1 week ago',
    to: '0xa0d575db7419e7a750942eacea9a9307ab4f8ce0',
    value: '0 ETH',
    fee: '0.00004'
  },
  {
    hash: '0xc1f7fa2b6e1ea2ef4cbda72834b6e5113d528b1dbdfdb5975003517c2f664a7c',
    method: 'SubmitApp',
    block: '4815102',
    age: '1 week ago',
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    value: '0 ETH',
    fee: '0.00006'
  },
  {
    hash: '0xe27a8f15beed6abc25a5857e3f2fb19cb8d9cd26eb2a32c25ae90eefa6a8ae4b',
    method: 'DonateFiat',
    block: '4812000',
    age: '2 weeks ago',
    to: '0x22f1c8a14da2eefc2a2da8cbfe1df6bdec231d57',
    value: '0.01 ETH',
    fee: '0.00003'
  },
  {
    hash: '0xb20b8f1bc41f238af107dded17d7b32c66d15aefb20b8f1bc41f238af107dded',
    method: 'Approve',
    block: '4810000',
    age: '3 weeks ago',
    to: '0x8b20b8f1bc41f238af107dded17d7b32c66d15aef',
    value: '0 ETH',
    fee: '0.00002'
  },
  {
    hash: '0x000000000000000000000000000000000000000000000000084532ff00000000',
    method: 'Fund',
    block: '4805000',
    age: '1 month ago',
    to: '0x1234567890123456789012345678901234567890',
    value: '5.0 ETH',
    fee: '0.00045'
  },
  {
    hash: '0xabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabc',
    method: 'SubmitApp',
    block: '4802000',
    age: '1 month ago',
    to: '0x0987654321098765432109876543210987654321',
    value: '0 ETH',
    fee: '0.00009'
  }
];

const ETH_PRICE_INR = 280000;

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [walletAddress, setWalletAddress] = useState('');
  
  const [activeTab, setActiveTab] = useState('login'); // login, register
  const [dashboardTab, setDashboardTab] = useState('apply'); // apply, fund, ..., about
  const [formData, setFormData] = useState({ 
    uid: '', 
    password: '', 
    role: 'student', 
    name: '', 
    amount: '', 
    reason: '', 
    recipient_wallet: '', 
    profile_pic: '',
    parent_income: '',
    marks_10th: '',
    marks_12th: '',
    income_cert: ''
  });
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState('0');
  const [networkName, setNetworkName] = useState('Unknown Network');

  const [paymentModal, setPaymentModal] = useState({ open: false, type: '', amount: 0, ethAmount: 0, appId: null });
  const [selectedFiat, setSelectedFiat] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [formStep, setFormStep] = useState(1);
  const [fileNames, setFileNames] = useState({ marks_10th: '', marks_12th: '', income_cert: '' });

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFundClick = (appId, ethAmount) => {
    setPaymentModal({ open: true, type: 'fund', ethAmount: ethAmount, appId: appId });
  };

  const confirmPayment = async () => {
    if (!walletAddress) {
      showNotification('Please connect MetaMask first!', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      let weiAmount = '0x0';
      if (paymentModal.ethAmount) {
         // calculate raw wei hex using BigInt to perfectly avoid overflow limits
         weiAmount = '0x' + BigInt(Math.floor(parseFloat(paymentModal.ethAmount) * 1e18)).toString(16);
      }

      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: '0x000000000000000000000000000000000000dEaD', 
          value: weiAmount,
        }],
      });
      
      showNotification('Payment successfully confirmed on-chain!', 'success');
      
      if (paymentModal.type === 'fund' && paymentModal.appId) {
        await fetch(`${API_URL}/fund`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ app_id: paymentModal.appId, amount_eth: paymentModal.ethAmount }),
        });
        fetchApplications(); 
      }
      
      setPaymentModal({ open: false, type: '', amount: 0, ethAmount: 0, appId: null });
      setSelectedFiat(null);
    } catch (err) {
      console.error(err);
      showNotification('Transaction failed or rejected by user.', 'error');
    }
    setIsLoading(false);
  };

  const replayTransaction = async (tx) => {
    if (!walletAddress) {
      showNotification('Please connect MetaMask first to replay transactions!', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      let weiAmount = '0x0';
      const parsedVal = parseFloat(tx.value);
      if (!isNaN(parsedVal) && parsedVal > 0) {
         weiAmount = '0x' + BigInt(Math.floor(parsedVal * 1e18)).toString(16);
      }

      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: tx.to, 
          value: weiAmount,
        }],
      });
      showNotification(`Successfully replayed ${tx.method} on-chain!`, 'success');
    } catch (err) {
      console.error(err);
      showNotification('Transaction rejected in MetaMask.', 'error');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (token && user) {
      fetchApplications();
      // Sync user data to formData if not already set
      setFormData(prev => ({
        ...prev,
        uid: user.uid, // Always keep UID in sync for submission
        name: prev.name || user.name || ''
      }));
    }
  }, [token, user]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showNotification = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const generateAvatar = (seed) => {
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1e1e1e`;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      const dataKey = name.replace('_file', '');
      setFileNames(prev => ({ ...prev, [dataKey]: file.name }));
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [dataKey]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const fetchWalletDetails = async (address) => {
    try {
      if (window.ethereum) {
        // Fetch balance using ethers.js
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balanceWei = await provider.getBalance(address);
        const balanceEth = ethers.formatEther(balanceWei);
        setWalletBalance(parseFloat(balanceEth).toFixed(4));

        // Fetch network using ethers.js provider
        const network = await provider.getNetwork();
        console.log(network);
        
        const chainIdNum = Number(network.chainId);
        let netName = network.name && network.name !== 'unknown' 
          ? network.name.charAt(0).toUpperCase() + network.name.slice(1) 
          : 'Unknown Chain';
          
        if (chainIdNum === 1) netName = 'Ethereum Mainnet';
        else if (chainIdNum === 11155111) netName = 'Sepolia Testnet';
        else if (netName === 'Unknown Chain') netName = 'Chain ID ' + chainIdNum;
        
        setNetworkName(netName);
      }
    } catch(err) {
       console.error("Error fetching wallet details", err);
    }
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
        } catch (addError) {
          console.error("User rejected adding Sepolia:", addError);
          return false;
        }
      }
      console.error("User rejected switching to Sepolia:", error);
      return false;
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const switched = await checkAndSwitchNetwork();
        if (!switched) {
          showNotification('Please switch to Sepolia Testnet in MetaMask!', 'error');
          return;
        }
        
        // Request connection using ethers.js provider wrapper
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        await fetchWalletDetails(accounts[0]);
        setIsSidebarOpen(true);
        showNotification('Wallet connected on Sepolia successfully!');
      } catch {
        showNotification('Failed to connect wallet.', 'error');
      }
    } else {
      showNotification('Please install MetaMask!', 'error');
    }
  };

  const sendTestTransaction = async () => {
    if (!window.ethereum) {
      showNotification('Please install MetaMask!', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      const switched = await checkAndSwitchNetwork();
      if (!switched) {
        showNotification('Please switch to Sepolia Testnet manually to send.', 'error');
        setIsLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: "0x000000000000000000000000000000000000dEaD",
        value: ethers.parseEther("0.001")
      });
      
      showNotification('Transaction sent! Waiting for confirmation...', 'success');
      
      await tx.wait();
      showNotification('Transaction confirmed successfully!', 'success');
      
      await fetchWalletDetails(walletAddress);
    } catch (error) {
      console.error("Transaction Error:", error);
      
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
         showNotification('Transaction rejected by user.', 'error');
      } else if (error.message && (error.message.includes('insufficient funds') || error.message.includes('intrinsic gas'))) {
         showNotification('Insufficient funds for gas.', 'error');
      } else if (error.message && error.message.includes('network')) {
         showNotification('Network error, please check connection.', 'error');
      } else {
         showNotification('Failed to send transaction.', 'error');
      }
    }
    setIsLoading(false);
  };

  const handleAuth = async (e, type) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: formData.uid,
          password: formData.password,
          role: formData.role,
          name: formData.name,
          profile_pic: formData.profile_pic
        })
      });
      const data = await res.json();
      if (res.ok) {
        if (type === 'login') {
          setToken(data.token);
          setUser(data.user);
          setFormData(prev => ({ 
            ...prev, 
            name: data.user.name || '', 
            role: data.user.role || 'student',
            uid: data.user.uid
          }));
          // Set intelligent default tab based on role
          if (data.user.role === 'donor') {
            setDashboardTab('fund');
          } else {
            setDashboardTab('apply');
          }
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          showNotification(`Welcome back, ${data.user.name || data.user.uid}!`);
        } else {
          showNotification('Registration successful! Please login.');
          setActiveTab('login');
        }
      } else {
        showNotification(data.error || 'Authentication failed', 'error');
      }
    } catch {
      showNotification('Server error', 'error');
    }
    setIsLoading(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setWalletAddress('');
    showNotification('Logged out successfully');
  };


  const submitApplication = async (e) => {
    e.preventDefault();
    if (!walletAddress) {
      showNotification('Please connect wallet first!', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/apply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: formData.name,
          amount: formData.amount,
          reason: formData.reason,
          recipient_wallet: formData.recipient_wallet,
          parent_income: formData.parent_income,
          marks_10th: formData.marks_10th,
          marks_12th: formData.marks_12th,
          income_cert: formData.income_cert
        })
      });
      if (res.ok) {
        showNotification('Application submitted successfully!');
        setFormData(prev => ({ ...prev, amount: '', reason: '', recipient_wallet: '', parent_income: '', marks_10th: '', marks_12th: '', income_cert: '' }));
        setFormStep(1); // Reset step
        setFileNames({ marks_10th: '', marks_12th: '', income_cert: '' }); // Reset filenames
        fetchApplications();
      } else {
        const errData = await res.json();
        showNotification(errData.error || 'Failed to submit application', 'error');
      }
    } catch (err) {
      console.error('Submission technical error:', err);
      showNotification(`Error: ${err.message || 'Check your internet connection'}`, 'error');
    }
    setIsLoading(false);
  };

  const fundApplication = async (appId, amount, recipient) => {
    if (!window.ethereum) {
      showNotification('Please install MetaMask to fund!', 'error');
      return;
    }

    if (!recipient || !ethers.isAddress(recipient)) {
      showNotification('Invalid recipient wallet address for this application.', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      const switched = await checkAndSwitchNetwork();
      if (!switched) {
        showNotification('Please switch to Sepolia Testnet manually to fund.', 'error');
        setIsLoading(false);
        return;
      }

      // 1. Send Transaction via MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      showNotification('Please confirm the payment in MetaMask...', 'success');
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount.toString())
      });
      
      showNotification('Transaction broadcasted. Waiting for confirmation...', 'success');
      await tx.wait(); // Wait for mining

      // 2. Mark as funded in backend
      const res = await fetch(`${API_URL}/fund`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ app_id: appId, amount_eth: amount })
      });
      
      if (res.ok) {
        showNotification(`Scholarship successfully secured for application #${appId}!`, 'success');
        fetchApplications();
      } else {
        showNotification('Payment succeeded, but backend sync failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
         showNotification('Transaction was rejected by you.', 'error');
      } else if (err.message && (err.message.includes('insufficient funds'))) {
         showNotification('Insufficient funds for gas + value.', 'error');
      } else {
         showNotification('Funding transaction failed.', 'error');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className={`app-wrapper ${!token ? 'login-bg' : 'main-bg'}`}>
      <div className="app-container">
      {showSplash && (
        <div className="splash-screen" onClick={() => {
          setShowSplash(false);
        }}>
          <div className="splash-logo-container">
            <img src="/logo.png" alt="ScholarChain Logo" className="splash-logo" />
          </div>
          <div className="splash-title-container">
            <span className="splash-title-p1">Scholar</span>
            <span className="splash-title-p2">Chain</span>
          </div>
          <p className="splash-tagline">Decentralized. Trusted. Impactful.</p>
          <div className="splash-hint">Click to Launch</div>
        </div>
      )}

      {/* Floating Help Chatbot (always accessible) */}
      <HelpChatbot />

      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            {toast.msg}
          </div>
        </div>
      )}

      <header>
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.png" alt="ScholarChain Logo" style={{ width: 42, height: 42, objectFit: 'contain' }} />
          <h1>ScholarChain</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button onClick={toggleTheme} className="wallet-btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', display: 'inline-flex', padding: '0.5rem', color: 'var(--text-primary)' }} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {token && user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-secondary)', padding: '0.4rem 1rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
              <img src={user.profile_pic || generateAvatar(user.uid)} alt="avatar" style={{ width: 30, height: 30, borderRadius: '50%', background: 'transparent', objectFit: 'cover' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name || user.uid}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{user.role}</span>
              </div>
            </div>
          )}
          {token && (
            <button onClick={connectWallet} className={`wallet-btn ${walletAddress ? 'wallet-connected' : ''}`} style={{ display: 'inline-flex' }}>
              <Wallet size={18} />
              {walletAddress ? `${walletAddress.substring(0,6)}...${walletAddress.substring(38)}` : 'Connect Wallet'}
            </button>
          )}
          {token && (
            <button onClick={logout} className="wallet-btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', display: 'inline-flex', color: 'var(--text-primary)' }}>
              Logout
            </button>
          )}
        </div>
      </header>

      {!token ? (
        <div className="hero-section">
          <h2 className="hero-title" style={{ marginTop: '3rem' }}>Decentralized<br/><span style={{ color: 'var(--accent-primary)' }}>Education Funding</span></h2>
          <p className="hero-subtitle">Secure, transparent, and placement-ready. Connect your wallet, apply for scholarships, or fund the future securely on the blockchain.</p>
          
          <div style={{ maxWidth: 400, margin: '0 auto' }} className="glass-card">
            <div className="tabs">
              <button className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Login</button>
              <button className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>Register</button>
            </div>

            <form onSubmit={(e) => handleAuth(e, activeTab)}>
              <div className="form-group">
                <label>University ID (UID)</label>
                <input required type="text" name="uid" className="form-input" value={formData.uid} onChange={handleInputChange} placeholder="e.g. 21BCS123" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input required type="password" name="password" className="form-input" value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
              </div>
              
              {activeTab === 'register' && (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input required type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select name="role" className="form-input" value={formData.role} onChange={handleInputChange}>
                      <option value="student">Student</option>
                      <option value="donor">Donor</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Profile Picture</label>
                    <input type="file" name="profile_pic_file" accept="image/*" className="form-input" onChange={handleInputChange} style={{ padding: '0.4rem' }} />
                  </div>
                </>
              )}
              
              <button type="submit" className="btn-primary" disabled={isLoading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                {isLoading ? <RefreshCw className="spinner" size={18} /> : (activeTab === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />)}
                {isLoading ? 'Processing...' : activeTab === 'login' ? 'Access Portal' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          {/* Dashboard Stats */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon"><Activity size={24} /></div>
              <div className="stat-info">
                <h4>Dreams Awaiting Support</h4>
                <p>{applications.filter(a => !a.funded).length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><HeartHandshake size={24} /></div>
              <div className="stat-info">
                <h4>Futures Brightened</h4>
                <p>{applications.filter(a => a.funded).length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Users size={24} /></div>
              <div className="stat-info">
                <h4>Collective Generosity (ETH)</h4>
                <p>{applications.filter(a => a.funded).reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="tabs">
            <button className={`tab-btn ${dashboardTab === 'apply' ? 'active' : ''}`} onClick={() => setDashboardTab('apply')}>Find Support</button>
            <button className={`tab-btn ${dashboardTab === 'fund' ? 'active' : ''}`} onClick={() => setDashboardTab('fund')}>Inspire a Student</button>
            <button className={`tab-btn ${dashboardTab === 'contributions' ? 'active' : ''}`} onClick={() => setDashboardTab('contributions')}>My Impact</button>
            <button className={`tab-btn ${dashboardTab === 'transactions' ? 'active' : ''}`} onClick={() => setDashboardTab('transactions')}>Transparency Record</button>
            <button className={`tab-btn ${dashboardTab === 'donate' ? 'active' : ''}`} onClick={() => setDashboardTab('donate')}>Fuel Our Mission</button>
            <button className={`tab-btn ${dashboardTab === 'direct' ? 'active' : ''}`} onClick={() => setDashboardTab('direct')}>Direct Payment</button>
            <button className={`tab-btn ${dashboardTab === 'advanced' ? 'active' : ''}`} onClick={() => setDashboardTab('advanced')}>Advanced Features</button>
            <button className={`tab-btn ${dashboardTab === 'help' ? 'active' : ''}`} onClick={() => setDashboardTab('help')}>Help & Support</button>
            <button className={`tab-btn ${dashboardTab === 'about' ? 'active' : ''}`} onClick={() => setDashboardTab('about')}>About Us</button>
          </div>

          {dashboardTab === 'apply' && (
            <div style={{ animation: 'fadeIn 0.4s ease-out', maxWidth: 900, margin: '0 auto' }}>
              {/* Application Criteria Floating Card */}
              <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid var(--accent-secondary)', background: 'rgba(246, 133, 27, 0.05)' }}>
                 <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={20} /> Application Criteria
                 </h4>
                 <div className="txn-table-container" style={{ background: 'transparent', border: 'none', boxShadow: 'none', marginTop: 0 }}>
                    <table className="txn-table" style={{ fontSize: '0.85rem' }}>
                       <thead>
                          <tr>
                             <th>Eligibility Category</th>
                             <th>Required Qualification</th>
                          </tr>
                       </thead>
                       <tbody>
                          <tr>
                             <td style={{ fontWeight: 600 }}>Family Income</td>
                             <td>Annual income must be less than ₹2.5 Lakhs ($20,000)</td>
                          </tr>
                          <tr>
                             <td style={{ fontWeight: 600 }}>Academic Standing</td>
                             <td>Minimum 60% or equivalent grade in 10th and 12th standard</td>
                          </tr>
                          <tr>
                             <td style={{ fontWeight: 600 }}>Documentation</td>
                             <td>Valid income certificate and official marksheets required</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText /> Scholarship Application Form
                </h3>
                <form onSubmit={submitApplication}>
                  {formStep === 1 && (
                    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                          <label>Full Name</label>
                          <input required type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} placeholder="Your Full Name" />
                        </div>
                        <div className="form-group">
                          <label>Parent's Annual Income (INR)</label>
                          <input required type="number" name="parent_income" className="form-input" value={formData.parent_income} onChange={handleInputChange} placeholder="e.g. 180000" />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                          <label>Requested Support (ETH)</label>
                          <input required type="number" step="0.01" name="amount" className="form-input" value={formData.amount} onChange={handleInputChange} placeholder="e.g. 0.2" />
                        </div>
                        <div className="form-group">
                          <label>Recipient Wallet Address</label>
                          <input required type="text" name="recipient_wallet" className="form-input" value={formData.recipient_wallet} onChange={handleInputChange} placeholder="0x..." style={{ fontFamily: 'monospace' }} />
                        </div>
                      </div>
                      
                      <button type="button" onClick={() => setFormStep(2)} className="btn-primary" style={{ marginTop: '1rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        Next Step: Attach Documents <ChevronRight size={18} />
                      </button>
                    </div>
                  )}

                  {formStep === 2 && (
                    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                      <div className="glass-card" style={{ background: 'var(--surface-secondary)', border: '1px dashed var(--border-color)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                              10th Marksheet {fileNames.marks_10th && <span style={{ color: '#34d399', fontSize: '0.75rem' }}>✓ {fileNames.marks_10th}</span>}
                            </label>
                            <input required type="file" name="marks_10th_file" className="form-input" accept="image/*,application/pdf" style={{ fontSize: '0.8rem' }} onChange={handleInputChange} />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                              12th Marksheet {fileNames.marks_12th && <span style={{ color: '#34d399', fontSize: '0.75rem' }}>✓ {fileNames.marks_12th}</span>}
                            </label>
                            <input required type="file" name="marks_12th_file" className="form-input" accept="image/*,application/pdf" style={{ fontSize: '0.8rem' }} onChange={handleInputChange} />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                              Income Certificate {fileNames.income_cert && <span style={{ color: '#34d399', fontSize: '0.75rem' }}>✓ {fileNames.income_cert}</span>}
                            </label>
                            <input required type="file" name="income_cert_file" className="form-input" accept="image/*,application/pdf" style={{ fontSize: '0.8rem' }} onChange={handleInputChange} />
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={() => setFormStep(1)} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                          <ChevronLeft size={18} /> Back
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            if (!formData.marks_10th || !formData.marks_12th || !formData.income_cert) {
                              showNotification('Please upload all 3 documents to continue', 'error');
                              return;
                            }
                            setFormStep(3);
                          }} 
                          className="btn-primary" 
                          style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                        >
                          Next Step: Tell Your Story <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {formStep === 3 && (
                    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                      <div className="form-group">
                        <label>Why do you need this scholarship?</label>
                        <textarea required name="reason" className="form-input" value={formData.reason} onChange={handleInputChange} placeholder="Share your academic mission..." rows="6"></textarea>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={() => setFormStep(2)} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                          <ChevronLeft size={18} /> Back
                        </button>
                        
                        {!walletAddress ? (
                          <button type="button" onClick={connectWallet} className="btn-primary" style={{ flex: 1, background: 'var(--accent-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                            <Wallet size={18} /> Connect Wallet to Finish
                          </button>
                        ) : (
                          <button type="submit" className="btn-primary" disabled={isLoading} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                             {isLoading ? <RefreshCw className="spinner" size={18} /> : <Send size={18} />}
                             {isLoading ? 'Encrypting & Submitting...' : 'Confirm and Submit Application'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {dashboardTab === 'fund' && (
            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', textAlign: 'center' }}>Stories Awaiting Your Support</h3>
              <div className="dashboard-grid">
                {applications.length === 0 ? (
                  <div className="empty-state">
                    <HeartHandshake size={64} className="empty-icon" />
                    <h3>All quiet for now!</h3>
                    <p>Every student here has received the support they need. Check back soon to change another life.</p>
                  </div>
                ) : (
                  applications.map((app) => (
                    <div key={app.id} className="glass-card application-card">
                      <div className="user-profile-header">
                        <img src={app.student_real_pic || generateAvatar(app.name || app.uid)} alt="Student Avatar" className="user-avatar" />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h4 className="user-name">{app.name || app.uid}</h4>
                            {app.marks_10th && app.marks_12th && app.income_cert && (
                              <span title="Verified Documentation Attached" style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>
                                <ShieldCheck size={16} />
                              </span>
                            )}
                          </div>
                          <div className="user-uid">Student UID: {app.uid}</div>
                          <div className="app-time"><Clock size={12} /> {app.funded ? 'Funding Secured' : 'Recently Applied'}</div>
                        </div>
                        <span style={{ alignSelf: 'flex-start' }} className={`status-badge ${app.funded ? 'funded' : ''}`}>
                          {app.funded ? 'Secured' : 'Active'}
                        </span>
                      </div>
                      
                      <div className="app-amount" style={{ textAlign: 'center', background: 'var(--surface-secondary)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 500, marginBottom: '0.2rem' }}>Requested Support</span>
                        {app.amount} ETH
                      </div>

                      <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span className="method-badge" style={{ fontSize: '0.7rem' }}>Income: ₹{app.parent_income}</span>
                        {app.marks_10th && (
                            <button 
                                onClick={() => {
                                    const win = window.open();
                                    win.document.write(`<iframe src="${app.marks_10th}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                }}
                                className="method-badge" 
                                style={{ fontSize: '0.7rem', background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: 'none', cursor: 'pointer' }}
                            >
                                View 10th Marks
                            </button>
                        )}
                        {app.marks_12th && (
                            <button 
                                onClick={() => {
                                    const win = window.open();
                                    win.document.write(`<iframe src="${app.marks_12th}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                }}
                                className="method-badge" 
                                style={{ fontSize: '0.7rem', background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: 'none', cursor: 'pointer' }}
                            >
                                View 12th Marks
                            </button>
                        )}
                        {app.income_cert && (
                            <button 
                                onClick={() => {
                                    const win = window.open();
                                    win.document.write(`<iframe src="${app.income_cert}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                }}
                                className="method-badge" 
                                style={{ fontSize: '0.7rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'none', cursor: 'pointer' }}
                            >
                                Income Cert
                            </button>
                        )}
                      </div>
                      
                      <div className="reason-quote">
                        "{app.reason}"
                      </div>
                      
                      {!app.funded && (
                        <button 
                          onClick={() => fundApplication(app.id, app.amount, app.recipient_wallet)}
                          className="btn-primary" 
                          style={{ padding: '0.75rem', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                          disabled={isLoading}
                        >
                          {isLoading ? <RefreshCw className="spinner" size={16} /> : <Check size={16} />}
                          {isLoading ? 'Processing Transaction...' : 'Secure Funding'}
                        </button>
                      )}
                      {app.funded && (
                        <div style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', justifyContent: 'center', marginTop: '1rem' }}>
                          <CheckCircle size={18} /> Scholarship Secured
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {dashboardTab === 'contributions' && (
            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', textAlign: 'center' }}>My Impact</h3>
              
              <div style={{ background: 'var(--surface-color)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '24px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto', boxShadow: 'var(--card-shadow)' }}>
                <span style={{ color: '#34d399', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>Total Generosity</span>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
                  {applications.filter(app => app.funded_by === user?.uid).reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0).toFixed(2)} ETH
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>Thank you for believing in these students and funding their futures! 🌟</p>
              </div>

              <div className="dashboard-grid">
                {applications.filter(app => app.funded_by === user?.uid).length === 0 ? (
                  <div className="empty-state">
                    <HeartHandshake size={64} className="empty-icon" style={{ opacity: 0.8 }} />
                    <h3 style={{ fontSize: '1.4rem' }}>Your Journey Starts Here</h3>
                    <p style={{ maxWidth: '400px', margin: '0 auto' }}>You haven't supported any stories yet! Head over to the Inspire a Student board when you're ready to make a difference.</p>
                  </div>
                ) : (
                  applications.filter(app => app.funded_by === user?.uid).map((app) => (
                    <div key={app.id} className="glass-card application-card" style={{ border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      <div className="user-profile-header">
                        <img src={app.student_real_pic || generateAvatar(app.name || app.uid)} alt="Student Avatar" className="user-avatar" />
                        <div style={{ flex: 1 }}>
                          <h4 className="user-name">{app.name || app.uid}</h4>
                          <div className="user-uid">Student UID: {app.uid}</div>
                          <div className="app-time"><CheckCircle size={12} color="#34d399" /> Funded by you</div>
                        </div>
                      </div>
                      
                      <div className="app-amount" style={{ textAlign: 'center', background: 'var(--surface-secondary)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 500, marginBottom: '0.2rem' }}>Your Donation</span>
                        {app.amount} ETH
                      </div>
                      
                      <div className="reason-quote">
                        "{app.reason}"
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {dashboardTab === 'transactions' && (
            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', textAlign: 'center' }}>Transparency Record</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-card" style={{ padding: '1rem', textAlign: 'center', background: 'rgba(52, 211, 153, 0.05)' }}>
                   <div style={{ color: '#34d399', fontWeight: 700, fontSize: '1.2rem' }}>{MOCK_TRANSACTIONS.length}</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Transactions Verified</div>
                </div>
                <div className="glass-card" style={{ padding: '1rem', textAlign: 'center', background: 'rgba(3, 125, 214, 0.05)' }}>
                   <div style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '1.2rem' }}>
                     {MOCK_TRANSACTIONS.reduce((acc, curr) => acc + parseFloat(curr.value), 0).toFixed(2)} ETH
                   </div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Volume Tracked</div>
                </div>
                <div className="glass-card" style={{ padding: '1rem', textAlign: 'center', background: 'rgba(246, 133, 27, 0.05)' }}>
                   <div style={{ color: 'var(--accent-secondary)', fontWeight: 700, fontSize: '1.2rem' }}>0.00 MSA</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Avg Gas Optimized</div>
                </div>
              </div>
              
              {!walletAddress ? (
                <div className="empty-state" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <img src="/empty-wallet.png" alt="Wallet Unconnected Vector Graphic" style={{ width: '100%', maxWidth: '160px', margin: '0 auto 1.5rem', display: 'block', opacity: 0.95 }} />
                  <h3 style={{ fontSize: '1.4rem' }}>Let's connect your wallet!</h3>
                  <p style={{ maxWidth: '400px', margin: '0 auto' }}>We need to securely link your digital wallet so you can view the community's public receipt ledger.</p>
                  <button onClick={connectWallet} className="btn-primary" style={{ marginTop: '1.5rem', maxWidth: '200px', margin: '1.5rem auto 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', borderRadius: '999px' }}>
                    <Wallet size={18} /> Link Wallet
                  </button>
                </div>
              ) : (
                <div className="txn-table-container">
                  <table className="txn-table">
                    <thead>
                      <tr>
                        <th>Public Receipt</th>
                        <th>Action Taken</th>
                        <th>Block #</th>
                        <th>Time</th>
                        <th>Sender</th>
                        <th>Recipient</th>
                        <th>Amount</th>
                        <th>Network Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_TRANSACTIONS.map((tx, idx) => (
                        <tr key={idx}>
                          <td>
                            <a href={`https://sepolia.etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="hash-link" title="View on Etherscan">
                              {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)} <ExternalLink size={12} style={{ display: 'inline', marginLeft: '2px' }} />
                            </a>
                          </td>
                          <td>
                            <button 
                              className="method-badge" 
                              style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                              onClick={() => replayTransaction(tx)}
                              title={`Execute ${tx.method} via MetaMask`}
                            >
                              {tx.method}
                            </button>
                          </td>
                          <td><a href="#" className="hash-link">{tx.block}</a></td>
                          <td>{tx.age}</td>
                          <td style={{ fontFamily: 'monospace' }}>
                            {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                          </td>
                          <td style={{ fontFamily: 'monospace' }}>
                            {tx.to.substring(0, 10)}...
                          </td>
                          <td style={{ fontWeight: 600 }}>{tx.value}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{tx.fee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Data synced via window.ethereum selected address: <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{walletAddress}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {dashboardTab === 'donate' && (
            <div style={{ animation: 'fadeIn 0.4s ease-out', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Fuel Our Mission 🚀</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Every contribution supports the platform and ensures more students can achieve their dreams securely.</p>
              </div>

              <div className="fiat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 7000, 8000, 9000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000].map(amt => (
                  <button 
                    key={amt} 
                    className={`fiat-btn ${selectedFiat === amt ? 'selected' : ''}`}
                    style={{ padding: '0.8rem 0.5rem', fontSize: '1rem' }}
                    onClick={() => {
                      setSelectedFiat(amt);
                      setPaymentModal({ open: true, type: 'donate', amount: amt, ethAmount: (amt / ETH_PRICE_INR).toFixed(6), appId: null });
                    }}
                  >
                    ₹{amt >= 1000 ? (amt/1000) + 'k' : amt}
                  </button>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
                You will be able to confirm the exact transaction using MetaMask alongside a quick-scan QR code!
              </div>
            </div>
          )}

          {dashboardTab === 'direct' && (
            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
               <PaymentComponent />
            </div>
          )}

          {dashboardTab === 'advanced' && (
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
               <AdvancedFeatures walletAddress={walletAddress} />
            </div>
          )}

          {dashboardTab === 'help' && (
            <HelpSection />
          )}

          {dashboardTab === 'about' && (
            <div style={{ animation: 'fadeIn 0.6s ease-out', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="hero-title" style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
                        Empowering <span style={{ color: 'var(--accent-primary)' }}>Futures</span>
                    </h2>
                    <p className="hero-subtitle">ScholarChain is more than a platform; it's a movement to decentralize opportunity and ensure that every student's potential is unlocked by the collective generosity of a global community.</p>
                </div>

                <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem', color: 'var(--accent-primary)' }}>
                            <ShieldCheck size={28} />
                            <h3 style={{ fontSize: '1.4rem' }}>Our Mission</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                            We aim to eliminate the middlemen and bureaucracies that often stand between donors and deserving students. By leveraging Ethereum's Sepolia network, we provide a 1:1 direct funding model that is transparent, immutable, and 100% secure.
                        </p>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem', color: 'var(--accent-secondary)' }}>
                            <GraduationCap size={28} />
                            <h3 style={{ fontSize: '1.4rem' }}>The Vision</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                            Every student deserves an education, regardless of financial barriers. ScholarChain envisions a world where a student's dedication is the only factor in their career growth, supported by a blockchain-verified registry of scholarship and impact.
                        </p>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(3, 125, 214, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.6rem' }}>Meet Our Visionaries</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
                        {['Ayantika Chakraborty', 'Riddhima Dutta', 'Ayantika Ghosal', 'Lakshmee Kumari', 'Mrinal Kanti Pakhira', 'Arijit Pal'].map(name => (
                            <div key={name} style={{ background: 'var(--surface-secondary)', padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.9rem', fontWeight: 600 }}>
                                {name}
                            </div>
                        ))}
                    </div>
                    <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        United by a passion for technology and social impact, we built ScholarChain to demonstrate how Web3 can solve real-world problems in the education sector.
                    </p>
                </div>
            </div>
          )}
        </div>
      )}
      
      {/* Payment Modal Overlay */}
      {paymentModal.open && (
        <div className="payment-modal-overlay" onClick={(e) => {
          if (e.target.className === 'payment-modal-overlay') {
             setPaymentModal({ open: false, type: '', amount: 0, ethAmount: 0, appId: null });
             setSelectedFiat(null);
          }
        }}>
          <div className="payment-modal">
            <button className="close-modal-btn" onClick={() => {
                setPaymentModal({ open: false, type: '', amount: 0, ethAmount: 0, appId: null });
                setSelectedFiat(null);
            }}>
              <X size={20} />
            </button>
            
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>
              {paymentModal.type === 'fund' ? 'Fund Scholarship' : 'Confirm Donation'}
            </h3>
            
            <div style={{ background: 'var(--surface-secondary)', padding: '1.2rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {paymentModal.type === 'donate' ? `₹ ${paymentModal.amount}` : `${paymentModal.ethAmount} ETH`}
              </div>
              {paymentModal.type === 'donate' && (
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  ≈ {paymentModal.ethAmount} ETH
                </div>
              )}
            </div>

            <div className="qr-container">
              {paymentModal.type === 'donate' ? (
                <img 
                  src={`/qrs/${paymentModal.amount}.jpg`} 
                  alt={`Donate RS ${paymentModal.amount} QR`} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
              ) : (
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ethereum:0x000000000000000000000000000000000000dEaD?value=${paymentModal.ethAmount}e18`} 
                  alt="Ethereum QR" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
              )}
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0.5rem', lineHeight: '1.5' }}>
              Scan the QR code entirely using your mobile Web3 wallet, or authorize it instantly right here on your desktop using your MetaMask browser extension.
            </p>

            <button className="btn-primary" onClick={confirmPayment} disabled={isLoading} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.1rem' }}>
              {isLoading ? <RefreshCw className="spin" size={20} /> : <Wallet size={20} />}
              {isLoading ? 'Processing...' : 'Confirm via MetaMask'}
            </button>
          </div>
        </div>
      )}

      {/* Modern Informational Footer */}
      <footer style={{ marginTop: '4rem', padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          <GraduationCap size={20} color="var(--accent-primary)" />
          <span>© 2026 ScholarChain. Built with ❤️ for students globally.</span>
        </div>
        <div className="footer-badges" style={{ display: 'flex', gap: '1rem' }}>
          <div className="trust-badge" style={{ background: 'var(--surface-color)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-color)' }}>
            <ShieldCheck size={16} color="var(--accent-primary)" />
            Verified Student IDs
          </div>
          <div className="trust-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            <Lock size={16} color="#34d399" />
            Empowered by Web3
          </div>
        </div>
      </footer>

      {walletAddress && (
        <div className={`metamask-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <div className="sidebar-content">
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              MetaMask Account
            </h3>
            <div className="sidebar-item">
              <span className="sidebar-label">Status</span>
              <span className="sidebar-value" style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Check size={14}/> Connected</span>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-label">Address</span>
              <span className="sidebar-value hash-link" style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{walletAddress}</span>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-label">Network</span>
              <span className="sidebar-value">{networkName}</span>
            </div>
            <div className="sidebar-item" style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '12px', marginTop: '1rem', border: '1px solid var(--border-color)' }}>
              <span className="sidebar-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Balance</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{walletBalance} <span style={{fontSize:'1rem', color:'var(--text-secondary)'}}>ETH</span></span>
              
              <button 
                className="btn-primary" 
                onClick={sendTestTransaction} 
                disabled={isLoading}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', fontSize: '0.95rem', marginTop: '1.5rem', borderRadius: '8px' }}
              >
                {isLoading ? <RefreshCw className="spinner" size={16} /> : <Send size={16} />}
                {isLoading ? 'Processing...' : 'Send 0.001 ETH Test'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  </div>
  );
}

export default App;
