from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.models.schemas import (
    BookOut, BookCreate, BookUpdate, ProgressUpdate,
    NoteOut, NoteCreate, BookAIInsightsResponse
)
from app.services import book_service, progress_service, notes_service, ai_service

router = APIRouter(prefix="/api/books", tags=["Books"])

@router.get("", response_model=List[BookOut])
def list_books(
    search: Optional[str] = Query(None, description="Search by title, author, or genre"),
    status: Optional[str] = Query(None, description="Filter by status (want_to_read, reading, completed)"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    sort_by: Optional[str] = Query("date_added", description="Sort by date_added, title, progress, pages")
):
    return book_service.get_all_books(search=search, status=status, genre=genre, sort_by=sort_by)

@router.post("", response_model=BookOut, status_code=status.HTTP_201_CREATED)
def create_book(book_in: BookCreate):
    return book_service.create_book(book_in)

@router.get("/{book_id}", response_model=BookOut)
def get_book(book_id: str):
    book = book_service.get_book_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.put("/{book_id}", response_model=BookOut)
def update_book(book_id: str, updates: BookUpdate):
    book = book_service.update_book(book_id, updates)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.delete("/{book_id}", status_code=status.HTTP_200_OK)
def delete_book(book_id: str):
    success = book_service.delete_book(book_id)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"message": "Book deleted successfully", "id": book_id}

@router.post("/{book_id}/progress")
def update_progress(book_id: str, payload: ProgressUpdate):
    result = progress_service.update_reading_progress(
        book_id=book_id,
        new_page=payload.new_page,
        session_note=payload.session_note
    )
    if not result:
        raise HTTPException(status_code=404, detail="Book not found")
    return result

@router.get("/{book_id}/notes", response_model=List[NoteOut])
def get_book_notes(book_id: str):
    book = book_service.get_book_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return notes_service.get_notes_for_book(book_id)

@router.post("/{book_id}/notes", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def add_book_note(book_id: str, payload: NoteCreate):
    note = notes_service.create_note(book_id=book_id, note_data=payload)
    if not note:
        raise HTTPException(status_code=404, detail="Book not found")
    return note

@router.post("/{book_id}/ai-insights", response_model=BookAIInsightsResponse)
def get_book_insights(book_id: str):
    insights = ai_service.generate_book_ai_insights(book_id)
    if not insights:
        raise HTTPException(status_code=404, detail="Book not found")
    return insights

