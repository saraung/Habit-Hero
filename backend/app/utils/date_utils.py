from datetime import date


def today() -> date:
    return date.today()


def date_to_string(value: date) -> str:
    return value.strftime("%Y-%m-%d")