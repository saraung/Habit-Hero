# Habit Hero — Project Documentation

---

## 1. Problem Statement

Building and maintaining good habits is difficult. People often start strong but lose track because:

- There is no easy way to log daily progress across multiple habits
- Feedback on progress is delayed, vague, or non-existent
- There is no personalised guidance on what habits to try next
- Emotional state during check-ins goes unrecorded, making it hard to spot patterns

Existing apps are either too complex, require subscriptions for AI features, or don't connect mood data with habit performance.

---

## 2. Solution Overview

Habit Hero is a lightweight, full-stack habit tracker that solves these problems with three core ideas:

**Frictionless tracking** — Users log habits with a single check-in per day. Notes are optional but add depth.

**Built-in AI — no API key needed** — Mood analysis runs locally using VADER sentiment analysis. Habit recommendations use TF-IDF cosine similarity. Both work offline and have zero cost per request.

**Actionable analytics** — A dedicated analytics page shows streak, success rate, best performing day, and category distribution — all derived from real check-in data.

The app is built as a decoupled architecture: a React frontend communicates with a FastAPI backend over a REST API. Locally it uses SQLite with zero setup. In production it connects to a PostgreSQL database on Railway.

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  User's Browser                     │
│                                                     │
│   React 19 + Vite + Tailwind CSS v4                 │
│   habithero.saraung.com                             │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / REST (Axios)
                       │ VITE_API_URL → /api/v1
                       ▼
┌─────────────────────────────────────────────────────┐
│               FastAPI Backend                       │
│               habitapi.saraung.com                  │
│                                                     │
│   Routers → Services → Repositories → Models       │
│                                                     │
│   AI: VADER (mood) + TF-IDF (recommendations)      │
│   ORM: SQLAlchemy                                   │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
   SQLite (local dev)       PostgreSQL (production)
   habit_hero.db             Railway managed DB
```

**Request flow:**

1. User action in React triggers an Axios call
2. FastAPI router validates the request via Pydantic schemas
3. Service layer runs business logic
4. Repository / ORM layer queries SQLAlchemy
5. Response is serialised by Pydantic and returned as JSON
6. React updates state and re-renders

---

## 4. Frontend Structure

**Tech:** React 19, Vite 8, Tailwind CSS v4, React Router v7, Axios, Recharts, Lucide React, jsPDF

```
frontend/src/
├── api/
│   ├── axiosClient.js          # Axios instance with base URL from env
│   ├── habitsApi.js            # CRUD calls for habits
│   ├── checkinsApi.js          # Check-in create and list
│   ├── analyticsApi.js         # GET /analytics
│   └── aiApi.js                # analyze-note + recommendations
│
├── hooks/
│   ├── useHabits.js            # Habits list state + refetch
│   ├── useCheckins.js          # Per-habit check-ins + addCheckin
│   ├── useAnalytics.js         # Analytics data + refresh
│   └── useRecommendations.js   # AI recommendations + refresh
│
├── pages/
│   ├── Dashboard.jsx           # Habit list, create button
│   ├── HabitDetails.jsx        # Check-in form + history
│   ├── Analytics.jsx           # Stats cards, charts, PDF export
│   └── AIRecommendations.jsx   # Recommendation cards + how-it-works
│
├── components/
│   ├── common/                 # Button, Card, Loader, etc.
│   ├── checkins/
│   │   ├── CheckinForm.jsx         # Date + note form, triggers AI on submit
│   │   ├── CheckinHistory.jsx      # Sorted list of past check-ins
│   │   └── NoteAnalysisResult.jsx  # Animated mood result card
│   ├── habits/                 # HabitCard, HabitList, CreateHabitForm
│   └── analytics/              # CategoryChart, SuccessRateChart, StreakCard
│
└── utils/
    ├── constants.js            # Category badge colours, frequency labels
    └── dateUtils.js            # formatDate, timeAgo, sortByDateDesc
```

**Routing** (React Router v7):

- `/` — Dashboard
- `/habits/new` — Create habit form
- `/habits/:id` — Habit details + check-in form
- `/analytics` — Analytics dashboard
- `/ai` — AI recommendations

**Environment variable:**

```
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 5. Backend Structure

**Tech:** FastAPI, SQLAlchemy, Pydantic v2, uvicorn, VADER, scikit-learn, psycopg v3

```
backend/app/
├── main.py                    # App factory, CORS, router registration
│
├── core/
│   ├── config.py              # Pydantic Settings — reads DATABASE_URL from .env
│   ├── database.py            # Engine creation (SQLite vs PostgreSQL), get_db
│   └── constants.py           # HabitFrequency, HabitCategory, MoodType enums
│
├── models/
│   ├── habit.py               # Habit ORM model (id, name, frequency, category, start_date)
│   └── checkin.py             # CheckIn ORM model (id, habit_id FK, checkin_date, note)
│
├── schemas/
│   ├── habit.py               # HabitCreate, HabitUpdate, HabitResponse
│   └── checkin.py             # CheckInCreate, CheckInResponse
│
├── repositories/              # Raw DB query layer (used by services)
│
├── services/
│   ├── habit_service.py       # CRUD logic for habits
│   ├── checkin_service.py     # Check-in creation and listing
│   ├── analytics_service.py   # Streak, success rate, best day, category distribution
│   └── ai_service.py          # VADER mood analysis + TF-IDF recommendations
│
├── api/v1/
│   ├── habits.py              # GET/POST/PUT/DELETE /habits
│   ├── checkins.py            # GET/POST /checkins
│   ├── analytics.py           # GET /analytics
│   └── ai.py                  # POST /ai/analyze-note, GET /ai/recommendations
│
└── utils/
    ├── streak_calculator.py   # calculate_streak() — deduplicated consecutive day counter
    ├── date_utils.py          # Shared date helpers
    └── validators.py          # validate_frequency()
```

**Database auto-creation:** `Base.metadata.create_all(bind=engine)` runs on startup, so no migrations are needed for fresh installs.

**Database switching logic** (`database.py`):

```python
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

if db_url.startswith("sqlite"):
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
else:
    engine = create_engine(db_url)
```

This means the same codebase runs on SQLite locally and PostgreSQL in production with no code changes — only `DATABASE_URL` in the environment differs.

---

## 6. AI Features

### 6.1 Mood Analysis

**Library:** `vaderSentiment` (Valence Aware Dictionary and sEntiment Reasoner)

**Endpoint:** `POST /api/v1/ai/analyze-note`

**Input:** `{ "note": "string" }`

**Output:**
```json
{
  "mood": "positive" | "neutral" | "negative",
  "score": -1.0 to 1.0,
  "recommendation": "string"
}
```

**Classification thresholds:**

```
compound ≥  0.05  →  positive  →  "Keep your momentum going."
compound ≤ -0.05  →  negative  →  "Try breaking your goal into smaller steps."
otherwise         →  neutral   →  "Stay consistent and keep tracking."
```

**How it is triggered in the frontend:**

When the user submits a check-in that has a note (≥ 5 characters), `CheckinForm` automatically calls `analyzeNote()` in the background after the check-in is saved. No button click is required. A shimmer skeleton is shown while the AI processes, then the animated `NoteAnalysisResult` card slides in with the mood, score bar, and recommendation.

**Advantages:** VADER works offline, requires no API key, adds zero cost per request, and is fast enough for real-time use.

---

### 6.2 Habit Recommendations

**Endpoint:** `GET /api/v1/ai/recommendations`

**Output:** `{ "recommendations": ["Habit A", "Habit B", "Habit C"] }`

**Algorithm — hybrid TF-IDF + Category Boost:**

**Step 1 — Filter existing habits**

Any library habit the user already tracks is removed (case-insensitive).

**Step 2 — TF-IDF cosine similarity**

The user's habit names and the candidate library habits are combined into a single corpus. `TfidfVectorizer` builds a term-frequency matrix. The user's habits are averaged into a single profile vector. Cosine similarity between the user profile and each candidate produces a relevance score.

**Step 3 — Category boost**

Library items that belong to the same categories the user already tracks receive a `+0.2` score bonus. This ensures that if a user tracks fitness habits, other fitness habits are ranked higher even if their names have low textual similarity.

**Step 4 — Rank and return top 3**

The final scores are sorted descending and the top 3 candidates are returned.

**Habit knowledge base** (20 curated habits across 5 categories):

```
Health:        Drink Water Daily, Sleep Before 11 PM, Take Vitamins Daily, Cook a Healthy Meal
Fitness:       Morning Stretching, Take a 15 Minute Walk, Do 20 Push-ups Daily, Yoga for Flexibility
Mental Health: Meditation, Journal Your Thoughts, Practice Gratitude, Digital Detox Evening
Learning:      Read 10 Pages Daily, Learn One New Concept, Watch an Educational Video, Practice a New Language
Work:          Practice Coding 30 Minutes, Track Daily Expenses, Plan Tomorrow Tonight, Review Weekly Goals
```

---

## 7. Analytics Logic

All analytics are computed server-side in `AnalyticsService.get_analytics()` and returned in a single `GET /api/v1/analytics` call.

**Total Habits** — `len(habits)` — direct count of all habit rows.

**Total Check-ins** — `len(checkins)` — direct count of all check-in rows.

**Current Streak** (`streak_calculator.py`)

1. Collect all `checkin_date` values across every habit
2. Deduplicate with `set()` — prevents multiple habits on the same day from breaking the chain
3. Sort descending (most recent first)
4. Walk from today backwards: count consecutive days where the difference between adjacent dates is exactly 1 day, stop at the first gap

```python
sorted_dates = sorted(set(checkin_dates), reverse=True)
streak = 1
for i in range(len(sorted_dates) - 1):
    if sorted_dates[i] - sorted_dates[i + 1] == timedelta(days=1):
        streak += 1
    else:
        break
```

**Success Rate**

For each habit, the expected number of check-ins is calculated from its `start_date` to today:
- Daily habit: `days_elapsed`
- Weekly habit: `ceil(days_elapsed / 7)`

```
success_rate = (total_actual_checkins / total_expected_checkins) × 100
```

Capped at 100% to handle catch-up check-ins.

**Best Day** — weekday name that appears most frequently across all check-in dates, using `Counter.most_common(1)`.

**Category Distribution** — `Counter` over all habit categories, returned as a dict for the frontend pie/bar chart.

---

## 8. Deployment Details

**Frontend**
- Hosted at `https://habithero.saraung.com`
- Built with `npm run build`, output in `frontend/dist/`
- `VITE_API_URL` is set to `https://habitapi.saraung.com/api/v1`

**Backend**
- Hosted at `https://habitapi.saraung.com`
- Deployed on Railway
- `DATABASE_URL` set to Railway's managed PostgreSQL connection string (starts with `postgresql://`, automatically rewritten to `postgresql+psycopg://` at runtime)
- CORS is open (`allow_origins=["*"]`) since the app has no authentication layer

**Database**
- Local: SQLite at `backend/app/db/habit_hero.db` (auto-created on startup)
- Production: PostgreSQL on Railway (tables auto-created via `Base.metadata.create_all`)

**Python version:** 3.14+ (specified in `backend/.python-version`)

**Dependency management:** `uv` with `pyproject.toml` as the source of truth. `requirements.txt` is provided as a pip fallback.

---

## 9. Future Enhancements

**Authentication**
- Add user accounts (JWT or session-based) so multiple users can track their own habits independently
- Each habit and check-in would be scoped to a user ID

**Streak Freeze**
- Allow users to mark a missed day as excused without breaking their streak
- Useful for planned rest days or travel

**Habit Reminders**
- Push notifications or email reminders at a user-defined time each day
- Could use a background task scheduler (e.g., APScheduler or Celery)

**Historical Mood Trends**
- Store the mood result alongside each check-in in the database
- Surface a mood-over-time chart in analytics to show emotional patterns

**Richer AI Recommendations**
- Expand the habit knowledge base beyond 20 items
- Factor in streak performance and category success rate into the recommendation score
- Allow users to dismiss or pin recommendations

**Habit Completion Goals**
- Let users define a target (e.g., 30-day challenge) with a progress bar and milestone notifications

**Mobile App**
- React Native or a PWA wrapper so the app installs on mobile with offline support

**Export Options**
- CSV export of full check-in history alongside the existing PDF analytics report
