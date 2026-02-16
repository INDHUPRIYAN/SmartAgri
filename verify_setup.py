import os
import sys
import importlib

def check_file_exists(filepath, description):
    """Check if a file exists and print status"""
    if os.path.exists(filepath):
        print(f"✅ {description} - Found")
        return True
    else:
        print(f"❌ {description} - Missing ({filepath})")
        return False

def check_directory_exists(dirpath, description):
    """Check if a directory exists and print status"""
    if os.path.exists(dirpath) and os.path.isdir(dirpath):
        print(f"✅ {description} - Found")
        return True
    else:
        print(f"❌ {description} - Missing ({dirpath})")
        return False

def verify_backend():
    """Verify backend components"""
    print("\n--- Backend Verification ---")
    
    all_good = True
    
    # Check main files
    all_good &= check_file_exists("backend/main.py", "Main FastAPI application")
    all_good &= check_file_exists("backend/requirements.txt", "Python requirements")
    all_good &= check_file_exists("backend/firebase_key.json", "Firebase service account key")
    
    # Check routers
    all_good &= check_file_exists("backend/app/routers/disease.py", "Disease detection router")
    all_good &= check_file_exists("backend/app/routers/weather.py", "Weather router")
    all_good &= check_file_exists("backend/app/routers/soil.py", "Soil health router")
    all_good &= check_file_exists("backend/app/routers/crops.py", "Crops router")
    
    # Check AI models
    all_good &= check_directory_exists("backend/ai_models", "AI models directory")
    all_good &= check_file_exists("backend/ai_models/plant_disease.py", "Plant disease AI model interface")
    
    # Check if model file exists (optional warning)
    if not check_file_exists("backend/ai_models/plant_disease_model.h5", "TensorFlow model file"):
        print("   ⚠️  This file is required for disease detection to work")
    
    return all_good

def verify_frontend():
    """Verify frontend components"""
    print("\n--- Frontend Verification ---")
    
    all_good = True
    
    # Check main files
    all_good &= check_file_exists("frontend/package.json", "Package configuration")
    all_good &= check_file_exists("frontend/firebaseConfig.js", "Firebase configuration")
    all_good &= check_file_exists("frontend/app/api.js", "API client")
    
    # Check screens
    all_good &= check_file_exists("frontend/app/screens/home.jsx", "Home screen")
    all_good &= check_file_exists("frontend/app/screens/disease-detection.jsx", "Disease detection screen")
    all_good &= check_file_exists("frontend/app/screens/soil-health.jsx", "Soil health screen")
    all_good &= check_file_exists("frontend/app/screens/weather.jsx", "Weather screen")
    
    return all_good

def verify_dependencies():
    """Verify that required tools are installed"""
    print("\n--- Dependency Verification ---")
    
    all_good = True
    
    # Check Python packages (using importlib to avoid linter issues)
    try:
        importlib.import_module("fastapi")
        print("✅ FastAPI - Installed")
    except ImportError:
        print("❌ FastAPI - Not installed (pip install fastapi)")
        all_good = False
    
    try:
        importlib.import_module("firebase_admin")
        print("✅ Firebase Admin - Installed")
    except ImportError:
        print("❌ Firebase Admin - Not installed (pip install firebase-admin)")
        all_good = False
    
    try:
        importlib.import_module("tensorflow")
        print("✅ TensorFlow - Installed")
    except ImportError:
        print("❌ TensorFlow - Not installed (pip install tensorflow)")
        all_good = False
    
    # Check Node.js
    try:
        node_version = os.popen("node --version").read().strip()
        print(f"✅ Node.js - Installed ({node_version})")
    except:
        print("❌ Node.js - Not installed")
        all_good = False
    
    # Check if Expo is available
    try:
        expo_version = os.popen("npx expo --version").read().strip()
        print(f"✅ Expo CLI - Installed ({expo_version})")
    except:
        print("❌ Expo CLI - Not installed (npm install -g expo-cli)")
        all_good = False
    
    return all_good

def main():
    print("🔍 AGRI_SMART Setup Verification")
    print("=" * 50)
    
    backend_ok = verify_backend()
    frontend_ok = verify_frontend()
    deps_ok = verify_dependencies()
    
    print("\n" + "=" * 50)
    if backend_ok and frontend_ok and deps_ok:
        print("✅ All checks passed! Your setup is ready for development.")
        print("\n🚀 Next steps:")
        print("   Run 'python start_development.py' to start both servers")
        print("   Or follow the manual steps in INTEGRATION_README.md")
    else:
        print("❌ Some issues found in your setup.")
        print("\n🔧 Please fix the missing components and run this script again.")
        print("   Check INTEGRATION_README.md for detailed instructions.")

if __name__ == "__main__":
    main()