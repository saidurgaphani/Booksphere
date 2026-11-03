from fastapi import APIRouter
from app.models.schemas import InsightsStats
from app.services import stats_service

router = APIRouter(prefix="/api/insights", tags=["Insights"])

@router.get("", response_model=InsightsStats)
def get_insights():
    return stats_service.get_insights_statistics()

