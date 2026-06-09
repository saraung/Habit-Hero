from datetime import date
from datetime import datetime

from pydantic import BaseModel
from pydantic import Field


class HabitBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)

    frequency: str

    category: str

    start_date: date


class HabitCreate(HabitBase):
    pass


class HabitUpdate(BaseModel):
    name: str | None = None

    frequency: str | None = None

    category: str | None = None

    start_date: date | None = None


class HabitResponse(HabitBase):
    id: int

    created_at: datetime

    updated_at: datetime

    model_config = {
        "from_attributes": True
    }