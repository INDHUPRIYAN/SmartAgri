from fastapi import APIRouter, Query
from app.services.soil_service import fetch_soil_data

router = APIRouter(prefix="/soil", tags=["Soil"])

@router.get("/point")
async def get_soil_point(
    lat: float = Query(..., description="Latitude of the location"),
    lon: float = Query(..., description="Longitude of the location"),
):
    result = await fetch_soil_data(lat, lon)
    return result
