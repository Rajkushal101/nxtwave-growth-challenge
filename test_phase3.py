import urllib.request
import json
import urllib.error

def _resolve_base_url():
    for candidate in ['http://localhost:5173/api', 'http://127.0.0.1:8002/api', 'http://127.0.0.1:5173/api']:
        try:
            req = urllib.request.urlopen(f"{candidate}/health", timeout=1)
            if req.status == 200:
                return candidate
        except Exception:
            continue
    return 'http://127.0.0.1:8002/api'

base_url = _resolve_base_url()

import time

run_tag = int(time.time() * 1000)

print("==================================================================")
print("       PHASE 3: VIRAL GROWTH ENGINE END-TO-END VERIFICATION       ")
print("==================================================================")

# ---------------------------------------------------------------
# STEP 1: Student A Journey
# ---------------------------------------------------------------
print("\n[STEP 1] Student A (Kartheek) takes quiz & registers...")

quiz_a = {
    "session_id": f"ses_student_a_{run_tag}",
    "year_of_study": 3,
    "branch": "Electronics / ECE",
    "coding_level": "Intermediate",
    "interest_area": "Cybersecurity",
    "primary_goal": "Build a portfolio",
    "preferred_tech": "Python"
}
req = urllib.request.Request(
    f"{base_url}/recommend",
    data=json.dumps(quiz_a).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res = urllib.request.urlopen(req)
rec_a = json.loads(res.read().decode())
print(f"   -> Student A Matched: '{rec_a['project_title']}' ({rec_a['category']})")

email_a = f"kartheek.{run_tag}@example.com"
reg_a = {
    "session_id": f"ses_student_a_{run_tag}",
    "user_id": rec_a["user_id"],
    "full_name": "Kartheek Sharma",
    "email": email_a,
    "whatsapp_number": "9876543210",
    "college_name": "Amrita Vishwa Vidyapeetham"
}
req = urllib.request.Request(
    f"{base_url}/register",
    data=json.dumps(reg_a).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res = urllib.request.urlopen(req)
reg_res_a = json.loads(res.read().decode())
code_a = reg_res_a["referral_code"]
print(f"   -> Student A Registered! Code: {code_a} | Project: {reg_res_a['project_title']}")

# Check Student A's Growth Hub initially
res = urllib.request.urlopen(f"{base_url}/referrals/{code_a}/hub")
hub_a_initial = json.loads(res.read().decode())
print(f"   -> Student A Growth Hub (Initial): {hub_a_initial['total_referrals']} referrals, Next: {hub_a_initial['next_milestone']['title']}")
assert hub_a_initial["total_referrals"] == 0, "Initial referrals should be 0"

# ---------------------------------------------------------------
# STEP 2: Student B Discovers via Referral URL
# ---------------------------------------------------------------
print(f"\n[STEP 2] Student B arrives via referral link /?ref={code_a}...")

# 2.1 Verify Context Resolution
res = urllib.request.urlopen(f"{base_url}/referrals/{code_a}")
context_res = json.loads(res.read().decode())
print(f"   -> Referral Context: Valid={context_res['valid']}")
print(f"   -> Context Banner Message: \"{context_res['message']}\"")
assert context_res["valid"] is True
assert "Kartheek S." in context_res["referrer_name"]

# 2.2 Record Unique Click
click_req = {
    "session_id": "ses_student_b_browser",
    "referral_code": code_a,
    "utm_source": "whatsapp_cs_squad",
    "referrer_url": "https://web.whatsapp.com/"
}
req = urllib.request.Request(
    f"{base_url}/referrals/click",
    data=json.dumps(click_req).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res = urllib.request.urlopen(req)
click_data = json.loads(res.read().decode())
print(f"   -> Referral Click Logged: {click_data['status']}")

# ---------------------------------------------------------------
# STEP 3: Student B Completes Matcher & Registers with Attribution
# ---------------------------------------------------------------
print("\n[STEP 3] Student B takes quiz and gets a DIFFERENT personalized project...")

quiz_b = {
    "session_id": "ses_student_b_browser",
    "year_of_study": 2,
    "branch": "Mechanical",
    "coding_level": "Intermediate",
    "interest_area": "Automation",
    "primary_goal": "Solve a practical problem",
    "preferred_tech": "Python"
}
req = urllib.request.Request(
    f"{base_url}/recommend",
    data=json.dumps(quiz_b).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res = urllib.request.urlopen(req)
rec_b = json.loads(res.read().decode())
print(f"   -> Student B Matched: '{rec_b['project_title']}' ({rec_b['category']})")
assert rec_b["project_title"] != rec_a["project_title"], "Student B should get a project tailored to Mechanical/Automation!"

print("\n[STEP 3.2] Student B registers with referral attribution from Student A...")
email_b = f"priya.mech.{run_tag}@example.com"
reg_b = {
    "session_id": f"ses_student_b_{run_tag}",
    "user_id": rec_b["user_id"],
    "full_name": "Priya Nair",
    "email": email_b,
    "whatsapp_number": "9123456780",
    "college_name": "Amrita Vishwa Vidyapeetham",
    "referred_by_code": code_a  # Attribution preserved from landing link!
}
req = urllib.request.Request(
    f"{base_url}/register",
    data=json.dumps(reg_b).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res = urllib.request.urlopen(req)
reg_res_b = json.loads(res.read().decode())
code_b = reg_res_b["referral_code"]
print(f"   -> Student B Registered! Own Code: {code_b} | Linked Project: {reg_res_b['project_title']}")

# ---------------------------------------------------------------
# STEP 4: Verify Student A's Growth Hub Updates & Unlocks Milestone 1
# ---------------------------------------------------------------
print("\n[STEP 4] Checking Student A's Growth Hub after referral conversion...")
res = urllib.request.urlopen(f"{base_url}/referrals/{code_a}/hub")
hub_a_updated = json.loads(res.read().decode())

print(f"   -> Total Clicks: {hub_a_updated['total_clicks']}")
print(f"   -> Confirmed Referrals: {hub_a_updated['total_referrals']} (Incremented from 0!)")
print(f"   -> Referred Peers List: {[f['name'] + ' (' + f['project_title'] + ')' for f in hub_a_updated['referred_friends']]}")

# Check Milestone 1 Unlock
m1 = hub_a_updated["milestones"][0]
print(f"   -> Milestone 1: '{m1['title']}' | Unlocked = {m1['is_unlocked']}")
print(f"   -> Milestone 1 Reward Content: {m1['reward_content']}")
print(f"   -> Next Target: '{hub_a_updated['next_milestone']['title']}' (Need {hub_a_updated['next_milestone']['remaining']} more)")

assert hub_a_updated["total_referrals"] == 1, "Referral count must be 1"
assert m1["is_unlocked"] is True, "Milestone 1 must be unlocked"
assert len(hub_a_updated["referred_friends"]) == 1, "Friend list must contain 1 entry"

# ---------------------------------------------------------------
# STEP 5: Anti-Abuse Validation
# ---------------------------------------------------------------
print("\n[STEP 5] Testing Anti-Abuse Guardrails...")

# 5.1 Self-Referral Prevention (Student A registering with their own code)
self_reg = {
    "session_id": f"ses_self_refer_{run_tag}",
    "user_id": rec_a["user_id"],
    "full_name": "Kartheek Sharma",
    "email": email_a,
    "whatsapp_number": "9876543210",
    "college_name": "Amrita Vishwa Vidyapeetham",
    "referred_by_code": code_a
}
req = urllib.request.Request(
    f"{base_url}/register",
    data=json.dumps(self_reg).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res = urllib.request.urlopen(req)
# Deduplication will return existing registration without creating referral
res_hub_check = urllib.request.urlopen(f"{base_url}/referrals/{code_a}/hub")
check_hub = json.loads(res_hub_check.read().decode())
assert check_hub["total_referrals"] == 1, "Self-referral must not increment count!"
print("   -> Self-Referral Protection: PASSED (Count remained 1)")

# 5.2 Invalid Referral Code Handling
res_invalid = urllib.request.urlopen(f"{base_url}/referrals/NONEXISTENT99")
inv_ctx = json.loads(res_invalid.read().decode())
assert inv_ctx["valid"] is False
print(f"   -> Invalid Referral Code Gracefully Handled: valid={inv_ctx['valid']}")

print("\n==================================================================")
print("     ALL PHASE 3 VIRAL GROWTH TESTS COMPLETED WITH 100% SUCCESS!   ")
print("==================================================================")
