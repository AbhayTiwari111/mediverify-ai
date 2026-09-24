import base64
import hashlib

from cryptography.fernet import Fernet

from .config import get_settings


class PIIEncryptor:
    def __init__(self) -> None:
        settings = get_settings()
        key = hashlib.sha256(settings.secret_key.encode("utf-8")).digest()
        self.fernet = Fernet(base64.urlsafe_b64encode(key))

    def encrypt(self, text: str) -> str:
        return self.fernet.encrypt(text.encode("utf-8")).decode("utf-8")

    def decrypt(self, token: str) -> str:
        return self.fernet.decrypt(token.encode("utf-8")).decode("utf-8")
