from app.core.constants import HabitFrequency


def validate_frequency(
    frequency: str
):
    valid_frequencies = [
        HabitFrequency.DAILY,
        HabitFrequency.WEEKLY
    ]

    return frequency in valid_frequencies