import os
import sys
import subprocess
import time
import threading

def run_backend():
    print("[Launcher] Starting FastAPI backend on http://127.0.0.1:8000...")
    # Change directory to backend parent if needed, or run from root
    cmd = [sys.executable, "-m", "uvicorn", "backend.app:app", "--host", "127.0.0.1", "--port", "8000"]
    try:
        subprocess.run(cmd)
    except KeyboardInterrupt:
        pass

def run_frontend():
    print("[Launcher] Starting Vite React frontend...")
    # Change directory to frontend folder
    cwd = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")
    
    # Check if node_modules exists, if not, alert
    node_modules_path = os.path.join(cwd, "node_modules")
    if not os.path.exists(node_modules_path):
        print("[Launcher] WARNING: frontend/node_modules not found. Attempting to install frontend dependencies...")
        subprocess.run(["npm", "install"], cwd=cwd, shell=True)

    cmd = ["npm", "run", "dev"]
    try:
        subprocess.run(cmd, cwd=cwd, shell=True)
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    print("="*60)
    print("      NexusIntel: Multimodal Shadow Product Auditor")
    print("="*60)
    
    # Start Backend Thread
    backend_thread = threading.Thread(target=run_backend, daemon=True)
    backend_thread.start()
    
    # Wait a bit for backend to initialize
    time.sleep(2)
    
    # Start Frontend (in main thread so Ctrl+C propagates naturally)
    try:
        run_frontend()
    except KeyboardInterrupt:
        print("\n[Launcher] Shutting down NexusIntel services. Goodbye!")
        sys.exit(0)
