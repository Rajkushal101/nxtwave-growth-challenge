# 🚀 NxtWave Growth Challenge — "What AI Project Should You Build?"

> **Mission:** Acquire **500 verified engineering student registrations** for a free workshop *"Build Your First AI Project in 60 Minutes"* — within **7 days**, on a **₹2,000 budget** — using an AI-powered, viral growth engine.

[![Phase 2 Tests](https://img.shields.io/badge/Phase%202%20Tests-PASS%20100%25-brightgreen)](./test_phase2.py)
[![Phase 3 Tests](https://img.shields.io/badge/Phase%203%20Tests-PASS%20100%25-brightgreen)](./test_phase3.py)
[![Phase 4 Tests](https://img.shields.io/badge/Phase%204%20Tests-PASS%20100%25-brightgreen)](./backend/test_phase4.py)
[![Phase 4 Corrections](https://img.shields.io/badge/Phase%204%20Corrections-PASS%20100%25-brightgreen)](./backend/test_phase4_corrections.py)
[![Phase 5 QA](https://img.shields.io/badge/Phase%205%20QA-15%2F15%20PASS-brightgreen)](./backend/test_phase5_qa.py)
[![Phase 6 E2E](https://img.shields.io/badge/Phase%206%20E2E-PASS%20100%25-brightgreen)](./backend/test_phase6_e2e.py)

---

## 🎯 The Core Growth Idea

Instead of pushing engineering students to a generic webinar form, this platform delivers a **value-first growth mechanism**:

```text
Discovery (WhatsApp Groups / College Tech Clubs / Campus QR Posters)
    │
    ▼
"What AI Project Should You Build?" — 5-Step Quiz
    │  (Academic Year → Engineering Branch → Coding Level → Interest Area → Goal)
    ▼
Dual-Tier Personalized Project Recommendation
    │  (Gemini 1.5 Flash + 24-entry deterministic fallback — zero API-failure risk)
    ▼
High-Intent Workshop Registration — "Build It With Us in 60 Mins"
    │  (Profile pre-filled from questionnaire context)
    ▼
Viral Referral Hub — Unique Code + Shareable HTML5 Canvas Card + Embedded QR
    │  (Milestone 1: 1 referral → AI Starter Blueprint unlocked)
    ▼
Campus Friends Join → Growth Loop Closes
```

**Why this works:** Students receive a tailored, realistic project idea *before* being asked to register. The value exchange happens before the ask — converting passive browsers into motivated registrants.

---

## 🏗️ System Architecture & Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | SPA, dark developer aesthetic, WCAG-accessible, mobile-first responsive. |
| **Backend** | Python 3.12 + FastAPI | Async REST API, Pydantic input validation, CORS protection. |
| **Database** | SQLite + SQLAlchemy 2.0 (Async) | Full referential integrity, parameter-bound queries, indexed lookups. |
| **AI Personalization** | Google Gemini 1.5 Flash | Dynamic project tailoring and match rationale generation. |
| **Fail-Safe Fallback** | 24-Entry Deterministic Matrix | Instant fallback (< 5ms) ensuring zero user failure on API downtime. |
| **Event Telemetry** | Granular In-House Event Engine | 9-stage canonical funnel, Single First-Touch attribution, is_simulation partitioning. |
| **Growth & Experiments**| A/B Testing & Referral Engine | Deterministic variant assignment, anti-abuse checks, budget decision modeling. |

---

## 📂 Project Organization

```text
Nextwave/
├── backend/
│   ├── app/
│   │   ├── api/             # REST endpoints (recommend, register, referrals, analytics, experiments)
│   │   ├── core/            # Database async session, configuration & settings
│   │   ├── models/          # SQLAlchemy ORM models & Pydantic schemas
│   │   ├── services/        # Catalog, AI service, fallback matrix, tracker, experiments
│   │   └── main.py          # FastAPI application entrypoint
│   ├── growth_challenge.db  # SQLite database with strict simulation isolation
│   ├── requirements.txt     # Python backend dependencies
│   ├── test_phase4.py       # Phase 4 telemetry test suite
│   ├── test_phase4_corrections.py # Phase 4 mathematical reconciliation audit
│   ├── test_phase5_qa.py    # Phase 5 comprehensive QA & security suite
│   └── test_phase6_e2e.py   # Phase 6 full end-to-end journey verification
├── frontend/
│   ├── src/
│   │   ├── components/      # Quiz, ProjectCard, ReferralHub, RegistrationModal, AnalyticsDashboard
│   │   ├── services/        # API client and event tracker service
│   │   ├── App.jsx          # Master application layout
│   │   ├── index.css        # Modern design system & CSS variables
│   │   └── main.jsx
│   ├── package.json         # React + Vite dependencies
│   ├── vite.config.js       # Vite build & proxy settings
│   └── dist/                # Verified production build output
├── documentation/           # Phase 6 Submission Documentation Package
│   ├── architecture.md      # System architecture, data flow & security specifications
│   ├── growth_strategy.md   # Target audience, growth loop, ₹2,000 budget & 500-student model
│   ├── metrics.md           # 9-stage funnel math, single first-touch attribution & A/B benchmarks
│   ├── demo_script.md       # 3-minute video recording script with timestamps
│   ├── presentation_points.md # Evaluator Q&A defense & interview talking points
│   ├── submission_description.md # Final project description & core value narrative
│   ├── screenshot_checklist.md # 15-point visual capture guide for live running app
│   └── FINAL_PROJECT_STATUS.md # Complete audit matrix & phase completion sign-off
├── docs/                    # Architectural design documentation from Phases 1–3
├── phase6_final_report.md   # Comprehensive Phase 6 deployment & submission report
├── test_phase2.py           # Phase 2 core catalog & recommendation test
├── test_phase3.py           # Phase 3 viral growth engine test
├── .env.example             # Sanitized environment variable template
├── .gitignore               # Secrets and build artifact exclusions
└── README.md
```

---

## 🚀 Quickstart & Local Verification

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- Swagger API Documentation: `http://localhost:8000/docs`
- System Health Check: `http://localhost:8000/api/health`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Interactive Application: `http://localhost:5173`

---

## 🧪 Comprehensive Test Suite Execution

All test suites have been verified with a **100% passing rate**:

```bash
# Phase 2: Core Project Matcher & Registration Flow
python test_phase2.py

# Phase 3: Viral Growth Engine & Referral Attribution
python test_phase3.py

# Phase 4: Telemetry & Funnel Engine
python backend/test_phase4.py

# Phase 4 Corrections: Mathematical Reconciliation Audit
python backend/test_phase4_corrections.py

# Phase 5: Comprehensive QA, Security & Resilience (15/15)
python backend/test_phase5_qa.py

# Phase 6: Complete End-to-End User Journey & Referral Audit
python backend/test_phase6_e2e.py

# Frontend Production Build Verification
cd frontend && npm run build
```

---

## 📊 Analytics & Telemetry Framework

### Single First-Touch Acquisition Breakdown (Reconciled)
All 1,248 simulated visitors and 187 registrations reconcile with 100% mathematical consistency:

| Channel | Visitors | Share | Registrations | Conversion | Cost / Reg (Simulated Benchmark) |
|---|---|---|---|---|---|
| **College Clubs** | 340 | 27.2% | 54 | 15.9% | ₹7.41 |
| **WhatsApp** | 260 | 20.8% | 42 | 16.2% | ₹3.57 |
| **Instagram** | 220 | 17.6% | 26 | 11.8% | ₹26.92 |
| **Referral** | 198 | 15.9% | 31 | 15.7% | ₹0.00 (Organic) |
| **Campus QR** | 100 | 8.0% | 12 | 12.0% | ₹20.83 |
| **LinkedIn** | 90 | 7.2% | 14 | 15.6% | ₹7.14 |
| **Direct / Organic**| 40 | 3.2% | 8 | 20.0% | ₹0.00 (Organic) |
| **Total Reconciled**| **1,248** | **100.0%** | **187** | **15.0%** | **₹8.56 (Blended)** |

### Strict Simulation vs. Live Data Isolation
- **Simulated Demo Data:** 187 registrations (used strictly to demonstrate the 7-day campaign analysis and budget allocation model).
- **Live Telemetry:** 23 registrations (generated during integration testing and manual verification).
- **Data Partitioning:** Every record is partitioned via an explicit `is_simulation` database column. The dashboard clearly labels active data modes.

---

## 🔒 Security Hardening

- [x] Zero hardcoded secrets in source files.
- [x] `.env` excluded from version control via `.gitignore`.
- [x] `.env.example` provided with safe placeholders.
- [x] Parameterized SQL queries via SQLAlchemy ORM (100% SQL injection resistance).
- [x] Input boundary sanitization via Pydantic schemas.
- [x] Production CORS origin enforcement.
- [x] Global exception masking preventing traceback leaks.
- [x] PII masking on student referral leaderboards (e.g. `Vikram D.`).

---

## 🌐 Production Deployment Guide

### Recommended Deployment Topology
- **Frontend:** Static SPA hosting on Vercel, Cloudflare Pages, or AWS S3 + CloudFront.
- **Backend:** Containerized FastAPI app on Render, Google Cloud Run, or AWS ECS.
- **Database:** Managed PostgreSQL (e.g., Supabase, Neon, or AWS RDS).
- **Configuration:** Set `ENVIRONMENT=production`, supply `SECRET_KEY` and `DATABASE_URL` via cloud environment settings, and set `CORS_ORIGINS` to the production frontend domain.

---

## ⚖️ Known Limitations

1. **Simulated Campaign Telemetry:** The 187 registrations shown in the campaign dashboard represent a simulated demonstration cohort, not real-world ad spend.
2. **Viral Coefficient ($K$):** Accurately reported as **"Insufficient data"** because external mobile messaging channels do not expose recipient contact counts.
3. **A/B Testing Conclusions:** The +40.8% lift on the value-focused CTA is reported as an **"Early directional signal"**, not definitive statistical proof.
4. **Local Database:** Current setup uses SQLite for frictionless zero-setup evaluation; production deployments should use a managed relational database.
