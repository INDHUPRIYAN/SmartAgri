import json, numpy as np
from datetime import datetime

with open("ai-models/crop_profiles.json") as f:
    CROP_PROFILES = json.load(f)

def compute_suitability(farm, crop):
    profile = CROP_PROFILES.get(crop,{})
    score = 50
    soil = farm.get("soil_type","").lower()
    if soil in [s.lower() for s in profile.get("soil",[])]:
        score += 30
    if farm.get("acres",0) >= profile.get("min_acres",0):
        score += 20
    return min(100, score)

def compute_market_score(price_series):
    # price_series = [{"date": "...", "price": 2000}, ...]
    if not price_series or len(price_series) < 3:
        return 50
    prices = [p["price"] for p in price_series[-30:]]
    x = np.arange(len(prices))
    y = np.array(prices)
    slope = np.polyfit(x,y,1)[0]
    mean = max(1, y.mean())
    norm = (slope / mean) * 100
    score = 50 + norm
    return max(0, min(100, score))

def compute_community_score(community_doc, crop):
    total = sum(community_doc.values()) if community_doc else 0
    if total == 0: return 20
    return (community_doc.get(crop,0) / total) * 100

def calculate_score(farm, history, community, market_data, candidates):
    scored = []
    for c in candidates:
        market_prices = market_data.get(c, [])
        if market_prices and isinstance(market_prices, list):
            try:
                avg_price = sum(p.get("price", 1000) for p in market_prices if isinstance(p.get("price"), (int,float))) / len(market_prices)
            except:
                avg_price = 1000
        else:
            avg_price = 1000  # fallback

        # Suitability: check soil + rotation
        suitability = compute_suitability(farm, c) if c in CROP_PROFILES else 60
        if c in history:  
            suitability -= 20  # discourage monocropping

        community_score = compute_community_score(community, c)
        market_score = min(int(avg_price / 50), 100)  # scale

        total = (suitability * 0.4) + (market_score * 0.4) + (community_score * 0.2)

        scored.append({
            "crop": c,
            "score": int(total),
            "suitability": int(suitability),
            "market": int(market_score),
            "community": int(community_score)
        })

    return sorted(scored, key=lambda x: x["score"], reverse=True)
