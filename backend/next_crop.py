# ai-models/next_crop_advanced.py
import os
import time
import json
import math
import httpx
from functools import lru_cache
from typing import Dict, Any, List, Optional

# Environment / Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENWEATHERMAP_KEY = os.getenv("OPENWEATHERMAP_KEY")
BHUVAN_API_KEY = os.getenv("BHUVAN_API_KEY")  # optional
MARKET_API_KEY = os.getenv("MARKET_API_KEY")
CACHE_TTL = int(os.getenv("CACHE_TTL_SECONDS", "3600"))

# Simple in-memory cache with TTL (process-lifetime)
_cache = {}

def cache_get(key: str):
    entry = _cache.get(key)
    if not entry: 
        return None
    value, ts = entry
    if time.time() - ts > CACHE_TTL:
        del _cache[key]
        return None
    return value

def cache_set(key: str, value):
    _cache[key] = (value, time.time())

# ----------------------------
# 1) Satellite / Soil fetcher
# ----------------------------
def fetch_satellite_soil(lat: float, lon: float) -> Dict[str, Any]:
    """
    Fetch soil properties from a satellite / soil API.
    Placeholder: adapt to Bhuvan / SoilGrids / other provider.
    Returns a dict with keys: ph, organic_carbon, texture, ec, topsoil_n, topsoil_p, topsoil_k
    """
    cache_key = f"soil:{lat:.5f}:{lon:.5f}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    # TODO: Replace with Bhuvan / SoilGrids API call and proper parsing
    # Example pseudo-call (you need to supply real endpoint and key):
    # url = f"https://bhuvan.example/api/soil?lat={lat}&lon={lon}&key={BHUVAN_API_KEY}"
    # resp = httpx.get(url, timeout=20)
    # data = resp.json()

    # For now: fallback synthetic values (real call recommended)
    data = {
        "source": "satellite_stub",
        "ph": 6.5,
        "organic_carbon": 0.8,
        "texture": "loam",
        "ec": 0.25,
        "topsoil_N": 120,
        "topsoil_P": 40,
        "topsoil_K": 180,
    }

    cache_set(cache_key, data)
    return data

# ----------------------------
# 2) Weather fetcher (OpenWeatherMap)
# ----------------------------
def fetch_weather_forecast(lat: float, lon: float) -> Dict[str, Any]:
    cache_key = f"weather:{lat:.5f}:{lon:.5f}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    if not OPENWEATHERMAP_KEY:
        # fallback
        data = {"source": "owm_stub", "forecast_days": [], "note": "no key"}
        cache_set(cache_key, data)
        return data

    url = ("https://api.openweathermap.org/data/2.5/onecall"
           f"?lat={lat}&lon={lon}&exclude=minutely,hourly,alerts&units=metric&appid={OPENWEATHERMAP_KEY}")
    try:
        resp = httpx.get(url, timeout=15)
        resp.raise_for_status()
        payload = resp.json()
        # extract daily summary for next 7 days
        forecast_days = []
        for d in payload.get("daily", [])[:7]:
            forecast_days.append({
                "dt": d.get("dt"),
                "temp_day": d.get("temp", {}).get("day"),
                "temp_min": d.get("temp", {}).get("min"),
                "temp_max": d.get("temp", {}).get("max"),
                "precip_mm": d.get("rain", 0) if "rain" in d else d.get("pop", 0) * 10, # approx
                "humidity": d.get("humidity")
            })
        data = {"source": "openweathermap", "forecast_days": forecast_days}
    except Exception as e:
        data = {"source": "openweathermap_error", "error": str(e)}

    cache_set(cache_key, data)
    return data

# ----------------------------
# 3) Market snapshot (placeholder)
# ----------------------------
def fetch_market_snapshot(region: str) -> Dict[str, Any]:
    cache_key = f"market:{region}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    # TODO: replace with actual market API or scraping pipeline
    snapshot = {
        "source": "market_stub",
        "top_crops": [
            {"crop": "Tomato", "price_trend": "falling", "price_per_kg": 8.5},
            {"crop": "Chilli", "price_trend": "rising", "price_per_kg": 120},
        ]
    }
    cache_set(cache_key, snapshot)
    return snapshot

# ----------------------------
# 4) Prompt builder for LLM
# ----------------------------
PROMPT_TEMPLATE = """
You are an expert agronomist. Given the farmer's profile, local soil properties, 7-day weather forecast, recent crop history, and local market snapshot,
recommend the top 3 crops the farmer should plant next on a {area_acres} acre parcel, ranked by suitability. For each recommended crop, output:
- crop_name
- reason (1-2 sentences referencing soil, weather, rotation, and market)
- expected_duration_days
- expected_yield_range_kg_per_acre
- fertilizer_plan (N,P,K suggestions and timing)
- sustainability_score (0-100)
Return the result as JSON with keys: recommendations (list of 3), sources_used (list), timestamp_utc.

Farmer profile:
{farmer_profile}

Soil properties:
{soil}

Weather summary (7-day forecast):
{weather}

Market snapshot:
{market}

Recent crops:
{recent_crops}

Constraints:
- Avoid recommending the same crop as the last crop (unless yield was < threshold or specific reason)
- Prefer crops with higher sustainability_score if profitability is similar
- If any data source is missing, explicitly note it in sources_used
"""

def build_prompt(farmer_profile: Dict[str,Any], soil: Dict[str,Any], weather: Dict[str,Any],
                 market: Dict[str,Any], recent_crops: List[Dict[str,Any]], area_acres: float):
    # simplified serialization for the prompt
    fp = json.dumps(farmer_profile, indent=2)
    soil_s = json.dumps(soil, indent=2)
    weather_s = json.dumps(weather.get("forecast_days", weather), indent=2)
    market_s = json.dumps(market, indent=2)
    recent = json.dumps(recent_crops, indent=2)

    prompt = PROMPT_TEMPLATE.format(
        area_acres=area_acres,
        farmer_profile=fp,
        soil=soil_s,
        weather=weather_s,
        market=market_s,
        recent_crops=recent
    )
    return prompt

# ----------------------------
# 5) LLM call (Gemini-like)
# ----------------------------
def call_gemini_api(prompt: str, max_tokens: int = 700) -> Dict[str, Any]:
    """
    Generic HTTP call wrapper to a Gemini-like LLM. Replace the URL + headers
    with the provider you use (Gemini API, Vertex AI, or Azure OpenAI).
    We expect a JSON text response (the LLM should be instructed to output JSON).
    """
    if not GEMINI_API_KEY:
        # return stub if no key provided
        return {"stub": True, "text": "[]", "error": "No GEMINI_API_KEY set"}

    # TODO: Replace endpoint/url with your LLM provider. Below is a placeholder.
    endpoint = os.getenv("GEMINI_ENDPOINT", "https://api.example-llm.com/v1/generate")

    headers = {
        "Authorization": f"Bearer {GEMINI_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "prompt": prompt,
        "max_tokens": max_tokens,
        "temperature": 0.0,
        "top_p": 0.95
    }

    try:
        with httpx.Client(timeout=30) as client:
            resp = client.post(endpoint, json=payload, headers=headers)
            resp.raise_for_status()
            body = resp.json()
            # adapt to provider: assume body['text'] contains LLM text output
            text = body.get("text") or body.get("output") or json.dumps(body)
            return {"stub": False, "text": text, "raw": body}
    except Exception as e:
        return {"stub": False, "text": "", "error": str(e)}

# ----------------------------
# 6) Parse LLM JSON output safely
# ----------------------------
def safe_parse_llm_json(text: str) -> Optional[Dict[str,Any]]:
    """
    LLM is instructed to return JSON. We try to parse; if parsing fails,
    wrap fallback parsing logic.
    """
    try:
        return json.loads(text)
    except Exception:
        # attempt to recover: find first '{' and last '}' and parse
        try:
            start = text.index('{')
            end = text.rindex('}') + 1
            candidate = text[start:end]
            return json.loads(candidate)
        except Exception:
            return None

# ----------------------------
# 7) Public function: recommend_next_crops
# ----------------------------
def recommend_next_crops(user_profile: Dict[str,Any], farm_location: Dict[str,Any],
                         area_acres: float, recent_crops: List[Dict[str,Any]]) -> Dict[str,Any]:
    """
    Main orchestrator. Returns structured result with recommendations and metadata.
    """
    lat = farm_location.get("lat")
    lon = farm_location.get("lon")
    region = farm_location.get("region", "unknown")

    soil = fetch_satellite_soil(lat, lon) if lat and lon else {"note": "no_coords"}
    weather = fetch_weather_forecast(lat, lon) if lat and lon else {"note": "no_coords"}
    market = fetch_market_snapshot(region)

    prompt = build_prompt(user_profile, soil, weather, market, recent_crops, area_acres)
    llm_resp = call_gemini_api(prompt)

    result = {
        "sources_used": [],
        "raw_llm": llm_resp
    }

    if llm_resp.get("stub"):
        # No key — use deterministic rule-based fallback
        # Basic fallback recommendations based on soil ph and NPK
        fallback = rule_based_fallback(soil, recent_crops)
        result.update({
            "recommendations": fallback,
            "sources_used": ["fallback_rule_engine"],
            "note": "Used fallback because GEMINI key not provided or disabled."
        })
        return result

    text = llm_resp.get("text", "")
    parsed = safe_parse_llm_json(text)
    if parsed:
        result["recommendations"] = parsed.get("recommendations")
        result["sources_used"] = parsed.get("sources_used", ["llm"])
        result["timestamp_utc"] = parsed.get("timestamp_utc")
        return result

    # If LLM returned non-JSON or failed to parse, use fallback rules + include raw text
    fallback = rule_based_fallback(soil, recent_crops)
    result.update({
        "recommendations": fallback,
        "sources_used": ["llm_raw_unparseable", "fallback_rule_engine"],
        "llm_text": text
    })
    return result

# ----------------------------
# 8) Fallback rule engine (simple, deterministic)
# ----------------------------
def rule_based_fallback(soil: Dict[str,Any], recent_crops: List[Dict[str,Any]]):
    ph = soil.get("ph", 6.5)
    n = soil.get("topsoil_N", 80)
    p = soil.get("topsoil_P", 40)
    k = soil.get("topsoil_K", 120)
    recs = []
    # simple heuristics
    if ph < 5.5:
        recs += ["Potato", "Tea"]
    elif ph > 7.8:
        recs += ["Barley", "Beetroot"]
    else:
        if n < 60:
            recs += ["Pulses"]
        else:
            recs += ["Maize", "Wheat"]

    # avoid last crop
    if recent_crops:
        last = recent_crops[-1].get("crop","").lower()
        recs = [r for r in recs if r.lower() != last]

    return [{"crop_name": r, "reason": "rule_based"} for r in recs[:3]]
