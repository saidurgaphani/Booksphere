import React, { useState, useMemo } from 'react';
import {
  Highlighter,
  Quote,
  FileText,
  Search,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  Filter,
  BookOpen
} from 'lucide-react';

export default function NotesPage({
  notes = [],
  books = [],
  onOpenAddNote,
  onEditNote,
  onDeleteNote,
  onSelectBook,
}) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, quote, note, highlight
  const [selectedBook, setSelectedBook] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // Type filter
      if (selectedType !== 'all' && n.type !== selectedType) return false;
      // Book filter
      if (selectedBook !== 'all' && n.book_id !== selectedBook) return false;
      // Search
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const inContent = n.content?.toLowerCase().includes(q);
        const inTitle = n.book_title?.toLowerCase().includes(q);
        const inTags = n.tags?.some((t) => t.toLowerCase().includes(q));
        if (!inContent && !inTitle && !inTags) return false;
      }
      return true;
    });
  }, [notes, selectedType, selectedBook, search]);

  const handleCopyQuote = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-3xl p-5 border border-cream-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: 'All Entries', count: notes.length },
              {
                id: 'quote',
                label: 'Quotes',
                count: notes.filter((n) => n.type === 'quote').length,
              },
              {
                id: 'note',
                label: 'Personal Notes',
                count: notes.filter((n) => n.type === 'note').length,
              },
              {
                id: 'highlight',
                label: 'Highlights',
                count: notes.filter((n) => n.type === 'highlight').length,
              },
            ].map((tab) => {
              const isActive = selectedType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-navy-900 text-white shadow-2xs'
                      : 'bg-cream-100/70 text-stone-600 hover:bg-cream-200/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-stone-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Action: Add Note */}
          <button
            onClick={() => onOpenAddNote()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-2xs transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Note / Quote</span>
          </button>
        </div>

        {/* Second Row: Search & Book Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-cream-100">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes, quotes, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-cream-50 border border-cream-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-700 focus:outline-none focus:border-brand-500"
            >
              <option value="all">Filter by Book (All)</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 space-y-3">
          <Quote className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-base text-navy-900">
            No notes found
          </h3>
          <p className="text-xs text-stone-500">
            {search
              ? 'No notes match your current search query.'
              : 'Save your first book quote or thought to start building your personal commonplace book.'}
          </p>
          <button
            onClick={() => onOpenAddNote()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-2xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Note</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredNotes.map((note) => {
            const isQuote = note.type === 'quote';

            return (
              <div
                key={note.id}
                className="bg-white rounded-3xl p-6 border border-cream-200/80 shadow-2xs hover:shadow-xs transition flex flex-col justify-between space-y-4 relative group"
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isQuote
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : note.type === 'highlight'
                          ? 'bg-purple-50 text-purple-800 border border-purple-200'
                          : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      {note.type}
                    </span>

                    {note.page_number && (
                      <span className="text-[11px] font-medium text-stone-400">
                        Page {note.page_number}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleCopyQuote(note.content, note.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-navy-900 hover:bg-cream-100 transition"
                      title="Copy text"
                    >
                      {copiedId === note.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onEditNote(note)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-navy-900 hover:bg-cream-100 transition"
                      title="Edit note"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content body */}
                <div className="flex-1">
                  <p
                    className={`text-sm leading-relaxed text-stone-800 ${
                      isQuote
                        ? 'font-serif italic text-navy-950 pl-3 border-l-2 border-brand-500'
                        : ''
                    }`}
                  >
                    {isQuote ? `"${note.content}"` : note.content}
                  </p>
                </div>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer with linked book title */}
                <div className="pt-3 border-t border-cream-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-serif font-semibold text-navy-900 truncate max-w-[200px]">
                    {note.book_title}
                  </span>
                  <span>{note.created_at?.slice(0, 10)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

