import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Highlighter,
  History,
  TrendingUp,
  Star,
  Plus,
  Quote,
  CheckCircle2,
  Calendar,
  Layers,
  Loader2,
  Trash2
} from 'lucide-react';
import { getBookNotes, getBookAIInsights, getHistory, deleteNote } from '../services/api';

export default function BookDetailModal({
  isOpen,
  onClose,
  book,
  onOpenProgressModal,
  onOpenAddNote,
  onEditBook
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, notes, ai, history
  const [notes, setNotes] = useState([]);
  const [history, setHistory] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);

  useEffect(() => {
    if (book && isOpen) {
      loadNotes();
      loadBookHistory();
      setAiInsights(null); // Reset until tab clicked or loaded
      setActiveTab('overview');
    }
  }, [book, isOpen]);

  const loadNotes = async () => {
    if (!book) return;
    setLoadingNotes(true);
    try {
      const data = await getBookNotes(book.id);
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNotes(false);
    }
  };

  const loadBookHistory = async () => {
    if (!book) return;
    try {
      const allHist = await getHistory();
      const filtered = allHist.filter((h) => h.book_id === book.id);
      setHistory(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAiInsights = async () => {
    if (!book || aiInsights) return;
    setLoadingAi(true);
    try {
      const res = await getBookAIInsights(book.id);
      setAiInsights(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes(notes.filter((n) => n.id !== noteId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen || !book) return null;

  const pct = book.completion_percentage ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-cream-200 overflow-hidden">
        {/* Top Header Banner */}
        <div className="relative bg-navy-900 text-white p-6 pb-5 flex items-start justify-between">
          <div className="flex gap-4 items-start z-10 flex-1 min-w-0 pr-4">
            <div className="w-16 h-22 sm:w-20 sm:h-28 rounded-xl bg-cream-200 flex-shrink-0 overflow-hidden shadow-md">
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-600 to-indigo-900 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white/80" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-cream-100">
                  {book.genre}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-500/30 text-brand-200 border border-brand-400/30">
                  {book.status === 'reading'
                    ? 'Currently Reading'
                    : book.status === 'completed'
                    ? 'Completed'
                    : 'Want to Read'}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-serif font-bold text-white truncate">
                {book.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-medium">by {book.author}</p>

              {/* Rating */}
              {book.rating && (
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= book.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-stone-500'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-stone-300 ml-1 font-semibold">{book.rating}/5</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 z-10">
            <button
              onClick={() => onEditBook(book)}
              className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-xl transition text-white"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-cream-200 bg-cream-50/60 px-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Progress', icon: Layers },
            { id: 'notes', label: `Notes & Quotes (${notes.length})`, icon: Highlighter },
            { id: 'ai', label: 'AI Insights', icon: Sparkles },
            { id: 'history', label: `Reading Log (${history.length})`, icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'ai') loadAiInsights();
                }}
                className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                  active
                    ? 'border-brand-600 text-brand-700 bg-white/60'
                    : 'border-transparent text-stone-500 hover:text-navy-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-brand-600' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Progress Summary Card */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-600" />
                    <span className="text-xs font-semibold text-navy-900">
                      Reading Progress
                    </span>
                  </div>
                  <span className="text-xs font-bold text-brand-600">{pct}% Completed</span>
                </div>

                <div className="w-full bg-cream-200 rounded-full h-2.5 mb-3 overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span>
                    Current Page: <strong className="text-navy-900">{book.current_page}</strong> / {book.total_pages}
                  </span>
                  <span>{book.total_pages - book.current_page} pages remaining</span>
                </div>

                <div className="mt-3 pt-3 border-t border-cream-200 flex justify-end">
                  <button
                    onClick={() => onOpenProgressModal(book)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition shadow-2xs"
                  >
                    Update Progress
                  </button>
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Description
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed font-serif">
                  {book.description || 'No description added yet for this book.'}
                </p>
              </div>

              {/* Metadata Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-cream-100">
                <div className="p-3 rounded-xl bg-cream-50/50 border border-cream-200">
                  <span className="text-[11px] font-medium text-stone-400 block">Date Added</span>
                  <span className="text-xs font-semibold text-navy-900">
                    {book.date_added ? book.date_added.slice(0, 10) : 'N/A'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-cream-50/50 border border-cream-200">
                  <span className="text-[11px] font-medium text-stone-400 block">Date Started</span>
                  <span className="text-xs font-semibold text-navy-900">
                    {book.date_started ? book.date_started.slice(0, 10) : 'Not started'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-cream-50/50 border border-cream-200">
                  <span className="text-[11px] font-medium text-stone-400 block">Date Completed</span>
                  <span className="text-xs font-semibold text-navy-900">
                    {book.date_completed ? book.date_completed.slice(0, 10) : 'In progress'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NOTES & HIGHLIGHTS */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-600">
                  {notes.length} note{notes.length === 1 ? '' : 's'} recorded for this book
                </span>
                <button
                  onClick={() => onOpenAddNote(book.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Note / Quote</span>
                </button>
              </div>

              {loadingNotes ? (
                <div className="py-12 flex justify-center text-stone-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : notes.length === 0 ? (
                <div className="py-12 text-center text-stone-400 space-y-2">
                  <Quote className="w-8 h-8 mx-auto opacity-40" />
                  <p className="text-xs font-medium">No notes or quotes recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200/80 space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span className="font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                          {note.type}
                        </span>
                        <div className="flex items-center gap-2">
                          {note.page_number && (
                            <span>Page {note.page_number}</span>
                          )}
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-stone-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition p-0.5"
                            title="Delete note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p
                        className={`text-sm text-stone-800 leading-relaxed ${
                          note.type === 'quote' ? 'font-serif italic text-navy-950 pl-3 border-l-2 border-brand-500' : ''
                        }`}
                      >
                        {note.content}
                      </p>

                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {note.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-cream-200 text-stone-500"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI INSIGHTS */}
          {activeTab === 'ai' && (
            <div className="space-y-5">
              {loadingAi ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-600" />
                  <p className="text-xs font-medium text-stone-500">
                    Synthesizing intelligent literary insights with Gemini...
                  </p>
                </div>
              ) : aiInsights ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-600" />
                      <span className="text-xs font-semibold text-stone-700">
                        Synthesized Reading Insights
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                      Source: {aiInsights.source === 'gemini' ? 'Gemini 2.5 Flash' : 'Curated Engine'}
                    </span>
                  </div>

                  {/* Thesis / Summary */}
                  <div className="p-4 rounded-2xl bg-brand-50/40 border border-brand-100">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-brand-800 mb-1.5">
                      Core Concept & Summary
                    </h5>
                    <p className="text-sm font-serif text-stone-800 leading-relaxed">
                      {aiInsights.summary}
                    </p>
                  </div>

                  {/* Key Takeaways */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                      Key Takeaways
                    </h5>
                    <ul className="space-y-2">
                      {aiInsights.key_takeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Discussion Questions */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                      Discussion & Deep-Dive Questions
                    </h5>
                    <div className="space-y-2">
                      {aiInsights.discussion_questions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-navy-900"
                        >
                          <strong>{idx + 1}.</strong> {q}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reflection prompt */}
                  {aiInsights.reflection_prompt && (
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                        Reader's Reflection Prompt
                      </h5>
                      <p className="text-xs sm:text-sm font-serif italic text-amber-950">
                        "{aiInsights.reflection_prompt}"
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 4: READING HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-stone-600 block">
                Reading Sessions & Progression History
              </span>

              {history.length === 0 ? (
                <div className="py-12 text-center text-stone-400">
                  <p className="text-xs font-medium">No recorded reading sessions yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className="p-3 rounded-xl border border-cream-200 bg-cream-50/40 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-navy-900">
                            Page {h.new_page}
                          </span>
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            +{h.pages_read} pages
                          </span>
                        </div>
                        {h.note && (
                          <p className="text-xs text-stone-600 italic">"{h.note}"</p>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {h.timestamp ? h.timestamp.slice(0, 10) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

