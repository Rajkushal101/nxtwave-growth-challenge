from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

# ==========================================
# SQLAlchemy ORM Models
# ==========================================

class CampaignSourceModel(Base):
    __tablename__ = "campaign_sources"

    id = Column(String, primary_key=True, index=True)
    source_name = Column(String, nullable=False)
    channel_type = Column(String, nullable=False)  # 'whatsapp', 'tech_club', 'creator', 'campus_qr'
    utm_source = Column(String, nullable=False, index=True)
    utm_medium = Column(String, nullable=False)
    utm_campaign = Column(String, nullable=False)
    target_registrations = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, nullable=False, index=True)
    year_of_study = Column(Integer, nullable=False)
    branch = Column(String, nullable=False)
    coding_level = Column(String, nullable=False)
    interest_area = Column(String, nullable=False)
    primary_goal = Column(String, nullable=False)
    preferred_tech = Column(String, nullable=True)
    is_simulation = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    recommendations = relationship("ProjectRecommendationModel", back_populates="user", cascade="all, delete-orphan")
    registration = relationship("RegistrationModel", back_populates="user", uselist=False, cascade="all, delete-orphan")


class ProjectRecommendationModel(Base):
    __tablename__ = "project_recommendations"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    project_id = Column(String, nullable=False)  # Catalog key
    project_title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    difficulty_stars = Column(Integer, default=3)
    estimated_minutes = Column(Integer, default=60)
    tech_stack = Column(Text, nullable=False)  # Stored as JSON string
    what_you_will_build = Column(Text, nullable=False)
    why_this_matches_you = Column(Text, nullable=False)
    learning_outcomes = Column(Text, nullable=False)  # Stored as JSON string
    portfolio_relevance = Column(Text, nullable=False)
    portfolio_value = Column(String, default="High")
    is_ai_generated = Column(Boolean, default=False)
    is_simulation = Column(Boolean, default=False, index=True)
    generated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="recommendations")


class RegistrationModel(Base):
    __tablename__ = "registrations"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    whatsapp_number = Column(String, nullable=False)
    college_name = Column(String, nullable=False)
    project_title = Column(String, nullable=False, default="AI Project")
    referral_code = Column(String, nullable=False, unique=True, index=True)
    referred_by_code = Column(String, nullable=True, index=True)
    is_simulation = Column(Boolean, default=False, index=True)
    registered_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="registration")


class ReferralModel(Base):
    __tablename__ = "referrals"

    id = Column(String, primary_key=True, index=True)
    referrer_code = Column(String, nullable=False, index=True)
    referred_user_id = Column(String, nullable=False)
    referred_name = Column(String, nullable=True)  # Safe display name e.g. 'Priya S.'
    status = Column(String, default="completed")   # 'attributed', 'completed'
    is_simulation = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    converted_at = Column(DateTime, default=datetime.utcnow)


class ReferralClickModel(Base):
    __tablename__ = "referral_clicks"

    id = Column(String, primary_key=True, index=True)
    referral_code = Column(String, nullable=False, index=True)
    session_id = Column(String, nullable=False, index=True)
    utm_source = Column(String, nullable=True)
    referrer_url = Column(String, nullable=True)
    is_simulation = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AnalyticsEventModel(Base):
    __tablename__ = "analytics_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String, nullable=False, index=True)
    anonymous_id = Column(String, nullable=True, index=True)
    user_id = Column(String, nullable=True, index=True)
    event_name = Column(String, nullable=False, index=True)
    utm_source = Column(String, nullable=True, index=True)
    utm_medium = Column(String, nullable=True)
    utm_campaign = Column(String, nullable=True)
    utm_content = Column(String, nullable=True)
    referral_code = Column(String, nullable=True, index=True)
    experiment_id = Column(String, nullable=True, index=True)
    variant = Column(String, nullable=True)
    referrer_url = Column(String, nullable=True)
    metadata_json = Column(Text, nullable=True)
    is_simulation = Column(Boolean, default=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)


# ==========================================
# Phase 4: Experimentation & Budget Models
# ==========================================

class ExperimentModel(Base):
    __tablename__ = "experiments"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    hypothesis = Column(Text, nullable=False)
    primary_metric = Column(String, nullable=False)
    secondary_metric = Column(String, nullable=True)
    status = Column(String, default="active")  # 'active', 'paused', 'completed'
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    variants = relationship("ExperimentVariantModel", back_populates="experiment", cascade="all, delete-orphan")


class ExperimentVariantModel(Base):
    __tablename__ = "experiment_variants"

    id = Column(String, primary_key=True, index=True)
    experiment_id = Column(String, ForeignKey("experiments.id"), nullable=False, index=True)
    name = Column(String, nullable=False)  # 'Variant A', 'Variant B'
    label = Column(String, nullable=False)  # 'Register Now', 'Build My Project'
    description = Column(String, nullable=True)
    allocation_pct = Column(Integer, default=50)
    payload_json = Column(Text, nullable=True)

    experiment = relationship("ExperimentModel", back_populates="variants")


class ExperimentExposureModel(Base):
    __tablename__ = "experiment_exposures"

    id = Column(String, primary_key=True, index=True)
    experiment_id = Column(String, ForeignKey("experiments.id"), nullable=False, index=True)
    variant_id = Column(String, ForeignKey("experiment_variants.id"), nullable=False, index=True)
    session_id = Column(String, nullable=False, index=True)
    anonymous_id = Column(String, nullable=True)
    user_id = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    is_simulation = Column(Boolean, default=False, index=True)


class CampaignBudgetModel(Base):
    __tablename__ = "campaign_budgets"

    id = Column(String, primary_key=True, index=True)
    channel_name = Column(String, nullable=False)
    channel_type = Column(String, nullable=False)  # 'whatsapp', 'tech_clubs', 'instagram', 'linkedin', 'campus_posters', 'referral'
    planned_spend = Column(Integer, default=0)
    actual_spend = Column(Integer, default=0)
    simulated_spend = Column(Integer, default=0)
    notes = Column(Text, nullable=True)


# ==========================================
# Pydantic Schemas for Requests & Responses
# ==========================================

class QuizSubmissionRequest(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=128, description="Client session ID")
    year_of_study: int = Field(..., ge=1, le=4, description="Engineering Year 1-4")
    branch: str = Field(..., min_length=1, max_length=100, description="e.g. CSE, ECE, Mech")
    coding_level: str = Field(..., min_length=1, max_length=50, description="Beginner, Intermediate, Advanced")
    interest_area: str = Field(..., min_length=1, max_length=100, description="Area of interest")
    primary_goal: str = Field(..., min_length=1, max_length=100, description="Student career or learning goal")
    preferred_tech: Optional[str] = Field("Python", max_length=100)


class ProjectRecommendationResponse(BaseModel):
    id: str
    user_id: str
    project_id: str
    project_title: str
    category: str
    difficulty: str
    difficulty_stars: int = 3
    estimated_minutes: int = 60
    tech_stack: List[str]
    what_you_will_build: str
    why_this_matches_you: str
    learning_outcomes: List[str]
    portfolio_relevance: str
    portfolio_value: str = "High"
    is_ai_generated: bool
    summary_hook: str
    alternative_project_ids: List[str] = []


class RegistrationRequest(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=128)
    user_id: str = Field(..., min_length=1, max_length=128)
    full_name: str = Field(..., min_length=2, max_length=80)
    email: str = Field(..., max_length=120, pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")
    whatsapp_number: str = Field(..., min_length=10, max_length=25, pattern=r"^\+?[0-9\s\-]{10,25}$")
    college_name: str = Field(..., min_length=2, max_length=120)
    referred_by_code: Optional[str] = Field(None, max_length=32, pattern=r"^[A-Za-z0-9_-]*$")


class RegistrationResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    email: str
    college_name: str
    project_title: str
    referral_code: str
    referral_url: str
    registered_at: datetime
    message: str


class AnalyticsEventRequest(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=128)
    anonymous_id: Optional[str] = Field(None, max_length=128)
    user_id: Optional[str] = Field(None, max_length=128)
    event_name: str = Field(..., min_length=1, max_length=64, pattern=r"^[A-Za-z0-9_]+$")
    utm_source: Optional[str] = Field(None, max_length=100)
    utm_medium: Optional[str] = Field(None, max_length=100)
    utm_campaign: Optional[str] = Field(None, max_length=100)
    utm_content: Optional[str] = Field(None, max_length=100)
    referral_code: Optional[str] = Field(None, max_length=32, pattern=r"^[A-Za-z0-9_-]*$")
    experiment_id: Optional[str] = Field(None, max_length=64)
    variant: Optional[str] = Field(None, max_length=64)
    referrer_url: Optional[str] = Field(None, max_length=500)
    metadata: Optional[Dict[str, Any]] = None
    is_simulation: Optional[bool] = False


class FunnelStageMetric(BaseModel):
    stage_id: str
    stage_name: str
    event_name: str
    count: int
    conversion_from_previous: float
    conversion_from_top: float
    drop_off_count: int
    drop_off_pct: float


class DropOffAnalysis(BaseModel):
    biggest_drop_off_stage: str
    drop_off_count: int
    drop_off_pct: float
    observation: str
    action_hypothesis: str


class FunnelResponse(BaseModel):
    stages: List[FunnelStageMetric]
    drop_off_analysis: DropOffAnalysis
    total_funnel_conversion_pct: float
    is_simulation: bool
    data_label: str


class OverviewMetricsResponse(BaseModel):
    total_visitors: int
    total_registrations: int
    registration_conversion_pct: float
    total_referrals: int
    total_referred_registrations: int
    referral_conversion_pct: float
    referred_registration_rate: float = 0.0
    viral_coefficient: Optional[str] = "Insufficient data"
    target_registrations: int = 500
    goal_completion_pct: float
    is_simulation: bool
    data_label: str


class SourceMetric(BaseModel):
    source: str
    channel_type: str
    visitors: int
    quiz_starts: int
    registrations: int
    conversion_rate: float
    referrals_generated: int
    referred_registrations: int
    planned_spend: int
    actual_spend: int
    simulated_spend: int
    cost_per_registration: float
    quality_category: str  # 'High Efficiency', 'High Volume', 'Experimental'


class SourcesResponse(BaseModel):
    sources: List[SourceMetric]
    total_campaign_budget: int = 2000
    total_spent: int
    budget_recommendation: str
    is_simulation: bool
    data_label: str


class YearSegmentMetric(BaseModel):
    year: int
    year_label: str
    visitors: int
    quiz_completions: int
    registrations: int
    conversion_rate: float
    referrals: int
    primary_goal: str


class BranchSegmentMetric(BaseModel):
    branch: str
    project_generations: int
    registrations: int
    conversion_rate: float


class SegmentMetricsResponse(BaseModel):
    years: List[YearSegmentMetric]
    branches: List[BranchSegmentMetric]
    key_segment_insight: str
    is_simulation: bool
    data_label: str


class ProjectPerformanceMetric(BaseModel):
    project_id: str
    project_title: str
    category: str
    views: int
    registrations: int
    conversion_rate: float


class ProjectCategoryMetric(BaseModel):
    category: str
    views: int
    registrations: int
    share_pct: float


class ProjectMetricsResponse(BaseModel):
    projects: List[ProjectPerformanceMetric]
    categories: List[ProjectCategoryMetric]
    top_project: str
    is_simulation: bool
    data_label: str


class ReferralLeaderboardItem(BaseModel):
    rank: int
    student_name: str  # Safe masked 'Kartheek S.'
    referral_code: str
    successful_referrals: int


class ReferralMetricsResponse(BaseModel):
    total_registered_students: int
    referral_codes_generated: int = 0
    students_who_referred: int  # Synonym for referral participants
    referral_participants: int = 0
    referral_participation_rate: float
    total_referral_clicks: int
    referred_registrations: int
    referral_conversion_rate: float
    referred_registration_rate: float = 0.0
    viral_coefficient: Optional[str] = "Insufficient data"
    milestone_completions: Dict[str, int]
    leaderboard: List[ReferralLeaderboardItem]
    is_simulation: bool
    data_label: str


class ExperimentVariantStats(BaseModel):
    variant_id: str
    name: str
    label: str
    exposures: int
    conversions: int
    conversion_rate: float


class ExperimentReportItem(BaseModel):
    id: str
    name: str
    hypothesis: str
    primary_metric: str
    status: str
    variants: List[ExperimentVariantStats]
    leader_variant: Optional[str] = None
    lift_pct: float = 0.0
    signal_confidence: str  # 'Early directional signal', 'Weak signal', 'Insufficient data'
    decision_recommendation: str


class ExperimentsReportResponse(BaseModel):
    experiments: List[ExperimentReportItem]
    is_simulation: bool
    data_label: str


class GrowthInsightItem(BaseModel):
    category: str  # 'Acquisition', 'Funnel Bottleneck', 'Viral Loop', 'Experimentation', 'Budget Strategy'
    title: str
    observation: str
    action_hypothesis: str
    priority: str  # 'High', 'Medium', 'Strategic'


class GrowthInsightsResponse(BaseModel):
    insights: List[GrowthInsightItem]
    is_simulation: bool
    data_label: str


class AskAnalyticsRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=300, description="Natural language growth query")
    is_simulation: Optional[bool] = False


class AskAnalyticsResponse(BaseModel):
    question: str
    observation: str
    interpretation: str
    recommended_action: str
    supporting_metrics: Dict[str, Any]
    is_simulation: bool


class DashboardMetricsResponse(BaseModel):
    total_visitors: int
    total_quiz_starts: int
    total_quiz_completions: int
    total_projects_generated: int
    total_registrations: int
    target_registrations: int = 500
    goal_completion_pct: float
    funnel: List[FunnelStageMetric]
    registrations_by_year: Dict[str, int]
    registrations_by_source: Dict[str, int]
    viral_coefficient: float


# ==========================================
# Phase 3: Viral Growth Engine Schemas
# ==========================================

class ReferralContextResponse(BaseModel):
    valid: bool
    referral_code: str
    referrer_name: Optional[str] = None
    project_title: Optional[str] = None
    message: str


class ReferralClickRequest(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=128)
    referral_code: str = Field(..., min_length=1, max_length=32, pattern=r"^[A-Za-z0-9_-]+$")
    utm_source: Optional[str] = Field(None, max_length=100)
    referrer_url: Optional[str] = Field(None, max_length=500)


class MilestoneItem(BaseModel):
    id: str
    title: str
    required_count: int
    description: str
    badge: str
    is_unlocked: bool
    reward_content: Optional[str] = None


class ReferredFriendItem(BaseModel):
    name: str
    project_title: str
    registered_at: datetime
    status: str = "Registered"


class NextMilestoneItem(BaseModel):
    title: str
    required_count: int
    remaining: int
    progress_pct: float


class ReferralHubResponse(BaseModel):
    referral_code: str
    referral_url: str
    student_name: str
    project_title: str
    project_category: str
    difficulty: str
    total_clicks: int
    total_referrals: int
    next_milestone: Optional[NextMilestoneItem] = None
    milestones: List[MilestoneItem]
    referred_friends: List[ReferredFriendItem]


# ==========================================
# Experiment Assignment & Exposures
# ==========================================

class VariantDetail(BaseModel):
    id: str
    name: str
    label: str
    allocation_pct: int
    payload: Optional[Dict[str, Any]] = None


class ActiveExperimentDetail(BaseModel):
    id: str
    name: str
    hypothesis: str
    primary_metric: str
    status: str
    variants: List[VariantDetail]


class ActiveExperimentsResponse(BaseModel):
    experiments: List[ActiveExperimentDetail]


class ExposureRecordRequest(BaseModel):
    experiment_id: str
    variant_id: str
    session_id: str
    anonymous_id: Optional[str] = None
    user_id: Optional[str] = None
    is_simulation: Optional[bool] = False
