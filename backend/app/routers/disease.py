from fastapi import APIRouter, UploadFile, File
import shutil
import os

router = APIRouter()  # <-- This is what your main.py is looking for

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    # For now, return a mock response since TensorFlow is not available
    return {
        "predicted_class": "Apple___healthy",
        "confidence": 95.5
    }