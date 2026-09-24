from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

from .config import get_settings


def create_wallet_token(wallet_address: str) -> str:
    settings = get_settings()
    payload = {
        "wallet": wallet_address,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def verify_wallet_token(token: str) -> dict[str, Any]:
    settings = get_settings()
    return jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
