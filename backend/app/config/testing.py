from .base import BaseSettings


class TestingSettings(BaseSettings):
    debug: bool = True
    secret_key: str = "test-secret"
