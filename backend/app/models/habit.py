from datetime import datetime

from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship

from app.models.base import Base


class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    frequency = Column(String(20), nullable=False)

    category = Column(String(50), nullable=False)

    start_date = Column(Date, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    checkins = relationship(
        "CheckIn",
        back_populates="habit",
        cascade="all, delete-orphan"
    )