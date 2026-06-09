from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base
from app.core.database import engine

# Import models so SQLAlchemy can detect them
from app.models.habit import Habit
from app.models.checkin import CheckIn


from app.api.v1.habits import router as habits_router
from app.api.v1.checkins import router as checkins_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.ai import router as ai_router


# Create database tables automatically
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Habit Hero API",
    version="1.0.0",
    description="""
    Habit Hero Backend API

    Features:
    - Habit Management
    - Check-in Tracking
    - Analytics
    - AI Mood Analysis
    """
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health Check
@app.get("/")
def root():
    return {
        "message": "Habit Hero API Running"
    }


# Register Routers
app.include_router(
    habits_router,
    prefix=settings.API_V1_PREFIX
)

app.include_router(
    checkins_router,
    prefix=settings.API_V1_PREFIX
)

app.include_router(
    analytics_router,
    prefix=settings.API_V1_PREFIX
)

app.include_router(
    ai_router,
    prefix=settings.API_V1_PREFIX
)