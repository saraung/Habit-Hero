from pydantic import BaseModel


class AnalyticsResponse(BaseModel):
    total_habits: int

    total_checkins: int

    current_streak: int

    success_rate: float

    best_day: str