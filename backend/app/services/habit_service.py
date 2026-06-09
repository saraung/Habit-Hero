from sqlalchemy.orm import Session

from app.repositories.habit_repository import HabitRepository
from app.schemas.habit import HabitCreate
from app.schemas.habit import HabitUpdate


class HabitService:

    @staticmethod
    def get_all_habits(db: Session):
        return HabitRepository.get_all(db)

    @staticmethod
    def get_habit_by_id(
        db: Session,
        habit_id: int
    ):
        return HabitRepository.get_by_id(
            db,
            habit_id
        )

    @staticmethod
    def create_habit(
        db: Session,
        habit_data: HabitCreate
    ):
        return HabitRepository.create(
            db,
            habit_data
        )

    @staticmethod
    def update_habit(
        db: Session,
        habit_id: int,
        update_data: HabitUpdate
    ):
        habit = HabitRepository.get_by_id(
            db,
            habit_id
        )

        if not habit:
            return None

        return HabitRepository.update(
            db,
            habit,
            update_data
        )

    @staticmethod
    def delete_habit(
        db: Session,
        habit_id: int
    ):
        habit = HabitRepository.get_by_id(
            db,
            habit_id
        )

        if not habit:
            return False

        HabitRepository.delete(
            db,
            habit
        )

        return True