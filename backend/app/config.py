import os
from typing import List
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

def _split_csv(value: str | None, default: List[str]) -> List[str]:
    if not value:
        return default
    return [v.strip() for v in value.split(",") if v.strip()]

class Settings(BaseModel):
    PROJECT_NAME: str = "SmartAgri API"
    OWM_API_KEY: str = os.getenv("OWM_API_KEY", "")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")  # Fixed to match .env file
    OWM_ONECALL_URL: str = os.getenv("OWM_ONECALL_URL", "https://api.openweathermap.org/data/3.0/onecall")
    OWM_GEOCODE_URL: str = os.getenv("OWM_GEOCODE_URL", "http://api.openweathermap.org/geo/1.0/direct")
    FIREBASE_CREDENTIALS: str = os.getenv("FIREBASE_CREDENTIALS", "firebase_key.json")
    ALLOW_ORIGINS: List[str] = _split_csv(os.getenv("ALLOW_ORIGINS"), ["*"])

settings = Settings()