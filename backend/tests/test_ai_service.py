"""
Tests for AIService.analyze_note() mood detection.
"""
import pytest

from app.services.ai_service import AIService


# ── Return shape ──────────────────────────────────────────────────────────────

def test_analyze_note_returns_required_keys():
    result = AIService.analyze_note("I feel great today!")
    assert "mood" in result
    assert "score" in result
    assert "recommendation" in result


def test_score_is_float():
    result = AIService.analyze_note("Today was okay.")
    assert isinstance(result["score"], float)


def test_score_is_within_vader_range():
    result = AIService.analyze_note("This is a test.")
    assert -1.0 <= result["score"] <= 1.0


# ── Mood classification ───────────────────────────────────────────────────────

def test_positive_note_returns_positive_mood():
    result = AIService.analyze_note(
        "Amazing day! I feel fantastic and full of energy!"
    )
    assert result["mood"] == "positive"


def test_negative_note_returns_negative_mood():
    result = AIService.analyze_note(
        "Terrible day, I feel exhausted and really awful."
    )
    assert result["mood"] == "negative"


def test_neutral_note_returns_neutral_mood():
    result = AIService.analyze_note("I did the task.")
    assert result["mood"] == "neutral"


# ── Mood values are valid ─────────────────────────────────────────────────────

def test_mood_value_is_one_of_three():
    for note in [
        "I love this!",
        "It was fine.",
        "I hate feeling stuck.",
    ]:
        result = AIService.analyze_note(note)
        assert result["mood"] in ("positive", "neutral", "negative")


# ── Recommendation is non-empty string ───────────────────────────────────────

def test_recommendation_is_non_empty_string():
    result = AIService.analyze_note("Good progress today.")
    assert isinstance(result["recommendation"], str)
    assert len(result["recommendation"]) > 0
