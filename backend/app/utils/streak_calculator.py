from datetime import timedelta


def calculate_streak(checkin_dates):
    if not checkin_dates:
        return 0

    sorted_dates = sorted(
        checkin_dates,
        reverse=True
    )

    streak = 1

    for i in range(
        len(sorted_dates) - 1
    ):
        current_date = sorted_dates[i]
        next_date = sorted_dates[i + 1]

        if current_date - next_date == timedelta(days=1):
            streak += 1
        else:
            break

    return streak