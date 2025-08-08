import firebase_admin
from firebase_admin import auth , credentials
from fastapi import HTTPException, Depends, Request
from firebase_admin import firestore

cred=credentials.Certificate("app/firebase_key.json")
firebase_admin.initialize_app(cred)
db=firestore.client()

def verify_token(request: Request):
    auth_header= request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401,detail="Authorization header missing")
    try:
        token = auth_header.split(" ")[1]
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401,detail="Invalid token")

    doc = db.collection("users").document(uid).get()
    user_data = doc.to_dict() if doc.exists else {}
    preferred_language = user_data.get("preferred_language", "en")
    return {"uid": uid, "preferred_language": preferred_language}