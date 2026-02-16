from fastapi import APIRouter
from .voice import router as voice_router
from .intent import router as intent_router
from .tips import router as tips_router
from .router import router

router = APIRouter()
router.include_router(voice_router, prefix="/voice", tags=["voice"])
router.include_router(intent_router, prefix="/intent", tags=["intent"])
router.include_router(tips_router, prefix="/tips", tags=["tips"])
