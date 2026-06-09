from typing import List

from pydantic import BaseModel
from pydantic import Field


class NoteAnalysisRequest(BaseModel):
    note: str = Field(
        ...,
        min_length=1,
        max_length=1000
    )


class NoteAnalysisResponse(BaseModel):
    mood: str
    score: float
    recommendation: str


class HabitRecommendationResponse(BaseModel):
    recommendations: List[str]