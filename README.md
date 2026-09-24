  Your `README.md` is currently **empty** (0 lines). You need to paste the full content into it.

### Quick fix:

1. On that GitHub page, click the **pencil icon** (Edit this file) on the right side.
2. **Delete** whatever is there (it’s empty).
3. **Paste** the entire content from the file I created for you.
4. Scroll down → click **Commit changes**.

Here’s the complete content again so you can copy-paste it easily:

---

```markdown
# MediVerify AI

**AI-powered medical insurance claim verification with blockchain settlement**

MediVerify AI is a full-stack platform that combines OCR document analysis, AI-driven fraud detection, and Ethereum smart contracts to verify medical insurance claims quickly, securely, and transparently.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript%20%2B%20Vite-61DAFB)](frontend)
[![Backend](https://img.shields.io/badge/backend-FastAPI-009688)](backend)
[![Blockchain](https://img.shields.io/badge/blockchain-Hardhat%20%2B%20Solidity-orange)](blockchain)

---

## Overview

Medical claim processing is slow, error-prone, and vulnerable to fraud. MediVerify AI addresses this by:

- Extracting key data from medical documents using OCR
- Running AI-based risk scoring and fraud detection
- Registering verified claims on-chain for immutable proof
- Enabling transparent settlement via smart contracts

The system is designed with a modern, demo-friendly architecture that works out of the box (demo mode) while supporting real integrations (OpenAI, Google Cloud Vision, Sepolia, etc.).

---

## Features

- **OCR Document Analysis** – Extract policy numbers, diagnosis, amounts, and other fields from uploaded medical documents
- **AI Fraud Detection** – Risk scoring with configurable flags (duplicate patterns, high-payout anomalies, missing documents)
- **Wallet Authentication** – JWT-based auth using Ethereum wallet addresses
- **On-Chain Claim Registry** – Smart contract (`InsuranceClaims.sol`) for claim registration, verification, settlement, and rejection
- **PII Encryption** – Sensitive notes encrypted at rest
- **Modern Frontend** – React + TypeScript + Tailwind + Framer Motion UI with claim lifecycle tracking
- **Demo Mode** – Fully functional without external API keys or live blockchain

---

## Tech Stack

| Layer        | Technologies                                      |
|--------------|---------------------------------------------------|
| Frontend     | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Ethers.js, Lucide React |
| Backend      | FastAPI, Pydantic, PyJWT, Cryptography, Web3.py   |
| Blockchain   | Solidity 0.8.24, Hardhat, Ethereum (Sepolia / localhost) |
| Auth         | Wallet-based JWT                                  |
| Storage      | In-memory claim store (easily replaceable)        |

---

## Project Structure

```
mediverify-ai/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI routes
│   │   ├── ocr_service.py          # Document analysis
│   │   ├── fraud_detector.py       # Risk scoring & flags
│   │   ├── blockchain_service.py   # On-chain interactions
│   │   ├── auth.py                 # Wallet JWT
│   │   ├── encryption.py           # PII encryption
│   │   ├── models.py               # Pydantic schemas
│   │   └── ...
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 # Main claims UI
│   │   └── ...
│   ├── package.json
│   └── ...
├── blockchain/
│   ├── contracts/
│   │   └── InsuranceClaims.sol     # Claim registry & settlement
│   ├── scripts/
│   ├── test/
│   ├── hardhat.config.js
│   └── package.json
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- (Optional) Hardhat / local Ethereum node for blockchain testing

### 1. Clone the repository

```bash
git clone https://github.com/AbhayTiwari111/mediverify-ai.git
cd mediverify-ai
```

### 2. Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # Edit if needed
uvicorn app.main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`  
API docs: `http://localhost:8000/docs`

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 4. Blockchain (optional)

```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat node                   # Local network
# In another terminal:
npx hardhat run scripts/deploy.js --network localhost
```

Update `CONTRACT_ADDRESS` and `BLOCKCHAIN_RPC_URL` in the backend `.env` for live integration.

---

## Environment Variables

Copy `backend/.env.example` and adjust as needed:

```env
APP_NAME=MediVerify AI
DEMO_MODE=true
SECRET_KEY=demo-secret-key-change-me
JWT_ALGORITHM=HS256
OPENAI_API_KEY=
GOOGLE_CLOUD_PROJECT=
GOOGLE_APPLICATION_CREDENTIALS=
BLOCKCHAIN_RPC_URL=
CONTRACT_ADDRESS=
```

- Set `DEMO_MODE=true` for fully offline operation (mock OCR, fraud detection, and blockchain responses).
- Provide real API keys and contract address when moving to production.

---

## API Endpoints

| Method | Endpoint                      | Description                          |
|--------|-------------------------------|--------------------------------------|
| GET    | `/health`                     | Health check                         |
| POST   | `/api/auth/connect-wallet`    | Issue JWT for a wallet address       |
| POST   | `/api/verify-claim`           | Submit & verify a medical claim      |
| GET    | `/api/claim-status/{claim_id}`| Retrieve claim status                |
| POST   | `/blockchain/settle-claim`    | Settle an approved claim on-chain    |

---

## Smart Contract

`InsuranceClaims.sol` provides:

- Claim registration with medical document hash
- Status lifecycle: `Submitted` → `Verified` → `Settled` / `Rejected`
- Only the insurer (contract owner) can settle or reject
- On-chain settlement with native ETH transfer
- Events for indexing (`ClaimVerified`, `ClaimSettled`, `ClaimRejected`)

---

## How It Works

1. **Connect Wallet** → Receive JWT
2. **Submit Claim** → Claimant details + documents + diagnosis
3. **OCR Analysis** → Extract structured data from documents
4. **Fraud Detection** → Compute risk score & flags
5. **On-Chain Registration** → Immutable proof of verified claim
6. **Settlement** → Optional automated or manual payout via smart contract

---

## Roadmap

- [ ] Real OCR integration (Google Cloud Vision / Tesseract / Azure)
- [ ] Production-grade fraud model (ML-based anomaly detection)
- [ ] Persistent database (PostgreSQL / MongoDB)
- [ ] Multi-chain support
- [ ] Role-based access (patient, insurer, auditor)
- [ ] Audit trail & compliance reports

---

## Contributing

Contributions are welcome! Please open an issue first to discuss major changes.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Author

**Abhay Tiwari**  
GitHub: [AbhayTiwari111](https://github.com/AbhayTiwari111)

---

> Built to make medical claim verification faster, fairer, and more transparent.
```

---

Just paste the above into the empty README.md on GitHub and commit. It will look professional immediately.
