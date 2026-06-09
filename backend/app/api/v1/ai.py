from fastapi import APIRouter

from app.schemas.ai import (
    NoteAnalysisRequest
)

from app.schemas.ai import (
    NoteAnalysisResponse
)

from app.services.ai_service import (
    AIService
)


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