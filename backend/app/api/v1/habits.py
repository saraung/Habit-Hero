from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.habit import HabitCreate
from app.schemas.habit import HabitUpdate
from app.schemas.habit import HabitResponse

from app.services.habit_service import HabitService


router = APIRouter(
    prefix="/habits",
    tags=["Habits"]
)


@router.get(
    "/",
    response_model=list[HabitResponse]
)
def get_habits(
    db: Session = Depends(get_db)
):
    return HabitService.get_all_habits(db)


@router.get(
    "/{habit_id}",
    response_model=HabitResponse
)
def get_habit(
    habit_id: int,
    db: Session = Depends(get_db)
):
    habit = HabitService.get_habit_by_id(
        db,
        habit_id
    )

    if not habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found"
        )

    return habit


@router.post(
    "/",
    response_model=HabitResponse,
    status_code=201
)
def create_habit(
    habit_data: HabitCreate,
    db: Session = Depends(get_db)
):
    return HabitService.create_habit(
        db,
        habit_data
    )


@router.put(
    "/{habit_id}",
    response_model=HabitResponse
)
def update_habit(
    habit_id: int,
    update_data: HabitUpdate,
    db: Session = Depends(get_db)
):
    habit = HabitService.update_habit(
        db,
        habit_id,
        update_data
    )

    if not habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found"
        )

    return habit


@router.delete("/{habit_id}")
def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db)
):
    deleted = HabitService.delete_habit(
        db,
        habit_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Habit not found"
        )

    return {
        "message": "Habit deleted successfully"
    }