import requests
from .firebase_auth import db

FCM_SERVER_KEY = "YOUR_FCM_SERVER_KEY"

def send_weather_alert_to_user(uid: str, title: str, message: str):
    
    user_doc = db.collection("users").document(uid).get()

    if not user_doc.exists:
        return {"error": "User not found"}

    user_data = user_doc.to_dict()
    fcm_token = user_data.get("fcm_token")

    if not fcm_token:
        return {"error": "FCM token not found for user"}

    url = "https://fcm.googleapis.com/fcm/send"
    headers = {
        "Authorization": f"key={FCM_SERVER_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "to": fcm_token,
        "notification": {
            "title": title,
            "body": message
        }
    }

    response = requests.post(url, json=payload, headers=headers)

    return {
        "status": "sent" if response.status_code == 200 else "failed",
        "firebase_response": response.json()
    }
