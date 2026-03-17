import os

from .base import BaseSettings
from .development import DevelopmentSettings
from .production import ProductionSettings
from .testing import TestingSettings


def load_settings() -> BaseSettings:
    environment = os.getenv("FASTAPI_ENV", "development").strip().lower()

    settings_map: dict[str, type[BaseSettings]] = {
        "development": DevelopmentSettings,
        "production": ProductionSettings,
        "testing": TestingSettings,
    }

    settings_class = settings_map.get(environment, DevelopmentSettings)
    return settings_class()

__all__ = [
    "BaseSettings",
    "DevelopmentSettings",
    "ProductionSettings",
    "TestingSettings",
    "load_settings",
]
