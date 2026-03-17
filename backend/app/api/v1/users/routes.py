from fastapi import APIRouter

from app.schemas.user import UserRead

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserRead])
def list_users() -> list[UserRead]:
    return [UserRead(id="u-001", email="demo@example.com", name="Demo User")]
