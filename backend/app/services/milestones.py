"""Milestone reward definitions and progress calculator for the NxtWave Referral Engine."""

from typing import List, Dict, Any, Tuple, Optional
from app.models.schemas import MilestoneItem, NextMilestoneItem

MILESTONE_DEFINITIONS = [
    {
        "id": "starter_blueprint",
        "title": "🎁 AI Project Starter Blueprint",
        "required_count": 1,
        "description": "Complete architecture schematic, step-by-step 60-minute build roadmap, and starter GitHub repo boilerplate.",
        "badge": "1 Referral",
        "reward_content": "Included: Architecture Flowchart, Streamlit Boilerplate, Gemini API Prompt Templates"
    },
    {
        "id": "advanced_blueprint",
        "title": "🚀 Advanced AI Project Blueprint & Deployment Checklist",
        "required_count": 3,
        "description": "Full production deployment guide, cloud hosting setup, and automated input validation guardrails.",
        "badge": "3 Referrals",
        "reward_content": "Included: Vercel/Render Deploy Guide, Rate Limiting Strategy, CI/CD GitHub Actions"
    },
    {
        "id": "showcase_pack",
        "title": "🏆 AI Project Showcase & Hackathon Pitch Pack",
        "required_count": 5,
        "description": "Recruiter-ready resume bullet bank, demo video slide deck template, and hackathon presentation pitch deck.",
        "badge": "5 Referrals",
        "reward_content": "Included: Resume Bullets for ATS, 5-Slide Pitch Deck Template, Live Demo Script"
    }
]

def calculate_milestone_progress(referral_count: int) -> Tuple[List[MilestoneItem], Optional[NextMilestoneItem]]:
    """Calculates unlocked milestones and next milestone distance."""
    milestones: List[MilestoneItem] = []
    for m in MILESTONE_DEFINITIONS:
        is_unlocked = referral_count >= m["required_count"]
        milestones.append(MilestoneItem(
            id=m["id"],
            title=m["title"],
            required_count=m["required_count"],
            description=m["description"],
            badge=m["badge"],
            is_unlocked=is_unlocked,
            reward_content=m["reward_content"] if is_unlocked else None
        ))

    # Determine next milestone
    next_item = None
    for m in MILESTONE_DEFINITIONS:
        if referral_count < m["required_count"]:
            rem = m["required_count"] - referral_count
            pct = min(100.0, round((referral_count / m["required_count"]) * 100, 1))
            next_item = NextMilestoneItem(
                title=m["title"],
                required_count=m["required_count"],
                remaining=rem,
                progress_pct=pct
            )
            break

    if not next_item and MILESTONE_DEFINITIONS:
        # All completed
        last = MILESTONE_DEFINITIONS[-1]
        next_item = NextMilestoneItem(
            title="All Milestones Unlocked! 🚀",
            required_count=last["required_count"],
            remaining=0,
            progress_pct=100.0
        )

    return milestones, next_item
