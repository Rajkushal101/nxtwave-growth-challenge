# System Architecture & Technical Specifications

> **Project:** What AI Project Should You Build? — NxtWave 60-Minute AI Challenge  
> **Status:** Phase 6 Final Architecture Verification  

---

## 1. High-Level Architecture Overview

The system is organized as a decoupled, modern multi-tier web application designed for high-concurrency event telemetry, deterministic fallback reliability, and measurable acquisition loops:

```
                            ┌─────────────────────────────────────────┐
                            │              CLIENT BROWSER             │
                            │  React 18 SPA (Vite) / Vanilla CSS      │
                            │  Responsive Viewport (Mobile & Desktop) │
                            └────────────────────┬────────────────────┘
                                                 │
                                                 │ HTTPS / JSON REST
                                                 ▼
                            ┌─────────────────────────────────────────┐
                            │             FASTAPI BACKEND             │
                            │  Async ASGI Engine (Python 3.12)        │
                            │  Port 8000 (Local Dev: Port 8002)       │
                            └────────────────────┬────────────────────┘
                                                 │
               ┌─────────────────────────────────┼─────────────────────────────────┐
               │                                 │                                 │
               ▼                                 ▼                                 ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐   ┌─────────────────────────────┐
│  AI RECOMMENDATION ENGINE   │   │     GROWTH & VIRAL ENGINE   │   │   EVENT & TELEMETRY ENGINE  │
│ • 17-Project Curated Catalog│   │ • Unique Referral Generator │   │ • 9-Stage Canonical Funnel  │
│ • Deterministic Fallback    │   │ • First-Touch Attribution   │   │ • First-Touch UTM Parser    │
│ • Google Gemini LLM API     │   │ • Anti-Abuse (Self-referral)│   │ • A/B Testing Randomizer    │
│ • Contextual Match Rationale│   │ • Milestone Progress Unlocks│   │ • Simulation Isolation Flag │
└──────────────┬──────────────┘   └──────────────┬──────────────┘   └──────────────┬──────────────┘
               │                                 │                                 │
               └─────────────────────────────────┼─────────────────────────────────┘
                                                 │
                                                 ▼
                            ┌─────────────────────────────────────────┐
                            │            PERSISTENCE LAYER            │
                            │  SQLAlchemy 2.0 Async ORM               │
                            │  Local/Demo: SQLite (growth_challenge.db│
                            │  Production: PostgreSQL / Managed Cloud │
                            └─────────────────────────────────────────┘
```

---

## 2. Core Subsystems & Responsibilities

### 2.1 React 18 Single-Page Application (Frontend)
- **Framework & Tooling:** React 18, Vite 5.4, Lucide React icons, Canvas-Confetti, QRCode.react.
- **Styling Architecture:** Vanilla CSS design system (`index.css`) featuring custom CSS variables, dark developer theme, responsive flex/grid layouts, micro-animations, and full WCAG accessibility compliance (contrast, ARIA tags, screen reader cues).
- **Core Views:**
  1. **Landing Hero:** Dynamic headline A/B testing variant display, value proposition, and quiz trigger.
  2. **Questionnaire Flow:** 5-question multi-step quiz (Year of study, Engineering branch, Coding comfort level, AI interest area, Primary career/learning goal).
  3. **Personalized Project Card:** Dynamic category badges, build time estimates, difficulty stars, tailored match explanation, learning outcomes, tech stack pills, and HTML5 Canvas share card with embedded QR code.
  4. **Registration Modal:** High-intent workshop enrollment with form pre-fill from questionnaire context.
  5. **Referral Growth Hub:** Live personal referral metrics, unique `/r/{CODE}` copy/share buttons, WhatsApp direct deep link, milestone unlock badges (Blueprint, VIP Pass, Mentor Review), and masked list of attributed friends.
  6. **Growth Analytics Dashboard:** Complete administrative dashboard showcasing canonical 9-stage funnel drop-offs, acquisition source breakdown, year/branch segmentation, privacy-safe viral leaderboard, A/B experiment evaluation, and strategic budget recommendations.

### 2.2 FastAPI Asynchronous Backend
- **Asynchronous Concurrency:** Built on `FastAPI` with `async/await` throughout, utilizing `aiosqlite` and `asyncpg`-compatible SQLAlchemy 2.0 async sessions.
- **Deterministic AI Recommendation (`recommender.py` & `ai_service.py`):**
  - Primary path: Gemini 1.5 Flash generates tailored hooks and customized project adaptations.
  - Fail-safe fallback: 24-entry deterministic matrix matching student year + branch + interest directly to a relevant project from the 17-project catalog. Ensures **zero user-facing failures** even if API quotas or internet connectivity fail.
- **Workshop Registration & Anti-Abuse Engine (`registration.py`):**
  - Generates memorable, unique referral codes (e.g., `KARTHE63`, `AARAVS55`).
  - Enforces strict anti-abuse protections: self-referral blocking (by code and email), deduplication of existing registrants, and graceful handling of nonexistent referral codes.
- **Analytics & Growth Telemetry Engine (`analytics.py` & `experiments.py`):**
  - Logs granular events (`page_view`, `quiz_started`, `quiz_completed`, `project_generated`, `registration_started`, `registration_completed`, `referral_click`, etc.).
  - Preserves Single First-Touch UTM attribution across all visitor sessions.
  - Partitions telemetry using an explicit `is_simulation` database column, preventing prototype demo data from contaminating live user telemetry.

---

## 3. Database Entity Relationship Model

| Entity Table | Primary Key | Description & Key Columns |
|---|---|---|
| `users` | `id` (VARCHAR UUID) | Respondent demographic profile (`year_of_study`, `branch`, `coding_level`, `interest_area`, `primary_goal`, `session_id`). |
| `project_recommendations` | `id` (VARCHAR UUID) | Recommendations delivered (`user_id`, `project_id`, `project_title`, `why_this_matches_you`, `is_ai_generated`). |
| `registrations` | `id` (VARCHAR UUID) | Confirmed workshop registrants (`user_id`, `full_name`, `email`, `whatsapp_number`, `college_name`, `referral_code`, `referred_by_code`, `is_simulation`). |
| `referrals` | `id` (VARCHAR UUID) | Successful peer referral conversions (`referrer_code`, `referred_user_id`, `referred_name`, `status`, `is_simulation`). |
| `referral_clicks` | `id` (VARCHAR UUID) | Inbound visits attributed to a referral link (`referral_code`, `session_id`, `is_simulation`). |
| `analytics_events` | `id` (INTEGER AUTO) | Telemetry stream (`session_id`, `anonymous_id`, `event_name`, `utm_source`, `utm_medium`, `utm_campaign`, `is_simulation`). |
| `experiments` | `id` (VARCHAR) | Registered A/B tests (`name`, `hypothesis`, `primary_metric`, `status`). |
| `experiment_variants` | `id` (VARCHAR) | Test variations (`experiment_id`, `name`, `label`, `allocation_pct`). |
| `experiment_exposures`| `id` (VARCHAR UUID) | User variant exposure records (`experiment_id`, `variant_id`, `session_id`, `is_simulation`). |
| `campaign_budgets` | `id` (VARCHAR) | ₹2,000 budget models (`channel_name`, `channel_type`, `planned_spend`, `simulated_spend`, `actual_spend`). |

---

## 4. Security & Hardening Configuration

1. **Parameterization:** 100% of SQL queries executed through SQLAlchemy ORM parameter binding, preventing SQL injection.
2. **Input Validation:** Strict Pydantic schemas validating string boundaries (min/max lengths), email format regex, and allowed integer ranges (Years 1–4).
3. **CORS Hardening:** Configured with specific permitted origins in production; disallowed origins receive standard HTTP 400 rejection.
4. **Error Masking:** Global exception handling masks internal stack traces and database paths, returning clean client-facing error payloads.
5. **Privacy Safe Telemetry:** Student names on public leaderboards and referral hubs are masked (e.g., `Vikram D.`, `Sneha R.`) to prevent private PII leakage.
6. **Credential Hygiene:** No API keys or database credentials committed to version control; `.env` is ignored by `.gitignore`, and `.env.example` provides sanitized templates.

---

## 5. Deployment Topology

- **Demo / Local Baseline:**
  - Frontend: Vite dev server on `http://localhost:5173` (proxied to API).
  - Backend: Uvicorn ASGI server on `http://localhost:8002` (or port 8000).
  - Database: Local SQLite file (`growth_challenge.db`).
- **Production Recommendation:**
  - Frontend: Vercel / Cloudflare Pages / AWS S3 + CloudFront (static bundle).
  - Backend: Render / AWS ECS / Google Cloud Run container running Uvicorn.
  - Database: AWS RDS PostgreSQL or Supabase / Neon managed PostgreSQL.
