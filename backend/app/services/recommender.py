"""Project Recommendation Engine with Deterministic Scoring and AI Personalization."""

from typing import Dict, Any, List, Tuple
from app.services.catalog import PROJECT_CATALOG, get_project_by_id
from app.services.ai_service import personalize_with_gemini

def _format_year_label(year: int) -> str:
    suffixes = {1: "1st", 2: "2nd", 3: "3rd", 4: "4th"}
    return f"{suffixes.get(year, str(year))} Year"

def score_project_compatibility(project: Dict[str, Any], profile: Dict[str, Any]) -> int:
    """
    Computes a deterministic match score (0 - 100+) between a student's profile and a project template.
    """
    score = 0
    student_year = profile.get("year_of_study", 1)
    student_branch = profile.get("branch", "Other")
    student_level = profile.get("coding_level", "Beginner")
    student_interest = profile.get("interest_area", "AI / Machine Learning")
    student_goal = profile.get("primary_goal", "Explore AI")
    student_tech = profile.get("preferred_tech", "Python")

    # 1. Interest Match (+35 points max)
    if student_interest in project.get("primary_interests", []):
        score += 35
    elif project.get("category") in student_interest:
        score += 25

    # 2. Coding Level Match (+25 points max)
    if student_level in project.get("required_skill_level", []):
        score += 25
    elif student_level == "Beginner" and project.get("difficulty") == "Beginner":
        score += 20
    elif student_level == "Advanced" and project.get("difficulty") in ["Intermediate", "Advanced"]:
        score += 20

    # 3. Year Suitability Match (+20 points max)
    if student_year in project.get("suitable_years", []):
        score += 20
    elif abs(student_year - project.get("suitable_years", [1])[0]) <= 1:
        score += 10

    # 4. Primary Goal Match (+15 points max)
    if student_goal in project.get("goals", []):
        score += 15

    # 5. Branch Match (+10 points max)
    suitable_branches = project.get("suitable_branches", ["All"])
    if "All" in suitable_branches or student_branch in suitable_branches:
        score += 10

    # 6. Preferred Technology Match (+5 points max)
    if student_tech == "No preference" or student_tech in project.get("technologies", []):
        score += 5

    return score

async def recommend_project_for_student(
    student_profile: Dict[str, Any],
    specific_project_id: str = None
) -> Tuple[Dict[str, Any], List[str], bool]:
    """
    Ranks projects and generates a personalized recommendation.
    Returns: (project_details, alternative_project_ids, is_ai_generated)
    """
    # Score all projects
    scored_projects = []
    for proj in PROJECT_CATALOG:
        score = score_project_compatibility(proj, student_profile)
        scored_projects.append((score, proj))

    # Sort descending by score
    scored_projects.sort(key=lambda x: x[0], reverse=True)

    # Pick specific project if requested (e.g. for "Try Another Project"), otherwise pick top match
    if specific_project_id:
        chosen_project = get_project_by_id(specific_project_id)
        # Remaining alternatives excluding chosen
        alternatives = [p["id"] for _, p in scored_projects if p["id"] != specific_project_id][:4]
    else:
        chosen_project = scored_projects[0][1]
        alternatives = [p["id"] for _, p in scored_projects[1:5]]

    # Format year text
    year_text = _format_year_label(student_profile.get("year_of_study", 1))
    branch = student_profile.get("branch", "Engineering")
    coding_level = student_profile.get("coding_level", "Beginner")
    interest = student_profile.get("interest_area", "AI")
    goal = student_profile.get("primary_goal", "Explore AI")

    # Layer 2: Attempt AI Personalization
    ai_result = await personalize_with_gemini(student_profile, chosen_project)

    if ai_result and "why_this_matches_you" in ai_result:
        is_ai_generated = True
        why_matches = ai_result["why_this_matches_you"]
        outcomes = ai_result.get("custom_learning_outcomes", chosen_project.get("learning_outcomes", []))
    else:
        # Layer 1: Deterministic Fallback Template
        is_ai_generated = False
        template = chosen_project.get(
            "why_it_matches_template",
            "Because you are a {year} student in {branch} with {level} coding skills wanting to {goal}, this project delivers an immediate, practical breakthrough."
        )
        try:
            why_matches = template.format(
                year=year_text,
                branch=branch,
                level=coding_level.lower(),
                interest=interest,
                goal=goal.lower()
            )
        except Exception:
            why_matches = f"Because you are a {year_text} student in {branch} interested in {interest} and looking to {goal.lower()}, this gives you an ideal 60-minute practical build."
        outcomes = chosen_project.get("learning_outcomes", [])

    result_data = {
        "project_id": chosen_project["id"],
        "project_title": chosen_project["name"],
        "category": chosen_project["category"],
        "difficulty": chosen_project["difficulty"],
        "difficulty_stars": chosen_project.get("difficulty_stars", 3),
        "estimated_minutes": 60,
        "tech_stack": chosen_project.get("technologies", []),
        "what_you_will_build": chosen_project.get("what_you_will_build", chosen_project["description"]),
        "why_this_matches_you": why_matches,
        "learning_outcomes": outcomes,
        "portfolio_relevance": chosen_project.get("career_relevance", "High portfolio impact."),
        "portfolio_value": chosen_project.get("portfolio_value", "High"),
        "summary_hook": f"Recommended for {year_text} {branch} • {chosen_project['category']}"
    }

    return result_data, alternatives, is_ai_generated
