import requests
from bs4 import BeautifulSoup

def fetch_prices_example(commodity_slug):
    url = f"https://agmarknet.gov.in/SearchCmmResults.aspx?CommName={commodity_slug}"
    r = requests.get(url, timeout=10)
    soup = BeautifulSoup(r.text, "html.parser")
    prices=[]
    table = soup.select_one("table#tblData")
    if not table:
        return []
    rows = table.find_all("tr")[1:]
    for tr in rows:
        tds = tr.find_all("td")
        date = tds[0].text.strip()
        try:
            price = float(tds[2].text.replace(",","").strip())
            prices.append({"date": date, "price": price})
        except:
            continue
    return prices
