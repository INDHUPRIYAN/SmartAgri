from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.crop_service import suggest_crops
from app.services.firestore_client import get_user
import time, json

router = APIRouter(prefix="/recommend", tags=["recommendation"])

class Req(BaseModel):
    user_id: str
    target_lang: str = "en"


def json_safe(data):
    """Convert Firestore/complex objects into JSON-safe types."""
    if isinstance(data, dict):
        return {k: json_safe(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [json_safe(v) for v in data]
    elif isinstance(data, (int, float, str, bool)) or data is None:
        return data
    else:
        return str(data)  # fallback → convert anything else to string


@router.post("/")
async def recommend(req: Req):
    # 1. Get farmer profile
    user = get_user(req.user_id)
    if not user:
        raise HTTPException(404, "Farmer profile not found. Please update your details.")

    # 2. Call crop service (Gemini + scoring + market + Firestore save)
    recs = await suggest_crops(req.user_id, req.target_lang)
    if not recs or "error" in recs:
        raise HTTPException(500, f"Could not generate recommendations. {recs.get('error','')}")

    # 3. Farmer-friendly response
    response = {
        "recommendation_for": user.get("name", "Farmer"),
        "recommendations": recs,
        "timestamp": int(time.time())
    }

    return {
        "message": f"Dear {user.get('name','Farmer')}, here are your best crop options this season.",
        "details": json_safe(response)
    }
