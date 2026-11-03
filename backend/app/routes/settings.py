from fastapi import APIRouter
from app.models.schemas import SettingsModel
from app.utils.storage import read_json, write_json

router = APIRouter(prefix="/api/settings", tags=["Settings"])

SETTINGS_FILE = "settings.json"

@router.get("", response_model=SettingsModel)
def get_settings():
    data = read_json(SETTINGS_FILE, default={})
    # Mask API key if requested for display, but here we can return masked or plain
    key = data.get("gemini_api_key", "")
    return SettingsModel(
        gemini_api_key=key,
        ai_model=data.get("ai_model", "gemini-2.5-flash"),
        theme=data.get("theme", "light"),
        daily_reading_goal_pages=data.get("daily_reading_goal_pages", 30),
        default_view=data.get("default_view", "grid")
    )

@router.post("", response_model=SettingsModel)
def save_settings(settings_in: SettingsModel):
    current = read_json(SETTINGS_FILE, default={})
    updated = {
        **current,
        **settings_in.model_dump(exclude_unset=True)
    }
    write_json(SETTINGS_FILE, updated)
    return SettingsModel(**updated)

