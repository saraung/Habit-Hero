from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.habit import Habit
from app.schemas.ai import (
    NoteAnalysisRequest,
    NoteAnalysisResponse,
    HabitRecommendationResponse,
)
from app.services.ai_service import AIService


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


@router.post(
    "/analyze-note",
    response_model=NoteAnalysisResponse
)
def analyze_note(
    request: NoteAnalysisRequest
):
    result = AIService.analyze_note(
        request.note
    )
    return result


@router.get(
    "/recommendations",
    response_model=HabitRecommendationResponse
)
def get_recommendations(
    db: Session = Depends(get_db)
):
    habits = db.query(Habit).all()
    return AIService.get_recommendations(habits)