import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  BookOpen,
  SlidersHorizontal,
  X
} from 'lucide-react';
import BookCard from '../components/BookCard';

export default function LibraryPage({
  books = [],
  onSelectBook,
  onQuickProgress,
  onOpenAddBook,
  onEditBook,
  onDeleteBook,
  searchQuery,
  setSearchQuery,
}) {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('date_added'); // date_added, title, progress, pages
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  // Extract all distinct genres from books
  const genres = useMemo(() => {
    const set = new Set();
    books.forEach((b) => {
      if (b.genre) set.add(b.genre);
    });
    return Array.from(set).sort();
  }, [books]);

  // Client-side instant filter and search
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      // Status filter
      if (selectedStatus !== 'all' && b.status !== selectedStatus) {
        return false;
      }
      // Genre filter
      if (selectedGenre !== 'all' && b.genre?.toLowerCase() !== selectedGenre.toLowerCase()) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = b.title?.toLowerCase().includes(q);
        const inAuthor = b.author?.toLowerCase().includes(q);
        const inGenre = b.genre?.toLowerCase().includes(q);
        if (!inTitle && !inAuthor && !inGenre) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'progress') {
        return (b.completion_percentage || 0) - (a.completion_percentage || 0);
      } else if (sortBy === 'pages') {
        return (b.total_pages || 0) - (a.total_pages || 0);
      } else {
        // default date_added descending
        return (b.date_added || '').localeCompare(a.date_added || '');
      }
    });
  }, [books, selectedStatus, selectedGenre, searchQuery, sortBy]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-3xl p-5 border border-cream-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Books', count: books.length },
              {
                id: 'reading',
                label: 'Reading',
                count: books.filter((b) => b.status === 'reading').length,
              },
              {
                id: 'completed',
                label: 'Completed',
                count: books.filter((b) => b.status === 'completed').length,
              },
              {
                id: 'want_to_read',
                label: 'Want to Read',
                count: books.filter((b) => b.status === 'want_to_read').length,
              },
            ].map((tab) => {
              const isActive = selectedStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
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

          {/* Right Controls: Sort & View Mode */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-cream-100/70 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-navy-900 border border-transparent focus:border-brand-500 focus:outline-none"
              >
                <option value="date_added">Recently Added</option>
                <option value="title">Title (A-Z)</option>
                <option value="progress">Reading Progress</option>
                <option value="pages">Book Length</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-cream-100/80 border border-cream-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-navy-900 shadow-2xs'
                    : 'text-stone-400 hover:text-navy-900'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-white text-navy-900 shadow-2xs'
                    : 'text-stone-400 hover:text-navy-900'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Second Row: Genre Filter Chips */}
        {genres.length > 0 && (
          <div className="pt-3 border-t border-cream-100 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-semibold text-stone-400 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Genre:
            </span>
            <button
              onClick={() => setSelectedGenre('all')}
              className={`text-xs px-2.5 py-1 rounded-lg transition ${
                selectedGenre === 'all'
                  ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All Genres
            </button>
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`text-xs px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
                  selectedGenre.toLowerCase() === g.toLowerCase()
                    ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {g}
              </button>
            ))}

            {(selectedGenre !== 'all' || selectedStatus !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedGenre('all');
                  setSelectedStatus('all');
                  setSearchQuery('');
                }}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 ml-auto whitespace-nowrap"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Book Cards Display */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 space-y-4">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-navy-900">
            No matching books found
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
            {searchQuery
              ? `No books matching "${searchQuery}". Try adjusting your keywords or clearing filters.`
              : "You haven't added any books to this category yet."}
          </p>
          <button
            onClick={onOpenAddBook}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add a New Book</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              viewMode="grid"
              onSelectBook={onSelectBook}
              onQuickProgress={onQuickProgress}
              onEditBook={onEditBook}
              onDeleteBook={onDeleteBook}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              viewMode="list"
              onSelectBook={onSelectBook}
              onQuickProgress={onQuickProgress}
              onEditBook={onEditBook}
              onDeleteBook={onDeleteBook}
            />
          ))}
        </div>
      )}
    </div>
  );
}

