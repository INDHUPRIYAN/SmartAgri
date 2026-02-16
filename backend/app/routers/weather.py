from fastapi import APIRouter, Depends, HTTPException
from ..schemas import WeatherByCoords, WeatherByCity, WeatherReport
from ..auth import get_current_user
from ..services.weather_service import geocode_city, fetch_weather , shape_report

router = APIRouter(prefix="/weather", tags=["weather"])

@router.post("/by-coords", response_model=WeatherReport)
def weather_by_coords(payload: WeatherByCoords, decoded: dict = Depends(get_current_user)):
    try:
        raw = fetch_weather(payload.latitude, payload.longitude)
        return shape_report(payload.latitude, payload.longitude, raw)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Weather API error: {e}")

@router.post("/by-city", response_model=WeatherReport)
def weather_by_city(payload: WeatherByCity, decoded: dict = Depends(get_current_user)):
    try:
        lat, lon = geocode_city(payload.city, payload.country_code)
        raw = fetch_weather(lat, lon)
        return shape_report(lat, lon, raw)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Weather API error: {e}")