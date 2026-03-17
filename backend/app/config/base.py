from pydantic_settings import BaseSettings as PydanticBaseSettings
from pydantic_settings import SettingsConfigDict


class BaseSettings(PydanticBaseSettings):
    app_name: str = "Bodeum API"
    api_version: str = "0.1.0"
    api_prefix: str = "/api"
    log_level: str = "INFO"
    host: str = "0.0.0.0"
    port: int = 8000
    secret_key: str = "change-me"
    debug: bool = False

    model_config = SettingsConfigDict(
        env_prefix="FASTAPI_",
        extra="ignore",
    )
