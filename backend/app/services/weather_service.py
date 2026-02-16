import requests
from typing import Tuple, Dict, Any
from ..config import settings

def geocode_city(city: str, country_code: str | None) -> Tuple[float, float]:
    """
    Geocode a city name to (lat, lon) using OpenWeatherMap's geocoding API.
    """
    q = f"{city},{country_code}" if country_code else city
    params = {
        "q": q,
        "limit": 1,
        "appid": settings.OWM_API_KEY,
    }
    r = requests.get(settings.OWM_GEOCODE_URL, params=params, timeout=20)
    r.raise_for_status()
    data = r.json()
    if not data:
        raise ValueError(f"Could not geocode '{q}'.")
    return float(data[0]["lat"]), float(data[0]["lon"])

def fetch_weather(lat: float, lon: float) -> Dict[str, Any]:
    params = {
        "lat": lat,
        "lon": lon,
        "units": "metric",
        "appid": settings.OWM_API_KEY,
    }
    r = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params, timeout=30)
    r.raise_for_status()
    return r.json()


def shape_report(lat: float, lon: float, raw: dict) -> dict:
    return {
        "location": {
            "city": raw.get("name", ""),
            "latitude": lat,
            "longitude": lon
        },
        "condition": raw["weather"][0]["description"],
        "temperature_c": raw["main"]["temp"],
        "humidity_pct": raw["main"]["humidity"],
        "windspeed_mps": raw.get("wind", {}).get("speed", 0),
        "uv_index": None,   # not available in weather endpoint
        "alerts": []        # not available in weather endpoint
    }