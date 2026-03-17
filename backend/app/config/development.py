from .base import BaseSettings


class DevelopmentSettings(BaseSettings):
    debug: bool = True
