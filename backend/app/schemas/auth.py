from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class OAuthUser(BaseModel):
    provider: str
    provider_id: str
    email: str | None = None
    name: str | None = None
    profile_image: str | None = None


class AuthUser(BaseModel):
    id: str
    provider: str
    email: str | None = None
    name: str | None = None
    profile_image: str | None = None
