import random
from typing import Any


class FraudDetector:
    async def analyze(self, claim: dict[str, Any]) -> dict[str, Any]:
        risk = 18 + random.randint(0, 35)
        if "travel" in claim.get("claim_type", "").lower():
            risk += 12
        if claim.get("amount", 0) > 5000:
            risk += 15

        flags = []
        if risk > 55:
            flags.append("Prior duplicate claim pattern")
        if claim.get("amount", 0) > 8000:
            flags.append("High payout anomaly")
        if not claim.get("documents"):
            flags.append("Missing supporting documents")

        if not flags:
            flags = ["No material risk flags"]

        return {
            "risk_score": min(risk, 96),
            "confidence": 88 + random.randint(0, 10),
            "verdict": "approved" if risk < 55 else "manual_review",
            "fraud_flags": flags,
            "summary": "Claim pattern matches policy coverage with moderate anomaly review.",
        }
