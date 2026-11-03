import React, { useState } from 'react';
import {
  TrendingUp,
  BookmarkCheck,
  CheckCircle2,
  Calendar,
  History,
  Clock,
  BookOpen,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export default function ReadingProgressPage({
  books = [],
  history = [],
  onSelectBook,
  onQuickProgress,
}) {
  const [historyFilter, setHistoryFilter] = useState('all');

  const readingBooks = books.filter((b) => b.status === 'reading');
  const completedBooks = books.filter((b) => b.status === 'completed');

  // Filter history
  const filteredHistory = history.filter((h) => {
    if (historyFilter === 'all') return true;
    return h.book_id === historyFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Active Books In Progress */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-navy-900">
              Active Books in Progress ({readingBooks.length})
            </h2>
            <p className="text-xs text-stone-500">
              Update pages read and maintain momentum
            </p>
          </div>
        </div>

        {readingBooks.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-cream-200 text-center text-stone-500">
            No active books in progress. Pick a book from your library to start reading!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {readingBooks.map((book) => {
              const pct = book.completion_percentage || 0;
              const remaining = Math.max(0, book.total_pages - book.current_page);

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-3xl p-5 border border-cream-200/80 shadow-2xs hover:shadow-xs transition space-y-4 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-20 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0 shadow-2xs">
                      {book.cover_image ? (
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-600 to-indigo-900 flex items-center justify-center text-white">
                          <BookOpen className="w-6 h-6 opacity-80" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-cream-100 text-stone-600 border border-cream-200">
                        {book.genre}
                      </span>
                      <h3
                        onClick={() => onSelectBook(book)}
                        className="font-serif font-bold text-base text-navy-900 truncate mt-1 cursor-pointer hover:text-brand-600 transition"
                      >
                        {book.title}
                      </h3>
                      <p className="text-xs text-stone-500 truncate">by {book.author}</p>
                    </div>
                  </div>

                  {/* Progress details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline text-xs font-semibold">
                      <span className="text-stone-700">
                        Page {book.current_page} of {book.total_pages}
                      </span>
                      <span className="text-brand-600 text-sm">{pct}%</span>
                    </div>

                    <div className="w-full bg-cream-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-brand-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-stone-400">
                      <span>{remaining} pages to finish</span>
                      <span>Started: {book.date_started?.slice(0, 10) || 'Recently'}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 border-t border-cream-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectBook(book)}
                      className="text-xs text-stone-500 hover:text-navy-900 flex items-center gap-1 transition"
                    >
                      <span>Book Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onQuickProgress(book)}
                      className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-2xs transition"
                    >
                      Log Today's Pages
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Completed Books Shelf */}
      {completedBooks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-navy-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Finished Books Archive ({completedBooks.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="bg-white rounded-2xl p-4 border border-cream-200/80 shadow-2xs hover:shadow-xs cursor-pointer transition flex items-center gap-3.5"
              >
                <div className="w-10 h-14 rounded-lg bg-emerald-50 border border-emerald-200 flex-shrink-0 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif font-bold text-sm text-navy-900 truncate">
                    {book.title}
                  </h4>
                  <p className="text-xs text-stone-500 truncate">by {book.author}</p>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    100% completed • {book.total_pages} pgs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Full Reading History Log */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-navy-900 flex items-center gap-2">
              <History className="w-5 h-5 text-stone-600" />
              Reading Session History Log
            </h2>
            <p className="text-xs text-stone-500">Every recorded reading session and page milestone</p>
          </div>

          {/* Filter by book */}
          {books.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
                className="bg-white border border-cream-300 rounded-xl px-3 py-1.5 text-xs text-stone-700 focus:outline-none focus:border-brand-500"
              >
                <option value="all">All Books</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-cream-200/80 overflow-hidden shadow-2xs">
          {filteredHistory.length === 0 ? (
            <div className="p-12 text-center text-stone-400">
              No reading history recorded matching the selection.
            </div>
          ) : (
            <div className="divide-y divide-cream-100">
              {filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-cream-50/50 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-serif font-bold text-sm text-navy-900">
                        {entry.book_title}
                      </h4>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        +{entry.pages_read} pages
                      </span>
                    </div>

                    <p className="text-xs text-stone-600">
                      Progressed from page {entry.previous_page} to{' '}
                      <strong className="text-navy-900">page {entry.new_page}</strong>
                    </p>

                    {entry.note && (
                      <p className="text-xs text-stone-500 italic bg-cream-50 px-2.5 py-1 rounded-lg inline-block">
                        "{entry.note}"
                      </p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0 text-xs text-stone-400 font-medium">
                    {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

