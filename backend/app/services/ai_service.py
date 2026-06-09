from vaderSentiment.vaderSentiment import (
    SentimentIntensityAnalyzer
)


class AIService:

    analyzer = (
        SentimentIntensityAnalyzer()
    )

    @staticmethod
    def analyze_note(
        note: str
    ):
        scores = (
            AIService.analyzer
            .polarity_scores(note)
        )

        compound = scores["compound"]

        if compound >= 0.05:
            mood = "positive"
            recommendation = (
                "Keep your momentum going."
            )

        elif compound <= -0.05:
            mood = "negative"
            recommendation = (
                "Try breaking your goal into smaller steps."
            )

        else:
            mood = "neutral"
            recommendation = (
                "Stay consistent and keep tracking."
            )

        return {
            "mood": mood,
            "score": compound,
            "recommendation": recommendation
        }