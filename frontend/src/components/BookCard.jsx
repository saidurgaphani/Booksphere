import React from 'react';
import { BookOpen, Star, MoreVertical, Edit2, Trash2, ArrowUpRight } from 'lucide-react';

const STATUS_CONFIG = {
  reading: {
    label: 'Currently Reading',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    dot: 'bg-indigo-500',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
  },
  want_to_read: {
    label: 'Want to Read',
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500',
  },
};

export default function BookCard({
  book,
  onSelectBook,
  onQuickProgress,
  onEditBook,
  onDeleteBook,
  viewMode = 'grid'
}) {
  const statusInfo = STATUS_CONFIG[book.status] || STATUS_CONFIG.want_to_read;
  const pct = book.completion_percentage ?? 0;

  // Render list view
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl p-4 border border-cream-200/80 shadow-2xs hover:shadow-xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
        <div className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer" onClick={() => onSelectBook(book)}>
          {/* Thumbnail */}
          <div className="w-12 h-16 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0 relative shadow-2xs">
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-600 to-indigo-900 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5 opacity-80" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-cream-100 text-stone-600 border border-cream-200">
                {book.genre}
              </span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1.5 ${statusInfo.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                {statusInfo.label}
              </span>
            </div>
            <h4 className="font-serif font-bold text-base text-navy-900 truncate group-hover:text-brand-600 transition">
              {book.title}
            </h4>
            <p className="text-xs text-stone-500 truncate">by {book.author}</p>
          </div>
        </div>

        {/* Progress & Actions */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-cream-100">
          <div className="text-right sm:w-36">
            <div className="flex justify-between text-xs font-medium text-stone-600 mb-1">
              <span>p. {book.current_page} of {book.total_pages}</span>
              <span className="font-semibold text-brand-600">{pct}%</span>
            </div>
            <div className="w-full bg-cream-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onQuickProgress(book)}
              className="px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-cream-50 hover:bg-cream-100 border border-cream-300 rounded-lg transition"
            >
              Update
            </button>
            <button
              onClick={() => onSelectBook(book)}
              className="p-1.5 text-stone-400 hover:text-navy-900 rounded-lg hover:bg-cream-100 transition"
              title="View details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Grid Card
  return (
    <div className="bg-white rounded-2xl border border-cream-200/80 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Top Cover Visual */}
      <div
        className="relative h-48 bg-gradient-to-br from-stone-800 via-navy-900 to-indigo-950 p-4 flex flex-col justify-between cursor-pointer overflow-hidden"
        onClick={() => onSelectBook(book)}
      >
        {book.cover_image && (
          <img
            src={book.cover_image}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-navy-900 shadow-xs">
            {book.genre}
          </span>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-xs ${statusInfo.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
            {statusInfo.label}
          </span>
        </div>

        {/* Title over cover for fallback / elegance */}
        <div className="relative z-10">
          <h3 className="font-serif font-bold text-lg text-white line-clamp-2 drop-shadow-sm group-hover:text-brand-200 transition">
            {book.title}
          </h3>
          <p className="text-xs text-stone-200/90 font-medium drop-shadow-xs">
            {book.author}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">
          {book.description || 'No description recorded for this book.'}
        </p>

        {/* Progress Bar & Page Stats */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs text-stone-600 font-medium">
            <span>
              Page {book.current_page} of {book.total_pages}
            </span>
            <span className="font-semibold text-brand-600">{pct}%</span>
          </div>
          <div className="w-full bg-cream-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                book.status === 'completed' ? 'bg-emerald-500' : 'bg-brand-600'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Rating and Actions footer */}
        <div className="pt-3 border-t border-cream-200/60 flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  book.rating && star <= book.rating
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-stone-300'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onQuickProgress(book)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg text-brand-700 bg-brand-50 hover:bg-brand-100 transition"
            >
              Update
            </button>
            <button
              onClick={() => onEditBook(book)}
              className="p-1 text-stone-400 hover:text-navy-900 rounded-md hover:bg-cream-100 transition"
              title="Edit book"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteBook(book)}
              className="p-1 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition"
              title="Delete book"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

