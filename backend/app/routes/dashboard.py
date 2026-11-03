from fastapi import APIRouter
from app.models.schemas import DashboardStats
from app.services import stats_service

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardStats)
def get_dashboard():
    return stats_service.get_dashboard_statistics()

