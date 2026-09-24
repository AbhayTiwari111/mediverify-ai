import uuid
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .auth import create_wallet_token, verify_wallet_token
from .blockchain_service import BlockchainService
from .config import get_settings
from .database import ClaimStore
from .encryption import PIIEncryptor
from .fraud_detector import FraudDetector
from .models import ClaimResponse, ClaimSubmission
from .ocr_service import OCRService

app = FastAPI(title="MediVerify AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)
ocr = OCRService()
fraud = FraudDetector()
blockchain = BlockchainService()
pii = PIIEncryptor()


def get_current_wallet(credentials: HTTPAuthorizationCredentials | None = Depends(security)) -> str:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing wallet token")
    try:
        payload = verify_wallet_token(credentials.credentials)
        return payload["wallet"]
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid wallet token") from exc


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/auth/connect-wallet")
async def connect_wallet(wallet_address: str) -> dict[str, str]:
    if not wallet_address or not wallet_address.startswith("0x") or len(wallet_address) != 42:
        raise HTTPException(status_code=400, detail="Invalid wallet address")
    token = create_wallet_token(wallet_address)
    return {"token": token, "wallet": wallet_address}


@app.post("/api/verify-claim", response_model=ClaimResponse)
async def verify_claim(payload: ClaimSubmission, wallet: str = Depends(get_current_wallet)) -> ClaimResponse:
    claim_id = str(uuid.uuid4())[:8]
    doc_result = await ocr.analyze_documents(payload.documents)
    fraud_result = await fraud.analyze(payload.model_dump())

    encrypted_notes = pii.encrypt(payload.notes or "")
    claim_record = {
        "claim_id": claim_id,
        "claimant_name": payload.claimant_name,
        "claimant_wallet": payload.claimant_wallet,
        "policy_number": payload.policy_number,
        "claim_type": payload.claim_type,
        "amount": payload.amount,
        "incident_date": payload.incident_date,
        "diagnosis": payload.diagnosis,
        "documents": payload.documents,
        "notes_encrypted": encrypted_notes,
        "status": "under_review",
        "risk_score": fraud_result["risk_score"],
        "confidence": fraud_result["confidence"],
        "verdict": fraud_result["verdict"],
        "summary": fraud_result["summary"],
        "fraud_flags": fraud_result["fraud_flags"],
        "blockchain_tx": None,
    }

    ClaimStore.create_claim(claim_id, claim_record)

    blockchain_ref = await blockchain.register_claim(payload.model_dump())
    claim_record["blockchain_tx"] = blockchain_ref["tx_hash"]
    claim_record["status"] = "approved" if fraud_result["verdict"] == "approved" else "manual_review"
    ClaimStore.create_claim(claim_id, claim_record)

    return ClaimResponse(
        claim_id=claim_id,
        status=claim_record["status"],
        risk_score=fraud_result["risk_score"],
        confidence=fraud_result["confidence"],
        verdict=fraud_result["verdict"],
        blockchain_tx=blockchain_ref["tx_hash"],
        payment_proof={"network": "Sepolia demo", "tx_hash": blockchain_ref["tx_hash"]},
        fraud_flags=fraud_result["fraud_flags"],
        summary=fraud_result["summary"],
    )


@app.get("/api/claim-status/{claim_id}")
async def claim_status(claim_id: str) -> dict[str, Any]:
    claim = ClaimStore.get_claim(claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim


@app.post("/blockchain/settle-claim")
async def settle_claim(claim_id: str, amount: float) -> dict[str, Any]:
    settlement = await blockchain.settle_claim(claim_id, amount)
    claim = ClaimStore.get_claim(claim_id)
    if claim:
        claim["status"] = "settled"
        claim["payment_proof"] = settlement
        ClaimStore.create_claim(claim_id, claim)
    return settlement
