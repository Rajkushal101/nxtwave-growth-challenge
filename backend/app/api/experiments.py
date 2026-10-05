"""API endpoints for Experimentation, Active A/B Tests, and Exposure Tracking."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.schemas import (
    ActiveExperimentsResponse,
    ExposureRecordRequest
)
from app.services.experiments import (
    get_active_experiments,
    record_exposure
)

router = APIRouter(prefix="/api/experiments", tags=["Growth Experimentation"])

@router.get("/active", response_model=ActiveExperimentsResponse)
async def list_active_experiments(db: AsyncSession = Depends(get_db)):
    """Returns active A/B experiments and their configured variants."""
    experiments = await get_active_experiments(db)
    return ActiveExperimentsResponse(experiments=experiments)

@router.post("/exposure", status_code=status.HTTP_200_OK)
async def track_experiment_exposure(
    request: ExposureRecordRequest,
    db: AsyncSession = Depends(get_db)
):
    """Logs client exposure to an assigned experiment variant."""
    await record_exposure(
        db=db,
        experiment_id=request.experiment_id,
        variant_id=request.variant_id,
        session_id=request.session_id,
        anonymous_id=request.anonymous_id,
        user_id=request.user_id,
        is_simulation=request.is_simulation or False
    )
    return {"status": "recorded", "experiment_id": request.experiment_id, "variant_id": request.variant_id}
