from fastapi import APIRouter, HTTPException, Request, WebSocket

from app.config import BaseSettings
from app.schemas.ml import (
    ChatOpenRequest,
    ChatOpenResponse,
    ChatRequest,
    ChatResponse,
    PredictionRequest,
    PredictionResponse,
)
from .llm import LLMConfigurationError, LLMResponseError, generate_chat_opening, generate_chat_response
from .websocket import ml_websocket

router = APIRouter(prefix="/ml", tags=["ml"])


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest) -> PredictionResponse:
    return PredictionResponse(label="pending", score=0.0, metadata=payload.features)


@router.post("/chat/open", response_model=ChatOpenResponse)
def chat_open(payload: ChatOpenRequest, request: Request) -> ChatOpenResponse:
    settings: BaseSettings = request.app.state.settings

    try:
        return generate_chat_opening(settings=settings, scores=payload.scores)
    except LLMConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except LLMResponseError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="The chat opening request failed.",
        ) from exc


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, request: Request) -> ChatResponse:
    settings: BaseSettings = request.app.state.settings

    try:
        return generate_chat_response(
            settings=settings,
            scores=payload.scores,
            messages=payload.messages,
            turn_count=payload.turn_count,
        )
    except LLMConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except LLMResponseError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="The chat model request failed.",
        ) from exc


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await ml_websocket(websocket)
