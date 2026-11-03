from collections import defaultdict
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from app.utils.storage import read_json
from app.services.book_service import get_all_books, enrich_book

BOOKS_FILE = "books.json"
HISTORY_FILE = "history.json"

def get_dashboard_statistics() -> Dict[str, Any]:
    books = get_all_books()
    history = read_json(HISTORY_FILE, default=[])
    history.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    
    total_books = len(books)
    currently_reading = [b for b in books if b.get("status") == "reading"]
    completed_books = [b for b in books if b.get("status") == "completed"]
    planned_books = [b for b in books if b.get("status") == "want_to_read"]
    
    total_pages_read = sum(b.get("current_page", 0) for b in books)
    total_library_pages = sum(b.get("total_pages", 0) for b in books)
    
    overall_progress = 0.0
    if total_library_pages > 0:
        overall_progress = round((total_pages_read / total_library_pages) * 100, 1)
        
    # Sort books by date_added descending for recent list
    sorted_by_date = sorted(books, key=lambda x: x.get("date_added", ""), reverse=True)
    
    return {
        "total_books": total_books,
        "currently_reading": len(currently_reading),
        "completed_books": len(completed_books),
        "planned_books": len(planned_books),
        "total_pages_read": total_pages_read,
        "total_library_pages": total_library_pages,
        "overall_progress_percentage": overall_progress,
        "recently_added_books": sorted_by_date[:4],
        "currently_reading_books": currently_reading[:4],
        "recent_activity": history[:6]
    }

def calculate_reading_streak(history: List[Dict[str, Any]]) -> int:
    if not history:
        return 0
        
    dates_with_activity = set()
    for h in history:
        ts = h.get("timestamp")
        if ts:
            try:
                # Parse date part
                d_str = ts.split("T")[0]
                dates_with_activity.add(d_str)
            except Exception:
                continue
                
    if not dates_with_activity:
        return 0
        
    sorted_dates = sorted(list(dates_with_activity), reverse=True)
    today = datetime.now(timezone.utc).date()
    today_str = today.isoformat()
    yesterday_str = (today - timedelta(days=1)).isoformat()
    
    # Check if user read today or yesterday
    if sorted_dates[0] != today_str and sorted_dates[0] != yesterday_str:
        return 0
        
    streak = 1
    current_check = datetime.fromisoformat(sorted_dates[0]).date()
    for d_str in sorted_dates[1:]:
        d_val = datetime.fromisoformat(d_str).date()
        if (current_check - d_val).days == 1:
            streak += 1
            current_check = d_val
        elif (current_check - d_val).days == 0:
            continue
        else:
            break
            
    return streak

def get_insights_statistics() -> Dict[str, Any]:
    books = get_all_books()
    history = read_json(HISTORY_FILE, default=[])
    
    total_books_completed = sum(1 for b in books if b.get("status") == "completed")
    total_pages_read = sum(b.get("current_page", 0) for b in books)
    
    # Average pages per session
    total_session_pages = sum(h.get("pages_read", 0) for h in history)
    avg_pages = round(total_session_pages / max(1, len(history)), 1)
    
    # Streak
    streak = calculate_reading_streak(history)
    
    # Genre distribution
    genre_counts = defaultdict(int)
    genre_pages = defaultdict(int)
    for b in books:
        g = b.get("genre", "Uncategorized").title()
        genre_counts[g] += 1
        genre_pages[g] += b.get("current_page", 0)
        
    total_books = max(1, len(books))
    favorite_genres = []
    for g, count in sorted(genre_counts.items(), key=lambda x: x[1], reverse=True):
        favorite_genres.append({
            "genre": g,
            "count": count,
            "pages_read": genre_pages[g],
            "percentage": round((count / total_books) * 100, 1)
        })
        
    # Monthly reading summary (from history and completed dates)
    monthly_pages = defaultdict(int)
    monthly_completed = defaultdict(int)
    
    for h in history:
        ts = h.get("timestamp")
        if ts:
            try:
                month_key = ts[:7]  # e.g., "2026-10"
                monthly_pages[month_key] += h.get("pages_read", 0)
            except Exception:
                pass
                
    for b in books:
        if b.get("status") == "completed" and b.get("date_completed"):
            try:
                m_key = b["date_completed"][:7]
                monthly_completed[m_key] += 1
            except Exception:
                pass
                
    all_months = sorted(set(list(monthly_pages.keys()) + list(monthly_completed.keys())))
    # Format month nicely like "Oct 2026"
    monthly_summary = []
    for m in all_months:
        try:
            dt = datetime.strptime(m, "%Y-%m")
            label = dt.strftime("%b %Y")
        except Exception:
            label = m
        monthly_summary.append({
            "month": label,
            "books_completed": monthly_completed[m],
            "pages_read": monthly_pages[m]
        })
        
    # Reading pace calculation
    pace_status = "Consistent Reader" if streak >= 3 else ("Getting Started" if streak == 0 else "Active Reader")
    
    return {
        "total_books_completed": total_books_completed,
        "total_pages_read": total_pages_read,
        "average_pages_per_session": avg_pages,
        "reading_streak_days": streak,
        "favorite_genres": favorite_genres,
        "monthly_summary": monthly_summary,
        "reading_pace_status": pace_status
    }

