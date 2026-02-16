from fastapi import APIRouter
from app.services.gemini_client import ask_gemini

router = APIRouter()

@router.get("/")
async def get_farming_tip():
    """Get a sustainable farming tip from Gemini"""
    prompt = "Provide a sustainable farming tip that would be helpful for farmers. Keep it concise and practical."
    tip = await ask_gemini(prompt)
    return {"tip": tip}

@router.post("/")
async def generate_custom_tip(topic: str = "sustainable farming"):
    """Generate a custom tip based on a specific topic"""
    prompt = f"Provide a helpful tip about {topic} for farmers. Keep it concise and practical."
    tip = await ask_gemini(prompt)
    return {"tip": tip}