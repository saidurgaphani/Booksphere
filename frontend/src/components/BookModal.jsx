import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, BookOpen, Star, Loader2 } from 'lucide-react';
import { searchOpenLibrary } from '../services/api';

const GENRE_SUGGESTIONS = [
  'Science Fiction',
  'Self-Help',
  'Productivity',
  'Literary Fiction',
  'Finance',
  'Philosophy',
  'Psychology',
  'Fantasy',
  'Mystery',
  'Biography',
];

export default function BookModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'Science Fiction',
    description: '',
    total_pages: 300,
    current_page: 0,
    status: 'want_to_read',
    cover_image: '',
    rating: null,
  });

  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'search'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        genre: initialData.genre || 'General',
        description: initialData.description || '',
        total_pages: initialData.total_pages || 300,
        current_page: initialData.current_page || 0,
        status: initialData.status || 'want_to_read',
        cover_image: initialData.cover_image || '',
        rating: initialData.rating || null,
      });
      setActiveTab('form');
    } else {
      setFormData({
        title: '',
        author: '',
        genre: 'Science Fiction',
        description: '',
        total_pages: 300,
        current_page: 0,
        status: 'want_to_read',
        cover_image: '',
        rating: null,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleOpenLibrarySearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await searchOpenLibrary(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectSearchResult = (book) => {
    setFormData((prev) => ({
      ...prev,
      title: book.title,
      author: book.author,
      genre: book.genre || prev.genre,
      total_pages: book.total_pages || prev.total_pages,
      cover_image: book.cover_image || prev.cover_image,
      description: book.description || prev.description,
    }));
    setActiveTab('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) return;
    setSubmitting(true);
    try {
      await onSave({
        ...formData,
        total_pages: Number(formData.total_pages) || 1,
        current_page: Number(formData.current_page) || 0,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-cream-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cream-200/80 flex items-center justify-between bg-cream-50/50">
          <div>
            <h3 className="font-serif font-bold text-lg text-navy-900">
              {initialData ? 'Edit Book Details' : 'Add New Book'}
            </h3>
            <p className="text-xs text-stone-500">
              {initialData ? 'Update details in your personal library' : 'Enter manual details or search online database'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-navy-900 hover:bg-cream-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch for new books */}
        {!initialData && (
          <div className="flex border-b border-cream-200 px-6 pt-2 bg-cream-50/30">
            <button
              onClick={() => setActiveTab('form')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                activeTab === 'form'
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'search'
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Auto-fill from Open Library
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'search' ? (
            <div className="space-y-4">
              <form onSubmit={handleOpenLibrarySearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by book title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white border border-cream-300 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                </button>
              </form>

              {/* Results List */}
              <div className="space-y-2 mt-4">
                {searchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectSearchResult(res)}
                    className="p-3 rounded-xl border border-cream-200 hover:border-brand-300 hover:bg-brand-50/40 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {res.cover_image ? (
                        <img
                          src={res.cover_image}
                          alt={res.title}
                          className="w-8 h-11 object-cover rounded shadow-2xs"
                        />
                      ) : (
                        <div className="w-8 h-11 bg-cream-200 rounded flex items-center justify-center text-stone-500">
                          <BookOpen className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-semibold text-navy-900 group-hover:text-brand-700">
                          {res.title}
                        </h4>
                        <p className="text-xs text-stone-500">by {res.author}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded-md">
                      Use This
                    </span>
                  </div>
                ))}

                {searchResults.length === 0 && !isSearching && searchQuery && (
                  <p className="text-xs text-center text-stone-400 py-6">
                    No books found. You can fill out details manually under the 'Manual Entry' tab.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} id="book-form" className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sapiens: A Brief History of Humankind"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-cream-300 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yuval Noah Harari"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-cream-300 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Genre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. History"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-cream-300 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Genre chips */}
              <div className="flex flex-wrap gap-1.5">
                {GENRE_SUGGESTIONS.slice(0, 6).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, genre: g })}
                    className={`text-[11px] px-2 py-0.5 rounded-full border transition ${
                      formData.genre.toLowerCase() === g.toLowerCase()
                        ? 'bg-brand-50 text-brand-700 border-brand-300 font-semibold'
                        : 'bg-white text-stone-500 border-cream-200 hover:border-cream-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Total Pages *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.total_pages}
                    onChange={(e) => setFormData({ ...formData, total_pages: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Current Page
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formData.total_pages}
                    value={formData.current_page}
                    onChange={(e) => {
                      const cur = Number(e.target.value);
                      let newStatus = formData.status;
                      if (cur >= formData.total_pages) newStatus = 'completed';
                      else if (cur > 0 && newStatus === 'want_to_read') newStatus = 'reading';
                      setFormData({ ...formData, current_page: e.target.value, status: newStatus });
                    }}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="want_to_read">Want to Read</option>
                    <option value="reading">Currently Reading</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description / Synopsis
                </label>
                <textarea
                  rows="2"
                  placeholder="Brief summary of the book..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-cream-300 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-cream-300 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Rating (1-5)
                  </label>
                  <div className="flex items-center gap-1.5 py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            rating: formData.rating === star ? null : star,
                          })
                        }
                        className="p-1 rounded hover:scale-110 transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            formData.rating && star <= formData.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-stone-300 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer actions */}
        {activeTab === 'form' && (
          <div className="px-6 py-4 border-t border-cream-200/80 bg-cream-50/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-navy-900 rounded-xl hover:bg-cream-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="book-form"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialData ? 'Update Book' : 'Add to Library'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

