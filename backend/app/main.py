from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

from app.routes import books, notes, dashboard, insights, recommendations, history, reports, settings

app = FastAPI(
    title="BookSphere API",
    description="Backend API for BookSphere – AI-Driven Reading Companion",
    version="1.0.0"
)

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "BookSphere API",
        "version": "1.0.0"
    }

# Register API Routers
app.include_router(dashboard.router)
app.include_router(books.router)
app.include_router(notes.router)
app.include_router(insights.router)
app.include_router(recommendations.router)
app.include_router(history.router)
app.include_router(reports.router)
app.include_router(settings.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

