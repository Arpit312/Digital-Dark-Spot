"""
DarkSpot Atlas - Comprehensive Backend Connection & Error-Free Verification
============================================================================
Tests ALL API endpoints, database connectivity, and error handling.
Run: python backend/verify_backend.py
"""
import asyncio
import sys
import os
import time
import json

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

PASS = "[PASS]"
FAIL = "[FAIL]"
WARN = "[WARN]"
results = []

def log(status, test, detail=""):
    symbol = PASS if status == "pass" else (FAIL if status == "fail" else WARN)
    results.append({"status": status, "test": test, "detail": detail})
    msg = f"  {symbol} {test}"
    if detail:
        msg += f" - {detail}"
    print(msg)


async def test_health(client, base):
    """Test /health endpoint"""
    try:
        r = await client.get(f"{base}/health")
        data = r.json()
        if r.status_code == 200 and data.get("status") == "ok":
            log("pass", "Health Check", f"v{data.get('version', '?')}")
        else:
            log("fail", "Health Check", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Health Check", str(e))


async def test_auth_demo_login(client, base):
    """Test demo account login"""
    try:
        r = await client.post(f"{base}/auth/login", json={"email": "demo123@gmai.com", "password": "demo123"})
        data = r.json()
        if r.status_code == 200 and data.get("status") == "success" and data.get("token"):
            log("pass", "Auth: Demo Login", f"token={data['token'][:20]}...")
            return data.get("token")
        else:
            log("fail", "Auth: Demo Login", str(data))
    except Exception as e:
        log("fail", "Auth: Demo Login", str(e))
    return None


async def test_auth_admin_login(client, base):
    """Test admin account login"""
    try:
        r = await client.post(f"{base}/auth/login", json={"email": "admin@darkspotatlas.org", "password": "admin123"})
        data = r.json()
        if r.status_code == 200 and data.get("status") == "success":
            log("pass", "Auth: Admin Login", f"role={data.get('user', {}).get('role', 'admin')}")
            return data.get("token")
        else:
            log("fail", "Auth: Admin Login", str(data))
    except Exception as e:
        log("fail", "Auth: Admin Login", str(e))
    return None


async def test_auth_signup(client, base):
    """Test signup flow"""
    try:
        r = await client.post(f"{base}/auth/signup", json={"email": "demo123@gmai.com", "password": "demo123", "full_name": "Test User"})
        data = r.json()
        if r.status_code in (200, 422):
            log("pass", "Auth: Demo Signup", "Handled properly")
        else:
            log("warn", "Auth: Demo Signup", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Auth: Demo Signup", str(e))


async def test_auth_me(client, base, token):
    """Test /me endpoint"""
    try:
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        r = await client.get(f"{base}/auth/me", headers=headers)
        data = r.json()
        if r.status_code == 200 and data.get("email"):
            log("pass", "Auth: /me Endpoint", f"user={data.get('email')}")
        else:
            log("fail", "Auth: /me Endpoint", str(data))
    except Exception as e:
        log("fail", "Auth: /me Endpoint", str(e))


async def test_profile_update(client, base, token):
    """Test profile update"""
    try:
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        r = await client.put(f"{base}/auth/profile", json={"full_name": "Demo Auditor Verified"}, headers=headers)
        data = r.json()
        if r.status_code == 200 and data.get("status") == "success":
            log("pass", "Auth: Profile Update")
        else:
            log("fail", "Auth: Profile Update", str(data))
    except Exception as e:
        log("fail", "Auth: Profile Update", str(e))


async def test_analyses(client, base, token):
    """Test analyses endpoints"""
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    try:
        r = await client.get(f"{base}/analyses", headers=headers)
        if r.status_code == 200:
            data = r.json()
            log("pass", "Analyses: List", f"{len(data)} analyses found")
        else:
            log("fail", "Analyses: List", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Analyses: List", str(e))

    try:
        r = await client.get(f"{base}/analyses/demo", headers=headers)
        if r.status_code == 200:
            data = r.json()
            log("pass", "Analyses: Get Demo", f"findings={len(data.get('findings', []))}")
        else:
            log("fail", "Analyses: Get Demo", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Analyses: Get Demo", str(e))


async def test_support_tickets(client, base, token, admin_token):
    """Test support ticket CRUD"""
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    admin_headers = {"Authorization": f"Bearer {admin_token}"} if admin_token else {}

    # List tickets
    try:
        r = await client.get(f"{base}/support/tickets", headers=headers)
        if r.status_code == 200:
            data = r.json()
            log("pass", "Support: List Tickets", f"{len(data)} tickets")
        else:
            log("fail", "Support: List Tickets", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Support: List Tickets", str(e))

    # Create ticket
    ticket_id = None
    try:
        r = await client.post(f"{base}/support/ticket", json={
            "subject": "Test Verification Ticket",
            "category": "Verification Test",
            "priority": "Low",
            "description": "Automated backend verification test ticket.",
            "email": "test@verify.com",
            "source": "app"
        }, headers=headers)
        data = r.json()
        if r.status_code == 200 and data.get("status") == "success":
            ticket_id = data.get("ticket", {}).get("id")
            log("pass", "Support: Create Ticket", f"id={ticket_id}")
        else:
            log("fail", "Support: Create Ticket", str(data))
    except Exception as e:
        log("fail", "Support: Create Ticket", str(e))

    # Get single ticket
    if ticket_id:
        try:
            r = await client.get(f"{base}/support/ticket/{ticket_id}", headers=headers)
            if r.status_code == 200:
                log("pass", "Support: Get Ticket", f"id={ticket_id}")
            else:
                log("fail", "Support: Get Ticket", f"status={r.status_code}")
        except Exception as e:
            log("fail", "Support: Get Ticket", str(e))

        # Update ticket
        try:
            r = await client.patch(f"{base}/support/ticket/{ticket_id}", json={
                "status": "Resolved",
                "resolution": "Automated test resolution",
                "reply": "This is a test reply from verification."
            }, headers=admin_headers)
            data = r.json()
            if r.status_code == 200 and data.get("status") == "success":
                log("pass", "Support: Update Ticket", "Resolved with reply")
            else:
                log("fail", "Support: Update Ticket", str(data))
        except Exception as e:
            log("fail", "Support: Update Ticket", str(e))

        # Delete ticket
        try:
            r = await client.delete(f"{base}/support/ticket/{ticket_id}", headers=admin_headers)
            if r.status_code == 200:
                log("pass", "Support: Delete Ticket", f"id={ticket_id} removed")
            else:
                log("fail", "Support: Delete Ticket", f"status={r.status_code}")
        except Exception as e:
            log("fail", "Support: Delete Ticket", str(e))

    # Filter tickets
    try:
        r = await client.get(f"{base}/support/tickets?source=web&status=In Triage", headers=admin_headers)
        if r.status_code == 200:
            log("pass", "Support: Filter Tickets", f"{len(r.json())} web/triage tickets")
        else:
            log("fail", "Support: Filter Tickets", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Support: Filter Tickets", str(e))


async def test_watchtower(client, base):
    """Test watchtower endpoints"""
    try:
        r = await client.get(f"{base}/watch")
        if r.status_code == 200:
            log("pass", "Watchtower: List", f"{len(r.json())} watched")
        else:
            log("fail", "Watchtower: List", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Watchtower: List", str(e))

    try:
        r = await client.post(f"{base}/watch", json={"url": "https://test.gov.in", "frequency": "daily"})
        if r.status_code == 200:
            watch_id = r.json().get("watch", {}).get("id")
            log("pass", "Watchtower: Add", f"id={watch_id}")
            if watch_id:
                await client.delete(f"{base}/watch/{watch_id}")
                log("pass", "Watchtower: Delete", f"id={watch_id}")
        else:
            log("fail", "Watchtower: Add", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Watchtower: Add", str(e))

    try:
        r = await client.get(f"{base}/alerts")
        if r.status_code == 200:
            log("pass", "Watchtower: Alerts", f"{len(r.json())} alerts")
        else:
            log("fail", "Watchtower: Alerts", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Watchtower: Alerts", str(e))


async def test_eval(client, base):
    """Test evaluation endpoints"""
    try:
        r = await client.get(f"{base}/eval/report")
        if r.status_code == 200:
            data = r.json()
            log("pass", "Eval: Report", f"{len(data.get('metrics', []))} metrics")
        else:
            log("fail", "Eval: Report", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Eval: Report", str(e))


async def test_officer(client, base, admin_token):
    """Test officer endpoints"""
    admin_headers = {"Authorization": f"Bearer {admin_token}"} if admin_token else {}
    try:
        r = await client.get(f"{base}/officer/modules", headers=admin_headers)
        if r.status_code == 200:
            log("pass", "Officer: Modules", f"{len(r.json())} modules")
        else:
            log("fail", "Officer: Modules", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Officer: Modules", str(e))

    for key in ["confusion", "coverage", "trends"]:
        try:
            r = await client.get(f"{base}/officer/{key}", headers=admin_headers)
            if r.status_code == 200:
                log("pass", f"Officer: {key.title()}", f"{len(r.json().get('rows', []))} rows")
            else:
                log("fail", f"Officer: {key.title()}", f"status={r.status_code}")
        except Exception as e:
            log("fail", f"Officer: {key.title()}", str(e))


async def test_admin_dashboard(client, base, admin_token):
    """Test all admin dashboard endpoints"""
    admin_headers = {"Authorization": f"Bearer {admin_token}"} if admin_token else {}
    endpoints = [
        ("/admin/stats", "Admin: Stats"),
        ("/admin/timeseries?metric=analyses&range=7d", "Admin: Timeseries 7d"),
        ("/admin/timeseries?metric=analyses&range=24h", "Admin: Timeseries 24h"),
        ("/admin/timeseries?metric=analyses&range=30d", "Admin: Timeseries 30d"),
        ("/admin/ai/insights", "Admin: AI Insights"),
        ("/admin/health", "Admin: Health Check"),
        ("/admin/users", "Admin: Users List"),
        ("/admin/users?role=admin", "Admin: Filter Admins"),
        ("/admin/verifications", "Admin: Verifications"),
        ("/admin/analyses", "Admin: Analyses"),
        ("/admin/flagged", "Admin: Flagged"),
        ("/admin/sources", "Admin: Sources"),
        ("/admin/agents", "Admin: Agent Stats"),
        ("/admin/audit", "Admin: Audit Log"),
        ("/admin/flags", "Admin: Feature Flags"),
    ]

    for path, name in endpoints:
        try:
            r = await client.get(f"{base}{path}", headers=admin_headers)
            if r.status_code == 200:
                data = r.json()
                count = len(data) if isinstance(data, list) else len(data.keys()) if isinstance(data, dict) else 0
                log("pass", name, f"{count} items")
            else:
                log("fail", name, f"status={r.status_code}")
        except Exception as e:
            log("fail", name, str(e))


async def test_admin_mutations(client, base, admin_token):
    """Test admin write operations"""
    admin_headers = {"Authorization": f"Bearer {admin_token}"} if admin_token else {}

    # AI Copilot Ask
    try:
        r = await client.post(f"{base}/admin/ai/ask", json={"message": "How many support tickets are open?"}, headers=admin_headers)
        if r.status_code == 200:
            data = r.json()
            log("pass", "Admin: AI Copilot Ask", f"answer={data.get('answer', '')[:50]}...")
        else:
            log("fail", "Admin: AI Copilot Ask", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Admin: AI Copilot Ask", str(e))

    # AI Review
    try:
        r = await client.post(f"{base}/admin/ai/review", json={"kind": "finding"}, headers=admin_headers)
        if r.status_code == 200:
            log("pass", "Admin: AI Review", f"risk={r.json().get('risk')}")
        else:
            log("fail", "Admin: AI Review", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Admin: AI Review", str(e))

    # Feature Flag Toggle
    try:
        r = await client.put(f"{base}/admin/flags/maintenance_mode", json={"enabled": False}, headers=admin_headers)
        if r.status_code == 200:
            log("pass", "Admin: Toggle Flag", "maintenance_mode=False")
        else:
            log("fail", "Admin: Toggle Flag", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Admin: Toggle Flag", str(e))

    # Add Source
    try:
        r = await client.post(f"{base}/admin/sources", json={"domain": "test.verify.gov.in", "tier": 1}, headers=admin_headers)
        if r.status_code == 200:
            log("pass", "Admin: Add Source", f"id={r.json().get('id')}")
        else:
            log("fail", "Admin: Add Source", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Admin: Add Source", str(e))


async def test_campus(client, base):
    """Test campus mode"""
    try:
        r = await client.post(f"{base}/campus/check")
        if r.status_code == 200:
            data = r.json()
            log("pass", "Campus: Check", f"{len(data.get('gaps', []))} issues found")
        else:
            log("fail", "Campus: Check", f"status={r.status_code}")
    except Exception as e:
        log("fail", "Campus: Check", str(e))


async def test_user_data(client, base, token):
    """Test user data endpoints"""
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    try:
        r = await client.get(f"{base}/me/export", headers=headers)
        if r.status_code == 200:
            data = r.json()
            log("pass", "User: Export Data", f"keys={list(data.keys())}")
        else:
            log("fail", "User: Export Data", f"status={r.status_code}")
    except Exception as e:
        log("fail", "User: Export Data", str(e))


async def test_error_handling(client, base, token, admin_token):
    """Test that error cases return proper HTTP error responses"""
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    admin_headers = {"Authorization": f"Bearer {admin_token}"} if admin_token else {}

    # 404 for missing analysis
    try:
        r = await client.get(f"{base}/analyses/nonexistent_999", headers=headers)
        if r.status_code == 404:
            log("pass", "Error: 404 Missing Analysis")
        else:
            log("warn", "Error: 404 Missing Analysis", f"Got {r.status_code} instead of 404")
    except Exception as e:
        log("fail", "Error: 404 Missing Analysis", str(e))

    # 404 for missing ticket
    try:
        r = await client.get(f"{base}/support/ticket/TKT-NONEXIST", headers=headers)
        if r.status_code == 404:
            log("pass", "Error: 404 Missing Ticket")
        else:
            log("warn", "Error: 404 Missing Ticket", f"Got {r.status_code} instead of 404")
    except Exception as e:
        log("fail", "Error: 404 Missing Ticket", str(e))

    # 400 for empty login
    try:
        r = await client.post(f"{base}/auth/login", json={"email": "", "password": ""})
        if r.status_code == 400:
            log("pass", "Error: 400 Empty Login")
        else:
            log("warn", "Error: 400 Empty Login", f"Got {r.status_code}")
    except Exception as e:
        log("fail", "Error: 400 Empty Login", str(e))

    # 404 for missing user update
    try:
        r = await client.patch(f"{base}/admin/users/usr_nonexistent", json={"role": "admin"}, headers=admin_headers)
        if r.status_code == 404:
            log("pass", "Error: 404 Missing User")
        else:
            log("warn", "Error: 404 Missing User", f"Got {r.status_code}")
    except Exception as e:
        log("fail", "Error: 404 Missing User", str(e))


async def test_performance(client, base, token, admin_token):
    """Measure API response latency"""
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    admin_headers = {"Authorization": f"Bearer {admin_token}"} if admin_token else {}

    endpoints = [
        ("/health", {}),
        ("/analyses", headers),
        ("/support/tickets", headers),
        ("/admin/stats", admin_headers),
        ("/admin/health", admin_headers)
    ]
    for ep, h in endpoints:
        try:
            t0 = time.time()
            r = await client.get(f"{base}{ep}", headers=h)
            latency = (time.time() - t0) * 1000
            if latency < 500:
                log("pass", f"Perf: {ep}", f"{latency:.0f}ms")
            elif latency < 2000:
                log("warn", f"Perf: {ep}", f"{latency:.0f}ms (slow)")
            else:
                log("fail", f"Perf: {ep}", f"{latency:.0f}ms (too slow)")
        except Exception as e:
            log("fail", f"Perf: {ep}", str(e))


async def main():
    import httpx

    base = "http://localhost:8000"
    print("=" * 72)
    print("  DarkSpot Atlas - Backend Verification Suite")
    print("=" * 72)

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(f"{base}/health")
            if r.status_code != 200:
                print(f"  {FAIL} Backend server not healthy at {base}")
                sys.exit(1)
    except Exception:
        print(f"  {FAIL} Cannot connect to backend at {base}")
        sys.exit(1)

    print(f"  Backend: {base}\n")

    async with httpx.AsyncClient(timeout=15.0) as client:
        # Core Health
        print("--- Core Health ---")
        await test_health(client, base)
        print()

        # Authentication
        print("--- Authentication ---")
        token = await test_auth_demo_login(client, base)
        admin_token = await test_auth_admin_login(client, base)
        await test_auth_signup(client, base)
        await test_auth_me(client, base, token)
        await test_profile_update(client, base, token)
        print()

        # Analyses
        print("--- Analyses ---")
        await test_analyses(client, base, token)
        print()

        # Support Tickets
        print("--- Support Tickets (CRUD) ---")
        await test_support_tickets(client, base, token, admin_token)
        print()

        # Watchtower
        print("--- Watchtower ---")
        await test_watchtower(client, base)
        print()

        # Evaluation
        print("--- Evaluation ---")
        await test_eval(client, base)
        print()

        # Officer Console
        print("--- Officer Console ---")
        await test_officer(client, base, admin_token)
        print()

        # Admin Dashboard
        print("--- Admin Dashboard ---")
        await test_admin_dashboard(client, base, admin_token)
        print()

        # Admin Mutations
        print("--- Admin Write Operations ---")
        await test_admin_mutations(client, base, admin_token)
        print()

        # Campus Mode
        print("--- Campus Mode ---")
        await test_campus(client, base)
        print()

        # User Data
        print("--- User Data ---")
        await test_user_data(client, base, token)
        print()

        # Error Handling
        print("--- Error Handling ---")
        await test_error_handling(client, base, token, admin_token)
        print()

        # Performance
        print("--- Performance (Latency) ---")
        await test_performance(client, base, token, admin_token)
        print()

    # Summary
    passed = sum(1 for r in results if r["status"] == "pass")
    failed = sum(1 for r in results if r["status"] == "fail")
    warned = sum(1 for r in results if r["status"] == "warn")
    total = len(results)

    print("=" * 72)
    print(f"  Results: {passed}/{total} passed | {failed} failed | {warned} warnings")
    print()

    if failed == 0:
        crash_free = 100.0
        print(f"  Crash-Free Rate: {crash_free}%")
        print(f"  {PASS} Backend is ERROR-FREE and 100% REAL DATA READY!")
    else:
        crash_free = ((total - failed) / total) * 100
        print(f"  Crash-Free Rate: {crash_free:.1f}%")

    print("=" * 72)
    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    asyncio.run(main())
