from fastapi import HTTPException, Security, Header
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import firebase_admin
from firebase_admin import credentials, auth as fb_auth
from .config import settings  # Make sure settings is properly configured

if not firebase_admin._apps:
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
    firebase_admin.initialize_app(cred)

security = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    authorization: str | None = Header(default=None),
):
    token = None
    if credentials and credentials.scheme.lower() == "bearer":
        token = credentials.credentials
    elif authorization:
        token = authorization.strip()

    if not token:
        raise HTTPException(status_code=401, detail="Authorization token missing.")

    try:
        decoded = fb_auth.verify_id_token(token)
        return decoded
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        id_token = credentials.credentials
        decoded_token = fb_auth.verify_id_token(id_token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
