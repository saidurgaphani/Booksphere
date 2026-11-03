from fastapi import APIRouter
from app.models.schemas import RecommendationRequest, RecommendationsResponse
from app.services import ai_service

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.post("", response_model=RecommendationsResponse)
def get_recommendations(payload: RecommendationRequest):
    return ai_service.get_recommendations(
        favorite_genres=payload.favorite_genres,
        custom_prompt=payload.custom_prompt,
        count=payload.count
    )

