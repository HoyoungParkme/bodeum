from fastapi import FastAPI

from app.api import api_router
from app.config import BaseSettings, load_settings
from app.core.logging import configure_logging


def create_app(settings: BaseSettings | None = None) -> FastAPI:
    settings = settings or load_settings()
    configure_logging(settings.log_level)

    app = FastAPI(
        title=settings.app_name,
        version=settings.api_version,
    )
    app.state.settings = settings
    app.include_router(api_router, prefix=settings.api_prefix)
    return app


app = create_app()
