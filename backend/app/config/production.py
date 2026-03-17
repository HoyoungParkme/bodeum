from .base import BaseSettings


class ProductionSettings(BaseSettings):
    debug: bool = False
