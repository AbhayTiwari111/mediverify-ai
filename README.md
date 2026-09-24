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
