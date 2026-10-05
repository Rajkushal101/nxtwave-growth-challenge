"""Phase 6 database audit script."""
import sqlite3

conn = sqlite3.connect('growth_challenge.db')
c = conn.cursor()

c.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = [r[0] for r in c.fetchall()]
print("=== DATABASE TABLES ===")
for t in tables:
    c.execute(f"SELECT COUNT(*) FROM {t}")
    print(f"  {t}: {c.fetchone()[0]} rows")

print("\n=== LIVE vs SIMULATED DATA ===")
for tbl in ['registrations', 'analytics_events', 'referrals']:
    try:
        c.execute(f"SELECT COUNT(*) FROM {tbl} WHERE is_simulation=0")
        live = c.fetchone()[0]
        c.execute(f"SELECT COUNT(*) FROM {tbl} WHERE is_simulation=1")
        sim = c.fetchone()[0]
        print(f"  {tbl}: LIVE={live}, SIMULATED={sim}")
    except Exception as e:
        print(f"  {tbl}: (no is_simulation column) {e}")

print("\n=== SOURCE BREAKDOWN (SIMULATED) ===")
try:
    c.execute("""
        SELECT utm_source, COUNT(*) as cnt 
        FROM registrations 
        WHERE is_simulation=1 
        GROUP BY utm_source 
        ORDER BY cnt DESC
    """)
    for row in c.fetchall():
        print(f"  {row[0]}: {row[1]}")
except Exception as e:
    print(f"  Error: {e}")

print("\n=== YEAR BREAKDOWN (SIMULATED) ===")
try:
    c.execute("""
        SELECT year, COUNT(*) as cnt 
        FROM registrations 
        WHERE is_simulation=1 
        GROUP BY year 
        ORDER BY cnt DESC
    """)
    for row in c.fetchall():
        print(f"  {row[0]}: {row[1]}")
except Exception as e:
    print(f"  Error: {e}")

print("\n=== EXPERIMENTS ===")
try:
    c.execute("SELECT id, name, status FROM experiments")
    for row in c.fetchall():
        print(f"  [{row[2]}] {row[0]}: {row[1]}")
except Exception as e:
    print(f"  Error: {e}")

conn.close()
print("\n=== AUDIT COMPLETE ===")
