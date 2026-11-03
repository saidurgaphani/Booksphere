from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.models.schemas import NoteOut, NoteUpdate
from app.services import notes_service

router = APIRouter(prefix="/api/notes", tags=["Notes"])

@router.get("", response_model=List[NoteOut])
def list_notes(
    search: Optional[str] = Query(None, description="Search notes or quotes"),
    type: Optional[str] = Query(None, description="Filter by note, quote, or highlight"),
    book_id: Optional[str] = Query(None, description="Filter by book ID")
):
    return notes_service.get_all_notes(search=search, note_type=type, book_id=book_id)

@router.put("/{note_id}", response_model=NoteOut)
def update_note(note_id: str, updates: NoteUpdate):
    note = notes_service.update_note(note_id, updates)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.delete("/{note_id}", status_code=status.HTTP_200_OK)
def delete_note(note_id: str):
    success = notes_service.delete_note(note_id)
    if not success:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully", "id": note_id}

