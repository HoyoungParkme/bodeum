from pydantic import BaseModel


class PredictionRequest(BaseModel):
    features: dict[str, float | int | str]


class PredictionResponse(BaseModel):
    label: str
    score: float
    metadata: dict[str, float | int | str]
