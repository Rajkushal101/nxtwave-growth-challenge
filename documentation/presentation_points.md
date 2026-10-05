# Final Presentation Talking Points & Q&A Defense

> **Guide for Evaluator Q&A and Project Defense**  
> **Topic:** Growth Engine Architecture, Telemetry Standards & Experimentation  

---

### 1. Core Vision & Problem Solving

**Q: What specific problem are you solving?**  
**A:** Engineering students frequently suffer from tutorial paralysis. They know AI is critical for placements, but generic webinars have poor attendance because students feel the content won't be relevant. We solve this by matching them to a specific, realistic 60-minute project based on their year, branch, and skills *before* asking them to register.

**Q: Why engineering students across all four years?**  
**A:** 1st-year students need foundational confidence without setup hurdles; 2nd-year students need practical applications of data structures; 3rd-year students are desperate for placement portfolio differentiators; and 4th-year students need solid capstone architectures. A one-size-fits-all pitch alienates three-quarters of the campus.

---

### 2. Architecture & AI Reliability

**Q: How does the recommendation engine work?**  
**A:** We use a dual-tier architecture. A 17-project curated catalog covers 5 key domains (AI/ML, Cybersecurity, Data/Analytics, Productivity, Automation). Google Gemini 1.5 Flash provides personalized match rationale and tailoring. If the Gemini API is unreachable, times out, or has no quota, a 24-entry deterministic fallback matrix resolves in under 5 milliseconds. The student experience never breaks.

**Q: Why combine deterministic rules with AI instead of just an LLM prompt?**  
**A:** In high-volume student growth campaigns, zero-downtime reliability is paramount. Pure LLMs introduce latency, hallucinations, schema drift, and rate-limit failures. Our deterministic fallback guarantees a valid, curated project match 100% of the time, while the LLM acts as an enhancer for contextual rationale.

---

### 3. Growth Mechanics & Referral Loop

**Q: How does the referral loop work?**  
**A:** The student's personalized project becomes a **social object**. Upon registration, the student receives a personalized project card, an embedded QR code, and a clean link (`/r/{CODE}`). When shared on WhatsApp ("I'm building an AI ATS Matcher—find yours!"), clicking friends arrive with preserved attribution context, explore their own projects, and convert.

**Q: How do you prevent referral spam and fake metrics?**  
**A:** We implemented automated anti-abuse guardrails in `registration.py`:
1. Direct self-referral blocking by comparing incoming referral code against the newly generated code.
2. Email matching checks preventing a student from referring alternative emails owned by the same user.
3. Idempotent deduplication for repeat registrations.
4. Graceful fallback for malformed or nonexistent codes.

---

### 4. Telemetry, Analytics & Data Honesty

**Q: What is the difference between simulated and live data in your dashboard?**  
**A:** The repository maintains strict partitioning via an `is_simulation` column in SQLite. Live user sessions and manual test registrations are tracked as **LIVE PRODUCTION TELEMETRY** (23 verified registrations). The 187 registrations shown in the dashboard represent a **SIMULATED DEMO DATA** cohort generated to demonstrate the 7-day campaign analysis, budget allocation, and funnel drop-off math. We never combine or misrepresent simulated data as real-world results.

**Q: Why does the dashboard say "Insufficient data" for the Viral Coefficient ($K$)?**  
**A:** True $K$-factor calculation requires tracking the exact number of external invitations sent per user ($K = i \times c$). Because students share via native mobile WhatsApp and OS clipboard copies, client apps cannot measure the denominator ($i$) without privacy-invasive contacts permissions. Reporting an arbitrary $K > 1$ would be scientifically dishonest. We report "Insufficient data" while reporting the verified **Referred Registration Rate (16.6%)** and **Referral Conversion Rate (15.7%)**.

---

### 5. Growth Economics & Experimentation

**Q: How would you allocate the ₹2,000 budget?**  
**A:** Based on our acquisition telemetry:
- **₹800 (40%) to College Communities & Tech Clubs:** Delivers our highest volume and high conversion (15.9%) at ₹7.41 per registration.
- **₹500 (25%) to Campus QR Posters:** Placed in college labs and libraries for low-friction physical-to-digital capture.
- **₹400 (20%) to Instagram Micro-Demos:** Generates top-of-funnel reach, but capped due to higher acquisition cost (₹26.92/reg).
- **₹200 (10%) to WhatsApp Broadcasts:** Direct outreach with lowest cost/reg (₹3.57).
- **₹100 (5%) to Referral Rewards:** Bounties for top peer champions.

**Q: What is the primary bottleneck in your funnel, and how would you fix it?**  
**A:** The steepest drop-off occurs between **Project Generated (670)** and **Registration Started (208)** (a 69% drop). To address this, our A/B test evaluated value-focused CTA copy (`Build My Project` vs. `Register Now`). The value-focused copy showed an early directional lift of **+40.8%**. Shifting traffic to this variant alongside displaying mentor credentials directly on the card addresses this drop.

---

### 6. Security & Infrastructure

**Q: How is the system secured?**  
**A:** 
- Parameterized ORM queries preventing SQL injection.
- Strict Pydantic boundary validation (regex email validation, engineering year limits 1–4).
- Production CORS origin restrictions.
- Sanitized error masking preventing traceback leakage.
- Privacy-safe masking for public student referral leaderboards (e.g. `Vikram D.`).
- Credential isolation: `.env` is ignored by git, with template placeholders in `.env.example`.
