from sqlalchemy.orm import Session

from app.models.habit import Habit
from app.schemas.habit import HabitCreate
from app.schemas.habit import HabitUpdate


class HabitRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(Habit).all()

    @staticmethod
    def get_by_id(db: Session, habit_id: int):
        return (
            db.query(Habit)
            .filter(Habit.id == habit_id)
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        habit_data: HabitCreate
    ):
        habit = Habit(
            name=habit_data.name,
            frequency=habit_data.frequency,
            category=habit_data.category,
            start_date=habit_data.start_date
        )

        db.add(habit)
        db.commit()
        db.refresh(habit)

        return habit

    @staticmethod
    def update(
        db: Session,
        habit: Habit,
        update_data: HabitUpdate
    ):
        update_dict = update_data.model_dump(
            exclude_unset=True
        )

        for key, value in update_dict.items():
            setattr(habit, key, value)

        db.commit()
        db.refresh(habit)

        return habit

    @staticmethod
    def delete(
        db: Session,
        habit: Habit
    ):
        db.delete(habit)
        db.commit()