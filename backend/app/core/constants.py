from enum import Enum


class HabitFrequency(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"


class HabitCategory(str, Enum):
    HEALTH = "health"
    WORK = "work"
    LEARNING = "learning"
    PRODUCTIVITY = "productivity"
    FITNESS = "fitness"
    MENTAL_HEALTH = "mental_health"


class MoodType(str, Enum):
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"