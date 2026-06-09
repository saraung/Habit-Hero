from sqlalchemy.orm import Session

from app.models.checkin import CheckIn
from app.schemas.checkin import CheckInCreate


class CheckInRepository:

    @staticmethod
    def create(
        db: Session,
        checkin_data: CheckInCreate
    ):
        checkin = CheckIn(
            habit_id=checkin_data.habit_id,
            checkin_date=checkin_data.checkin_date,
            note=checkin_data.note
        )

        db.add(checkin)
        db.commit()
        db.refresh(checkin)

        return checkin

    @staticmethod
    def get_by_habit(
        db: Session,
        habit_id: int
    ):
        return (
            db.query(CheckIn)
            .filter(CheckIn.habit_id == habit_id)
            .order_by(CheckIn.checkin_date.desc())
            .all()
        )

    @staticmethod
    def get_all(db: Session):
        return db.query(CheckIn).all()