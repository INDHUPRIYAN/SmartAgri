import subprocess
import sys
import os
import time
from threading import Thread

def print_banner():
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║                 AGRI_SMART Development Setup                 ║
    ║                                                              ║
    ║  This script will start both the backend and frontend        ║
    ║  servers for development.                                    ║
    ╚══════════════════════════════════════════════════════════════╝
    """)

def start_backend():
    """Start the FastAPI backend server"""
    print("🚀 Starting Backend Server...")
    try:
        # Change to backend directory
        os.chdir("backend")
        
        # Install Python dependencies if needed
        print("📦 Installing Python dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True, capture_output=True)
        
        # Start the backend server
        print("🟢 Backend server starting on http://localhost:8000")
        backend_process = subprocess.Popen([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--reload", 
            "--host", "0.0.0.0", 
            "--port", "8000"
        ])
        
        os.chdir("..")  # Go back to root directory
        return backend_process
        
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        return None

def start_frontend():
    """Start the React Native frontend"""
    print("🚀 Starting Frontend Server...")
    try:
        # Change to frontend directory
        os.chdir("frontend")
        
        # Install Node.js dependencies if needed
        print("📦 Installing Node.js dependencies...")
        subprocess.run(["npm", "install"], check=True, capture_output=True)
        
        # Start the frontend server
        print("🟢 Frontend server starting...")
        frontend_process = subprocess.Popen(["npx", "expo", "start"])
        
        os.chdir("..")  # Go back to root directory
        return frontend_process
        
    except Exception as e:
        print(f"❌ Error starting frontend: {e}")
        return None

def monitor_processes(backend_process, frontend_process):
    """Monitor both processes and exit if either fails"""
    try:
        while True:
            if backend_process and backend_process.poll() is not None:
                print("❌ Backend process has stopped")
                break
            if frontend_process and frontend_process.poll() is not None:
                print("❌ Frontend process has stopped")
                break
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        if backend_process:
            backend_process.terminate()
        if frontend_process:
            frontend_process.terminate()
        print("✅ Servers stopped")

def main():
    print_banner()
    
    # Start backend
    backend_process = start_backend()
    if not backend_process:
        return
    
    # Small delay before starting frontend
    time.sleep(3)
    
    # Start frontend
    frontend_process = start_frontend()
    if not frontend_process:
        if backend_process:
            backend_process.terminate()
        return
    
    print("\n✅ Both servers started successfully!")
    print("   Backend:  http://localhost:8000")
    print("   Frontend: Check Expo DevTools for the URL")
    print("\n💡 Press Ctrl+C to stop both servers")
    
    # Monitor processes
    monitor_processes(backend_process, frontend_process)

if __name__ == "__main__":
    main()