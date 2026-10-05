"""API endpoints for Workshop Registration and Unique Referral Code Generation."""

import re
import random
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

import json
from app.core.database import get_db
from app.models.schemas import (
    RegistrationRequest,
    RegistrationResponse,
    UserModel,
    ProjectRecommendationModel,
    RegistrationModel,
    ReferralModel,
    AnalyticsEventModel
)

router = APIRouter(prefix="/api", tags=["Workshop Registration"])

def _generate_referral_code(full_name: str) -> str:
    """Generates a clean, readable referral code like 'KARTHEEK7' or 'PRIYA9'."""
    clean_name = re.sub(r'[^A-Za-z]', '', full_name).upper()
    prefix = clean_name[:6] if len(clean_name) >= 3 else "NXT"
    suffix = random.randint(10, 99)
    return f"{prefix}{suffix}"

@router.post("/register", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
async def register_student(
    request: RegistrationRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Registers a student for the free 60-minute workshop, links their matched project,
    generates a unique referral code, and establishes referral attribution.
    """
    # 1. Validate User exists
    user_res = await db.execute(select(UserModel).where(UserModel.id == request.user_id))
    user = user_res.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found. Please complete the AI Project Matcher first."
        )

    # 2. Check if student already registered with this email
    existing_reg_res = await db.execute(
        select(RegistrationModel).where(RegistrationModel.email == request.email.lower().strip())
    )
    existing_reg = existing_reg_res.scalar_one_or_none()
    if existing_reg:
        return RegistrationResponse(
            id=existing_reg.id,
            user_id=existing_reg.user_id,
            full_name=existing_reg.full_name,
            email=existing_reg.email,
            college_name=existing_reg.college_name,
            project_title=existing_reg.project_title,
            referral_code=existing_reg.referral_code,
            referral_url=f"/r/{existing_reg.referral_code}",
            registered_at=existing_reg.registered_at,
            message="Welcome back! You are already registered for the workshop."
        )

    # 3. Retrieve student's matched project title
    rec_res = await db.execute(
        select(ProjectRecommendationModel)
        .where(ProjectRecommendationModel.user_id == request.user_id)
        .order_by(ProjectRecommendationModel.generated_at.desc())
    )
    latest_rec = rec_res.scalar_one_or_none()
    project_title = latest_rec.project_title if latest_rec else "AI Personal Project"

    # 4. Generate unique referral code
    referral_code = _generate_referral_code(request.full_name)
    # Check collision (rare)
    code_check = await db.execute(select(RegistrationModel).where(RegistrationModel.referral_code == referral_code))
    if code_check.scalar_one_or_none():
        referral_code = f"{referral_code}{random.randint(1, 9)}"

    # 6. Referral Attribution & Anti-Abuse Logic
    valid_referred_by = None
    if request.referred_by_code:
        clean_ref_code = request.referred_by_code.strip().upper()

        # Check 1: Prevent direct self-referral to newly generated code
        if clean_ref_code != referral_code:
            # Check 2: Verify referrer code exists in registrations
            referrer_res = await db.execute(
                select(RegistrationModel).where(RegistrationModel.referral_code == clean_ref_code)
            )
            referrer = referrer_res.scalar_one_or_none()

            # Check 3: Prevent self-referral by email match
            if referrer and referrer.email.lower() != request.email.lower().strip():
                # Check 4: Prevent duplicate referral conversion for this user
                existing_conversion_res = await db.execute(
                    select(ReferralModel).where(
                        ReferralModel.referrer_code == clean_ref_code,
                        ReferralModel.referred_user_id == request.user_id
                    )
                )
                if not existing_conversion_res.scalar_one_or_none():
                    valid_referred_by = clean_ref_code
                    ref_entry = ReferralModel(
                        id=f"ref_{uuid.uuid4().hex[:10]}",
                        referrer_code=clean_ref_code,
                        referred_user_id=request.user_id,
                        referred_name=request.full_name.strip(),
                        status="completed",
                        created_at=datetime.utcnow(),
                        converted_at=datetime.utcnow()
                    )
                    db.add(ref_entry)

    # 5. Create Registration Record
    reg_id = f"reg_{uuid.uuid4().hex[:10]}"
    registration = RegistrationModel(
        id=reg_id,
        user_id=request.user_id,
        full_name=request.full_name.strip(),
        email=request.email.lower().strip(),
        whatsapp_number=request.whatsapp_number.strip(),
        college_name=request.college_name.strip(),
        project_title=project_title,
        referral_code=referral_code,
        referred_by_code=valid_referred_by,
        registered_at=datetime.utcnow()
    )
    db.add(registration)

    # Telemetry events for Phase 4 Funnel
    db.add(AnalyticsEventModel(
        session_id=request.session_id,
        user_id=request.user_id,
        event_name="registration_completed",
        referral_code=referral_code,
        metadata_json=json.dumps({"project_title": project_title, "college": request.college_name})
    ))
    db.add(AnalyticsEventModel(
        session_id=request.session_id,
        user_id=request.user_id,
        event_name="referral_code_generated",
        referral_code=referral_code
    ))
    if valid_referred_by:
        db.add(AnalyticsEventModel(
            session_id=request.session_id,
            user_id=request.user_id,
            event_name="referral_registration",
            referral_code=valid_referred_by
        ))

    await db.commit()

    return RegistrationResponse(
        id=reg_id,
        user_id=request.user_id,
        full_name=registration.full_name,
        email=registration.email,
        college_name=registration.college_name,
        project_title=project_title,
        referral_code=referral_code,
        referral_url=f"/r/{referral_code}",
        registered_at=registration.registered_at,
        message="Registration confirmed! You're officially enrolled in 'Build Your First AI Project in 60 Minutes'."
    )
