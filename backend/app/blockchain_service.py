import random
from typing import Any


class BlockchainService:
    async def register_claim(self, claim: dict[str, Any]) -> dict[str, Any]:
        return {
            "contract": "0xCFA7A4d8A0E9d36b2D9ee9E7C1d1366332A7B7E9",
            "tx_hash": "0x" + "ab" * 32,
            "status": "verified",
            "blockchain_ref": f"BLOCK-{random.randint(100000, 999999)}",
            "amount": float(claim.get("amount", 0)),
        }

    async def settle_claim(self, claim_id: str, amount: float) -> dict[str, Any]:
        return {
            "claim_id": claim_id,
            "status": "settled",
            "tx_hash": "0x" + "cd" * 32,
            "amount": amount,
            "network": "Sepolia demo",
            "explorer_url": "https://sepolia.etherscan.io/tx/demo",
        }
