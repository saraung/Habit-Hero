from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.analytics import (
    AnalyticsResponse
)

from app.services.analytics_service import (
    AnalyticsService
)


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get(
    "/",
    response_model=AnalyticsResponse
)
def get_analytics(
    db: Session = Depends(get_db)
):
    data = AnalyticsService.get_analytics(
        db
    )

    return data