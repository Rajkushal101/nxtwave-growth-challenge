"""Simulated 7-Day Campaign Scenario Generator (Isolated via is_simulation=True flag)."""

import uuid
import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.models.schemas import (
    UserModel,
    ProjectRecommendationModel,
    RegistrationModel,
    ReferralModel,
    ReferralClickModel,
    AnalyticsEventModel,
    ExperimentExposureModel
)
from app.services.catalog import PROJECT_CATALOG
from app.services.experiments import ensure_default_experiments_and_budgets

DEMO_FIRST_NAMES = [
    "Aarav", "Priya", "Kartheek", "Rohan", "Sneha", "Vikram", "Ananya", "Rahul", 
    "Neha", "Aditya", "Divya", "Siddharth", "Pooja", "Arjun", "Meera", "Varun",
    "Ishaan", "Ritu", "Harish", "Kavya", "Sanjay", "Tanvi", "Gautam", "Deepika"
]
DEMO_LAST_NAMES = [
    "Sharma", "Nair", "Reddy", "Verma", "Patel", "Iyer", "Rao", "Gupta", 
    "Joshi", "Menon", "Chopra", "Deshmukh", "Bhat", "Kulkarni", "Singhania"
]
DEMO_COLLEGES = [
    "Amrita Vishwa Vidyapeetham", "IIT Madras", "NIT Trichy", "PSG Tech", 
    "Vellore Institute of Technology", "SRM University", "BITS Pilani", "Anna University"
]

# Canonical source channels
CHANNEL_CONFIG = {
    "WhatsApp": {"source": "whatsapp", "medium": "community", "campaign": "squad_lead_launch"},
    "College Clubs": {"source": "college_clubs", "medium": "tech_club", "campaign": "campus_club_drive"},
    "Instagram": {"source": "instagram", "medium": "paid_social", "campaign": "build_60m_video"},
    "LinkedIn": {"source": "linkedin", "medium": "student_lead", "campaign": "ambassador_post"},
    "Campus QR": {"source": "campus_qr", "medium": "offline_qr", "campaign": "lab_notice_board"},
    "Referral": {"source": "referral", "medium": "peer_invite", "campaign": "peer_referral_drive"},
    "Direct / Organic": {"source": "direct", "medium": "organic", "campaign": "direct_visit"}
}

async def seed_simulated_campaign(db: AsyncSession) -> Dict[str, Any]:
    """
    Seeds a realistic 7-day campaign scenario (modeling 187 registrations towards the 500 target),
    strictly isolated with is_simulation=True so real live test data remains unpolluted.
    All segmentations (Year, Branch, Source) strictly reconcile to 187 registrations.
    Total unique visitors strictly reconcile to 1,248.
    """
    await ensure_default_experiments_and_budgets(db)

    # 1. Reset any previous simulated data to prevent duplication
    await reset_simulated_data(db)

    start_date = datetime.utcnow() - timedelta(days=7)
    random.seed(42)  # Deterministic seed for reproducible evaluation metrics

    total_target_registrations = 187
    total_target_visitors = 1248

    # --- RECONCILING REGISTRATION ALLOCATIONS ---
    # Years: 1st=35, 2nd=52, 3rd=65, 4th=35 => Sum = 187
    year_assignments = [1] * 35 + [2] * 52 + [3] * 65 + [4] * 35
    random.shuffle(year_assignments)

    # Branches: CSE=75, IT=33, ECE=35, EEE=20, Mechanical=14, Civil=10 => Sum = 187
    branch_assignments = (
        ["Computer Science (CSE)"] * 75 +
        ["Information Tech (IT)"] * 33 +
        ["Electronics (ECE)"] * 35 +
        ["Electrical (EEE)"] * 20 +
        ["Mechanical"] * 14 +
        ["Civil"] * 10
    )
    random.shuffle(branch_assignments)

    # Primary Source Channels for the 187 Registrations:
    # WhatsApp=42, College Clubs=54, Instagram=26, LinkedIn=14, Campus QR=12, Referral=31, Direct=8 => Sum = 187
    source_reg_counts = {
        "WhatsApp": 42,
        "College Clubs": 54,
        "Instagram": 26,
        "LinkedIn": 14,
        "Campus QR": 12,
        "Referral": 31,
        "Direct / Organic": 8
    }
    source_assignments = []
    for src_name, count in source_reg_counts.items():
        source_assignments.extend([src_name] * count)
    random.shuffle(source_assignments)

    created_users = []
    created_registrations = []
    created_referrals = []
    squad_leads_info = []
    used_codes = set()

    # 2. Generate Registered Students (187)
    for i in range(total_target_registrations):
        day_offset = random.uniform(0.5, 6.9)
        reg_time = start_date + timedelta(days=day_offset)

        yr = year_assignments[i]
        branch = branch_assignments[i]
        src_name = source_assignments[i]
        chan_meta = CHANNEL_CONFIG[src_name]

        first = random.choice(DEMO_FIRST_NAMES)
        last = random.choice(DEMO_LAST_NAMES)
        full_name = f"{first} {last}"
        email = f"{first.lower()}.{last.lower()}{i+100}@demo.edu"
        phone = f"98{random.randint(10000000, 99999999)}"
        college = random.choice(DEMO_COLLEGES)

        matched_proj = random.choice(PROJECT_CATALOG)
        user_id = f"sim_usr_{uuid.uuid4().hex[:10]}"
        session_id = f"sim_ses_{uuid.uuid4().hex[:10]}"

        # User profile
        user = UserModel(
            id=user_id,
            session_id=session_id,
            year_of_study=yr,
            branch=branch,
            coding_level="Intermediate" if yr >= 2 else "Beginner",
            interest_area=matched_proj["category"],
            primary_goal="Placement Prep" if yr >= 3 else "Explore AI",
            preferred_tech="Python",
            is_simulation=True,
            created_at=reg_time - timedelta(minutes=15)
        )
        db.add(user)
        created_users.append(user)

        # Recommendation
        rec = ProjectRecommendationModel(
            id=f"sim_rec_{uuid.uuid4().hex[:10]}",
            user_id=user_id,
            project_id=matched_proj["id"],
            project_title=matched_proj["name"],
            category=matched_proj["category"],
            difficulty=matched_proj["difficulty"],
            difficulty_stars=matched_proj.get("difficulty_stars", 3),
            estimated_minutes=60,
            tech_stack=json.dumps(matched_proj.get("technologies", ["Python", "Gemini API"])),
            what_you_will_build=matched_proj.get("what_you_will_build", "A functional 60-minute AI application."),
            why_this_matches_you=matched_proj.get("description", "Tailored to your current skills and career milestones."),
            learning_outcomes=json.dumps(matched_proj.get("learning_outcomes", ["API integration", "Fast prototyping"])),
            portfolio_relevance=matched_proj.get("career_relevance", "High impact for engineering portfolios."),
            portfolio_value=matched_proj.get("portfolio_value", "High"),
            is_ai_generated=False,
            is_simulation=True,
            generated_at=reg_time - timedelta(minutes=10)
        )
        db.add(rec)

        # Unique referral code
        clean_prefix = (first[:5].upper() if len(first) >= 3 else "NXT")
        code_suffix = random.randint(100, 999)
        ref_code = f"{clean_prefix}{code_suffix}"
        while ref_code in used_codes:
            code_suffix = random.randint(100, 9999)
            ref_code = f"{clean_prefix}{code_suffix}"
        used_codes.add(ref_code)

        # Squad leads: exactly 7 students become active referral participants
        if len(squad_leads_info) < 7 and src_name != "Referral":
            squad_leads_info.append({"name": full_name, "code": ref_code, "user_id": user_id, "session_id": session_id, "time": reg_time})

        # Attribution: If this student came from Referral, attribute to one of the 7 squad leads
        referred_by = None
        if src_name == "Referral":
            lead = random.choice(squad_leads_info) if squad_leads_info else {"code": "VIKRA818"}
            referred_by = lead["code"]

        reg = RegistrationModel(
            id=f"sim_reg_{uuid.uuid4().hex[:10]}",
            user_id=user_id,
            full_name=full_name,
            email=email,
            whatsapp_number=phone,
            college_name=college,
            project_title=matched_proj["name"],
            referral_code=ref_code,
            referred_by_code=referred_by,
            is_simulation=True,
            registered_at=reg_time
        )
        db.add(reg)
        created_registrations.append(reg)

        # If referred, log conversion record
        if referred_by:
            ref_entry = ReferralModel(
                id=f"sim_ref_{uuid.uuid4().hex[:10]}",
                referrer_code=referred_by,
                referred_user_id=user_id,
                referred_name=full_name,
                status="completed",
                is_simulation=True,
                created_at=reg_time,
                converted_at=reg_time
            )
            db.add(ref_entry)
            created_referrals.append(ref_entry)

        # Log complete user journey events
        events_to_log = [
            ("page_view", reg_time - timedelta(minutes=20)),
            ("quiz_started", reg_time - timedelta(minutes=18)),
            ("quiz_completed", reg_time - timedelta(minutes=12)),
            ("project_generated", reg_time - timedelta(minutes=10)),
            ("registration_started", reg_time - timedelta(minutes=4)),
            ("registration_completed", reg_time),
            ("referral_code_generated", reg_time + timedelta(seconds=5))
        ]
        if referred_by:
            # If referred, also log referral_click and referral_registration
            events_to_log.insert(0, ("referral_click", reg_time - timedelta(minutes=21)))
            events_to_log.append(("referral_registration", reg_time + timedelta(seconds=2)))
            # Add ReferralClickModel
            db.add(ReferralClickModel(
                id=f"sim_clk_reg_{uuid.uuid4().hex[:10]}",
                referral_code=referred_by,
                session_id=session_id,
                utm_source="referral",
                referrer_url="https://web.whatsapp.com/",
                is_simulation=True,
                created_at=reg_time - timedelta(minutes=21)
            ))

        for ev_name, ev_time in events_to_log:
            ev = AnalyticsEventModel(
                session_id=session_id,
                anonymous_id=session_id,
                user_id=user_id,
                event_name=ev_name,
                utm_source=chan_meta["source"],
                utm_medium=chan_meta["medium"],
                utm_campaign=chan_meta["campaign"],
                referral_code=referred_by,
                is_simulation=True,
                timestamp=ev_time
            )
            db.add(ev)

        # CTA Experiment Exposure (Split roughly 50/50, Variant B converts higher)
        cta_var = "var_cta_b" if random.random() < 0.60 else "var_cta_a"
        db.add(ExperimentExposureModel(
            id=f"sim_exp_{uuid.uuid4().hex[:10]}",
            experiment_id="exp_project_cta",
            variant_id=cta_var,
            session_id=session_id,
            user_id=user_id,
            is_simulation=True,
            timestamp=reg_time - timedelta(minutes=8)
        ))

    # 3. Log explicit referral participation (sharing actions) for the 7 squad leads
    for lead in squad_leads_info:
        share_time = lead["time"] + timedelta(minutes=15)
        db.add(AnalyticsEventModel(
            session_id=lead["session_id"],
            user_id=lead["user_id"],
            event_name="whatsapp_share_clicked",
            referral_code=lead["code"],
            utm_source="referral",
            is_simulation=True,
            timestamp=share_time
        ))
        db.add(AnalyticsEventModel(
            session_id=lead["session_id"],
            user_id=lead["user_id"],
            event_name="referral_link_copied",
            referral_code=lead["code"],
            utm_source="referral",
            is_simulation=True,
            timestamp=share_time + timedelta(seconds=30)
        ))

    # 4. Generate Non-Converting Visitors (1,061 visitors)
    # Total visitors = 187 registrations + 1061 non-converting = 1,248
    # Source allocation for non-converting:
    # WhatsApp: 260 - 42 = 218
    # College Clubs: 340 - 54 = 286
    # Instagram: 220 - 26 = 194
    # LinkedIn: 90 - 14 = 76
    # Campus QR: 100 - 12 = 88
    # Referral: 198 - 31 = 167
    # Direct / Organic: 40 - 8 = 32
    # Sum = 218 + 286 + 194 + 76 + 88 + 167 + 32 = 1,061!
    non_conv_source_counts = {
        "WhatsApp": 218,
        "College Clubs": 286,
        "Instagram": 194,
        "LinkedIn": 76,
        "Campus QR": 88,
        "Referral": 167,
        "Direct / Organic": 32
    }
    non_conv_sources = []
    for src_name, count in non_conv_source_counts.items():
        non_conv_sources.extend([src_name] * count)
    random.shuffle(non_conv_sources)

    # Funnel Drop-off thresholds for the 1,061 non-converting visitors:
    # Quiz starts = 712 (712 + 187 = 899 total)
    # Quiz completes = 541 (541 + 187 = 728 total)
    # Project generated = 483 (483 + 187 = 670 total)
    # Registration started = 21 (21 + 187 = 208 total)
    for j, src_name in enumerate(non_conv_sources):
        day_offset = random.uniform(0.1, 6.9)
        v_time = start_date + timedelta(days=day_offset)
        s_id = f"sim_ses_anon_{uuid.uuid4().hex[:10]}"
        chan_meta = CHANNEL_CONFIG[src_name]

        # If referral visitor, log click
        if src_name == "Referral":
            lead = random.choice(squad_leads_info) if squad_leads_info else {"code": "VIKRA818"}
            db.add(ReferralClickModel(
                id=f"sim_clk_nc_{uuid.uuid4().hex[:10]}",
                referral_code=lead["code"],
                session_id=s_id,
                utm_source="referral",
                referrer_url="https://web.whatsapp.com/",
                is_simulation=True,
                created_at=v_time
            ))
            db.add(AnalyticsEventModel(
                session_id=s_id,
                event_name="referral_click",
                referral_code=lead["code"],
                utm_source="referral",
                is_simulation=True,
                timestamp=v_time
            ))

        # Always log page_view
        db.add(AnalyticsEventModel(
            session_id=s_id,
            event_name="page_view",
            utm_source=chan_meta["source"],
            utm_medium=chan_meta["medium"],
            utm_campaign=chan_meta["campaign"],
            is_simulation=True,
            timestamp=v_time
        ))

        # Hero headline experiment exposure
        head_var = random.choice(["var_head_a", "var_head_b", "var_head_c"])
        db.add(ExperimentExposureModel(
            id=f"sim_exp_h_{uuid.uuid4().hex[:10]}",
            experiment_id="exp_hero_headline",
            variant_id=head_var,
            session_id=s_id,
            is_simulation=True,
            timestamp=v_time
        ))

        # Quiz Started (~712 of non-converting did start)
        if j < 712:
            db.add(AnalyticsEventModel(
                session_id=s_id,
                event_name="quiz_started",
                utm_source=chan_meta["source"],
                utm_medium=chan_meta["medium"],
                utm_campaign=chan_meta["campaign"],
                is_simulation=True,
                timestamp=v_time + timedelta(minutes=1)
            ))

            # Quiz Completed (~541 did)
            if j < 541:
                db.add(AnalyticsEventModel(
                    session_id=s_id,
                    event_name="quiz_completed",
                    utm_source=chan_meta["source"],
                    utm_medium=chan_meta["medium"],
                    utm_campaign=chan_meta["campaign"],
                    is_simulation=True,
                    timestamp=v_time + timedelta(minutes=4)
                ))

                # Project Generated (~483 did)
                if j < 483:
                    db.add(AnalyticsEventModel(
                        session_id=s_id,
                        event_name="project_generated",
                        utm_source=chan_meta["source"],
                        utm_medium=chan_meta["medium"],
                        utm_campaign=chan_meta["campaign"],
                        is_simulation=True,
                        timestamp=v_time + timedelta(minutes=5)
                    ))

                    # CTA exposure for dropped project view
                    cta_var = "var_cta_a" if random.random() < 0.55 else "var_cta_b"
                    db.add(ExperimentExposureModel(
                        id=f"sim_exp_cta_{uuid.uuid4().hex[:10]}",
                        experiment_id="exp_project_cta",
                        variant_id=cta_var,
                        session_id=s_id,
                        is_simulation=True,
                        timestamp=v_time + timedelta(minutes=6)
                    ))

                    # Registration Started (~21 did but abandoned)
                    if j < 21:
                        db.add(AnalyticsEventModel(
                            session_id=s_id,
                            event_name="registration_started",
                            utm_source=chan_meta["source"],
                            utm_medium=chan_meta["medium"],
                            utm_campaign=chan_meta["campaign"],
                            is_simulation=True,
                            timestamp=v_time + timedelta(minutes=8)
                        ))

    await db.commit()

    return {
        "status": "seeded",
        "scenario": "Simulated 7-day campaign scenario (Day 3-4 progress snapshot)",
        "simulated_visitors": total_target_visitors,
        "simulated_registrations": total_target_registrations,
        "simulated_referrals": len(created_referrals),
        "target_goal": 500,
        "goal_progress_pct": round(total_target_registrations / 500 * 100, 1),
        "is_simulation": True,
        "disclaimer": "SIMULATED DEMO DATA: Generated exclusively for growth strategy evaluation. Real student records remain isolated."
    }

async def reset_simulated_data(db: AsyncSession) -> Dict[str, Any]:
    """Deletes all simulated campaign data without touching live production data."""
    await db.execute(delete(AnalyticsEventModel).where(AnalyticsEventModel.is_simulation == True))
    await db.execute(delete(ExperimentExposureModel).where(ExperimentExposureModel.is_simulation == True))
    await db.execute(delete(ReferralClickModel).where(ReferralClickModel.is_simulation == True))
    await db.execute(delete(ReferralModel).where(ReferralModel.is_simulation == True))
    await db.execute(delete(RegistrationModel).where(RegistrationModel.is_simulation == True))
    await db.execute(delete(ProjectRecommendationModel).where(ProjectRecommendationModel.is_simulation == True))
    await db.execute(delete(UserModel).where(UserModel.is_simulation == True))
    await db.commit()

    return {
        "status": "reset",
        "message": "All simulated demo records removed. Live production telemetry preserved."
    }
