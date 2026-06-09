from datetime import date
from datetime import datetime

from pydantic import BaseModel
from pydantic import Field


class CheckInBase(BaseModel):
    habit_id: int

    checkin_date: date

    note: str | None = Field(
        default=None,
        max_length=1000
    )


class CheckInCreate(CheckInBase):
    pass


class CheckInResponse(CheckInBase):
    id: int

    created_at: datetime

    model_config = {
        "from_attributes": True
    }