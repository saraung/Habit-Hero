"""
Tests for recommend_habits() — TF-IDF + category boost recommendation engine.
"""
import pytest

from app.services.ai_service import recommend_habits, HABIT_LIBRARY


# ── Return shape ──────────────────────────────────────────────────────────────

def test_returns_list():
    result = recommend_habits([], [], n=3)
    assert isinstance(result, list)


def test_returns_n_items_when_enough_candidates():
    result = recommend_habits([], [], n=3)
    assert len(result) == 3


def test_returns_fewer_when_candidates_exhausted():
    # Pass almost all library items as existing — very few left to recommend
    all_but_one = HABIT_LIBRARY[:-1]
    result = recommend_habits(all_but_one, [], n=5)
    assert len(result) <= 1


# ── Deduplication ─────────────────────────────────────────────────────────────

def test_does_not_recommend_existing_habits():
    existing = ["Meditation", "Read 10 Pages Daily"]
    result = recommend_habits(existing, [], n=3)
    for rec in result:
        assert rec not in existing


def test_case_insensitive_deduplication():
    existing = ["meditation"]  # lowercase variant
    result = recommend_habits(existing, [], n=3)
    lower_results = [r.lower() for r in result]
    assert "meditation" not in lower_results


# ── Cold start (no existing habits) ──────────────────────────────────────────

def test_cold_start_returns_library_items():
    result = recommend_habits([], [], n=3)
    for rec in result:
        assert rec in HABIT_LIBRARY


# ── All library items already tracked ────────────────────────────────────────

def test_returns_empty_when_all_habits_tracked():
    result = recommend_habits(HABIT_LIBRARY, [], n=3)
    assert result == []
