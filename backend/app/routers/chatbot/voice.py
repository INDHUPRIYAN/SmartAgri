from fastapi import APIRouter, UploadFile, File, HTTPException
import json

router = APIRouter()

@router.post("/")
async def process_voice(file: UploadFile = File(...)):
    # Return a simple mock response since we don't have the required dependencies
    return {"text": "Voice processing is not available in this demo version. Please type your message instead."}
