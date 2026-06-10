# 🦸 Habit Hero

A full-stack habit tracking application with AI-powered mood analysis and personalised habit recommendations.

🌐 **Frontend:** https://habithero.saraung.com
⚙️ **API:** https://habitapi.saraung.com

---

## ✨ Features

**Habit Management**
- Create habits with a name, category, frequency (daily / weekly), and start date
- Categories: Health, Fitness, Mental Health, Learning, Work, Productivity
- Delete habits — cascades and removes all associated check-ins

**Check-ins**
- Log a check-in for any habit on any date
- Optionally add a note describing how it went
- View full check-in history sorted by most recent

**AI Mood Analysis**
- Notes are automatically analysed on submit — no button click needed
- Detects mood as Positive 😊 / Neutral 😐 / Negative 😔 using VADER sentiment
- Shows a score bar and a personalised recommendation
- Runs fully offline — no external API key required

**AI Habit Recommendations**
- Personalised suggestions based on what you already track
- Uses TF-IDF cosine similarity on habit names with a category boost
- One-click Add button to pre-fill the Create Habit form

**Analytics Dashboard**
- Total habits and total check-ins counters
- Current streak — consecutive days with at least one check-in
- Success rate — actual vs expected check-ins as a percentage gauge
- Best day — the weekday you check in most
- Category distribution chart
- Export as PDF report

---

## 🗂️ Project Structure

```
Habit Hero/
├── backend/
│   ├── app/
│   │   ├── api/v1/        # Route handlers (habits, checkins, analytics, ai)
│   │   ├── core/          # Config, database engine
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── schemas/       # Pydantic request/response schemas
│   │   ├── services/      # Business logic (AI, analytics)
│   │   └── utils/         # Streak calculator, validators
│   ├── pyproject.toml
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/            # Axios API clients
    │   ├── components/
    │   ├── hooks/          # Data-fetching hooks
    │   ├── pages/          # Dashboard, Analytics, AI pages
    │   └── utils/
    └── package.json
```

---

## 🚀 Local Setup

### Prerequisites

- **Python** ≥ 3.14
- **uv** (Python package manager) — see install below
- **Node.js** ≥ 18
- **npm** ≥ 9

Install `uv`:

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/habit-hero.git
cd "habit-hero"
```

---

### 2. Backend Setup

```bash
cd backend
```

Create a `.env` file inside the `backend/` folder:

```env
# backend/.env

# Default — SQLite, no extra setup needed
DATABASE_URL=sqlite:///app/db/habit_hero.db

# Optional — PostgreSQL (only if running Postgres locally)
# DATABASE_URL=postgresql://user:password@localhost:5432/habithero
```

**Run with `uv` (recommended):**

```bash
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Run with pip (alternative):**

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be running at:

- `http://localhost:8000` — base URL
- `http://localhost:8000/docs` — Swagger UI
- `http://localhost:8000/redoc` — Redoc

The SQLite database is created automatically at `backend/app/db/habit_hero.db` on first run.

---

### 3. Frontend Setup

Open a **new terminal:**

```bash
cd frontend
```

Create a `.env` file inside the `frontend/` folder:

```env
# frontend/.env

# Local backend (default)
VITE_API_URL=http://localhost:8000/api/v1

# Production backend (uncomment to point at the live API)
# VITE_API_URL=https://habitapi.saraung.com/api/v1
```

Install dependencies and start:

```bash
npm install
npm run dev
```

App runs at **`http://localhost:5173`**

---

## 🔑 Environment Variables

### `backend/.env`

- `DATABASE_URL` *(optional)* — database connection string
  - Default: `sqlite:///app/db/habit_hero.db`
  - For PostgreSQL: `postgresql://user:password@host:5432/dbname`

### `frontend/.env`

- `VITE_API_URL` *(required)* — full base URL of the backend API
  - Local: `http://localhost:8000/api/v1`
  - Production: `https://habitapi.saraung.com/api/v1`

---

## 📡 API Endpoints

All routes are prefixed with `/api/v1`.

**Habits**
- `GET    /habits` — list all habits
- `POST   /habits` — create a habit
- `GET    /habits/{id}` — get a single habit
- `DELETE /habits/{id}` — delete a habit

**Check-ins**
- `GET  /checkins?habit_id={id}` — list check-ins for a habit
- `POST /checkins` — add a check-in

**Analytics**
- `GET /analytics` — aggregated stats (streak, success rate, best day, etc.)

**AI**
- `POST /ai/analyze-note` — analyse mood from a note string
- `GET  /ai/recommendations` — personalised habit recommendations

---

## 🗄️ Database

**Local (SQLite)**
- No setup needed — file is created automatically on first run
- Location: `backend/app/db/habit_hero.db`
- To reset: delete the `.db` file and restart the server

**Production (PostgreSQL on Railway)**
- Set `DATABASE_URL` to a `postgresql://...` connection string
- The app automatically uses `psycopg` v3 as the driver

---

## 🛠️ Tech Stack

**Backend**
- FastAPI — REST API framework
- SQLAlchemy — ORM
- Pydantic v2 — data validation & serialisation
- uvicorn — ASGI server
- vaderSentiment — offline mood/sentiment analysis
- scikit-learn — TF-IDF for habit recommendations
- psycopg v3 — PostgreSQL driver

**Frontend**
- React 19 — UI framework
- Vite 8 — build tool & dev server
- Tailwind CSS v4 — utility-first styling
- React Router v7 — client-side routing
- Axios — HTTP client
- Recharts — analytics charts
- Lucide React — icons
- jsPDF + autoTable — PDF export

---

## 🧪 Running Tests

Tests live in `backend/tests/` and cover the core business logic:

- `test_streak_calculator.py` — streak counting, deduplication, gap detection, order independence
- `test_ai_service.py` — mood classification (positive / neutral / negative), score range, response shape
- `test_recommendations.py` — TF-IDF engine, deduplication, cold start, exhausted candidates

```bash
cd backend

# With uv
uv run pytest

# With pip / venv
pytest

# Verbose output
pytest -v
```

---

## 📦 Building for Production

```bash
cd frontend
npm run build
# Output is in frontend/dist/
```

---

## 📄 License

MIT
