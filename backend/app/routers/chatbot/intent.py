from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class Query(BaseModel):
    text: str
    user_id: str

@router.post("/")
async def detect_intent(query: Query):
    text = query.text.lower()

    # Simple keyword-based intent detection (start basic)
    if any(k in text for k in ["open", "go to", "navigate", "page"]):
        return {"intent": "NAVIGATION", "page": "Home"}  # expand mapping later
    elif any(k in text for k in ["tip", "advice", "suggestion", "today"]):
        return {"intent": "SUSTAINABLE_TIP"}
    else:
        return {"intent": "GENERAL_KNOWLEDGE", "answer": "Let me check that for you..."}
