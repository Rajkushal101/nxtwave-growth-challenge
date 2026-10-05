"""API router for Central Analytics, Canonical Funnels, Attribution, and Growth Intelligence."""

from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.schemas import (
    AnalyticsEventRequest,
    OverviewMetricsResponse,
    FunnelResponse,
    SourcesResponse,
    SegmentMetricsResponse,
    ProjectMetricsResponse,
    ReferralMetricsResponse,
    ExperimentsReportResponse,
    GrowthInsightsResponse,
    AskAnalyticsRequest,
    AskAnalyticsResponse
)
from app.services.analytics import (
    record_event,
    get_overview_metrics,
    get_funnel_metrics,
    get_sources_and_budget,
    get_segment_metrics,
    get_project_metrics,
    get_referral_metrics,
    get_growth_insights,
    answer_growth_question
)
from app.services.experiments import compute_experiments_report
from app.services.demo_data import seed_simulated_campaign, reset_simulated_data

router = APIRouter(prefix="/api/analytics", tags=["Growth Analytics & Intelligence"])

@router.post("/event", status_code=status.HTTP_201_CREATED)
async def track_telemetry_event(
    event: AnalyticsEventRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Central event ingestion endpoint for all client lifecycle events:
    page_view, quiz_started, project_generated, registration_completed, etc.
    """
    saved = await record_event(
        db=db,
        session_id=event.session_id,
        anonymous_id=event.anonymous_id,
        user_id=event.user_id,
        event_name=event.event_name,
        utm_source=event.utm_source,
        utm_medium=event.utm_medium,
        utm_campaign=event.utm_campaign,
        utm_content=event.utm_content,
        referral_code=event.referral_code,
        experiment_id=event.experiment_id,
        variant=event.variant,
        referrer_url=event.referrer_url,
        metadata=event.metadata,
        is_simulation=event.is_simulation or False
    )
    return {"status": "recorded", "event_id": saved.id, "event_name": saved.event_name}


@router.get("/overview", response_model=OverviewMetricsResponse)
async def get_overview(
    is_simulation: bool = Query(False, description="Filter for simulated campaign scenario"),
    days: Optional[int] = Query(None, description="Time filter in days e.g. 7"),
    db: AsyncSession = Depends(get_db)
):
    """Returns top KPI scorecards, target progress (500 goal), and viral multiplier."""
    return await get_overview_metrics(db, is_simulation=is_simulation, days=days)


@router.get("/funnel", response_model=FunnelResponse)
async def get_funnel(
    is_simulation: bool = Query(False, description="Filter for simulated campaign scenario"),
    days: Optional[int] = Query(None, description="Time filter in days e.g. 7"),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns canonical 9-stage growth funnel, stage-to-stage drop-off,
    and rule-based action hypothesis for the primary leakage bottleneck.
    """
    return await get_funnel_metrics(db, is_simulation=is_simulation, days=days)


@router.get("/sources", response_model=SourcesResponse)
async def get_acquisition_sources(
    is_simulation: bool = Query(False, description="Filter for simulated campaign scenario"),
    db: AsyncSession = Depends(get_db)
):
    """Returns acquisition channel quality, conversion rates, and ₹2,000 budget decision metrics."""
    return await get_sources_and_budget(db, is_simulation=is_simulation)


@router.get("/segments", response_model=SegmentMetricsResponse)
async def get_student_segments(
    is_simulation: bool = Query(False, description="Filter for simulated campaign scenario"),
    db: AsyncSession = Depends(get_db)
):
    """Returns student engagement, conversion, and goals segmented by Year of Study (1-4) and Branch."""
    return await get_segment_metrics(db, is_simulation=is_simulation)


@router.get("/projects", response_model=ProjectMetricsResponse)
async def get_project_analytics(
    is_simulation: bool = Query(False, description="Filter for simulated campaign scenario"),
    db: AsyncSession = Depends(get_db)
):
    """Returns project view-to-registration conversion rates and category distribution."""
    return await get_project_metrics(db, is_simulation=is_simulation)


@router.get("/referrals", response_model=ReferralMetricsResponse)
async def get_referral_analytics(
    is_simulation: bool = Query(False, description="Filter for simulated campaign scenario"),
    db: AsyncSession = Depends(get_db)
):
    """Returns viral coefficient, referral conversion rate, milestone stats, and privacy-safe leaderboard."""
    return await get_referral_metrics(db, is_simulation=is_simulation)


@router.get("/experiments", response_model=ExperimentsReportResponse)
async def get_experiments_report(
    is_simulation: bool = Query(False, description="Filter for simulated campaign scenario"),
    db: AsyncSession = Depends(get_db)
):
    """Returns A/B test results, variants, exposures, conversions, lift %, and honest signal confidence."""
    report = await compute_experiments_report(db, is_simulation=is_simulation)
    data_label = "SIMULATED DEMO DATA — 7-Day Campaign Scenario" if is_simulation else "LIVE PRODUCTION TELEMETRY"
    return ExperimentsReportResponse(
        experiments=report,
        is_simulation=is_simulation,
        data_label=data_label
    )


@router.get("/insights", response_model=GrowthInsightsResponse)
async def get_insights(
    is_simulation: bool = Query(False, description="Filter for simulated campaign scenario"),
    db: AsyncSession = Depends(get_db)
):
    """Returns prioritized growth action hypotheses strictly distinguishing DATA from HYPOTHESIS."""
    return await get_growth_insights(db, is_simulation=is_simulation)


@router.post("/ask", response_model=AskAnalyticsResponse)
async def ask_analytics_assistant(
    request: AskAnalyticsRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Safe growth assistant: answers queries strictly grounded in structured DB metrics,
    returning Observation, Interpretation, and Recommended Next Action.
    """
    return await answer_growth_question(
        db=db,
        question=request.question,
        is_simulation=request.is_simulation or False
    )


@router.post("/seed-demo")
async def seed_demo_data(db: AsyncSession = Depends(get_db)):
    """Generates a realistic 7-day campaign scenario (187 registrations towards 500 target, tagged with is_simulation=True)."""
    return await seed_simulated_campaign(db)


@router.post("/reset-demo")
async def reset_demo(db: AsyncSession = Depends(get_db)):
    """Removes all simulated demo records, keeping real test/user records completely intact."""
    return await reset_simulated_data(db)
