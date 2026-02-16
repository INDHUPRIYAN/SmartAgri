from app.services.weather_service import fetch_weather, shape_report
from app.services.soil_service import fetch_property
from app.services.firestore_client import get_user
from app.services.gemini_client import ask_gemini  # <-- make sure you have this wrapper

async def suggest_crops(user_id: str, target_lang: str):
    try:
        # 1. Get farmer profile
        user = get_user(user_id)
        if not user:
            return {"error": "User not found"}

        # ✅ Extract lat/lon
        location = user.get("location", {})
        lat = location.get("lat")
        lon = location.get("lon")

        # ✅ Round lat/lon to 1 decimal place for SoilGrids
        lat_rounded = round(lat, 1)
        lon_rounded = round(lon, 1)

        if lat is None or lon is None:
            return {"error": "User does not have latitude/longitude"}

        # 2. Fetch weather
        raw_weather = fetch_weather(lat, lon)
        weather_report = shape_report(lat, lon, raw_weather)

        # 3. Fetch soil properties (await each one!)
        soil_report = {
            "ph": await fetch_property(lat_rounded, lon_rounded, "phh2o"),
            "organic_carbon": await fetch_property(lat_rounded, lon_rounded, "ocd"),
            "sand": await fetch_property(lat_rounded, lon_rounded, "sand"),
            "clay": await fetch_property(lat_rounded, lon_rounded, "clay"),
        }

        # 4. Build Prompt for Gemini
        prompt = f"""
        You are an agricultural expert. 
        Suggest the best crops for the farmer based on the following factors:

        🌦 Weather Report:
        - Location: {weather_report['location']['city']} ({weather_report['location']['latitude']}, {weather_report['location']['longitude']})
        - Condition: {weather_report['condition']}
        - Temperature (°C): {weather_report['temperature_c']}
        - Humidity (%): {weather_report['humidity_pct']}
        - Wind Speed (m/s): {weather_report['windspeed_mps']}

        🌱 Soil Report:
        - pH: {soil_report['ph']}
        - Organic Carbon: {soil_report['organic_carbon']}
        - Sand: {soil_report['sand']}
        - Clay: {soil_report['clay']}

        🌍 Farmer Profile:
        - Name: {user.get("name", "Farmer")}
        - Preferred Language: {target_lang}

        Provide a list of recommended crops that are best suited to this farmer’s conditions. 
        Reply in {target_lang}. Give me the suggested crops first in priority order, then explain why each crop is suitable based on the weather and soil conditions.
        """
          

        # 5. Send to Gemini
        gemini_response = await ask_gemini(prompt)

        return {
            "user_id": user_id,
            "language": target_lang,
            "weather": weather_report,
            "soil": soil_report,
            "recommended_crops": gemini_response  # <-- Gemini output instead of dummy
        }

    except Exception as e:
        return {"error": str(e)}
