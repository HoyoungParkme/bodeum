from fastapi import APIRouter, WebSocket

from app.schemas.ml import PredictionRequest, PredictionResponse
from .websocket import ml_websocket

router = APIRouter(prefix="/ml", tags=["ml"])


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest) -> PredictionResponse:
    return PredictionResponse(label="pending", score=0.0, metadata=payload.features)


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await ml_websocket(websocket)
