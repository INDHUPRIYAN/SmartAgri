# AGRI_SMART Integration Guide

This guide explains how to run the integrated AGRI_SMART system with all components (Frontend, Backend, and AI) working together.

## System Architecture

```
┌─────────────────┐    API Calls    ┌─────────────────┐
│   Frontend      │◄────────────────┤   Backend       │
│  (React Native) │                 │   (FastAPI)     │
└─────────────────┘                 └─────────────────┘
                                          │
                                          │ AI Processing
                                          ▼
                                  ┌─────────────────┐
                                  │   AI Models     │
                                  │  (TensorFlow)   │
                                  └─────────────────┘
```

## Prerequisites

1. Python 3.8+
2. Node.js 14+
3. Expo CLI
4. Firebase account and configuration

## Quick Start

### Option 1: Automated Startup (Recommended)

Run the development script that starts both servers:

```bash
python start_development.py
```

### Option 2: Manual Startup

1. **Start Backend Server:**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start Frontend Server:**
   ```bash
   cd frontend
   npm install
   npx expo start
   ```

## API Endpoints

The backend exposes the following endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/weather/by-coords` | POST | Get weather by coordinates |
| `/soil/point` | GET | Get soil health data |
| `/crops/top` | GET | Get top crops for location |
| `/recommend` | POST | Get crop recommendations |
| `/disease/predict` | POST | Detect plant diseases |
| `/user/{user_id}` | GET | Get user profile |

## Integration Points

### 1. Frontend ↔ Backend
- Frontend connects to `http://localhost:8000`
- Configured in [frontend/app/api.js](file:///c:/Users/indhu/OneDrive/Desktop/AGRI_SMART/frontend/app/api.js)
- Uses Firebase authentication tokens for secure API calls

### 2. Backend ↔ AI Models
- Disease detection model loaded from [backend/ai_models/plant_disease.py](file:///c:/Users/indhu/OneDrive/Desktop/AGRI_SMART/backend/ai_models/plant_disease.py)
- TensorFlow model file required at [backend/ai_models/plant_disease_model.h5](file:///c:/Users/indhu/OneDrive/Desktop/AGRI_SMART/backend/ai_models/plant_disease_model.h5)

## Testing Integration

Run the integration check script:

```bash
python integration_check.py
```

## Firebase Configuration

1. Place your Firebase config in [frontend/firebaseConfig.js](file:///c:/Users/indhu/OneDrive/Desktop/AGRI_SMART/frontend/firebaseConfig.js)
2. Place your Firebase service account key in [backend/firebase_key.json](file:///c:/Users/indhu/OneDrive/Desktop/AGRI_SMART/backend/firebase_key.json)

## Troubleshooting

### Common Issues:

1. **Port already in use:**
   ```bash
   # Kill process on port 8000
   lsof -i :8000
   kill -9 <PID>
   ```

2. **Missing dependencies:**
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Frontend
   cd frontend
   npm install
   ```

3. **CORS issues:**
   Already configured in [backend/main.py](file:///c:/Users/indhu/OneDrive/Desktop/AGRI_SMART/backend/main.py)

4. **TensorFlow model missing:**
   Ensure [plant_disease_model.h5](file:///c:/Users/indhu/OneDrive/Desktop/AGRI_SMART/backend/ai_models/plant_disease_model.h5) exists in the ai_models directory

## Estimated Development Time

For a minimal working model: **4-6 hours**

This includes:
- Setting up all connections
- Testing basic functionality
- Verifying data flow between components
- Basic UI integration with backend APIs

## Next Steps

1. Run the integration check script
2. Start both servers using the automated script
3. Test core functionality through the mobile app
4. Verify AI model predictions work
5. Test all API endpoints