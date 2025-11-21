# Insperion FHE Lending Protocol

A privacy‑preserving lending and borrowing system powered by Zama’s **fhEVM**. Insperion enables fully homomorphic encrypted borrowing, lending, repayments, and interest calculations — all computed on‑chain without exposing raw financial data.

---

## 🎯 **Overview**

Traditional DeFi platforms expose all balances, collateral ratios, and loan positions publicly on-chain. Insperion solves this by using **fully homomorphic encryption (FHE)** to ensure all user‑sensitive values remain hidden while still allowing the smart contracts to compute on them.

Insperion enables:

✅ **Borrowing with encrypted amounts**
✅ **Encrypted interest accrual**
✅ **Private repayments**
✅ **Encrypted loan health checks** (LTV logic stays private)
✅ **Lenders can provide liquidity without seeing borrower details**

All math — collateralization, health factors, interest, debt — is handled using Zama’s encrypted types (`euint64`, `euint128`, etc.).

---

## 🏗️ **Architecture**

### **Smart Contracts (Solidity + fhEVM)**

* **LoanVault.sol** – The core encrypted lending vault

  * Stores all borrower balances as encrypted integers
  * Computes interest and debt growth homomorphically
  * Prevents liquidation/leakage of borrower details
  * Uses handle‑based ciphertext references

* **Registry.sol** – Encrypted authorization + identity handles

  * Maps encrypted borrower IDs to loan keys
  * Secures read/write access for decryption via signature proofs

### **Encrypted Data Structures**

Each user has:

* `encryptedCollateral` – euint128
* `encryptedDebt` – euint128
* `encryptedInterestRate` – euint64
* `lastSyncTimestamp` – used for encrypted accrual calculations

All values are stored as **ciphertext handles**, not plaintext numbers.

---

## 🔐 **Privacy Model**

All sensitive values remain encrypted **on-chain**. Neither the contract nor the frontend sees the true values.

The only parties capable of decrypting:

* The user (borrower)
* The Vault Manager (lender or admin role)

All decryptions are done via Zama’s **Relayer + FHE SDK**, requiring EIP‑712 signatures.

### **What remains private:**

* Loan amount
* Collateral amount
* Interest rate
* Health factor
* Repayment sizes
* Total time‑accrued debt

### **What is public:**

* That a loan exists
* That a repayment occurred
* Encrypted ciphertext handles (no value disclosure)

---

## 🧱 **Frontend (React + Vite + TypeScript)**

Insperion uses a modern privacy‑focused frontend stack:

* **Vite** – fast dev server
* **React + TypeScript** – modular UI structure
* **TailwindCSS** – modern design system
* **Zama fhEVM SDK** – client‑side encryption/decryption
* **ethers.js / viem** – contract interactions

### **Pages**

* **Dashboard** – view encrypted loan/collateral values
* **Borrow Modal** – encrypt amount → submit loan request
* **Repay Modal** – encrypt repayment amount → settle debt
* **Admin Panel** – view encrypted pool analytics

All encryption/decryption happens **client‑side only**.

---

## 🔄 **Loan Workflow**

### 1️⃣ Borrower opens the Borrow modal

User enters a loan amount → frontend encrypts it using FHE.

```
const encryptedAmount = encryptUint64(amount);
```

### 2️⃣ Borrower submits encrypted loan

The contract never sees the clear value.

### 3️⃣ Vault computes interest + health factor in encrypted space

All LTV logic remains hidden.

### 4️⃣ Borrower repays debt privately

User encrypts repayment amount → contract subtracts it homomorphically.

### 5️⃣ Borrower can decrypt their updated debt/collateral privately

Only with signature authorization.

---

## ⚙️ **Tech Stack**

### **Smart Contracts**

* Solidity + fhEVM
* Zama Encrypted Types
* Custom Registry + Vault system

### **Frontend**

* React + Vite
* TailwindCSS
* FHEVM TypeScript SDK
* Wagmi / Viem wallet tools

### **Infrastructure**

* VPS hosting with Node 18+/20+
* Hardhat for deployments

---

## 🚀 **Getting Started**

### **Prerequisites**

* Node.js 20+
* pnpm or npm
* MetaMask
* Sepolia ETH (for testing)

### **Installation**

```
git clone <repo-url>
cd Insperion-frontend
npm install
```

### **Run locally**

```
npm run dev
```

Visit **[http://localhost:5173](http://localhost:5173)**

---

## 📁 **Project Structure**

```
Insperion-frontend/
│ src/
│   components/
│     BorrowRepayModal.tsx
│     Dashboard.tsx
│     GlassCard.tsx
│     ui/Button.tsx
│   fhevm/
│     encrypt.ts
│     decrypt.ts
│   contracts/
│     loanVault.ts
│     registry.ts
│   App.tsx
│   main.tsx
│ public/
│ vite.config.ts
```

---

## 🔍 **Decryption Flow**

1. User clicks "Decrypt"
2. Frontend sends an EIP‑712 signature request
3. Relayer verifies authorization
4. Decrypted value returned **privately** to frontend

The value is **never stored** and only displayed to the user.

---

## 📦 Deployment

### **Smart contracts**

```
npx hardhat run scripts/deploy.ts --network sepolia
```

### **Frontend build**

```
npm run build
npm run preview
```

### **VPS setup**

* push code to GitHub
* pull into VPS
* run `npm install`
* use PM2 or systemd to keep server alive

---

## 🧪 Tests

* Contract unit tests use Hardhat
* Frontend component tests (Vitest)
* Encryption/decryption test harness with Zama SDK

---

## 🛣️ Future Improvements

* Encrypted oracle for collateral pricing
* Secure liquidation logic under FHE
* Cross‑vault encrypted composability
* Mobile version with deep wallet integration
* Audits + zk‑FHE hybrid proofs

---

## 📜 License

MIT
* a **marketing‑style landing README**.
