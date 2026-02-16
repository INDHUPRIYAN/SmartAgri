from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

import firebase_admin
from firebase_admin import credentials, auth, firestore

from app.routers import crops, soil, disease, weather, user, recommend
from app.routers.chatbot.router import router as chatbot_router  # Import chatbot router
from app.auth import get_current_user  # your helper, keep if you need it

# ----------------- Firebase Init -----------------
cred = credentials.Certificate("firebase_key.json")  # service account key
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# Firestore DB client
db = firestore.client()

# ----------------- FastAPI App -----------------
app = FastAPI(title="SmartAgri Backend")

# ----------------- Middleware -----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔒 Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Firebase Auth Dependency -----------------
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        id_token = credentials.credentials  # Extract token
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ----------------- Routers -----------------
app.include_router(crops.router)
app.include_router(soil.router)
app.include_router(disease.router)
app.include_router(weather.router)
app.include_router(user.router)
app.include_router(recommend.router)
app.include_router(chatbot_router, prefix="/chatbot")  # enable chatbot router

# ----------------- Endpoints -----------------
@app.get("/")
def root():
    return {"message": "Welcome to SmartAgri API"}

# ✅ Verify-token endpoint
@app.post("/verify-token")
async def verify_token_endpoint(user: dict = Depends(get_current_user)):
    return {
        "message": "Token verified successfully",
        "user": user
    }