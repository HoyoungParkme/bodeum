import hashlib
from datetime import datetime, timedelta, timezone

import httpx
from jose import jwt

from app.config import BaseSettings
from app.schemas.auth import AuthUser, OAuthUser

_JWT_ALGORITHM = "HS256"
_JWT_EXPIRE_DAYS = 30


def create_jwt(user: AuthUser, secret_key: str) -> str:
    payload = {
        "sub": user.id,
        "provider": user.provider,
        "email": user.email,
        "name": user.name,
        "profile_image": user.profile_image,
        "exp": datetime.now(timezone.utc) + timedelta(days=_JWT_EXPIRE_DAYS),
    }
    return jwt.encode(payload, secret_key, algorithm=_JWT_ALGORITHM)


def decode_jwt(token: str, secret_key: str) -> dict:
    return jwt.decode(token, secret_key, algorithms=[_JWT_ALGORITHM])


def _make_user_id(provider: str, provider_id: str) -> str:
    return hashlib.sha256(f"{provider}:{provider_id}".encode()).hexdigest()[:24]


def get_kakao_redirect_uri(settings: BaseSettings) -> str:
    return f"{settings.frontend_url.rstrip('/')}/auth/kakao/callback"


def get_google_redirect_uri(settings: BaseSettings) -> str:
    return f"{settings.frontend_url.rstrip('/')}/auth/google/callback"


def get_kakao_auth_url(settings: BaseSettings) -> str:
    redirect_uri = get_kakao_redirect_uri(settings)
    return (
        "https://kauth.kakao.com/oauth/authorize"
        f"?client_id={settings.kakao_client_id}"
        f"&redirect_uri={redirect_uri}"
        "&response_type=code"
    )


def get_google_auth_url(settings: BaseSettings) -> str:
    redirect_uri = get_google_redirect_uri(settings)
    return (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={settings.google_client_id}"
        f"&redirect_uri={redirect_uri}"
        "&response_type=code"
        "&scope=openid%20email%20profile"
    )


def exchange_kakao_code(code: str, settings: BaseSettings) -> OAuthUser:
    redirect_uri = get_kakao_redirect_uri(settings)

    with httpx.Client(timeout=10.0) as client:
        token_res = client.post(
            "https://kauth.kakao.com/oauth/token",
            data={
                "grant_type": "authorization_code",
                "client_id": settings.kakao_client_id,
                "client_secret": settings.kakao_client_secret,
                "redirect_uri": redirect_uri,
                "code": code,
            },
        )
        token_res.raise_for_status()
        access_token = token_res.json()["access_token"]

        user_res = client.get(
            "https://kapi.kakao.com/v2/user/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        user_res.raise_for_status()
        data = user_res.json()

    kakao_account = data.get("kakao_account", {})
    profile = kakao_account.get("profile", {})

    return OAuthUser(
        provider="kakao",
        provider_id=str(data["id"]),
        email=kakao_account.get("email"),
        name=profile.get("nickname"),
        profile_image=profile.get("profile_image_url"),
    )


def exchange_google_code(code: str, settings: BaseSettings) -> OAuthUser:
    redirect_uri = get_google_redirect_uri(settings)

    with httpx.Client(timeout=10.0) as client:
        token_res = client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "grant_type": "authorization_code",
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "redirect_uri": redirect_uri,
                "code": code,
            },
        )
        token_res.raise_for_status()
        access_token = token_res.json()["access_token"]

        user_res = client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        user_res.raise_for_status()
        data = user_res.json()

    return OAuthUser(
        provider="google",
        provider_id=data["id"],
        email=data.get("email"),
        name=data.get("name"),
        profile_image=data.get("picture"),
    )


def oauth_user_to_auth_user(oauth_user: OAuthUser) -> AuthUser:
    return AuthUser(
        id=_make_user_id(oauth_user.provider, oauth_user.provider_id),
        provider=oauth_user.provider,
        email=oauth_user.email,
        name=oauth_user.name,
        profile_image=oauth_user.profile_image,
    )
