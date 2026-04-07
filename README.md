# ScholarChain 🎓⛓️

**ScholarChain** is a full-stack, industry-level Web3 platform built to decentralize and secure education funding. It allows students to apply for scholarships entirely on-chain while donors can securely fund these applications using actual Ethereum (via MetaMask). 

This project bridges traditional web technologies (Flask, SQLite, React) with a cutting-edge Blockchain architecture (Solidity, Web3 ethers) to create a placement-ready, highly impressive system.

---

## 🔥 Features
- **Ultra-Premium UI/UX:** A stunning glassmorphism dashboard built with React and custom Vanilla CSS.
- **Secure Authentication:** JWT (JSON Web Tokens) and Werkzeug Password hashing secure all user models.
- **Web3 Integration:** Full MetaMask integration (`window.ethereum`) allowing instant, gas-optimized decentralized transactions.
- **Smart Contract Logic:** Applications are funded and state-managed via a deployed Solidity Smart Contract on the Sepolia Testnet.

---

## 🏗️ Architecture Stack

- **Frontend:** React (Vite), purely styled with Vanilla CSS (Dark Mode & Micro-animations), `lucide-react` for icons.
- **Backend:** Python (Flask), `flask-jwt-extended`, SQLite3 Database.
- **Blockchain:** Solidity (`^0.8.0`), Ethereum Network (Sepolia Testnet), MetaMask.

---

## 🚀 How to Run Locally

### 1. Start the Flask Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the Python dependencies (ensure you have Python installed):
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   python app.py
   ```
   > The server will start running on `http://127.0.0.1:5000`. It will auto-create the `scholarchain.db` database file on first boot.

### 2. Start the React Frontend
1. Open a **new** terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   npm install lucide-react
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > The UI will instantly boot up on `http://localhost:5173`.

---

## ⚙️ Smart Contract Deployment (Optional/Viva Prep)

The core Solidity contract is located at `contracts/ScholarChain.sol`. To deploy it yourself:
1. Copy the code from `ScholarChain.sol`.
2. Open [Remix IDE](https://remix.ethereum.org/).
3. Create a new file, paste the code, and compile it.
4. Go to the "Deploy & Run Transactions" tab, select "Injected Provider - MetaMask" as the environment.
5. Deploy the contract to the **Sepolia Testnet**.

---

## 🧠 Viva Master Answers (For Examinations)

> **Q: What improvement did you add to this system?**
> *"I upgraded the core architecture to a real-world Web3 standard. I replaced primitive, insecure APIs with JWT Authentication and hashed passwords. I then introduced a full React frontend featuring MetaMask integration. The actual funding mechanism is now 100% decentralized through an Ethereum Smart Contract deployed on Sepolia, meaning all transactions are immutable, transparent, and impossible to fake."*

> **Q: Why didn't you use Web3.py in the backend?**
> *"In a true decentralized architecture, the backend shouldn't pay the gas fees for user actions. By relying entirely on the React Frontend + MetaMask provider (`window.ethereum`) to sign and broadcast the EVM transactions, we drastically lower backend server costs, improve scalability, and enforce best Web3 security practices where the user retains custody of their keys."*

---

> Built with ❤️ by Ayantika Chakraborty, Riddhima Dutta, Ayantika Ghosal, Lakshmee Kumari, Mrinal Kanti Pakhira. 
