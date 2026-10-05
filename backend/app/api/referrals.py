"""API endpoints for the NxtWave Viral Growth and Referral Engine."""

import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.models.schemas import (
    RegistrationModel,
    ReferralModel,
    ReferralClickModel,
    ReferralContextResponse,
    ReferralClickRequest,
    ReferralHubResponse,
    ReferredFriendItem,
    AnalyticsEventModel
)
from app.services.milestones import calculate_milestone_progress
from app.services.catalog import get_project_by_id

router = APIRouter(prefix="/api/referrals", tags=["Viral Growth Engine"])

def _format_safe_name(full_name: str) -> str:
    """Formats 'Kartheek Sharma' into 'Kartheek S.' for public privacy."""
    parts = full_name.strip().split()
    if len(parts) >= 2:
        return f"{parts[0]} {parts[1][0]}."
    return parts[0] if parts else "Fellow Student"

@router.get("/{code}", response_model=ReferralContextResponse)
async def get_referral_context(code: str, db: AsyncSession = Depends(get_db)):
    """
    Validates a referral code and returns safe, non-sensitive context
    to display a personalized landing banner (e.g. 'Your friend is building X').
    """
    clean_code = code.strip().upper()
    res = await db.execute(
        select(RegistrationModel).where(RegistrationModel.referral_code == clean_code)
    )
    reg = res.scalar_one_or_none()

    if not reg:
        return ReferralContextResponse(
            valid=False,
            referral_code=clean_code,
            referrer_name=None,
            project_title=None,
            message="Welcome! Discover which AI project you should build."
        )

    safe_name = _format_safe_name(reg.full_name)
    return ReferralContextResponse(
        valid=True,
        referral_code=clean_code,
        referrer_name=safe_name,
        project_title=reg.project_title,
        message=f"Your friend {safe_name} is building '{reg.project_title}' with NxtWave! What AI project will YOU build?"
    )

@router.post("/click")
async def record_referral_click(
    request: ReferralClickRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Tracks incoming referral link visits, deduplicating by session_id
    to prevent repeat clicks from distorting acquisition analytics.
    """
    clean_code = request.referral_code.strip().upper()

    # Verify referral code exists
    code_check = await db.execute(
        select(RegistrationModel).where(RegistrationModel.referral_code == clean_code)
    )
    if not code_check.scalar_one_or_none():
        return {"status": "ignored", "reason": "invalid_code"}

    # Deduplicate session click
    dup_check = await db.execute(
        select(ReferralClickModel).where(
            ReferralClickModel.referral_code == clean_code,
            ReferralClickModel.session_id == request.session_id
        )
    )
    if dup_check.scalar_one_or_none():
        return {"status": "deduplicated", "referral_code": clean_code}

    click = ReferralClickModel(
        id=f"clk_{uuid.uuid4().hex[:10]}",
        referral_code=clean_code,
        session_id=request.session_id,
        utm_source=request.utm_source,
        referrer_url=request.referrer_url
    )
    db.add(click)
    db.add(AnalyticsEventModel(
        session_id=request.session_id,
        event_name="referral_click",
        referral_code=clean_code,
        utm_source=request.utm_source or "referral",
        referrer_url=request.referrer_url
    ))
    await db.commit()

    return {"status": "recorded", "referral_code": clean_code}

@router.get("/{code}/hub", response_model=ReferralHubResponse)
async def get_referral_hub(
    code: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Returns full Growth Hub data for the registered student:
    clicks, confirmed referrals, milestone progress, unlocked rewards,
    and referred peers list.
    """
    clean_code = code.strip().upper()
    reg_res = await db.execute(
        select(RegistrationModel).where(RegistrationModel.referral_code == clean_code)
    )
    student = reg_res.scalar_one_or_none()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Referral profile '{clean_code}' not found."
        )

    # 1. Total unique clicks
    click_res = await db.execute(
        select(func.count(ReferralClickModel.id)).where(ReferralClickModel.referral_code == clean_code)
    )
    total_clicks = click_res.scalar_one() or 0

    # 2. Converted referrals
    ref_res = await db.execute(
        select(ReferralModel).where(
            ReferralModel.referrer_code == clean_code,
            ReferralModel.status == "completed"
        ).order_by(ReferralModel.converted_at.desc())
    )
    converted_refs = ref_res.scalars().all()
    total_referrals = len(converted_refs)

    # 3. Build safe friend list
    referred_friends = []
    for ref in converted_refs:
        # Look up referred student's registration
        fr_res = await db.execute(
            select(RegistrationModel).where(RegistrationModel.user_id == ref.referred_user_id)
        )
        fr_reg = fr_res.scalar_one_or_none()
        friend_name = _format_safe_name(fr_reg.full_name) if fr_reg else (ref.referred_name or "Peer Engineer")
        p_title = fr_reg.project_title if fr_reg else "AI Project"
        reg_time = fr_reg.registered_at if fr_reg else ref.created_at

        referred_friends.append(ReferredFriendItem(
            name=friend_name,
            project_title=p_title,
            registered_at=reg_time,
            status="Registered"
        ))

    # 4. Milestone progress
    milestones, next_milestone = calculate_milestone_progress(total_referrals)

    # 5. Extract category & difficulty from catalog if available
    matched_catalog = None
    for p in [get_project_by_id(student.project_title)]:
        matched_catalog = p
    category = matched_catalog.get("category", "AI Engineering") if matched_catalog else "AI Engineering"
    difficulty = matched_catalog.get("difficulty", "Intermediate") if matched_catalog else "Intermediate"

    return ReferralHubResponse(
        referral_code=clean_code,
        referral_url=f"/?ref={clean_code}",
        student_name=student.full_name,
        project_title=student.project_title,
        project_category=category,
        difficulty=difficulty,
        total_clicks=total_clicks,
        total_referrals=total_referrals,
        next_milestone=next_milestone,
        milestones=milestones,
        referred_friends=referred_friends
    )
