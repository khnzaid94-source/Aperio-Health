import os
import sys
import subprocess
import webbrowser
import time


def load_env_file(path):
    if not os.path.exists(path):
        return
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip())


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    load_env_file(os.path.join(base_dir, ".env"))
    dist_dir = os.path.join(base_dir, "dist")
    
    print("=" * 60)
    print("🔬 Starting Aperio Health — Clinical Intelligence Suite")
    print("=" * 60)

    # 1. Build frontend if dist/ does not exist
    if not os.path.exists(dist_dir) or not os.path.exists(os.path.join(dist_dir, "index.html")):
        print("\n📦 Building frontend UI bundle (npm run build)...")
        build_res = subprocess.run(["npm", "run", "build"], shell=True)
        if build_res.returncode != 0:
            print("⚠️ Build encountered an issue. Proceeding with backend...")

    # 2. Open browser automatically after a short delay
    def open_browser():
        time.sleep(1.5)
        print("\n🌐 Launching browser at http://localhost:8000 ...")
        webbrowser.open("http://localhost:8000")

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    # 3. Start unified FastAPI server (serves both React UI and Python API)
    print("\n🚀 Starting unified server on http://localhost:8000")
    print("👉 Press Ctrl+C to stop the server.\n")

    import uvicorn
    # Add backend folder to path
    sys.path.insert(0, os.path.join(base_dir, "backend"))
    from main import app
    uvicorn.run(app, host="127.0.0.1", port=8000)

if __name__ == "__main__":
    main()
