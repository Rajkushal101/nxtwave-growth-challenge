"""Experimentation Service: Manages A/B Tests, Deterministic Variant Assignment, and Signal Analytics."""

import json
import hashlib
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.models.schemas import (
    ExperimentModel,
    ExperimentVariantModel,
    ExperimentExposureModel,
    AnalyticsEventModel,
    CampaignBudgetModel,
    ExperimentReportItem,
    ExperimentVariantStats,
    ActiveExperimentDetail,
    VariantDetail
)

DEFAULT_EXPERIMENTS = [
    {
        "id": "exp_project_cta",
        "name": "Project-Focused CTA Copy",
        "description": "Tests if value-focused CTA ('Build My Project') outperforms generic action ('Register Now') on the project result screen.",
        "hypothesis": "A project-focused CTA will convert more students because it emphasizes the tangible portfolio value they receive rather than the friction of registration.",
        "primary_metric": "Registration Conversion Rate",
        "secondary_metric": "Modal Open Rate",
        "status": "active",
        "variants": [
            {
                "id": "var_cta_a",
                "name": "Variant A (Control)",
                "label": "Register Now",
                "description": "Standard direct action CTA",
                "allocation_pct": 50,
                "payload": {"button_text": "Register Now", "subtext": "Free 60-Minute Live Build"}
            },
            {
                "id": "var_cta_b",
                "name": "Variant B (Value-Focused)",
                "label": "Build My Project",
                "description": "Personalized value-driven CTA",
                "allocation_pct": 50,
                "payload": {"button_text": "Build My Project", "subtext": "Claim Your Seat & Verified Repo"}
            }
        ]
    },
    {
        "id": "exp_hero_headline",
        "name": "Landing Hero Headline Strategy",
        "description": "Tests whether personal curiosity messaging drives higher quiz start rates than generic workshop pitch.",
        "hypothesis": "A curiosity-driven headline ('What AI Project Should You Build?') will outperform a generic workshop headline ('Build Your First AI Project in 60 Minutes') by sparking personal relevance.",
        "primary_metric": "Quiz Start Rate",
        "secondary_metric": "Quiz Completion Rate",
        "status": "active",
        "variants": [
            {
                "id": "var_head_a",
                "name": "Variant A (Direct)",
                "label": "Build Your First AI Project in 60 Minutes",
                "description": "Time-commitment proposition",
                "allocation_pct": 34,
                "payload": {
                    "headline_part1": "Build Your First",
                    "headline_highlight": "AI Project in 60 Minutes"
                }
            },
            {
                "id": "var_head_b",
                "name": "Variant B (Curiosity-Driven)",
                "label": "What AI Project Should You Build?",
                "description": "Curiosity and personalization proposition",
                "allocation_pct": 33,
                "payload": {
                    "headline_part1": "What AI Project",
                    "headline_highlight": "Should You Build?"
                }
            },
            {
                "id": "var_head_c",
                "name": "Variant C (Challenge/Provocative)",
                "label": "Stop Watching AI Tutorials. Build Something.",
                "description": "Action-oriented anti-tutorial proposition",
                "allocation_pct": 33,
                "payload": {
                    "headline_part1": "Stop Watching AI Tutorials.",
                    "headline_highlight": "Build Something."
                }
            }
        ]
    }
]

DEFAULT_BUDGETS = [
    {
        "id": "budget_college_clubs",
        "channel_name": "College Communities & Clubs",
        "channel_type": "tech_clubs",
        "planned_spend": 600,
        "actual_spend": 0,
        "simulated_spend": 400,
        "notes": "College WhatsApp groups, coding club announcements, lab notices"
    },
    {
        "id": "budget_instagram",
        "channel_name": "Instagram Reels & Stories",
        "channel_type": "instagram",
        "planned_spend": 700,
        "actual_spend": 0,
        "simulated_spend": 700,
        "notes": "Short micro-demos of the 60-minute build projects"
    },
    {
        "id": "budget_campus_qr",
        "channel_name": "Campus QR Posters & Notice Boards",
        "channel_type": "campus_posters",
        "planned_spend": 300,
        "actual_spend": 0,
        "simulated_spend": 250,
        "notes": "A4 printouts on canteen & lab notice boards with UTM QR"
    },
    {
        "id": "budget_whatsapp_broadcast",
        "channel_name": "Direct WhatsApp Outreach",
        "channel_type": "whatsapp",
        "planned_spend": 200,
        "actual_spend": 0,
        "simulated_spend": 150,
        "notes": "Batch representative broadcasts with project card embeds"
    },
    {
        "id": "budget_linkedin",
        "channel_name": "LinkedIn Student Creator Outreach",
        "channel_type": "linkedin",
        "planned_spend": 200,
        "actual_spend": 0,
        "simulated_spend": 100,
        "notes": "Organic outreach via 3rd/4th year campus ambassadors"
    }
]

async def ensure_default_experiments_and_budgets(db: AsyncSession):
    """Initializes standard experiments and budget records if not already seeded."""
    for exp_data in DEFAULT_EXPERIMENTS:
        res = await db.execute(select(ExperimentModel).where(ExperimentModel.id == exp_data["id"]))
        existing = res.scalar_one_or_none()
        if not existing:
            exp = ExperimentModel(
                id=exp_data["id"],
                name=exp_data["name"],
                description=exp_data["description"],
                hypothesis=exp_data["hypothesis"],
                primary_metric=exp_data["primary_metric"],
                secondary_metric=exp_data.get("secondary_metric"),
                status=exp_data["status"],
                start_date=datetime.utcnow(),
                created_at=datetime.utcnow()
            )
            db.add(exp)
            await db.flush()

            for var_data in exp_data["variants"]:
                var = ExperimentVariantModel(
                    id=var_data["id"],
                    experiment_id=exp_data["id"],
                    name=var_data["name"],
                    label=var_data["label"],
                    description=var_data["description"],
                    allocation_pct=var_data["allocation_pct"],
                    payload_json=json.dumps(var_data.get("payload", {}))
                )
                db.add(var)

    for b_data in DEFAULT_BUDGETS:
        res = await db.execute(select(CampaignBudgetModel).where(CampaignBudgetModel.id == b_data["id"]))
        if not res.scalar_one_or_none():
            b = CampaignBudgetModel(
                id=b_data["id"],
                channel_name=b_data["channel_name"],
                channel_type=b_data["channel_type"],
                planned_spend=b_data["planned_spend"],
                actual_spend=b_data["actual_spend"],
                simulated_spend=b_data["simulated_spend"],
                notes=b_data["notes"]
            )
            db.add(b)

    await db.commit()


def get_deterministic_variant(session_id: str, experiment: ExperimentModel) -> ExperimentVariantModel:
    """
    Deterministic assignment: computes consistent hash based on session_id and experiment_id.
    Ensures a visitor will ALWAYS receive the identical variant on page refresh or revisit.
    """
    hash_str = f"{session_id}:{experiment.id}"
    hash_val = int(hashlib.md5(hash_str.encode()).hexdigest(), 16) % 100

    cumulative = 0
    selected_variant = experiment.variants[0] if experiment.variants else None
    for variant in experiment.variants:
        cumulative += variant.allocation_pct
        if hash_val < cumulative:
            selected_variant = variant
            break

    return selected_variant or experiment.variants[0]


async def record_exposure(
    db: AsyncSession,
    experiment_id: str,
    variant_id: str,
    session_id: str,
    anonymous_id: Optional[str] = None,
    user_id: Optional[str] = None,
    is_simulation: bool = False
):
    """Records user exposure to an experiment variant (deduplicated per session)."""
    # Check if exposure already recorded for this session + experiment
    existing_res = await db.execute(
        select(ExperimentExposureModel).where(
            ExperimentExposureModel.experiment_id == experiment_id,
            ExperimentExposureModel.session_id == session_id,
            ExperimentExposureModel.is_simulation == is_simulation
        )
    )
    if existing_res.scalar_one_or_none():
        return  # already recorded

    exposure = ExperimentExposureModel(
        id=f"exp_exp_{uuid.uuid4().hex[:10]}",
        experiment_id=experiment_id,
        variant_id=variant_id,
        session_id=session_id,
        anonymous_id=anonymous_id,
        user_id=user_id,
        is_simulation=is_simulation,
        timestamp=datetime.utcnow()
    )
    db.add(exposure)

    # Telemetry event
    event = AnalyticsEventModel(
        session_id=session_id,
        anonymous_id=anonymous_id,
        user_id=user_id,
        event_name="experiment_exposure",
        experiment_id=experiment_id,
        variant=variant_id,
        is_simulation=is_simulation,
        metadata_json=json.dumps({"experiment_id": experiment_id, "variant_id": variant_id})
    )
    db.add(event)
    await db.commit()


async def get_active_experiments(db: AsyncSession) -> List[ActiveExperimentDetail]:
    """Returns active experiments and their variants."""
    await ensure_default_experiments_and_budgets(db)
    res = await db.execute(
        select(ExperimentModel).where(ExperimentModel.status == "active")
    )
    experiments = res.scalars().all()

    result = []
    for exp in experiments:
        # Load variants
        v_res = await db.execute(
            select(ExperimentVariantModel).where(ExperimentVariantModel.experiment_id == exp.id)
        )
        variants = v_res.scalars().all()
        result.append(ActiveExperimentDetail(
            id=exp.id,
            name=exp.name,
            hypothesis=exp.hypothesis,
            primary_metric=exp.primary_metric,
            status=exp.status,
            variants=[
                VariantDetail(
                    id=v.id,
                    name=v.name,
                    label=v.label,
                    allocation_pct=v.allocation_pct,
                    payload=json.loads(v.payload_json) if v.payload_json else {}
                )
                for v in variants
            ]
        ))
    return result


async def compute_experiments_report(
    db: AsyncSession,
    is_simulation: bool = False
) -> List[ExperimentReportItem]:
    """
    Computes experiment exposures, conversions, conversion rates, leader variant,
    and returns realistic statistical confidence assessment (avoiding fake significance claims).
    """
    await ensure_default_experiments_and_budgets(db)
    res = await db.execute(select(ExperimentModel))
    experiments = res.scalars().all()

    report_items = []
    for exp in experiments:
        v_res = await db.execute(
            select(ExperimentVariantModel).where(ExperimentVariantModel.experiment_id == exp.id)
        )
        variants = v_res.scalars().all()

        variant_stats: List[ExperimentVariantStats] = []
        for v in variants:
            # 1. Total exposures for this variant
            exp_count_res = await db.execute(
                select(func.count(ExperimentExposureModel.id)).where(
                    ExperimentExposureModel.experiment_id == exp.id,
                    ExperimentExposureModel.variant_id == v.id,
                    ExperimentExposureModel.is_simulation == is_simulation
                )
            )
            exposures = exp_count_res.scalar_one() or 0

            # 2. Conversions
            # For CTA experiment: conversion is registration
            # For Headline experiment: conversion is quiz start or registration
            if exp.id == "exp_project_cta":
                # Find sessions exposed to this variant that completed registration
                conv_res = await db.execute(
                    select(func.count(func.distinct(AnalyticsEventModel.session_id))).where(
                        AnalyticsEventModel.session_id.in_(
                            select(ExperimentExposureModel.session_id).where(
                                ExperimentExposureModel.experiment_id == exp.id,
                                ExperimentExposureModel.variant_id == v.id,
                                ExperimentExposureModel.is_simulation == is_simulation
                            )
                        ),
                        AnalyticsEventModel.event_name == "registration_completed",
                        AnalyticsEventModel.is_simulation == is_simulation
                    )
                )
                conversions = conv_res.scalar_one() or 0
            else:
                # Headline experiment: quiz starts
                conv_res = await db.execute(
                    select(func.count(func.distinct(AnalyticsEventModel.session_id))).where(
                        AnalyticsEventModel.session_id.in_(
                            select(ExperimentExposureModel.session_id).where(
                                ExperimentExposureModel.experiment_id == exp.id,
                                ExperimentExposureModel.variant_id == v.id,
                                ExperimentExposureModel.is_simulation == is_simulation
                            )
                        ),
                        AnalyticsEventModel.event_name == "quiz_started",
                        AnalyticsEventModel.is_simulation == is_simulation
                    )
                )
                conversions = conv_res.scalar_one() or 0

            c_rate = round((conversions / exposures * 100), 1) if exposures > 0 else 0.0

            variant_stats.append(ExperimentVariantStats(
                variant_id=v.id,
                name=v.name,
                label=v.label,
                exposures=exposures,
                conversions=conversions,
                conversion_rate=c_rate
            ))

        # Determine leader and signal confidence
        total_exposures = sum(s.exposures for s in variant_stats)
        leader = None
        lift_pct = 0.0
        confidence = "Insufficient data"
        recommendation = "Continue data collection before drawing conclusions."

        if total_exposures < 30:
            confidence = "Insufficient data — need more observations"
            recommendation = "Sample size too small (N < 30). Maintain equal 50/50 allocation."
        else:
            sorted_variants = sorted(variant_stats, key=lambda x: x.conversion_rate, reverse=True)
            top = sorted_variants[0]
            second = sorted_variants[1] if len(sorted_variants) > 1 else None

            if top.conversions > 0:
                leader = top.label
                if second and second.conversion_rate > 0:
                    diff = top.conversion_rate - second.conversion_rate
                    lift_pct = round(((top.conversion_rate - second.conversion_rate) / second.conversion_rate) * 100, 1)

                    if diff >= 3.0:
                        confidence = f"Early directional signal (+{lift_pct}% relative lift)"
                        recommendation = f"Action Hypothesis: '{top.label}' is outperforming '{second.label}'. If trend persists at N=300, allocate 80% traffic to '{top.label}'."
                    else:
                        confidence = "Weak signal — difference is within noise margin"
                        recommendation = "Difference between variants is under 3%. Maintain test to gather statistically significant separation."
                else:
                    confidence = "Early directional signal"
                    recommendation = f"Action Hypothesis: '{top.label}' is currently converting highest. Monitor until sample size exceeds 200."

        report_items.append(ExperimentReportItem(
            id=exp.id,
            name=exp.name,
            hypothesis=exp.hypothesis,
            primary_metric=exp.primary_metric,
            status=exp.status,
            variants=variant_stats,
            leader_variant=leader,
            lift_pct=lift_pct,
            signal_confidence=confidence,
            decision_recommendation=recommendation
        ))

    return report_items
