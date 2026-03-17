from urllib.parse import urlparse

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings as PydanticBaseSettings
from pydantic_settings import SettingsConfigDict


class BaseSettings(PydanticBaseSettings):
    app_name: str = "Bodeum API"
    api_version: str = "0.1.0"
    api_prefix: str = "/api"
    log_level: str = "INFO"
    host: str = "0.0.0.0"
    port: int = Field(
        default=8000,
        validation_alias=AliasChoices("FASTAPI_PORT", "PORT"),
    )
    secret_key: str = "change-me"
    debug: bool = False
    llm_api_key: str = Field(
        default="",
        validation_alias=AliasChoices("LLM_API_KEY", "OPENAI_API_KEY"),
    )
    llm_model: str = Field(
        default="gpt-4.1-mini",
        validation_alias=AliasChoices("LLM_MODEL", "OPENAI_MODEL"),
    )
    llm_base_url: str = Field(
        default="https://api.openai.com/v1",
        validation_alias=AliasChoices("LLM_BASE_URL", "OPENAI_BASE_URL"),
    )
    cors_origins: str = Field(
        default="http://localhost:3001,http://localhost:5173",
        validation_alias=AliasChoices("FASTAPI_CORS_ORIGINS", "BACKEND_CORS_ORIGINS"),
    )
    cors_origin_regex: str = Field(
        default=r"^https://.*\.vercel\.app$",
        validation_alias=AliasChoices(
            "FASTAPI_CORS_ORIGIN_REGEX",
            "BACKEND_CORS_ORIGIN_REGEX",
        ),
    )

    def get_cors_origins(self) -> list[str]:
        origins: list[str] = []
        seen: set[str] = set()

        for raw_origin in self.cors_origins.split(","):
            origin = raw_origin.strip().rstrip("/")
            if origin and origin not in seen:
                origins.append(origin)
                seen.add(origin)

        return origins

    def get_llm_base_url(self) -> str:
        base_url = self.llm_base_url.strip().rstrip("/")
        parsed = urlparse(base_url)

        if not base_url:
            return "https://api.openai.com/v1"

        if parsed.path in ("", "/"):
            return f"{base_url}/v1"

        return base_url

    model_config = SettingsConfigDict(
        env_prefix="FASTAPI_",
        extra="ignore",
    )
