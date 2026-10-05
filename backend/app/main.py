from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, AsyncSessionLocal
# Import all models so that SQLAlchemy metadata is fully populated before create_all
import app.models.schemas  # noqa: F401
from app.services.experiments import ensure_default_experiments_and_budgets

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Database table creation and initial seed on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Initialize default A/B experiments and campaign budgets
    async with AsyncSessionLocal() as session:
        await ensure_default_experiments_and_budgets(session)

    yield
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for NxtWave Growth Challenge — 'What's Your AI Project?' & Phase 4 Growth Engine",
    version="1.0.0",
    lifespan=lifespan
)

from app.api.recommend import router as recommend_router
from app.api.registration import router as registration_router
from app.api.referrals import router as referrals_router
from app.api.analytics import router as analytics_router
from app.api.experiments import router as experiments_router

import logging
from fastapi import Request
from fastapi.responses import JSONResponse

logger = logging.getLogger("nxtwave.api")

app.include_router(recommend_router)
app.include_router(registration_router)
app.include_router(referrals_router)
app.include_router(analytics_router)
app.include_router(experiments_router)

# Enable secure CORS for allowed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_unhandled_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler to mask internal tracebacks, SQL errors,
    and sensitive server details from being exposed to clients.
    """
    logger.error(f"Unhandled error processing {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again."}
    )

@app.get("/api/health", tags=["System"])
async def health_check():
    """Health check endpoint to verify backend status."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "database": "sqlite_ready",
        "phase": "Phase 5 - Final Polish, Security, QA & Demo Ready",
        "target_registrations": settings.TARGET_REGISTRATIONS,
        "campaign_budget_inr": settings.CAMPAIGN_BUDGET
    }

@app.get("/", tags=["System"])
async def root():
    return {
        "message": "NxtWave Growth Challenge API is live (Phase 5).",
        "docs": "/docs",
        "health": "/api/health"
    }
