from sqlalchemy.orm import Session

from app.repositories.checkin_repository import CheckInRepository
from app.repositories.habit_repository import HabitRepository
from app.schemas.checkin import CheckInCreate


class CheckInService:

    @staticmethod
    def create_checkin(
        db: Session,
        checkin_data: CheckInCreate
    ):
        habit = HabitRepository.get_by_id(
            db,
            checkin_data.habit_id
        )

        if not habit:
            return None

        return CheckInRepository.create(
            db,
            checkin_data
        )

    @staticmethod
    def get_habit_checkins(
        db: Session,
        habit_id: int
    ):
        return CheckInRepository.get_by_habit(
            db,
            habit_id
        )