import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from app.utils.storage import read_json, write_json
from app.models.schemas import BookCreate, BookUpdate, BookOut

BOOKS_FILE = "books.json"

def calculate_completion(current: int, total: int) -> float:
    if total <= 0:
        return 0.0
    pct = round((min(current, total) / total) * 100, 1)
    return pct

def enrich_book(book: Dict[str, Any]) -> Dict[str, Any]:
    b = dict(book)
    current = b.get("current_page", 0)
    total = b.get("total_pages", 1)
    b["completion_percentage"] = calculate_completion(current, total)
    return b

def get_all_books(
    search: Optional[str] = None,
    status: Optional[str] = None,
    genre: Optional[str] = None,
    sort_by: Optional[str] = "date_added"
) -> List[Dict[str, Any]]:
    books = read_json(BOOKS_FILE, default=[])
    enriched = [enrich_book(b) for b in books]
    
    # Filter search
    if search:
        s = search.lower().strip()
        enriched = [
            b for b in enriched
            if s in b.get("title", "").lower() or s in b.get("author", "").lower() or s in b.get("genre", "").lower()
        ]
        
    # Filter status
    if status and status != "all":
        enriched = [b for b in enriched if b.get("status") == status]
        
    # Filter genre
    if genre and genre != "all":
        enriched = [b for b in enriched if b.get("genre", "").lower() == genre.lower()]
        
    # Sort
    if sort_by == "title":
        enriched.sort(key=lambda x: x.get("title", "").lower())
    elif sort_by == "progress":
        enriched.sort(key=lambda x: x.get("completion_percentage", 0), reverse=True)
    elif sort_by == "pages":
        enriched.sort(key=lambda x: x.get("total_pages", 0), reverse=True)
    else:  # default date_added descending
        enriched.sort(key=lambda x: x.get("date_added", ""), reverse=True)
        
    return enriched

def get_book_by_id(book_id: str) -> Optional[Dict[str, Any]]:
    books = read_json(BOOKS_FILE, default=[])
    for b in books:
        if b.get("id") == book_id:
            return enrich_book(b)
    return None

def create_book(book_data: BookCreate) -> Dict[str, Any]:
    books = read_json(BOOKS_FILE, default=[])
    now_iso = datetime.now(timezone.utc).isoformat()
    
    # Default status logic
    status = book_data.status
    current_page = book_data.current_page
    if current_page >= book_data.total_pages:
        status = "completed"
        current_page = book_data.total_pages
    elif current_page > 0 and status == "want_to_read":
        status = "reading"
        
    new_book = {
        "id": f"book-{uuid.uuid4().hex[:8]}",
        "title": book_data.title.strip(),
        "author": book_data.author.strip(),
        "genre": book_data.genre.strip(),
        "description": book_data.description or "",
        "total_pages": book_data.total_pages,
        "current_page": current_page,
        "status": status,
        "cover_image": book_data.cover_image or "",
        "rating": book_data.rating,
        "date_added": now_iso,
        "date_started": now_iso if status == "reading" else None,
        "date_completed": now_iso if status == "completed" else None
    }
    books.append(new_book)
    write_json(BOOKS_FILE, books)
    return enrich_book(new_book)

def update_book(book_id: str, updates: BookUpdate) -> Optional[Dict[str, Any]]:
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
    update_dict = updates.model_dump(exclude_unset=True)
    
    for k, v in update_dict.items():
        if v is not None:
            book[k] = v
            
    # Auto adjust status based on pages
    cur = book.get("current_page", 0)
    total = book.get("total_pages", 1)
    if cur >= total:
        book["status"] = "completed"
        book["current_page"] = total
        if not book.get("date_completed"):
            book["date_completed"] = now_iso
    elif cur > 0 and book.get("status") == "want_to_read":
        book["status"] = "reading"
        if not book.get("date_started"):
            book["date_started"] = now_iso
            
    books[target_idx] = book
    write_json(BOOKS_FILE, books)
    return enrich_book(book)

def delete_book(book_id: str) -> bool:
    books = read_json(BOOKS_FILE, default=[])
    initial_len = len(books)
    books = [b for b in books if b.get("id") != book_id]
    if len(books) < initial_len:
        write_json(BOOKS_FILE, books)
        # Also clean up associated notes
        notes = read_json("notes.json", default=[])
        notes = [n for n in notes if n.get("book_id") != book_id]
        write_json("notes.json", notes)
        return True
    return False

