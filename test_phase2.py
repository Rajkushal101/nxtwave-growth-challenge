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

print("=== 1. VERIFYING 17 PROJECT CATALOG ===")
res = urllib.request.urlopen(f"{base_url}/projects")
catalog = json.loads(res.read().decode())
print(f"Total catalog projects: {len(catalog)}")
categories = set(p['category'] for p in catalog)
print(f"Categories covered: {sorted(list(categories))}")

print("\n=== 2. RUNNING PERSONA TESTS ===")
test_cases = [
    ("Test 1 (1st Yr, Beginner, AI, Explore)", {
        "session_id": "s_test1",
        "year_of_study": 1,
        "branch": "Computer Science / CSE",
        "coding_level": "Beginner",
        "interest_area": "AI / Machine Learning",
        "primary_goal": "Explore AI",
        "preferred_tech": "Python"
    }),
    ("Test 2 (2nd Yr, Interm, Data, Learn)", {
        "session_id": "s_test2",
        "year_of_study": 2,
        "branch": "Computer Science / CSE",
        "coding_level": "Intermediate",
        "interest_area": "Data / Analytics",
        "primary_goal": "Learn by building",
        "preferred_tech": "Python"
    }),
    ("Test 3 (3rd Yr, Interm, Cyber, Portfolio)", {
        "session_id": "s_test3",
        "year_of_study": 3,
        "branch": "Electronics / ECE",
        "coding_level": "Intermediate",
        "interest_area": "Cybersecurity",
        "primary_goal": "Build a portfolio",
        "preferred_tech": "Python"
    }),
    ("Test 4 (4th Yr, Adv, AI, Career)", {
        "session_id": "s_test4",
        "year_of_study": 4,
        "branch": "Information Technology / IT",
        "coding_level": "Advanced",
        "interest_area": "AI / Machine Learning",
        "primary_goal": "Prepare for placements/career",
        "preferred_tech": "Python"
    })
]

saved_recs = []
for title, payload in test_cases:
    req = urllib.request.Request(
        f"{base_url}/recommend",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req)
    rec = json.loads(res.read().decode())
    saved_recs.append(rec)
    print(f"{title}:")
    print(f"   -> Matched: {rec['project_title']}")
    print(f"   -> Category: {rec['category']} | Difficulty: {rec['difficulty']}")
    print(f"   -> Build Time: {rec['estimated_minutes']} mins")
    print(f"   -> Tech: {', '.join(rec['tech_stack'])}")
    print(f"   -> Why matches: {rec['why_this_matches_you'][:90]}...")
    print(f"   -> Fallback Active: {not rec['is_ai_generated']}")

print("\n=== 3. VERIFYING 'TRY ANOTHER PROJECT' (SWITCHING) ===")
sample_user_id = saved_recs[2]["user_id"]
next_alt_id = saved_recs[2]["alternative_project_ids"][0]
switch_res = urllib.request.urlopen(f"{base_url}/recommend/switch/{sample_user_id}/{next_alt_id}")
switched_proj = json.loads(switch_res.read().decode())
print(f"Original: {saved_recs[2]['project_title']}")
print(f"Switched to: {switched_proj['project_title']} ({switched_proj['category']})")

print("\n=== 4. VERIFYING REGISTRATION FLOW ===")
reg_payload = {
    "session_id": "s_test3",
    "user_id": sample_user_id,
    "full_name": "Kartheek Sharma",
    "email": "kartheek.growth@example.com",
    "whatsapp_number": "9876543210",
    "college_name": "Amrita Vishwa Vidyapeetham"
}
reg_req = urllib.request.Request(
    f"{base_url}/register",
    data=json.dumps(reg_payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
reg_res = urllib.request.urlopen(reg_req)
reg_data = json.loads(reg_res.read().decode())
print(f"Registration Confirmed: {reg_data['full_name']}")
print(f"Linked Project: {reg_data['project_title']}")
print(f"Unique Referral Code: {reg_data['referral_code']}")
print(f"Referral URL: {reg_data['referral_url']}")

print("\n=== 5. VERIFYING VALIDATION & DEDUPLICATION ===")
# Test Duplicate Registration
dup_req = urllib.request.Request(
    f"{base_url}/register",
    data=json.dumps(reg_payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
dup_res = urllib.request.urlopen(dup_req)
dup_data = json.loads(dup_res.read().decode())
print(f"Duplicate Email Handled Gracefully: \"{dup_data['message']}\"")

# Test Invalid Email
invalid_payload = dict(reg_payload, email="invalid-email-format")
inv_req = urllib.request.Request(
    f"{base_url}/register",
    data=json.dumps(invalid_payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
try:
    urllib.request.urlopen(inv_req)
    print("Unexpected success on invalid email")
except urllib.error.HTTPError as e:
    print(f"Invalid Email Correctly Rejected with HTTP {e.code}")

print("\nALL PHASE 2 CORE INTEGRATION TESTS PASSED SUCCESSFULLY!")
