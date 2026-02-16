import requests
from bs4 import BeautifulSoup

def get_market_prices(crop: str, region: str = "India"):
    """
    Scrape mandi/market data for the given crop.
    For demo, scraping Agmarknet (Gov of India).
    """
    url = f"https://agmarknet.gov.in/SearchCmmMkt.aspx?comm={crop}"
    headers = {"User-Agent": "Mozilla/5.0"}
    
    try:
        r = requests.get(url, headers=headers, timeout=10)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")

        rows = soup.find_all("tr")[1:6]  # take top 5 rows
        prices = []
        for row in rows:
            cols = [c.get_text(strip=True) for c in row.find_all("td")]
            if len(cols) >= 4:
                prices.append({
                    "market": cols[0],
                    "date": cols[1],
                    "min_price": cols[2],
                    "max_price": cols[3]
                })

        return prices if prices else [{"market": "N/A", "date": "N/A", "min_price": "0", "max_price": "0"}]

    except Exception as e:
        return [{"error": str(e)}]
