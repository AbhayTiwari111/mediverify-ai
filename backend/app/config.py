from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MediVerify AI"
    demo_mode: bool = True
    secret_key: str = "demo-secret-key-change-me"
    jwt_algorithm: str = "HS256"
    openai_api_key: str = ""
    google_cloud_project: str = ""
    google_application_credentials: str = ""
    blockchain_rpc_url: str = ""
    contract_address: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
