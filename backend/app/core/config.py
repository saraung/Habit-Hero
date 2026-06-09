from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Habit Hero API"
    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str = "sqlite:///app/db/habit_hero.db"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )


settings = Settings()