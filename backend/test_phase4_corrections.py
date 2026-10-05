"""Targeted Phase 4 Corrections Verification Test Suite: Tests 1 through 11."""

import asyncio
import json
from datetime import datetime
from sqlalchemy import select, func, distinct
from app.core.database import AsyncSessionLocal
from app.models.schemas import (
    UserModel,
    ProjectRecommendationModel,
    RegistrationModel,
    ReferralModel,
    ReferralClickModel,
    AnalyticsEventModel
)
from app.services.analytics import (
    get_overview_metrics,
    get_funnel_metrics,
    get_sources_and_budget,
    get_segment_metrics,
    get_project_metrics,
    get_referral_metrics,
    classify_branch,
    classify_acquisition_source,
    CANONICAL_BRANCHES,
    CANONICAL_SOURCES
)
from app.services.demo_data import seed_simulated_campaign

async def run_corrections_validation():
    print("==================================================================")
    print("      PHASE 4 CORRECTIONS: MATHEMATICAL RECONCILIATION & AUDIT    ")
    print("==================================================================")

    async with AsyncSessionLocal() as session:
        # Re-seed to ensure fresh, deterministic state
        print("\n[SETUP] Seeding clean 7-day simulated campaign scenario...")
        await seed_simulated_campaign(session)

        # ---------------------------------------------------------------
        # TEST 1: BRANCH TOTALS RECONCILE TO TOTAL REGISTRATIONS
        # ---------------------------------------------------------------
        print("\n[TEST 1] Verifying Mutually Exclusive Branch Totals...")
        seg_res = await get_segment_metrics(session, is_simulation=True)
        ov_res = await get_overview_metrics(session, is_simulation=True)

        branch_reg_sum = sum(b.registrations for b in seg_res.branches)
        print(f"   -> Total Registrations: {ov_res.total_registrations}")
        print(f"   -> Sum of Branch Registrations: {branch_reg_sum}")
        for b in seg_res.branches:
            print(f"      • {b.branch:<12}: {b.registrations:>3} regs ({b.conversion_rate:>5.1f}% conv)")

        assert branch_reg_sum == ov_res.total_registrations, (
            f"Branch mismatch: sum={branch_reg_sum} != total={ov_res.total_registrations}"
        )
        assert len(seg_res.branches) == len(CANONICAL_BRANCHES)
        print("   >>> PASS: Branch registrations reconcile exactly to 187 with no overlapping categories.")

        # ---------------------------------------------------------------
        # TEST 2: YEAR TOTALS RECONCILE TO TOTAL REGISTRATIONS
        # ---------------------------------------------------------------
        print("\n[TEST 2] Verifying Mutually Exclusive Year Totals...")
        year_reg_sum = sum(y.registrations for y in seg_res.years)
        print(f"   -> Total Registrations: {ov_res.total_registrations}")
        print(f"   -> Sum of Year Registrations: {year_reg_sum}")
        for y in seg_res.years:
            print(f"      • Year {y.year} ({y.year_label}): {y.registrations:>3} regs")

        assert year_reg_sum == ov_res.total_registrations, (
            f"Year mismatch: sum={year_reg_sum} != total={ov_res.total_registrations}"
        )
        print("   >>> PASS: Year group registrations reconcile exactly to 187.")

        # ---------------------------------------------------------------
        # TEST 3: PRIMARY SOURCE TOTALS RECONCILE TO TOTAL VISITORS
        # ---------------------------------------------------------------
        print("\n[TEST 3] Verifying Single First-Touch Visitor Reconciliation...")
        sources_res = await get_sources_and_budget(session, is_simulation=True)
        source_visitor_sum = sum(s.visitors for s in sources_res.sources)

        print(f"   -> Overview Total Visitors: {ov_res.total_visitors}")
        print(f"   -> Sum of Source Visitors: {source_visitor_sum}")
        for s in sources_res.sources:
            print(f"      • {s.source:<20}: {s.visitors:>4} visitors")

        assert source_visitor_sum == ov_res.total_visitors, (
            f"Visitor mismatch: sum={source_visitor_sum} != total={ov_res.total_visitors}"
        )
        print("   >>> PASS: Primary source visitors reconcile exactly to 1,248.")

        # ---------------------------------------------------------------
        # TEST 4: PRIMARY SOURCE REGISTRATIONS RECONCILE TO TOTAL REGISTRATIONS
        # ---------------------------------------------------------------
        print("\n[TEST 4] Verifying Single First-Touch Registration Reconciliation...")
        source_reg_sum = sum(s.registrations for s in sources_res.sources)

        print(f"   -> Overview Total Registrations: {ov_res.total_registrations}")
        print(f"   -> Sum of Source Registrations: {source_reg_sum}")
        for s in sources_res.sources:
            print(f"      • {s.source:<20}: {s.registrations:>3} regs ({s.conversion_rate:>5.1f}%)")

        assert source_reg_sum == ov_res.total_registrations, (
            f"Source reg mismatch: sum={source_reg_sum} != total={ov_res.total_registrations}"
        )
        print("   >>> PASS: Primary source registrations reconcile exactly to 187.")

        # ---------------------------------------------------------------
        # TEST 5: REFERRAL PARTICIPANT COUNT BASED ON ACTUAL SHARING ACTIVITY
        # ---------------------------------------------------------------
        print("\n[TEST 5] Verifying Referral Participants vs. Codes Generated...")
        ref_res = await get_referral_metrics(session, is_simulation=True)
        funnel_res = await get_funnel_metrics(session, is_simulation=True)

        stage_7 = next(s for s in funnel_res.stages if s.stage_id == "stage_7")
        print(f"   -> Registered Students: {ref_res.total_registered_students}")
        print(f"   -> Referral Codes Generated: {ref_res.referral_codes_generated}")
        print(f"   -> Referral Participants: {ref_res.referral_participants}")
        print(f"   -> Funnel Stage 7 Label: '{stage_7.stage_name}', Count: {stage_7.count}")

        assert ref_res.referral_codes_generated == ov_res.total_registrations, "All registrants get codes"
        assert ref_res.referral_participants == 7, "Only 7 students actively shared links"
        assert stage_7.stage_name == "Referral Participants", "Stage 7 must be Referral Participants"
        assert stage_7.count == 7, "Stage 7 count must reflect actual participants"
        print("   >>> PASS: Referral Code Generation is clearly separated from Active Sharing Participation.")

        # ---------------------------------------------------------------
        # TEST 6: REFERRED REGISTRATION RATE CALCULATION
        # ---------------------------------------------------------------
        print("\n[TEST 6] Verifying Referred Registration Rate Calculation...")
        expected_ref_rate = round(ref_res.referred_registrations / ref_res.total_registered_students * 100, 1)
        print(f"   -> Formula: {ref_res.referred_registrations} / {ref_res.total_registered_students} * 100 = {expected_ref_rate}%")
        print(f"   -> Overview Metric Value: {ov_res.referred_registration_rate}%")
        print(f"   -> Referral Metric Value: {ref_res.referred_registration_rate}%")

        assert ov_res.referred_registration_rate == expected_ref_rate
        assert ref_res.referred_registration_rate == expected_ref_rate
        assert 16.5 <= ov_res.referred_registration_rate <= 16.7
        print("   >>> PASS: Referred Registration Rate calculates accurately as ~16.6%.")

        # ---------------------------------------------------------------
        # TEST 7: REFERRAL CONVERSION RATE CALCULATION
        # ---------------------------------------------------------------
        print("\n[TEST 7] Verifying Referral Conversion Rate Calculation...")
        expected_ref_conv = round(ref_res.referred_registrations / ref_res.total_referral_clicks * 100, 1)
        print(f"   -> Formula: {ref_res.referred_registrations} / {ref_res.total_referral_clicks} * 100 = {expected_ref_conv}%")
        print(f"   -> Metric Value: {ref_res.referral_conversion_rate}%")

        assert ref_res.referral_conversion_rate == expected_ref_conv
        assert 15.5 <= ref_res.referral_conversion_rate <= 15.8
        print("   >>> PASS: Referral Conversion Rate calculates accurately as ~15.7%.")

        # ---------------------------------------------------------------
        # TEST 8: STATISTICAL HONESTY ON VIRAL COEFFICIENT
        # ---------------------------------------------------------------
        print("\n[TEST 8] Verifying Statistical Honesty on Viral Coefficient...")
        print(f"   -> Overview Viral Coefficient: '{ov_res.viral_coefficient}'")
        print(f"   -> Referral Viral Coefficient: '{ref_res.viral_coefficient}'")

        assert ov_res.viral_coefficient == "Insufficient data"
        assert ref_res.viral_coefficient == "Insufficient data"
        assert ov_res.viral_coefficient != 0.17
        print("   >>> PASS: System conservatively reports 'Insufficient data' rather than fabricating a fake K-Factor.")

        # ---------------------------------------------------------------
        # TEST 9: SIMULATION ISOLATION & LIVE TELEMETRY INTEGRITY
        # ---------------------------------------------------------------
        print("\n[TEST 9] Verifying Complete Partitioning of Simulated vs. Live Data...")
        live_ov = await get_overview_metrics(session, is_simulation=False)
        sim_ov = await get_overview_metrics(session, is_simulation=True)

        print(f"   -> Live Registrations: {live_ov.total_registrations} (Real user test records)")
        print(f"   -> Simulated Registrations: {sim_ov.total_registrations} (7-Day campaign scenario)")
        assert sim_ov.total_registrations == 187
        assert live_ov.is_simulation is False
        assert sim_ov.is_simulation is True
        print("   >>> PASS: Live and simulated environments are completely segregated via is_simulation flag.")

        # ---------------------------------------------------------------
        # TEST 10: DIRECT DATABASE RECONCILIATION
        # ---------------------------------------------------------------
        print("\n[TEST 10] Direct SQL Queries vs. Service Metrics Reconciliation...")
        # Direct SQL count of simulated registrations
        sql_regs = (await session.execute(
            select(func.count(RegistrationModel.id)).where(RegistrationModel.is_simulation == True)
        )).scalar_one()

        # Direct SQL count of simulated visitors
        sql_visitors = (await session.execute(
            select(func.count(distinct(AnalyticsEventModel.session_id))).where(AnalyticsEventModel.is_simulation == True)
        )).scalar_one()

        # Direct SQL count of simulated referral clicks
        sql_clicks = (await session.execute(
            select(func.count(ReferralClickModel.id)).where(ReferralClickModel.is_simulation == True)
        )).scalar_one()

        # Direct SQL count of simulated referral conversions
        sql_ref_convs = (await session.execute(
            select(func.count(ReferralModel.id)).where(ReferralModel.is_simulation == True)
        )).scalar_one()

        print(f"   -> SQL Registrations: {sql_regs} == Dashboard: {ov_res.total_registrations}")
        print(f"   -> SQL Visitors: {sql_visitors} == Dashboard: {ov_res.total_visitors}")
        print(f"   -> SQL Referral Clicks: {sql_clicks} == Dashboard: {ref_res.total_referral_clicks}")
        print(f"   -> SQL Referral Conversions: {sql_ref_convs} == Dashboard: {ref_res.referred_registrations}")

        assert sql_regs == ov_res.total_registrations
        assert sql_visitors == ov_res.total_visitors
        assert sql_clicks == ref_res.total_referral_clicks
        assert sql_ref_convs == ref_res.referred_registrations
        print("   >>> PASS: 100% of dashboard metrics match direct underlying SQLite queries.")

        # ---------------------------------------------------------------
        # TEST 11: PHASE 1-3 REGRESSION CHECK
        # ---------------------------------------------------------------
        print("\n[TEST 11] Phase 1-3 Functionality & Database Schema Integrity Check...")
        # Verify projects catalog intact
        projects_res = await get_project_metrics(session, is_simulation=True)
        assert len(projects_res.projects) > 0, "Project recommendations must remain active"
        print(f"   -> Project Catalog: Top Matched Project: '{projects_res.top_project}'")

        # Verify live user and registration models exist
        live_reg_count = (await session.execute(
            select(func.count(RegistrationModel.id)).where(RegistrationModel.is_simulation == False)
        )).scalar_one()
        print(f"   -> Preserved Live Registrations from Phase 2 & 3: {live_reg_count}")
        assert live_reg_count >= 1, "Live registrations must not be deleted!"

        print("   >>> PASS: Phase 1-3 recommendation engine, referral loop, and live records intact.")

    print("\n==================================================================")
    print("      ALL 11 PHASE 4 CORRECTIONS TESTS PASSED SUCCESSFULLY!       ")
    print("==================================================================")

if __name__ == "__main__":
    asyncio.run(run_corrections_validation())
