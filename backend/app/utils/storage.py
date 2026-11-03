import json
import os
import shutil
import tempfile
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

def ensure_data_dir() -> Path:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    return DATA_DIR

def get_file_path(filename: str) -> Path:
    ensure_data_dir()
    return DATA_DIR / filename

def read_json(filename: str, default: Any = None) -> Any:
    file_path = get_file_path(filename)
    if not file_path.exists():
        if default is not None:
            write_json(filename, default)
            return default
        return []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return default if default is not None else []

def write_json(filename: str, data: Any) -> None:
    file_path = get_file_path(filename)
    ensure_data_dir()
    
    # Write to temporary file first then atomically replace to avoid corruptions
    temp_dir = file_path.parent
    with tempfile.NamedTemporaryFile("w", dir=temp_dir, delete=False, encoding="utf-8") as tf:
        json.dump(data, tf, indent=2, ensure_ascii=False)
        temp_name = tf.name
    shutil.move(temp_name, file_path)

