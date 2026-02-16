from fastapi import APIRouter, HTTPException, Depends
from firebase_admin import auth as fb_auth
from ..schemas import UserSignUp
from ..auth import get_current_user
from app.services.firestore_client import db 
router = APIRouter(prefix="", tags=["user"])

@router.post("/signup")
def signup(user: UserSignUp):
    try:
        user_record = fb_auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.name,
        )

        db.collection("users").document(user_record.uid).set({
            "name": user.name,
            "email": user.email,
            "mobile_number": user.mobile_number,
            "city": user.city,
            "farmland_acres": user.farmland_acres,
            "location": {
                "lat": user.location_lat,
                "lon": user.location_lon
            },
            "past_crops": user.past_crops,
            "regular_crops": user.regular_crops,
            "avg_yield_kg": user.avg_yield_kg,
            "invested": user.invested,
            "income": user.income,
            "preferred_language": user.preferred_language,
            "profile_picture": user.profile_picture
        })
        # You can optionally store name/location/age in Firestore later.
        return {"message": "User created successfully", "uid": user_record.uid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))