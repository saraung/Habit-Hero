from collections import Counter
from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.models.habit import Habit
from app.models.checkin import CheckIn
from app.utils.streak_calculator import calculate_streak


def _expected_checkins(habit: Habit, today: date) -> int:
    """
    Calculate the number of expected check-ins for a habit
    from its start_date up to and including today.

    daily  → 1 per day
    weekly → 1 per 7 days
    """
    start = habit.start_date

    # If start date is in the future, nothing expected yet
    if start > today:
        return 0

    days_elapsed = (today - start).days + 1  # inclusive of both endpoints

    if habit.frequency == "daily":
        return days_elapsed
    elif habit.frequency == "weekly":
        return max(1, (days_elapsed + 6) // 7)  # ceiling division
    else:
        # Unknown frequency — fall back to daily
        return days_elapsed


class AnalyticsService:

    @staticmethod
    def get_analytics(db: Session):
        habits = db.query(Habit).all()
        checkins = db.query(CheckIn).all()

        today = date.today()

        total_habits = len(habits)
        total_checkins = len(checkins)

        # ── Streak ─────────────────────────────────────────────────────────
        dates = [checkin.checkin_date for checkin in checkins]
        current_streak = calculate_streak(dates)

        # ── Success Rate ────────────────────────────────────────────────────
        # actual check-ins per habit / expected check-ins per habit → average
        # Capped at 100 so we never show > 100%.
        success_rate = 0.0

        if total_habits > 0:
            total_expected = sum(
                _expected_checkins(habit, today) for habit in habits
            )

            if total_expected > 0:
                raw_rate = (total_checkins / total_expected) * 100
                success_rate = round(min(raw_rate, 100.0), 2)

        # ── Best Day ────────────────────────────────────────────────────────
        weekday_names = [
            checkin.checkin_date.strftime("%A") for checkin in checkins
        ]
        best_day = "N/A"
        if weekday_names:
            best_day = Counter(weekday_names).most_common(1)[0][0]

        # ── Category Distribution ───────────────────────────────────────────
        category_distribution = dict(
            Counter(habit.category for habit in habits)
        )

        return {
            "total_habits": total_habits,
            "total_checkins": total_checkins,
            "current_streak": current_streak,
            "success_rate": success_rate,
            "best_day": best_day,
            "category_distribution": category_distribution,
        }