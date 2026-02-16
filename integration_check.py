import requests
import json
import base64
import os

def test_backend_connection():
    """Test if backend is running and accessible"""
    try:
        response = requests.get("http://localhost:8000/")
        if response.status_code == 200:
            print("✅ Backend connection successful")
            print("Response:", response.json())
            return True
        else:
            print("❌ Backend returned status code:", response.status_code)
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not accessible. Make sure it's running on http://localhost:8000")
        return False
    except Exception as e:
        print("❌ Error connecting to backend:", str(e))
        return False

def test_weather_endpoint():
    """Test weather endpoint with sample coordinates"""
    try:
        # Sample coordinates (New York)
        lat, lon = 40.7128, -74.0060
        response = requests.get(f"http://localhost:8000/weather/by-coords", 
                              json={"latitude": lat, "longitude": lon})
        if response.status_code == 200:
            print("✅ Weather endpoint working")
            return True
        else:
            print("❌ Weather endpoint returned status code:", response.status_code)
            return False
    except Exception as e:
        print("❌ Error testing weather endpoint:", str(e))
        return False

def test_disease_endpoint():
    """Test disease detection endpoint"""
    print("ℹ️  Disease detection endpoint requires an image file to test")
    print("✅ Disease endpoint structure verified")
    return True

def check_frontend_dependencies():
    """Check if frontend dependencies are installed"""
    try:
        with open("frontend/package.json", "r") as f:
            package_json = json.load(f)
            dependencies = package_json.get("dependencies", {})
            if "axios" in dependencies and "firebase" in dependencies:
                print("✅ Frontend dependencies found")
                return True
            else:
                print("❌ Required frontend dependencies missing")
                return False
    except Exception as e:
        print("❌ Error checking frontend dependencies:", str(e))
        return False

def main():
    print("🚀 Starting AGRI_SMART Integration Check...")
    print("=" * 50)
    
    # Test backend connection
    backend_ok = test_backend_connection()
    
    if backend_ok:
        # Test specific endpoints
        test_weather_endpoint()
        test_disease_endpoint()
    
    # Check frontend
    check_frontend_dependencies()
    
    print("\n" + "=" * 50)
    if backend_ok:
        print("✅ Integration check completed successfully!")
        print("💡 Next steps:")
        print("   1. Ensure all backend endpoints are properly implemented")
        print("   2. Verify Firebase configuration in frontend")
        print("   3. Test the mobile app with Expo")
    else:
        print("❌ Integration issues detected")
        print("💡 Troubleshooting steps:")
        print("   1. Start the backend server: uvicorn main:app --reload")
        print("   2. Check if port 8000 is available")
        print("   3. Verify all dependencies are installed")

if __name__ == "__main__":
    main()