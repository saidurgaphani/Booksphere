# BookSphere – AI-Driven Reading Companion 📚✨

**BookSphere** is a polished personal reading companion application built for book lovers and student readers. It helps users manage their personal book collections, track reading progress, record quotes and highlights, analyze reading velocity, and receive intelligent book recommendations powered by the **Google Gemini API** (with a seamless offline curated fallback).

---

## 🌟 Key Features

### 1. 📊 Executive Reading Dashboard
- Real-time statistics computed directly from stored data:
  - Total library books, currently reading, completed titles, and wish list count.
  - Overall progress rate (%) and total pages read vs. total library pages.
- Currently reading shelf with one-click page logging.
- Recently added books and live chronological reading activity stream.
- Reading streak counter.

### 2. 📖 Library Collection Management
- Full CRUD operations (Add, Edit, Delete, View).
- Dual view modes: **Grid View** (with book covers and progress rings) and **List View**.
- Instant search across titles, authors, and genres.
- Status filters: *All Books*, *Currently Reading*, *Completed*, *Want to Read*.
- Genre categorization chips and multi-key sorting (Date Added, Title, Progress, Book Length).
- **Open Library Integration**: Instant auto-fill of book title, author, genre, page count, and cover art by searching Open Library's public API.

### 3. ⏱️ Reading Progress Tracker
- Accurate current page tracking and automatic completion percentage calculation.
- Quick session logger with interactive slider, quick-add buttons (`+10`, `+25`, `+50` pgs), and session notes.
- Automatically transitions books to *Completed* when reaching the last page.
- Comprehensive reading history audit log recording timestamps, page changes, and reflections.

### 4. 🤖 AI Recommendation Engine (Gemini 2.5 Flash)
- Synthesizes personalized book suggestions based on existing library books, preferred genres, and custom reader queries.
- Generates detailed premise summaries, key themes, and explains **"Why This Fits You"**.
- Distinguishes AI suggestions from existing library books with an instant **"Add to My Library"** action.
- **Graceful Fallback Mode**: If no Gemini API key is configured, BookSphere automatically utilizes its built-in curated recommendation engine. The app never crashes or blocks the user.

### 5. ✍️ Notes, Quotes & Commonplace Book
- Record quotes, reflections, and chapter highlights linked to specific books and page numbers.
- Tagging system (`#habits`, `#systems`, `#psychology`) and real-time search.
- Literary serif quote cards with a one-click **"Copy to Clipboard"** button.

### 6. 📈 Reading Insights & Analytics
- Visual genre distribution breakdown.
- Monthly reading throughput summary.
- Average pages read per session and current reading streak calculation.
- Personalized reading pace evaluation (*Consistent Reader*, *Active Reader*).

### 7. 📥 Report Generation & Exports
- Instant export of reading history, library statistics, and book statuses.
- Available in **CSV Spreadsheet** format and **Formatted ASCII Text (.txt)** format.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite | High-performance Single Page Application (SPA) |
| **Styling** | Tailwind CSS | Minimalist warm aesthetic, custom typography |
| **Icons** | Lucide React | Modern, clean stroke icons |
| **HTTP Client** | Axios | REST API integration with timeout & proxy |
| **Backend** | Python 3.10+, FastAPI | High-speed asynchronous Python REST API |
| **Storage** | Atomic JSON persistence | Zero external database dependencies (no Postgres/Mongo needed) |
| **AI Engine** | Google GenAI SDK (`gemini-2.5-flash`) | Dynamic literary analysis and book curation |

---

## 📁 Project Structure

```
BookSphere/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookCard.jsx          # Grid & List book component
│   │   │   ├── BookDetailModal.jsx   # Tabbed book overview, notes & AI insights
│   │   │   ├── BookModal.jsx         # Add/Edit book with Open Library lookup
│   │   │   ├── Header.jsx            # Top bar with search & actions
│   │   │   ├── NoteModal.jsx         # Add/Edit quotes & notes
│   │   │   ├── ProgressModal.jsx     # Quick page logger
│   │   │   ├── Sidebar.jsx           # Responsive navigation drawer
│   │   │   ├── StatCard.jsx          # Dashboard KPI indicator
│   │   │   └── Toast.jsx             # Notification toasts
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx     # Main overview & quick actions
│   │   │   ├── LibraryPage.jsx       # Complete book catalogue
│   │   │   ├── DiscoverPage.jsx      # AI Recommendation Engine
│   │   │   ├── ReadingProgressPage.jsx# Active reading tracker & history
│   │   │   ├── NotesPage.jsx         # Quotes & highlights commonplace book
│   │   │   ├── InsightsPage.jsx      # Reading analytics & genre charts
│   │   │   └── SettingsPage.jsx      # Gemini API key & export triggers
│   │   ├── services/
│   │   │   └── api.js                # Centralized Axios API client
│   │   ├── App.jsx                   # Root application state & router
│   │   ├── index.css                 # Custom font & scrollbar styling
│   │   └── main.jsx                  # React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI initialization & CORS
│   │   ├── models/
│   │   │   └── schemas.py            # Pydantic validation models
│   │   ├── routes/
│   │   │   ├── books.py              # Book CRUD & progress endpoints
│   │   │   ├── dashboard.py          # Dashboard statistics endpoint
│   │   │   ├── history.py            # Reading history log endpoint
│   │   │   ├── insights.py           # Analytics calculation endpoint
│   │   │   ├── notes.py              # Commonplace notes endpoints
│   │   │   ├── recommendations.py    # AI recommendation endpoint
│   │   │   ├── reports.py            # CSV / TXT report generator endpoint
│   │   │   └── settings.py           # Configuration & API key management
│   │   ├── services/
│   │   │   ├── ai_service.py         # Gemini SDK + curated fallback engine
│   │   │   ├── book_service.py       # Book operations & calculations
│   │   │   ├── notes_service.py      # Note CRUD operations
│   │   │   ├── progress_service.py   # Progress updates & history logging
│   │   │   ├── report_service.py     # CSV/TXT file generation
│   │   │   └── stats_service.py      # Aggregation logic
│   │   └── utils/
│   │       └── storage.py            # Thread-safe atomic JSON file manager
│   ├── data/
│   │   ├── books.json                # Stored book records
│   │   ├── history.json              # Recorded reading sessions
│   │   ├── notes.json                # Quotes and notes
│   │   └── settings.json             # App settings & API key
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.10 or higher
- Node.js 18+ & npm

---

### 2. Backend Setup

1. Open a terminal and navigate to the project directory:
   ```bash
   cd Booksphere
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # On macOS / Linux:
   python3 -m venv backend/venv
   source backend/venv/bin/activate

   # On Windows (Command Prompt / PowerShell):
   # python -m venv backend\venv
   # backend\venv\Scripts\activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. Start the FastAPI backend server:
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```
   The backend API will be live at: **http://localhost:8000**  
   Interactive Swagger API Documentation: **http://localhost:8000/docs**

---

### 3. Frontend Setup

1. In a new terminal window, navigate to the `frontend` folder:
   ```bash
   cd Booksphere/frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at: **http://localhost:5173**

---

## 🔑 AI Features & Gemini API Configuration

1. You can enter your Gemini API key in **Settings > Gemini AI Integration** directly inside the web UI, or set it in your environment:
   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   ```
2. If no key is provided, BookSphere automatically runs in **Curated Fallback Mode**, presenting realistic suggestions and literature breakdowns without crashing.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/dashboard` | Aggregated dashboard KPI metrics and recent activity |
| `GET` | `/api/books` | List all books with optional search, status, genre, and sort filters |
| `POST` | `/api/books` | Create a new book |
| `GET` | `/api/books/{id}` | Retrieve details of a specific book |
| `PUT` | `/api/books/{id}` | Update book details |
| `DELETE`| `/api/books/{id}` | Delete a book (and cascaded notes) |
| `POST` | `/api/books/{id}/progress` | Log pages read, update completion %, and append to history |
| `GET` | `/api/books/{id}/notes` | Retrieve all notes and quotes for a book |
| `POST` | `/api/books/{id}/notes` | Add a note or quote to a book |
| `POST` | `/api/books/{id}/ai-insights` | Synthesize AI literary insights and discussion questions |
| `GET` | `/api/notes` | Search and filter all saved notes across the library |
| `PUT` | `/api/notes/{id}` | Edit a note |
| `DELETE`| `/api/notes/{id}` | Delete a note |
| `GET` | `/api/insights` | In-depth reading statistics, streak, and monthly velocity |
| `POST` | `/api/recommendations` | Generate AI-driven personalized reading recommendations |
| `GET` | `/api/history` | Retrieve full reading session history |
| `GET` | `/api/reports/export?format=csv` | Download complete reading report in CSV format |
| `GET` | `/api/reports/export?format=txt` | Download formatted reading report in plain text format |
| `GET` | `/api/settings` | Retrieve user configuration |
| `POST` | `/api/settings` | Save Gemini API key and reading goals |

---

## 🎓 Academic Mini-Project Note

This application was created as a college mini-project demonstrating:
- Clean modular full-stack architecture (Separation of Routes, Services, Data models, and Utilities).
- Safe atomic file-based persistence using JSON without heavy database administration.
- Graceful degradation and fallback strategies when integrating third-party AI APIs.
- Responsive, modern human-centered UI design.

