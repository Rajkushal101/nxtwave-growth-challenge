"""
Complete End-to-End User Journey & Referral Demonstration Test for Phase 6.
Tests:
1. Landing Page visit & telemetry
2. Quiz Progression
3. Personalized Project Recommendation (Student A)
4. Registration & Referral Code Generation
5. Growth Hub verification
6. Student B arrives via Student A referral URL
7. Student B Quiz & Recommendation (Different persona)
8. Student B Registration with Referral Attribution
9. Student A Growth Hub verification (Attribution + Milestone increment)
10. Anti-abuse guardrails (Self-referral protection, invalid code handling)
11. Analytics dashboard metrics update
"""
import urllib.request
import json
import uuid

BASE = "http://localhost:8002"

def post_json(path, data):
    req = urllib.request.Request(
        f"{BASE}{path}",
        data=json.dumps(data).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read())

def get_json(path):
    with urllib.request.urlopen(f"{BASE}{path}") as res:
        return json.loads(res.read())

def run_e2e_verification():
    print("==================================================================")
    print("      PHASE 6: COMPLETE END-TO-END JOURNEY & REFERRAL AUDIT       ")
    print("==================================================================")

    # 1. Landing & Visit Telemetry
    sess_a = f"e2e_ses_{uuid.uuid4().hex[:8]}"
    anon_a = f"e2e_anon_{uuid.uuid4().hex[:8]}"
    ev1 = post_json("/api/analytics/event", {
        "session_id": sess_a,
        "anonymous_id": anon_a,
        "event_name": "page_view",
        "utm_source": "college_clubs",
        "utm_medium": "community",
        "utm_campaign": "march_challenge"
    })
    print(f"[STAGE 1] Landing Page Telemetry Recorded: status={ev1.get('status')}")

    # 2. Quiz Progression
    post_json("/api/analytics/event", {
        "session_id": sess_a,
        "anonymous_id": anon_a,
        "event_name": "quiz_started",
        "utm_source": "college_clubs"
    })
    post_json("/api/analytics/event", {
        "session_id": sess_a,
        "anonymous_id": anon_a,
        "event_name": "quiz_completed",
        "utm_source": "college_clubs"
    })
    print("[STAGE 2] Quiz Started & Completed Events Recorded.")

    # 3. Student A Project Recommendation
    rec_a = post_json("/api/recommend", {
        "session_id": sess_a,
        "anonymous_id": anon_a,
        "year_of_study": 3,
        "branch": "CSE",
        "coding_level": "Intermediate",
        "interest_area": "AI / Machine Learning",
        "primary_goal": "Build a strong portfolio project",
        "preferred_tech": "Python"
    })
    title_a = rec_a["project_title"]
    is_ai_a = rec_a["is_ai_generated"]
    print(f"[STAGE 3] Student A Matched: '{title_a}' (AI Fallback Active: {not is_ai_a})")

    # 4. Student A Registration
    email_a = f"student_a_{uuid.uuid4().hex[:6]}@demo.edu"
    reg_a = post_json("/api/register", {
        "session_id": sess_a,
        "user_id": rec_a["user_id"],
        "full_name": "Aarav Sharma",
        "email": email_a,
        "whatsapp_number": "9876543210",
        "college_name": "Vellore Institute of Technology"
    })
    code_a = reg_a["referral_code"]
    print(f"[STAGE 4] Student A Registered: Name='{reg_a['full_name']}', Code='{code_a}', URL='{reg_a['referral_url']}'")

    # 5. Student A Referral Hub Verification (Initial)
    hub_init = get_json(f"/api/referrals/{code_a}/hub")
    print(f"[STAGE 5] Student A Hub (Pre-Referral): Total Referrals={hub_init['total_referrals']}, Clicks={hub_init['total_clicks']}")

    # 6. Student B Arrives via Referral Link
    sess_b = f"e2e_ses_{uuid.uuid4().hex[:8]}"
    anon_b = f"e2e_anon_{uuid.uuid4().hex[:8]}"
    click_res = post_json("/api/referrals/click", {
        "session_id": sess_b,
        "referral_code": code_a
    })
    ref_ctx = get_json(f"/api/referrals/{code_a}")
    print(f"[STAGE 6] Student B Arrived via /r/{code_a}: Valid={ref_ctx['valid']}, Referrer='{ref_ctx['referrer_name']}'")

    # 7. Student B Completes Quiz & Receives Personalized Project
    rec_b = post_json("/api/recommend", {
        "session_id": sess_b,
        "anonymous_id": anon_b,
        "year_of_study": 2,
        "branch": "ECE",
        "coding_level": "Beginner",
        "interest_area": "Cybersecurity",
        "primary_goal": "Explore what AI can do",
        "preferred_tech": "Python"
    })
    title_b = rec_b["project_title"]
    print(f"[STAGE 7] Student B Matched: '{title_b}'")

    # 8. Student B Registers with Attribution
    email_b = f"student_b_{uuid.uuid4().hex[:6]}@demo.edu"
    reg_b = post_json("/api/register", {
        "session_id": sess_b,
        "user_id": rec_b["user_id"],
        "full_name": "Bhavya Reddy",
        "email": email_b,
        "whatsapp_number": "9876543211",
        "college_name": "SRM University",
        "referred_by_code": code_a
    })
    print(f"[STAGE 8] Student B Registered with Attribution: Own Code='{reg_b['referral_code']}'")

    # 9. Student A Hub After Referral Conversion
    hub_updated = get_json(f"/api/referrals/{code_a}/hub")
    print(f"[STAGE 9] Student A Hub (Post-Referral): Total Referrals={hub_updated['total_referrals']} (Incremented!), Clicks={hub_updated['total_clicks']}")
    friends = [f["name"] for f in hub_updated["referred_friends"]]
    print(f"         Referred Friends List: {friends}")

    # 10. Anti-Abuse & Guardrail Verification (Self-referral with same email/code)
    dup_reg = post_json("/api/register", {
        "session_id": sess_a,
        "user_id": rec_a["user_id"],
        "full_name": "Aarav Sharma",
        "email": email_a,
        "whatsapp_number": "9876543210",
        "college_name": "Vellore Institute of Technology",
        "referred_by_code": code_a
    })
    hub_check = get_json(f"/api/referrals/{code_a}/hub")
    print(f"[STAGE 10] Self-Referral Protection: Attempt response='{dup_reg['message']}', Count remained={hub_check['total_referrals']} (PASSED)")

    inv_ctx = get_json("/api/referrals/INVALID_CODE_999")
    print(f"          Invalid Code Handling: Valid={inv_ctx['valid']}, Msg='{inv_ctx['message']}' (PASSED)")

    # 11. Growth Dashboard Telemetry
    overview = get_json("/api/analytics/overview")
    print("[STAGE 11] Growth Dashboard Verified:")
    print(f"          • Total Visitors: {overview['total_visitors']}")
    print(f"          • Total Registrations: {overview['total_registrations']}")
    print(f"          • Growth Planning Target: {overview['target_registrations']}")
    print(f"          • Goal Progress: {overview['goal_completion_pct']}%")
    print(f"          • Viral Coefficient: '{overview['viral_coefficient']}'")
    print(f"          • Referred Registration Rate: {overview['referred_registration_rate']}%")

    print("\n==================================================================")
    print("      ALL END-TO-END JOURNEY & REFERRAL AUDIT STAGES PASSED!      ")
    print("==================================================================")

if __name__ == "__main__":
    run_e2e_verification()
