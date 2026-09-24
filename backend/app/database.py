import json
from pathlib import Path
from typing import Any

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "claims.json"
DATA_PATH.parent.mkdir(parents=True, exist_ok=True)


class ClaimStore:
    _data: dict[str, Any] = {}

    @classmethod
    def load(cls) -> dict[str, Any]:
        if not cls._data:
            if DATA_PATH.exists():
                try:
                    with DATA_PATH.open("r", encoding="utf-8") as fh:
                        cls._data = json.load(fh) or {}
                except json.JSONDecodeError:
                    cls._data = {}
            else:
                cls._data = {}
        return cls._data

    @classmethod
    def save(cls) -> None:
        with DATA_PATH.open("w", encoding="utf-8") as fh:
            json.dump(cls._data, fh, indent=2)

    @classmethod
    def create_claim(cls, claim_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        data = cls.load()
        data[claim_id] = payload
        cls._data = data
        cls.save()
        return payload

    @classmethod
    def get_claim(cls, claim_id: str) -> dict[str, Any] | None:
        return cls.load().get(claim_id)

    @classmethod
    def list_claims(cls) -> list[dict[str, Any]]:
        return list(cls.load().values())
