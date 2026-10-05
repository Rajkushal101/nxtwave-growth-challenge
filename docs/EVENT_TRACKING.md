# Event Tracking & Growth Funnel Specification

This document defines the analytics taxonomy, event naming conventions, payload schemas, and conversion KPIs for the NxtWave AI Project Matcher.

---

## 1. Funnel Stages & KPI Definitions

| Funnel Stage | Event Name | Trigger Condition | Core Metric Tracked |
| :--- | :--- | :--- | :--- |
| **Top of Funnel (A)** | `page_view` | Initial landing on home page | Total Traffic, UTM Source Attribution |
| **Engagement 1 (E1)** | `quiz_started` | User answers Question 1 (Year) | Start Rate = `quiz_started / page_view` |
| **Engagement 2 (E2)** | `quiz_completed` | User completes Question 5 | Quiz Completion Rate = `quiz_completed / quiz_started` |
| **Value Delivered (V)** | `project_generated` | Recommended project shown | Value Drop-off = `(quiz_completed - project_generated)` |
| **Intent (I)** | `registration_started` | User opens "Build With Us" modal | Intent Rate = `registration_started / project_generated` |
| **Conversion (C)** | `registration_completed` | User submits registration form | Reg Conversion = `registration_completed / page_view` |
| **Virality 1 (K1)** | `share_clicked` | Clicks WhatsApp / Copy / Download | Virality Intent = `share_clicked / registration_completed` |
| **Virality 2 (K2)** | `referral_clicked` | Peer opens `/r/:code` link | Referral Reach = `referral_clicked / share_clicked` |
| **Loop Close (K3)** | `referral_registered` | Peer completes registration | Viral Coefficient (K) = `referred_registrations / total_registrations` |

---

## 2. Event Payload Schema

All events dispatched via client `tracker.js` follow this unified payload format:

```json
{
  "session_id": "ses_9a7b8c2d1e",
  "event_name": "quiz_completed",
  "utm_source": "wa_college_club",
  "utm_medium": "whatsapp_group",
  "utm_campaign": "build_60m_mar",
  "referrer_url": "https://web.whatsapp.com/",
  "metadata": {
    "year_of_study": 2,
    "branch": "ECE",
    "coding_level": "Intermediate",
    "interest_area": "IoT & Automation",
    "primary_goal": "Hackathons"
  }
}
```

---

## 3. Detailed Event Taxonomy

### `page_view`
- **When:** Page mount in `App.jsx`
- **Metadata:** `{ "path": "/", "screen_width": 390, "user_agent": "Mobile/Safari" }`

### `quiz_started`
- **When:** User selects their engineering year (Question 1)
- **Metadata:** `{ "year_of_study": 1 }`

### `quiz_step_completed`
- **When:** User answers steps 1 through 5
- **Metadata:** `{ "step": 3, "question": "coding_level", "answer": "Beginner" }`

### `quiz_completed`
- **When:** User finishes all 5 questions
- **Metadata:** `{ "time_spent_seconds": 38, "branch": "CSE" }`

### `project_generated`
- **When:** System returns recommendation
- **Metadata:** `{ "project_title": "AI Phishing Detector", "is_ai_generated": true, "latency_ms": 780 }`

### `registration_started`
- **When:** User clicks "Build It With Us" CTA
- **Metadata:** `{ "project_id": "proj_123", "cta_variant": "Build My Project" }`

### `registration_completed`
- **When:** Backend returns 201 Created for registration
- **Metadata:** `{ "referral_code": "PRIYA3", "referred_by": "KARTHEEK7" }`

### `share_clicked`
- **When:** User triggers a share action in Referral Hub
- **Metadata:** `{ "channel": "whatsapp", "referral_code": "PRIYA3" }`

### `referral_clicked`
- **When:** A peer lands via a referral URL (`/r/:code`)
- **Metadata:** `{ "referrer_code": "KARTHEEK7" }`

---

## 4. Growth Metric Formulas

1. **Overall Conversion Rate:**
   $$\text{CVR} = \frac{\text{Total Registrations}}{\text{Total Unique Visitors}} \times 100$$
   *Target: $\ge 25\%$ (leveraging value-first quiz engagement)*

2. **Viral Cycle Time (VCT):**
   Average hours between Student A registering and Student B (referred by A) registering.
   *Target: $< 24\text{ hours}$ via immediate WhatsApp sharing.*

3. **Viral Coefficient ($K$):**
   $$K = i \times c$$
   Where $i$ = average invites sent per user, and $c$ = conversion rate of invites.
   *Target: $K = 0.35$ (meaning every 100 registrations organically generate 35 additional registrations).*
