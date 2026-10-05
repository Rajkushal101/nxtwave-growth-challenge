import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "NxtWave Growth Challenge")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "nxtwave-growth-challenge-secret-key-2026")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./growth_challenge.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    AI_MODEL_NAME: str = os.getenv("AI_MODEL_NAME", "gemini-1.5-flash")
    TARGET_REGISTRATIONS: int = int(os.getenv("TARGET_REGISTRATIONS", "500"))
    CAMPAIGN_BUDGET: int = int(os.getenv("CAMPAIGN_BUDGET", "2000"))
    CORS_ORIGINS: list = [
        origin.strip() for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,http://localhost:8002,http://127.0.0.1:8002,http://localhost:8000,http://127.0.0.1:8000"
        ).split(",") if origin.strip()
    ]

settings = Settings()
