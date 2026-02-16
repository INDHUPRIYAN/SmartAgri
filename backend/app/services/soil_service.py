import httpx

SOILGRIDS_URL = "https://rest.isric.org/soilgrids/v2.0/properties/query"

# Properties we want to fetch
PROPERTIES = ["sand", "clay", "silt", "soc", "bdod", "phh2o"]
print(PROPERTIES)
# Depth label we need
TARGET_DEPTH = "15-30cm"

async def fetch_property(lat: float, lon: float, prop: str):
    """
    Fetch a single soil property from SoilGrids for the given lat/lon.
    Returns mean value at 15-30cm depth or None if not found.
    """
    url = f"{SOILGRIDS_URL}?lon={lon}&lat={lat}&property={prop}"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
    except Exception as e:
        return {prop: None, "error": str(e)}

    try:
        values = data["properties"]["layers"][0]["depths"]
        for d in values:
            if d.get("label") == TARGET_DEPTH:
                return {prop: d["values"].get("mean")}
        return {prop: None}
    except Exception as e:
        return {prop: None, "error": f"Parse error: {str(e)}"}


async def fetch_soil_data(lat: float, lon: float):
    """
    Fetch all properties and return combined JSON with mean values at 15-30cm.
    """
    results = {}
    errors = {}

    for prop in PROPERTIES:
        result = await fetch_property(lat, lon, prop)
        if prop in result and result[prop] is not None:
            results[prop] = result[prop]
        else:
            results[prop] = None
            if "error" in result:
                errors[prop] = result["error"]

    return {
        "location": {"lat": lat, "lon": lon},
        "depth": TARGET_DEPTH,
        "soil_summary": results,
        "errors": errors if errors else None
    }
