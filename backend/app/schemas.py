from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# ---------- Sign up ----------
class UserSignUp(BaseModel):
    email: str
    password: str
    name: str
    mobile_number: str
    city: str
    farmland_acres: float
    location_lat: float
    location_lon: float
    past_crops: List[str]
    regular_crops: List[str]
    avg_yield_kg: float
    invested: float
    income: float
    preferred_language: str
    profile_picture: Optional[str] = None

# ---------- Soil ----------
class SoilData(BaseModel):
    soil_type: str
    ph: float
    moisture: float

# ---------- Disease ----------
class DiseaseData(BaseModel):
    crop_name: str
    disease_name: str
    severity: str

# ---------- Weather ----------
class WeatherByCoords(BaseModel):
    latitude: float
    longitude: float

class WeatherByCity(BaseModel):
    city: str
    country_code: Optional[str] = None  # e.g. "IN", "US" (optional)

class Location(BaseModel):
    city: str  
    latitude: float
    longitude: float

class WeatherReport(BaseModel):
    location: Location
    condition: str
    temperature_c: float
    humidity_pct: int
    windspeed_mps: float | None = None  # optional
    uv_index: float | None = None      # optional
    alerts: list | None = None  

#---------- past crop ----------
class PastCrop(BaseModel):
    crop_name: str
    sown_month_year: str      # e.g., "June 2024"
    harvest_month_year: Optional[str] = None  # Optional if not yet harvested
    invested: float
    selling_price: Optional[float] = None     # Optional if not yet sold
    profit: Optional[float] = None
    loss: Optional[float] = None
    land_area_used: float     # in acres/hectares (decide unit)

#---------- current crop ----------
class CurrentCrop(BaseModel):
    crop_name: str
    sown_month_year: str  # e.g., "August 2025"
    invested: float
    best_time_to_harvest: Optional[str] = None  # Filled by your logic
    market_trends: Optional[str] = None
    domestic_market_price: Optional[float] = None
    export_market_price: Optional[float] = None
    suggested_fertilizers: Optional[list[str]] = None