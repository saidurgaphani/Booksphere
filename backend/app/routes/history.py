from typing import List, Optional
from fastapi import APIRouter, Query
from app.models.schemas import HistoryOut
from app.services import progress_service

router = APIRouter(prefix="/api/history", tags=["History"])

@router.get("", response_model=List[HistoryOut])
def get_history(limit: Optional[int] = Query(None, description="Limit records")):
    return progress_service.get_reading_history(limit=limit)

