from typing import List, Optional, Literal
from pydantic import BaseModel, Field

ReadingStatus = Literal["want_to_read", "reading", "completed"]
NoteType = Literal["note", "quote", "highlight"]

class BookBase(BaseModel):
    title: str = Field(..., min_length=1)
    author: str = Field(..., min_length=1)
    genre: str = Field(..., min_length=1)
    description: Optional[str] = ""
    total_pages: int = Field(..., gt=0)
    current_page: int = Field(0, ge=0)
    status: ReadingStatus = "want_to_read"
    cover_image: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[str] = None
    description: Optional[str] = None
    total_pages: Optional[int] = Field(None, gt=0)
    current_page: Optional[int] = Field(None, ge=0)
    status: Optional[ReadingStatus] = None
    cover_image: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)

class BookOut(BookBase):
    id: str
    completion_percentage: float = 0.0
    date_added: str
    date_started: Optional[str] = None
    date_completed: Optional[str] = None

class ProgressUpdate(BaseModel):
    new_page: int = Field(..., ge=0)
    session_note: Optional[str] = None

class NoteBase(BaseModel):
    type: NoteType = "note"
    page_number: Optional[int] = Field(None, ge=0)
    content: str = Field(..., min_length=1)
    tags: List[str] = []

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    type: Optional[NoteType] = None
    page_number: Optional[int] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None

class NoteOut(NoteBase):
    id: str
    book_id: str
    book_title: str
    created_at: str
    updated_at: str

class HistoryOut(BaseModel):
    id: str
    book_id: str
    book_title: str
    previous_page: int
    new_page: int
    pages_read: int
    timestamp: str
    note: Optional[str] = None

class DashboardStats(BaseModel):
    total_books: int
    currently_reading: int
    completed_books: int
    planned_books: int
    total_pages_read: int
    total_library_pages: int
    overall_progress_percentage: float
    recently_added_books: List[BookOut]
    currently_reading_books: List[BookOut]
    recent_activity: List[HistoryOut]

class GenreStat(BaseModel):
    genre: str
    count: int
    pages_read: int
    percentage: float

class MonthlySummary(BaseModel):
    month: str
    books_completed: int
    pages_read: int

class InsightsStats(BaseModel):
    total_books_completed: int
    total_pages_read: int
    average_pages_per_session: float
    reading_streak_days: int
    favorite_genres: List[GenreStat]
    monthly_summary: List[MonthlySummary]
    reading_pace_status: str

class RecommendationRequest(BaseModel):
    favorite_genres: Optional[List[str]] = None
    custom_prompt: Optional[str] = None
    count: int = Field(4, ge=1, le=10)

class BookRecommendation(BaseModel):
    title: str
    author: str
    genre: str
    description: str
    estimated_pages: Optional[int] = 300
    why_recommended: str
    key_themes: List[str] = []
    ai_generated: bool = True
    fallback: bool = False

class RecommendationsResponse(BaseModel):
    recommendations: List[BookRecommendation]
    source: str  # "gemini" or "curated_fallback"
    message: Optional[str] = None

class BookAIInsightsResponse(BaseModel):
    book_id: str
    title: str
    summary: str
    key_takeaways: List[str]
    discussion_questions: List[str]
    reflection_prompt: str
    source: str

class SettingsModel(BaseModel):
    gemini_api_key: Optional[str] = ""
    ai_model: Optional[str] = "gemini-2.5-flash"
    theme: Optional[str] = "light"
    daily_reading_goal_pages: Optional[int] = 30
    default_view: Optional[str] = "grid"

