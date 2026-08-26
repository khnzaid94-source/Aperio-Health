"""Post-deploy smoke check for the Aperio Health production deployment.

Verifies a Render deploy actually came up and is serving the current
build. Four checks, in order:

  [1/5] API wake-up      - poll /api/health until it answers (free-tier
                           cold starts can take ~60s after a deploy)
  [2/5] SPA served       - GET / returns the index.html shell with hashed
                           /assets/* bundle references
  [3/5] Deploy currency  - run a fresh local build from the CURRENT working
                           tree and require prod to serve the exact same
                           asset hash set (catches stale/failed deploys).
                           Skip with --skip-build if you already know the
                           working tree differs from the deployed commit.
  [4/5] Demo login       - seeded demo account round-trip proves the DB,
                           bcrypt auth, and session issuance all work live
  [5/5] Session cleanup  - log the smoke session back out

Usage:
    python scripts/smoke_prod.py                       # default prod URL
    python scripts/smoke_prod.py --base-url <url>     # other environment
    python scripts/smoke_prod.py --skip-build          # no npm rebuild

Exit code 0 = all checks passed; 1 = at least one check failed.
Stdlib only: no pip installs required to run this.
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request

DEFAULT_BASE_URL = "https://aperio-health.onrender.com"

DEMO_EMAIL = "sarah.jenkins@example.com"
DEMO_PASSWORD = "demo1234"

ASSET_RE = re.compile(r"/assets/([A-Za-z0-9._-]+\.(?:js|css))")
REQUEST_TIMEOUT = 20


def _request(url: str, method: str = "GET", payload: dict | None = None, token: str | None = None):
    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {"Accept": "application/json"}
    if body is not None:
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
        return resp.status, resp.read().decode("utf-8", errors="replace")


def wait_for_api(base_url: str, budget_seconds: int) -> bool:
    deadline = time.monotonic() + budget_seconds
    url = base_url + "/api/health"
    attempt = 0
    while time.monotonic() < deadline:
        attempt += 1
        try:
            status, text = _request(url)
            if status == 200 and json.loads(text).get("status") == "ok":
                print(f"       awake after {attempt} poll(s): {text.strip()[:80]}")
                return True
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError):
            pass
        remaining = int(deadline - time.monotonic())
        print(f"       poll {attempt}: not ready yet ({remaining}s of budget left)")
        time.sleep(6)
    return False


def fetch_spa_asset_names(base_url: str) -> set[str] | None:
    try:
        status, html = _request(base_url + "/")
    except (urllib.error.URLError, TimeoutError, OSError):
        return None
    if status != 200 or "<div id=\"root\"" not in html:
        return None
    return set(ASSET_RE.findall(html))


def local_build_asset_names() -> set[str] | None:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print("       running 'npm run build' against the current working tree ...")
    result = subprocess.run(
        "npm run build",
        cwd=root,
        shell=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=600,
    )
    if result.returncode != 0:
        print(result.stdout[-1500:])
        print(result.stderr[-1500:])
        return None
    index_path = os.path.join(root, "dist", "index.html")
    if not os.path.isfile(index_path):
        return None
    with open(index_path, encoding="utf-8") as fh:
        return set(ASSET_RE.findall(fh.read()))


def demo_login_round_trip(base_url: str) -> tuple[bool, str]:
    try:
        status, text = _request(
            base_url + "/api/auth/login",
            method="POST",
            payload={"email": DEMO_EMAIL, "password": DEMO_PASSWORD},
        )
        login = json.loads(text)
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError) as exc:
        return False, f"login request failed: {exc}"
    if status != 200 or not login.get("token"):
        return False, f"login did not yield a token (HTTP {status})"
    token = login["token"]

    try:
        status, text = _request(base_url + "/api/history", token=token)
        history = json.loads(text)
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError) as exc:
        return False, f"authorized history fetch failed: {exc}"
    if status != 200 or not isinstance(history, list):
        return False, f"history fetch unexpected (HTTP {status}, {len(history) if isinstance(history, list) else type(history).__name__})"

    cleanup = ""
    try:
        _request(base_url + "/api/auth/logout", method="POST", token=token)
        cleanup = "; smoke session logged out"
    except (urllib.error.URLError, TimeoutError, OSError):
        cleanup = "; WARNING: logout failed (session left open)"
    return True, (
        f"logged in as {login.get('user_email')}, "
        f"history fetch OK ({len(history)} reports){cleanup}"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Post-deploy production smoke check.")
    parser.add_argument(
        "--base-url",
        default=os.environ.get("PROD_URL", DEFAULT_BASE_URL),
        help=f"Target base URL (default: {DEFAULT_BASE_URL})",
    )
    parser.add_argument(
        "--wake-budget",
        type=int,
        default=300,
        help="Seconds to wait for a cold-started service before giving up (default: 300)",
    )
    parser.add_argument(
        "--skip-build",
        action="store_true",
        help="Skip the local-rebuild currency comparison (step 3)",
    )
    args = parser.parse_args()
    base_url = args.base_url.rstrip("/")

    failures: list[str] = []

    print(f"[1/5] API wake-up check on {base_url}")
    if wait_for_api(base_url, args.wake_budget):
        print("       PASS")
    else:
        failures.append("API wake-up timed out")
        print("       FAIL")

    print("[2/5] SPA shell served with hashed assets")
    remote_assets = fetch_spa_asset_names(base_url)
    if remote_assets:
        print(f"       PASS ({len(remote_assets)} assets: {sorted(remote_assets)})")
    else:
        failures.append("SPA shell missing or has no asset references")
        print("       FAIL")

    print("[3/5] Deploy currency (prod assets == fresh local build)")
    if args.skip_build:
        print("       SKIP (--skip-build)")
    elif remote_assets is None:
        failures.append("deploy currency unverifiable: no remote assets")
        print("       FAIL")
    else:
        local_assets = local_build_asset_names()
        if local_assets is None:
            failures.append("local build failed; currency unknown")
            print("       FAIL")
        elif local_assets == remote_assets:
            print(f"       PASS (both serve {len(local_assets)} identical asset hashes)")
        else:
            only_local = sorted(local_assets - remote_assets)
            only_remote = sorted(remote_assets - local_assets)
            failures.append(
                f"stale deploy: local-only={only_local} prod-only={only_remote}"
            )
            print(f"       MISMATCH local-only={only_local} prod-only={only_remote}")
            print("       FAIL")

    print("[4/5] Demo account login round-trip")
    ok, detail = demo_login_round_trip(base_url)
    print(f"       {detail}")
    if ok:
        print("       PASS")
    else:
        failures.append(f"demo login round-trip: {detail}")
        print("       FAIL")

    print("[5/5] Summary")
    if failures:
        for failure in failures:
            print(f"       FAILED: {failure}")
        print("SMOKE: FAIL")
        return 1
    print("       All checks passed.")
    print("SMOKE: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
