from typing import Any

from pydantic import BaseModel, Field, field_validator


class ClaimSubmission(BaseModel):
    claimant_name: str = Field(..., min_length=2)
    claimant_wallet: str = Field(..., min_length=10)
    policy_number: str = Field(..., min_length=3)
    claim_type: str = Field(..., min_length=2)
    amount: float = Field(..., gt=0)
    incident_date: str
    diagnosis: str = Field(..., min_length=3)
    documents: list[str] = Field(default_factory=list)
    notes: str = Field(default="")

    @field_validator("claimant_wallet")
    @classmethod
    def validate_wallet(cls, value: str) -> str:
        if not value.startswith("0x") or len(value) != 42:
            raise ValueError("Wallet address must be a valid 0x Ethereum address")
        return value


class ClaimResponse(BaseModel):
    claim_id: str
    status: str
    risk_score: int
    confidence: int
    verdict: str
    blockchain_tx: str | None = None
    payment_proof: dict[str, Any] | None = None
    fraud_flags: list[str] = Field(default_factory=list)
    summary: str
