from typing import List

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


# ─────────────────────────────────────────────────────────────────────────────
# Habit Knowledge Base
# Organised by category so TF-IDF picks up contextual similarity
# ─────────────────────────────────────────────────────────────────────────────
HABIT_LIBRARY = [
    # Health
    "Drink Water Daily",
    "Sleep Before 11 PM",
    "Take Vitamins Daily",
    "Cook a Healthy Meal",
    # Fitness
    "Morning Stretching",
    "Take a 15 Minute Walk",
    "Do 20 Push-ups Daily",
    "Yoga for Flexibility",
    # Mental Health
    "Meditation",
    "Journal Your Thoughts",
    "Practice Gratitude",
    "Digital Detox Evening",
    # Learning
    "Read 10 Pages Daily",
    "Learn One New Concept",
    "Watch an Educational Video",
    "Practice a New Language",
    # Work / Productivity
    "Practice Coding 30 Minutes",
    "Track Daily Expenses",
    "Plan Tomorrow Tonight",
    "Review Weekly Goals",
]

# Category keyword → library items mapping for hybrid boost
CATEGORY_BOOST = {
    "health":        ["Drink Water Daily", "Sleep Before 11 PM", "Take Vitamins Daily", "Cook a Healthy Meal"],
    "fitness":       ["Morning Stretching", "Take a 15 Minute Walk", "Do 20 Push-ups Daily", "Yoga for Flexibility"],
    "mental health": ["Meditation", "Journal Your Thoughts", "Practice Gratitude", "Digital Detox Evening"],
    "learning":      ["Read 10 Pages Daily", "Learn One New Concept", "Watch an Educational Video", "Practice a New Language"],
    "work":          ["Practice Coding 30 Minutes", "Track Daily Expenses", "Plan Tomorrow Tonight", "Review Weekly Goals"],
    "productivity":  ["Plan Tomorrow Tonight", "Review Weekly Goals", "Track Daily Expenses", "Practice Coding 30 Minutes"],
}


def recommend_habits(
    existing_names: List[str],
    existing_categories: List[str],
    n: int = 3,
) -> List[str]:
    """
    Returns `n` habit recommendations from HABIT_LIBRARY that the user
    doesn't already have, using a hybrid approach:

      1. TF-IDF cosine similarity on habit names  (semantic match)
      2. Category boost — uprank items matching the user's categories
      3. Deduplicate against existing habit names (case-insensitive)

    Falls back to the first `n` library items when no habits exist yet.
    """
    existing_lower = {n.lower() for n in existing_names}

    # Filter out habits the user already tracks
    candidates = [h for h in HABIT_LIBRARY if h.lower() not in existing_lower]

    if not existing_names or not candidates:
        return candidates[:n]

    # ── Step 1: TF-IDF similarity ────────────────────────────────────────────
    corpus = existing_names + candidates
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)

    user_vector  = tfidf_matrix[: len(existing_names)]
    habit_matrix = tfidf_matrix[len(existing_names):]

    # Average user profile — convert np.matrix to np.array for sklearn
    import numpy as np
    user_profile = np.asarray(user_vector.mean(axis=0))
    similarities = cosine_similarity(user_profile, habit_matrix).flatten()

    # ── Step 2: Category boost (+0.2 per matching category) ─────────────────
    cat_set = {c.lower() for c in existing_categories}
    boost = [0.0] * len(candidates)
    for i, habit in enumerate(candidates):
        for cat, boosted_habits in CATEGORY_BOOST.items():
            if cat in cat_set and habit in boosted_habits:
                boost[i] += 0.2

    final_scores = [s + b for s, b in zip(similarities, boost)]

    # ── Step 3: Rank and return top n ────────────────────────────────────────
    ranked = sorted(
        range(len(candidates)),
        key=lambda i: final_scores[i],
        reverse=True,
    )
    return [candidates[i] for i in ranked[:n]]


# ─────────────────────────────────────────────────────────────────────────────

class AIService:

    analyzer = SentimentIntensityAnalyzer()

    # ── Note Mood Analysis ───────────────────────────────────────────────────
    @staticmethod
    def analyze_note(note: str):
        scores = AIService.analyzer.polarity_scores(note)
        compound = scores["compound"]

        if compound >= 0.05:
            mood = "positive"
            recommendation = "Keep your momentum going."
        elif compound <= -0.05:
            mood = "negative"
            recommendation = "Try breaking your goal into smaller steps."
        else:
            mood = "neutral"
            recommendation = "Stay consistent and keep tracking."

        return {
            "mood": mood,
            "score": compound,
            "recommendation": recommendation,
        }

    # ── Habit Recommendations ────────────────────────────────────────────────
    @staticmethod
    def get_recommendations(habits):
        names      = [h.name for h in habits]
        categories = [h.category for h in habits]

        recommended = recommend_habits(names, categories, n=3)

        return {"recommendations": recommended}