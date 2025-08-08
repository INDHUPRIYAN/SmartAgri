import google.generativeai as genai
import json
import re

genai.configure(api_key="AIzaSyB9qsgPSuc-gF4rKe6fYOsyyKSLKR7CXAk")
model = genai.GenerativeModel("gemini-1.5-flash")

async def predict_yield_and_suggestion(acres, crop_name):
    prompt = (
        f"You are an agricultural expert.\n"
        f"A farmer has {acres} acres of land and is growing {crop_name}.\n"
        f"Estimate the average yield in kilograms and suggest one sustainable farming method."
    )
    try:
        response = model.generate_content(prompt)
        return {
            "crop": crop_name,
            "gemini_response": response.text
        }
    except Exception as e:
        return {
            "crop": crop_name,
            "gemini_response": f"Error: {str(e)}"
        }


async def estimate_soil_properties_from_health(soil_health_data: str):
    prompt = (
        "You are an experienced soil scientist and agronomist.\n"
        "Based on the following qualitative soil health parameters, estimate **realistic and scientifically valid** values for:\n"
        "- pH (4.5 to 9.0)\n"
        "- Nitrogen (ppm, typically between 10 to 100)\n"
        "- Phosphorus (ppm, typically between 5 to 50)\n"
        "- Potassium (ppm, typically between 50 to 200)\n"
        "- Latitude and Longitude (must be real-world GPS coordinates from India only)\n\n"
        "Respond in VALID JSON format exactly like this:\n"
        '{\n'
        '  "ph": 6.5,\n'
        '  "nitrogen": 55,\n'
        '  "phosphorus": 35,\n'
        '  "potassium": 75,\n'
        '  "latitude": 13.0827,\n'
        '  "longitude": 80.2707\n'
        '}\n\n'
        f"Input Soil Health Description:\n{soil_health_data.strip()}\n\n"
        "Ensure the output is realistic and stays within standard ranges used in agriculture."
    )
    try:
        response = model.generate_content(prompt)
        match = re.search(r"\{.*?\}", response.text, re.DOTALL)
        if match:
            parsed = json.loads(match.group(0))
            
            if (
                4.0 <= parsed["ph"] <= 9.0 and
                0 <= parsed["nitrogen"] <= 150 and
                0 <= parsed["phosphorus"] <= 100 and
                0 <= parsed["potassium"] <= 300
            ):
                return parsed
            else:
                return {
                    "error": "Values out of realistic range.",
                    "raw": parsed
                }
        else:
            return {
                "error": "Unable to parse Gemini response.",
                "raw_response": response.text
            }
    except Exception as e:
        return {
            "error": str(e),
            "context": "Gemini AI - estimate_soil_properties_from_health"
        }
