"""AI Service for personalizing project recommendations using Google Gemini API."""

import json
import logging
from typing import Dict, Any, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

async def personalize_with_gemini(
    student_profile: Dict[str, Any],
    project: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """
    Calls Google Gemini API to personalize the project rationale and outcomes.
    Returns structured JSON if successful, or None on any failure/timeout.
    """
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY.strip() == "":
        logger.info("GEMINI_API_KEY not configured. Using deterministic fallback engine.")
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.AI_MODEL_NAME}:generateContent?key={settings.GEMINI_API_KEY}"

    prompt = f"""
You are a senior engineering mentor at NxtWave preparing a student for our free workshop "Build Your First AI Project in 60 Minutes".
Personalize the project recommendation for this student based on their profile.

STUDENT PROFILE:
- Year of Study: {student_profile.get('year_of_study')} (e.g. 1st, 2nd, 3rd, 4th Year)
- Branch: {student_profile.get('branch')}
- Coding Comfort Level: {student_profile.get('coding_level')}
- Primary Interest: {student_profile.get('interest_area')}
- Primary Goal: {student_profile.get('primary_goal')}
- Preferred Technology: {student_profile.get('preferred_tech', 'Python')}

RECOMMENDED PROJECT:
- Title: {project.get('name')}
- Category: {project.get('category')}
- Difficulty: {project.get('difficulty')}
- Tech Stack: {', '.join(project.get('technologies', []))}

REQUIREMENTS:
1. 'why_this_matches_you': 2-3 encouraging, realistic sentences explaining why this exact project is ideal for a {student_profile.get('year_of_study')} year {student_profile.get('branch')} student with {student_profile.get('coding_level')} skills who wants to {student_profile.get('primary_goal')}. Do not invent details they didn't provide.
2. 'custom_learning_outcomes': List of exactly 4 concise, high-value technical bullet points they will master in 60 minutes.
3. 'mentor_tip': A one-sentence motivating tip for their live workshop build.

OUTPUT FORMAT:
Return ONLY valid JSON matching this schema with no markdown code fences:
{{
  "why_this_matches_you": "...",
  "custom_learning_outcomes": ["...", "...", "...", "..."],
  "mentor_tip": "..."
}}
"""

    try:
        async with httpx.AsyncClient(timeout=2.5) as client:
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 450,
                    "responseMimeType": "application/json"
                }
            }
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                data = response.json()
                text_content = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                # Clean up any residual markdown fences if present
                if text_content.startswith("```json"):
                    text_content = text_content[7:]
                if text_content.startswith("```"):
                    text_content = text_content[3:]
                if text_content.endswith("```"):
                    text_content = text_content[:-3]
                parsed = json.loads(text_content.strip())
                return parsed
            else:
                logger.warning(f"Gemini API returned status {response.status_code}: {response.text}")
                return None
    except Exception as e:
        logger.warning(f"Gemini API call timed out or failed: {e}. Falling back to deterministic engine.")
        return None
