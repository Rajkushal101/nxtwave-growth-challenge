"""API endpoints for Project Recommendations and Catalog Exploration."""

import json
import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.schemas import (
    QuizSubmissionRequest,
    ProjectRecommendationResponse,
    UserModel,
    ProjectRecommendationModel,
    AnalyticsEventModel
)
from app.services.recommender import recommend_project_for_student
from app.services.catalog import PROJECT_CATALOG, get_project_by_id

router = APIRouter(prefix="/api", tags=["Recommendation Engine"])

@router.get("/projects", response_model=List[Dict[str, Any]])
async def list_catalog_projects():
    """Returns the full catalog of 17 AI projects."""
    return PROJECT_CATALOG

@router.post("/recommend", response_model=ProjectRecommendationResponse)
async def generate_recommendation(
    request: QuizSubmissionRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Evaluates student quiz inputs, matches the optimal 60-minute project,
    persists student profile and recommendation, and returns customized details.
    """
    user_id = f"usr_{uuid.uuid4().hex[:10]}"
    
    # 1. Create or persist user profile
    user = UserModel(
        id=user_id,
        session_id=request.session_id,
        year_of_study=request.year_of_study,
        branch=request.branch,
        coding_level=request.coding_level,
        interest_area=request.interest_area,
        primary_goal=request.primary_goal,
        preferred_tech=request.preferred_tech
    )
    db.add(user)

    # 2. Compute recommendation
    profile_dict = request.model_dump()
    project_data, alternatives, is_ai_generated = await recommend_project_for_student(profile_dict)

    # 3. Persist recommendation in DB
    rec_id = f"rec_{uuid.uuid4().hex[:10]}"
    rec = ProjectRecommendationModel(
        id=rec_id,
        user_id=user_id,
        project_id=project_data["project_id"],
        project_title=project_data["project_title"],
        category=project_data["category"],
        difficulty=project_data["difficulty"],
        difficulty_stars=project_data["difficulty_stars"],
        estimated_minutes=project_data["estimated_minutes"],
        tech_stack=json.dumps(project_data["tech_stack"]),
        what_you_will_build=project_data["what_you_will_build"],
        why_this_matches_you=project_data["why_this_matches_you"],
        learning_outcomes=json.dumps(project_data["learning_outcomes"]),
        portfolio_relevance=project_data["portfolio_relevance"],
        portfolio_value=project_data["portfolio_value"],
        is_ai_generated=is_ai_generated
    )
    db.add(rec)

    # Telemetry events for Phase 4 Funnel
    db.add(AnalyticsEventModel(
        session_id=request.session_id,
        user_id=user_id,
        event_name="quiz_completed"
    ))
    db.add(AnalyticsEventModel(
        session_id=request.session_id,
        user_id=user_id,
        event_name="project_generated",
        metadata_json=json.dumps({"project_id": project_data["project_id"], "project_title": project_data["project_title"]})
    ))

    await db.commit()

    return ProjectRecommendationResponse(
        id=rec_id,
        user_id=user_id,
        project_id=project_data["project_id"],
        project_title=project_data["project_title"],
        category=project_data["category"],
        difficulty=project_data["difficulty"],
        difficulty_stars=project_data["difficulty_stars"],
        estimated_minutes=project_data["estimated_minutes"],
        tech_stack=project_data["tech_stack"],
        what_you_will_build=project_data["what_you_will_build"],
        why_this_matches_you=project_data["why_this_matches_you"],
        learning_outcomes=project_data["learning_outcomes"],
        portfolio_relevance=project_data["portfolio_relevance"],
        portfolio_value=project_data["portfolio_value"],
        is_ai_generated=is_ai_generated,
        summary_hook=project_data["summary_hook"],
        alternative_project_ids=alternatives
    )

@router.get("/recommend/switch/{user_id}/{target_project_id}", response_model=ProjectRecommendationResponse)
async def switch_recommended_project(
    user_id: str,
    target_project_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Allows 'Try Another Project' without forcing the student to re-take the quiz.
    Generates personalized details for the newly chosen project using stored user profile.
    """
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Student session profile not found.")

    profile_dict = {
        "year_of_study": user.year_of_study,
        "branch": user.branch,
        "coding_level": user.coding_level,
        "interest_area": user.interest_area,
        "primary_goal": user.primary_goal,
        "preferred_tech": user.preferred_tech
    }

    project_data, alternatives, is_ai_generated = await recommend_project_for_student(
        profile_dict,
        specific_project_id=target_project_id
    )

    rec_id = f"rec_{uuid.uuid4().hex[:10]}"
    rec = ProjectRecommendationModel(
        id=rec_id,
        user_id=user_id,
        project_id=project_data["project_id"],
        project_title=project_data["project_title"],
        category=project_data["category"],
        difficulty=project_data["difficulty"],
        difficulty_stars=project_data["difficulty_stars"],
        estimated_minutes=project_data["estimated_minutes"],
        tech_stack=json.dumps(project_data["tech_stack"]),
        what_you_will_build=project_data["what_you_will_build"],
        why_this_matches_you=project_data["why_this_matches_you"],
        learning_outcomes=json.dumps(project_data["learning_outcomes"]),
        portfolio_relevance=project_data["portfolio_relevance"],
        portfolio_value=project_data["portfolio_value"],
        is_ai_generated=is_ai_generated
    )
    db.add(rec)

    # Telemetry event
    db.add(AnalyticsEventModel(
        session_id=user.session_id,
        user_id=user_id,
        event_name="project_switched",
        metadata_json=json.dumps({"target_project_id": target_project_id, "project_title": project_data["project_title"]})
    ))

    await db.commit()

    return ProjectRecommendationResponse(
        id=rec_id,
        user_id=user_id,
        project_id=project_data["project_id"],
        project_title=project_data["project_title"],
        category=project_data["category"],
        difficulty=project_data["difficulty"],
        difficulty_stars=project_data["difficulty_stars"],
        estimated_minutes=project_data["estimated_minutes"],
        tech_stack=project_data["tech_stack"],
        what_you_will_build=project_data["what_you_will_build"],
        why_this_matches_you=project_data["why_this_matches_you"],
        learning_outcomes=project_data["learning_outcomes"],
        portfolio_relevance=project_data["portfolio_relevance"],
        portfolio_value=project_data["portfolio_value"],
        is_ai_generated=is_ai_generated,
        summary_hook=project_data["summary_hook"],
        alternative_project_ids=alternatives
    )
