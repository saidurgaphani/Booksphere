import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from app.utils.storage import read_json, write_json
from app.services.book_service import get_book_by_id
from app.models.schemas import NoteCreate, NoteUpdate

NOTES_FILE = "notes.json"

def get_all_notes(
    search: Optional[str] = None,
    note_type: Optional[str] = None,
    book_id: Optional[str] = None
) -> List[Dict[str, Any]]:
    notes = read_json(NOTES_FILE, default=[])
    
    if book_id:
        notes = [n for n in notes if n.get("book_id") == book_id]
        
    if note_type and note_type != "all":
        notes = [n for n in notes if n.get("type") == note_type]
        
    if search:
        s = search.lower().strip()
        notes = [
            n for n in notes
            if s in n.get("content", "").lower()
            or s in n.get("book_title", "").lower()
            or any(s in tag.lower() for tag in n.get("tags", []))
        ]
        
    notes.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return notes

def get_notes_for_book(book_id: str) -> List[Dict[str, Any]]:
    return get_all_notes(book_id=book_id)

def create_note(book_id: str, note_data: NoteCreate) -> Optional[Dict[str, Any]]:
    book = get_book_by_id(book_id)
    if not book:
        return None
        
    notes = read_json(NOTES_FILE, default=[])
    now_iso = datetime.now(timezone.utc).isoformat()
    
    new_note = {
        "id": f"note-{uuid.uuid4().hex[:8]}",
        "book_id": book_id,
        "book_title": book.get("title", ""),
        "type": note_data.type,
        "page_number": note_data.page_number,
        "content": note_data.content.strip(),
        "tags": note_data.tags or [],
        "created_at": now_iso,
        "updated_at": now_iso
    }
    notes.append(new_note)
    write_json(NOTES_FILE, notes)
    return new_note

def update_note(note_id: str, updates: NoteUpdate) -> Optional[Dict[str, Any]]:
    notes = read_json(NOTES_FILE, default=[])
    now_iso = datetime.now(timezone.utc).isoformat()
    
    target_idx = None
    for idx, n in enumerate(notes):
        if n.get("id") == note_id:
            target_idx = idx
            break
            
    if target_idx is None:
        return None
        
    note = notes[target_idx]
    update_dict = updates.model_dump(exclude_unset=True)
    
    for k, v in update_dict.items():
        if v is not None:
            note[k] = v
            
    note["updated_at"] = now_iso
    notes[target_idx] = note
    write_json(NOTES_FILE, notes)
    return note

def delete_note(note_id: str) -> bool:
    notes = read_json(NOTES_FILE, default=[])
    initial_len = len(notes)
    notes = [n for n in notes if n.get("id") != note_id]
    if len(notes) < initial_len:
        write_json(NOTES_FILE, notes)
        return True
    return False

