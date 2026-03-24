from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse

from app.config import BaseSettings
from app.schemas.auth import LoginRequest, TokenResponse
from .oauth import (
    create_jwt,
    exchange_google_code,
    exchange_kakao_code,
    get_google_auth_url,
    get_kakao_auth_url,
    oauth_user_to_auth_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    return TokenResponse(access_token=f"demo-token-for-{payload.email}")


@router.get("/kakao")
def kakao_login(request: Request) -> RedirectResponse:
    settings: BaseSettings = request.app.state.settings
    if not settings.kakao_client_id:
        raise HTTPException(status_code=503, detail="Kakao OAuth is not configured.")
    return RedirectResponse(url=get_kakao_auth_url(settings))


@router.get("/kakao/callback")
def kakao_callback(code: str, request: Request) -> RedirectResponse:
    settings: BaseSettings = request.app.state.settings
    try:
        oauth_user = exchange_kakao_code(code, settings)
    except Exception:
        frontend_error_url = f"{settings.frontend_url.rstrip('/')}/login?error=kakao_failed"
        return RedirectResponse(url=frontend_error_url)

    auth_user = oauth_user_to_auth_user(oauth_user)
    token = create_jwt(auth_user, settings.secret_key)
    redirect_url = f"{settings.frontend_url.rstrip('/')}/auth/callback?token={token}"
    return RedirectResponse(url=redirect_url)


@router.get("/google")
def google_login(request: Request) -> RedirectResponse:
    settings: BaseSettings = request.app.state.settings
    if not settings.google_client_id:
        raise HTTPException(status_code=503, detail="Google OAuth is not configured.")
    return RedirectResponse(url=get_google_auth_url(settings))


@router.get("/google/callback")
def google_callback(code: str, request: Request) -> RedirectResponse:
    settings: BaseSettings = request.app.state.settings
    try:
        oauth_user = exchange_google_code(code, settings)
    except Exception:
        frontend_error_url = f"{settings.frontend_url.rstrip('/')}/login?error=google_failed"
        return RedirectResponse(url=frontend_error_url)

    auth_user = oauth_user_to_auth_user(oauth_user)
    token = create_jwt(auth_user, settings.secret_key)
    redirect_url = f"{settings.frontend_url.rstrip('/')}/auth/callback?token={token}"
    return RedirectResponse(url=redirect_url)
