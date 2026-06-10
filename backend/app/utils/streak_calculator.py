from datetime import timedelta


def calculate_streak(checkin_dates):
    if not checkin_dates:
        return 0

    # Deduplicate first — multiple habits checked in on the same day
    # would otherwise produce consecutive identical dates (diff = 0 days)
    # which breaks the chain even though the streak is intact.
    sorted_dates = sorted(
        set(checkin_dates),
        reverse=True
    )

    streak = 1

    for i in range(len(sorted_dates) - 1):
        current_date = sorted_dates[i]
        next_date = sorted_dates[i + 1]

        if current_date - next_date == timedelta(days=1):
            streak += 1
        else:
            break

    return streak