from collections import Counter

from sqlalchemy.orm import Session

from app.models.habit import Habit
from app.models.checkin import CheckIn
from app.utils.streak_calculator import calculate_streak


class AnalyticsService:

    @staticmethod
    def get_analytics(
        db: Session
    ):
        habits = db.query(Habit).all()

        checkins = db.query(CheckIn).all()

        total_habits = len(habits)

        total_checkins = len(checkins)

        dates = [
            checkin.checkin_date
            for checkin in checkins
        ]

        current_streak = calculate_streak(
            dates
        )

        success_rate = 0.0

        if total_habits > 0:
            success_rate = round(
                (
                    total_checkins
                    / total_habits
                ) * 100,
                2
            )

        weekday_names = [
            checkin.checkin_date.strftime("%A")
            for checkin in checkins
        ]

        best_day = "N/A"

        if weekday_names:
            best_day = Counter(
                weekday_names
            ).most_common(1)[0][0]

        return {
            "total_habits": total_habits,
            "total_checkins": total_checkins,
            "current_streak": current_streak,
            "success_rate": success_rate,
            "best_day": best_day
        }