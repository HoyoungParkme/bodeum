from typing import Literal

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    features: dict[str, float | int | str]


class PredictionResponse(BaseModel):
    label: str
    score: float
    metadata: dict[str, float | int | str]


class BigFiveScoresPayload(BaseModel):
    O: float = Field(ge=0, le=100)
    C: float = Field(ge=0, le=100)
    E: float = Field(ge=0, le=100)
    A: float = Field(ge=0, le=100)
    N: float = Field(ge=0, le=100)


class ChatMessage(BaseModel):
    role: Literal["user", "coach"]
    text: str = Field(min_length=1, max_length=4000)


class ChatOpenRequest(BaseModel):
    scores: BigFiveScoresPayload


class ChatOpenResponse(BaseModel):
    reply: str
    model: str


class ReportInsight(BaseModel):
    strength: str
    challenge: str
    tip: str


class ChatRequest(BaseModel):
    scores: BigFiveScoresPayload
    messages: list[ChatMessage] = Field(min_length=1)
    turn_count: int = Field(default=0, ge=0)


class ChatResponse(BaseModel):
    reply: str
    summary: str
    model: str
    report_insight: ReportInsight | None = None
