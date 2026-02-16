import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
import time

cred_path = os.getenv("backend\firebase_key.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# --- Firestore Helpers ---
def get_user(user_id):
    doc = db.collection("users").document(user_id).get()
    return doc.to_dict() if doc.exists else None

def get_farm(user_id):
    q = db.collection("farms").where("user_id", "==", user_id).limit(1).get()
    return q[0].to_dict() if q else {}

def get_crop_history(user_id):
    doc = db.collection("crop_history").document(user_id).get()
    return doc.to_dict().get("history", []) if doc.exists else []

def get_community_stats(region):
    doc = db.collection("community_reports").document(region).get()
    return doc.to_dict() if doc.exists else {}

def save_recommendation(user_id, payload):
    """Save personalized recommendation with unique ID + timestamp"""
    doc_id = f"{user_id}_{int(time.time())}"
    payload["created_at"] = firestore.SERVER_TIMESTAMP  # Firestore auto timestamp
    db.collection("recommendations").document(doc_id).set(payload)
    return True

def increment_community(region, crop):
    ref = db.collection("community_reports").document(region)
    ref.set({crop: firestore.Increment(1)}, merge=True)
