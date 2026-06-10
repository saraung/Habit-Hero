"""
Tests for streak_calculator.calculate_streak()
"""
from datetime import date, timedelta

import pytest

from app.utils.streak_calculator import calculate_streak


# ── Helpers ───────────────────────────────────────────────────────────────────

def days_ago(n: int) -> date:
    """Return a date n days before today."""
    return date.today() - timedelta(days=n)


# ── Edge cases ────────────────────────────────────────────────────────────────

def test_empty_list_returns_zero():
    assert calculate_streak([]) == 0


def test_single_date_returns_one():
    assert calculate_streak([date.today()]) == 1


# ── Consecutive streaks ───────────────────────────────────────────────────────

def test_three_consecutive_days():
    dates = [days_ago(0), days_ago(1), days_ago(2)]
    assert calculate_streak(dates) == 3


def test_five_consecutive_days():
    dates = [days_ago(i) for i in range(5)]
    assert calculate_streak(dates) == 5


def test_streak_breaks_on_gap():
    # Jun 10, Jun 9, Jun 7 — gap on Jun 8 breaks the chain
    dates = [days_ago(0), days_ago(1), days_ago(3)]
    assert calculate_streak(dates) == 2


def test_only_first_consecutive_block_counts():
    # Streak is 2 (today + yesterday), then a gap, then older dates
    dates = [days_ago(0), days_ago(1), days_ago(5), days_ago(6), days_ago(7)]
    assert calculate_streak(dates) == 2


# ── Duplicate dates (multi-habit scenario) ────────────────────────────────────

def test_duplicate_dates_do_not_break_streak():
    """
    Two habits checked in on the same day must not count as a gap.
    Before the deduplication fix this would return 2 instead of 3.
    """
    dates = [
        days_ago(0),
        days_ago(1),
        days_ago(1),  # duplicate — second habit on same day
        days_ago(2),
    ]
    assert calculate_streak(dates) == 3


def test_all_same_date_returns_one():
    dates = [date.today()] * 5
    assert calculate_streak(dates) == 1


# ── Order independence ────────────────────────────────────────────────────────

def test_unsorted_input_is_handled():
    # Provide dates in random order — function must sort them internally
    dates = [days_ago(2), days_ago(0), days_ago(1)]
    assert calculate_streak(dates) == 3
