import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from app.utils.storage import read_json, write_json
from app.services.book_service import get_book_by_id, BOOKS_FILE, enrich_book

HISTORY_FILE = "history.json"

def update_reading_progress(book_id: str, new_page: int, session_note: Optional[str] = None) -> Optional[Dict[str, Any]]:
    books = read_json(BOOKS_FILE, default=[])
    now_iso = datetime.now(timezone.utc).isoformat()
    
    target_idx = None
    for idx, b in enumerate(books):
        if b.get("id") == book_id:
            target_idx = idx
            break
            
    if target_idx is None:
        return None
        
    book = books[target_idx]
    prev_page = book.get("current_page", 0)
    total_pages = book.get("total_pages", 1)
    
    clamped_page = max(0, min(new_page, total_pages))
    pages_diff = clamped_page - prev_page
    
    book["current_page"] = clamped_page
    
    # Status progression
    if clamped_page >= total_pages:
        book["status"] = "completed"
        if not book.get("date_completed"):
            book["date_completed"] = now_iso
    elif clamped_page > 0:
        book["status"] = "reading"
        if not book.get("date_started"):
            book["date_started"] = now_iso
    else:
        book["status"] = "want_to_read"
        
    books[target_idx] = book
    write_json(BOOKS_FILE, books)
    
    # Log session to history if pages changed or note provided
    history_entry = None
    if pages_diff != 0 or session_note:
        history = read_json(HISTORY_FILE, default=[])
        history_entry = {
            "id": f"hist-{uuid.uuid4().hex[:8]}",
            "book_id": book_id,
            "book_title": book.get("title", "Unknown Book"),
            "previous_page": prev_page,
            "new_page": clamped_page,
            "pages_read": max(0, pages_diff),
            "timestamp": now_iso,
            "note": session_note or f"Progress updated to page {clamped_page}/{total_pages}"
        }
        history.append(history_entry)
        write_json(HISTORY_FILE, history)
        
    return {
        "book": enrich_book(book),
        "history_entry": history_entry
    }

def get_reading_history(limit: Optional[int] = None) -> list:
    history = read_json(HISTORY_FILE, default=[])
    # sort by timestamp descending
    history.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    if limit:
        return history[:limit]
    return history

