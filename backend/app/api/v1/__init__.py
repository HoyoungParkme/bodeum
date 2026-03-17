from fastapi import APIRouter

from .auth.routes import router as auth_router
from .health.routes import router as health_router
from .ml.routes import router as ml_router
from .users.routes import router as users_router

router = APIRouter()
router.include_router(health_router)
router.include_router(auth_router)
router.include_router(users_router)
router.include_router(ml_router)
