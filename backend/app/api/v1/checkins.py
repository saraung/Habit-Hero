from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.checkin import CheckInCreate
from app.schemas.checkin import CheckInResponse

from app.services.checkin_service import (
    CheckInService
)


router = APIRouter(
    prefix="/checkins",
    tags=["CheckIns"]
)


@router.post(
    "",
    response_model=CheckInResponse,
    status_code=201
)
def create_checkin(
    checkin_data: CheckInCreate,
    db: Session = Depends(get_db)
):
    checkin = (
        CheckInService.create_checkin(
            db,
            checkin_data
        )
    )

    if not checkin:
        raise HTTPException(
            status_code=404,
            detail="Habit not found"
        )

    return checkin


@router.get(
    "/habit/{habit_id}",
    response_model=list[CheckInResponse]
)
def get_habit_checkins(
    habit_id: int,
    db: Session = Depends(get_db)
):
    return CheckInService.get_habit_checkins(
        db,
        habit_id
    )