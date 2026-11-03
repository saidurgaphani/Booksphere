import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import BookModal from './components/BookModal';
import ProgressModal from './components/ProgressModal';
import NoteModal from './components/NoteModal';
import BookDetailModal from './components/BookDetailModal';

import DashboardPage from './pages/DashboardPage';
import LibraryPage from './pages/LibraryPage';
import DiscoverPage from './pages/DiscoverPage';
import ReadingProgressPage from './pages/ReadingProgressPage';
import NotesPage from './pages/NotesPage';
import InsightsPage from './pages/InsightsPage';
import SettingsPage from './pages/SettingsPage';

import {
  getDashboard,
  getBooks,
  getNotes,
  getHistory,
  getInsights,
  getSettings,
  createBook,
  updateBook,
  deleteBook,
  updateProgress,
  createBookNote,
  updateNote,
  deleteNote,
  exportReportUrl,
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data States
  const [books, setBooks] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [bookForProgress, setBookForProgress] = useState(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteBookId, setNoteBookId] = useState(null);

  const [selectedBookDetail, setSelectedBookDetail] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (toastObj) => {
    setToast(toastObj);
  };

  const loadAllData = async () => {
    try {
      const [bList, dash, ins, nList, hist, sett] = await Promise.all([
        getBooks(),
        getDashboard(),
        getInsights(),
        getNotes(),
        getHistory(),
        getSettings(),
      ]);
      setBooks(bList);
      setDashboardData(dash);
      setInsightsData(ins);
      setNotes(nList);
      setHistory(hist);
      setSettings(sett);
    } catch (err) {
      console.error('Error fetching BookSphere data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers for Books
  const handleOpenAddBook = () => {
    setEditingBook(null);
    setIsBookModalOpen(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setIsBookModalOpen(true);
  };

  const handleSaveBook = async (formData) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, formData);
        showToast({ type: 'success', message: `Updated "${formData.title}"` });
      } else {
        await createBook(formData);
        showToast({ type: 'success', message: `Added "${formData.title}" to library!` });
      }
      await loadAllData();
      // If book detail is open, update it
      if (selectedBookDetail && editingBook && selectedBookDetail.id === editingBook.id) {
        setSelectedBookDetail({ ...selectedBookDetail, ...formData });
      }
    } catch (err) {
      console.error(err);
      showToast({ type: 'error', message: 'Failed to save book' });
    }
  };

  const handleDeleteBook = async (book) => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}" from your library?`)) {
      return;
    }
    try {
      await deleteBook(book.id);
      showToast({ type: 'info', message: `Deleted "${book.title}"` });
      if (selectedBookDetail?.id === book.id) {
        setSelectedBookDetail(null);
      }
      await loadAllData();
    } catch (err) {
      console.error(err);
      showToast({ type: 'error', message: 'Failed to delete book' });
    }
  };

  // Progress Handlers
  const handleOpenProgress = (book) => {
    if (!book && books.length > 0) {
      // Find currently reading or first book
      const firstReading = books.find((b) => b.status === 'reading') || books[0];
      setBookForProgress(firstReading);
    } else {
      setBookForProgress(book);
    }
    setIsProgressModalOpen(true);
  };

  const handleSaveProgress = async (bookId, newPage, sessionNote) => {
    try {
      const res = await updateProgress(bookId, { new_page: newPage, session_note: sessionNote });
      showToast({
        type: 'success',
        message: `Updated progress to page ${newPage}!`,
      });
      await loadAllData();
      if (selectedBookDetail && selectedBookDetail.id === bookId) {
        setSelectedBookDetail(res.book);
      }
    } catch (err) {
      console.error(err);
      showToast({ type: 'error', message: 'Failed to update progress' });
    }
  };

  // Note Handlers
  const handleOpenAddNote = (bookId = null) => {
    setEditingNote(null);
    setNoteBookId(bookId);
    setIsNoteModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteBookId(note.book_id);
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        await updateNote(editingNote.id, noteData);
        showToast({ type: 'success', message: 'Note updated successfully' });
      } else {
        await createBookNote(noteData.book_id, noteData);
        showToast({ type: 'success', message: 'Note saved to library' });
      }
      await loadAllData();
    } catch (err) {
      console.error(err);
      showToast({ type: 'error', message: 'Failed to save note' });
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(noteId);
      showToast({ type: 'info', message: 'Note removed' });
      await loadAllData();
    } catch (err) {
      console.error(err);
      showToast({ type: 'error', message: 'Failed to delete note' });
    }
  };

  // Direct Add from AI recommendations
  const handleAddFromAI = async (bookData) => {
    await handleSaveBook(bookData);
  };

  const handleExportReport = () => {
    const url = exportReportUrl('csv');
    window.open(url, '_blank');
    showToast({ type: 'info', message: 'Exporting reading report as CSV...' });
  };

  return (
    <div className="min-h-screen bg-cream-50 text-navy-900 flex flex-col lg:flex-row font-sans">
      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        settings={settings}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          setMobileOpen={setMobileOpen}
          onOpenAddBook={handleOpenAddBook}
          onOpenLogProgress={() => handleOpenProgress(null)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExportReport={handleExportReport}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardPage
              dashboardData={dashboardData}
              insightsData={insightsData}
              onNavigate={setActiveTab}
              onSelectBook={setSelectedBookDetail}
              onQuickProgress={handleOpenProgress}
              onOpenAddBook={handleOpenAddBook}
              onEditBook={handleEditBook}
              onDeleteBook={handleDeleteBook}
            />
          )}

          {activeTab === 'library' && (
            <LibraryPage
              books={books}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectBook={setSelectedBookDetail}
              onQuickProgress={handleOpenProgress}
              onOpenAddBook={handleOpenAddBook}
              onEditBook={handleEditBook}
              onDeleteBook={handleDeleteBook}
            />
          )}

          {activeTab === 'discover' && (
            <DiscoverPage
              books={books}
              onAddBookToLibrary={handleAddFromAI}
              onNavigate={setActiveTab}
              settings={settings}
            />
          )}

          {activeTab === 'progress' && (
            <ReadingProgressPage
              books={books}
              history={history}
              onSelectBook={setSelectedBookDetail}
              onQuickProgress={handleOpenProgress}
            />
          )}

          {activeTab === 'notes' && (
            <NotesPage
              notes={notes}
              books={books}
              onOpenAddNote={handleOpenAddNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              onSelectBook={setSelectedBookDetail}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsPage insightsData={insightsData} />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onSettingsUpdated={setSettings}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSave={handleSaveBook}
        initialData={editingBook}
      />

      <ProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        book={bookForProgress}
        onSaveProgress={handleSaveProgress}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        books={books}
        initialBookId={noteBookId}
        initialData={editingNote}
        onSaveNote={handleSaveNote}
      />

      <BookDetailModal
        isOpen={Boolean(selectedBookDetail)}
        onClose={() => setSelectedBookDetail(null)}
        book={selectedBookDetail}
        onOpenProgressModal={handleOpenProgress}
        onOpenAddNote={handleOpenAddNote}
        onEditBook={handleEditBook}
      />
    </div>
  );
}

