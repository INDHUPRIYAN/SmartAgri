from fastapi import APIRouter, HTTPException, Depends
from firebase_admin import firestore
from app.schemas import CurrentCrop, PastCrop
from app.auth import get_current_user
from app.services.gemini_client import ask_gemini
from typing import Dict

router = APIRouter(
    prefix="/crops",
    tags=["Crops"]
)

db = firestore.client()

@router.post("/past_crop")
def add_past_crop(crop: PastCrop, decoded_token: Dict = Depends(get_current_user)):
    try:
        uid = decoded_token.get("uid")
        db.collection("users").document(uid).collection("past_crops").add(crop.dict())
        return {"message": "Past crop added successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/current_crops")
def add_current_crop(crop: CurrentCrop, decoded_token: dict = Depends(get_current_user)):
    try:
        crop_name = crop.crop_name
        
        # ✅ Use Gemini for crop details dynamically
        details = ask_gemini(crop_name)

        crop.best_time_to_harvest = details.get("best_time_to_harvest")
        crop.market_trends = details.get("market_trends")
        crop.domestic_market_price = details.get("domestic_market_price")
        crop.export_market_price = details.get("export_market_price")
        crop.suggested_fertilizers = details.get("suggested_fertilizers")

        uid = decoded_token["uid"]
        crop_ref = db.collection("users").document(uid).collection("current_crops").document()
        crop_ref.set(crop.dict())

        return {
            "message": "Current crop added successfully",
            "id": crop_ref.id,
            "crop_name": crop.crop_name,
            "sown_month_year": crop.sown_month_year,
            "invested": crop.invested,
            "best_time_to_harvest": crop.best_time_to_harvest,
            "market_trends": crop.market_trends,
            "domestic_market_price": crop.domestic_market_price,
            "export_market_price": crop.export_market_price,
            "suggested_fertilizers": crop.suggested_fertilizers
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
