# Growth Strategy & Acquisition Architecture

> **Campaign Target:** Acquire 500 verified engineering student registrations for the workshop *"Build Your First AI Project in 60 Minutes"* within 7 days.  
> **Budget Model:** Strategic allocation of ₹2,000 across targeted student acquisition channels.  

---

## 1. Target Audience & Positioning

### Positioning Statement
*"What AI Project Should You Build?" is an AI-powered project discovery and growth experience for engineering students across all four years.*

### Audience Segmentation Matrix

| Year of Study | Primary Student Mindset | Value Hook | Catalog Focus |
|---|---|---|---|
| **1st Year (Freshers)** | Curiosity, exploring whether coding/AI is for them. | "Zero-setup beginner project you can build in 60 mins." | Study Assistant, Note Summarizer |
| **2nd Year (Foundations)** | Core subjects, building fundamental coding confidence. | "Move beyond syntax to build an end-to-end working AI tool." | Sentiment Analyzer, Log Explainer |
| **3rd Year (Placements)** | Resume anxiety, internship applications, portfolio needs. | "Build a standout AI project that recruiters can test live." | Phishing Detector, Market Forecaster |
| **4th Year (Capstones)** | Final year capstone, specialized roles, career readiness. | "Advanced architecture with deployment checklist & repo." | Multimodal Inspector, Resume/ATS Matcher |

---

## 2. The Core Growth Loop

Instead of pushing students immediately to a generic webinar form, the product delivers value **before** making the registration ask:

```
                      ┌────────────────────────┐
                      │ 1. GIVE VALUE FIRST    │
                      │ 5-step quiz matches    │
                      │ student to tailored AI │
                      │ project idea & stack   │
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │ 2. CREATE CURIOSITY    │
                      │ "Here is what you'll   │
                      │ build: step-by-step in │
                      │ 60 minutes with us"    │
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │ 3. HIGH-INTENT CONVERT │
                      │ Student registers      │
                      │ (Profile pre-filled)   │
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │ 4. EMPOWER SHARING     │
                      │ Student receives       │
                      │ unique code + card:    │
                      │ "I'm building X, what  │
                      │ will you build?"       │
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │ 5. REFERRED PEERS JOIN │
                      │ Friends click /r/CODE  │
                      │ & discover their own   │
                      │ personalized projects  │
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │ 6. MEASURE & IMPROVE   │
                      │ Telemetry spots drops  │
                      │ & informs reallocation │
                      └────────────────────────┘
```

---

## 3. Acquisition Channels & ₹2,000 Budget Strategy

### Core Principle
**"Data informs where the next ₹2,000 should go — not retrospective fabrication of money already spent."**

| Channel | Planned Spend | Strategic Role | Cost per Registration (Simulated Benchmark) | Strategic Finding |
|---|---|---|---|---|
| **College Communities & Tech Clubs** | **₹800 (40%)** | Scaled peer distribution via campus GDSC, coding club WhatsApp groups, and student tech leads. | **₹7.41** | **Highest Efficiency & Volume.** Tech club announcements generate pre-qualified high-intent visitors. |
| **Direct WhatsApp Outreach** | **₹200 (10%)** | Batch representative broadcasts with rich previewable cards. | **₹3.57** | **Lowest Cost per Registration.** Highly viral inside peer study circles. |
| **Campus QR Posters** | **₹500 (25%)** | Print posters placed in engineering computer labs, canteens, and library notice boards. | **₹20.83** | **Experimental Physical-to-Digital.** High capture rate during project assignment submission weeks. |
| **Instagram Micro-Demos** | **₹400 (20%)** | Paid 15-second screen recordings showing a live 60-second build of an AI project. | **₹26.92** | **Top-of-Funnel Discovery.** Broadest reach, but lower conversion rate (11.8%). Best capped at ₹400. |
| **Peer Referral Rewards (Incentive Pool)** | **₹100 (5%)** | Bonus pool for top student champions (e.g., printed swag, mentor review unlock). | **₹0.00 (Organic)** | Drives organic viral multiplier at zero direct marginal ad spend. |
| **Total** | **₹2,000 (100%)** | | **Blended Target: < ₹10.00** | |

---

## 4. Path to 500 Registrations (Planning Model)

> **Clarification:** The 500-registration figure is an operational **growth target**, not an already-achieved historical metric. The demonstration dataset models a simulated 7-day cohort of 187 registrations.

### 500-Registration Mathematical Model
To scale from the simulated 187 cohort to 500 registrations:
1. **Top of Funnel Visitors Required:** ~3,200 visitors at a steady 15.6% visitor-to-registration conversion rate.
2. **Channel Contribution Mix:**
   - College Tech Clubs & Campus Leads: 180 registrations (36%)
   - WhatsApp Study Group Broadcasts: 130 registrations (26%)
   - Organic Peer Referrals (K-Loop): 95 registrations (19%)
   - Campus Physical QR Posters: 55 registrations (11%)
   - Instagram Reels & Social Discovery: 40 registrations (8%)
3. **Primary Bottleneck Fix:**
   - In the funnel, the biggest drop-off occurs between **Project Generated (670)** and **Registration Started (208)** (a 69% drop).
   - Implementing the winning A/B variant (`Build My Project` instead of generic `Register Now`) and embedding mentor session preview notes recovers an estimated 12–18% of this dropped cohort, yielding 80+ additional registrations without increasing top-of-funnel ad spend.

---

## 5. Proposed 7-Day Growth Execution Plan

*(A planned schedule for campaign execution — not past activities)*

- **Day 1: Instrument & Launch Baseline**
  - Verify event telemetry pipelines, QR link tracking, and database integrity.
  - Deploy initial zero-spend link to 3 pilot student leads to verify attribution.
- **Day 2: WhatsApp Study Circles & Micro-Squads**
  - Seed personalized project cards into 1st and 2nd year class WhatsApp groups.
  - Monitor real-time quiz start and completion rates.
- **Day 3: Campus Club Partnerships**
  - Activate GDSC, IEEE, and student coding club heads across 5 engineering colleges.
  - Provide club leads with dedicated UTM referral links (`utm_source=college_clubs`).
- **Day 4: Physical Campus Lab Activation**
  - Put up A4 QR posters in computer labs and college libraries targeting 3rd-year placement students.
- **Day 5: Funnel Drop-off Analysis**
  - Review 9-stage drop-off analytics. Inspect mobile checkout friction.
- **Day 6: A/B Experiment Optimization**
  - Route 80% of traffic to the winning CTA copy variant (`Build My Project`).
- **Day 7: Budget Reallocation & Scaling**
  - Double down spend on the lowest-cost channels (College Communities & WhatsApp); pause underperforming creative on Instagram.

---

## 6. Strategic Risks & Mitigations

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| **Form Abandonment on Registration** | High | Minimize registration inputs to 4 fields; pre-fill year, branch, and project context from quiz. |
| **Referral Fatigue (Spam resistance)** | Medium | Provide genuine value unlock (AI Project Starter Blueprint) at just 2 referrals rather than requiring unrealistic volumes. |
| **Mobile Latency on AI Generation** | Medium | Fallback matrix responds in < 5ms; Gemini responses streamed or cached if latency exceeds 2.5s. |
| **Free-Rider Referrals (Self-sharing)** | Low | Automated anti-abuse guardrails block self-referrals by IP/session/email and ignore invalid codes. |
