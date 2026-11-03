import React, { useState, useEffect } from 'react';
import { X, BookmarkCheck, TrendingUp } from 'lucide-react';

export default function ProgressModal({ isOpen, onClose, book, onSaveProgress }) {
  const [newPage, setNewPage] = useState(0);
  const [sessionNote, setSessionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setNewPage(book.current_page || 0);
      setSessionNote('');
    }
  }, [book, isOpen]);

  if (!isOpen || !book) return null;

  const total = book.total_pages || 1;
  const clampedPage = Math.max(0, Math.min(Number(newPage) || 0, total));
  const newPct = Math.round((clampedPage / total) * 100);
  const pagesReadThisSession = clampedPage - (book.current_page || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSaveProgress(book.id, clampedPage, sessionNote);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-cream-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cream-200/80 flex items-center justify-between bg-cream-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-navy-900">
                Update Reading Progress
              </h3>
              <p className="text-xs text-stone-500 truncate max-w-[220px]">
                {book.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-navy-900 hover:bg-cream-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Progress Visual */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200/80 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-stone-600">
                New Progress: {clampedPage} of {total} pages
              </span>
              <span className="text-sm font-bold text-brand-600">{newPct}%</span>
            </div>

            <div className="w-full bg-cream-200/80 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${newPct}%` }}
              />
            </div>

            {pagesReadThisSession > 0 && (
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +{pagesReadThisSession} pages read in this session!
              </p>
            )}
          </div>

          {/* Slider & Quick Increments */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Page Number
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max={total}
                value={clampedPage}
                onChange={(e) => setNewPage(e.target.value)}
                className="flex-1 accent-brand-600 cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max={total}
                value={newPage}
                onChange={(e) => setNewPage(e.target.value)}
                className="w-20 px-3 py-1.5 text-sm font-bold text-navy-900 text-center rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            {/* Quick buttons */}
            <div className="flex gap-2 mt-2.5">
              {[10, 25, 50].map((inc) => (
                <button
                  type="button"
                  key={inc}
                  onClick={() => setNewPage(Math.min(total, clampedPage + inc))}
                  className="px-2.5 py-1 text-xs font-medium bg-cream-100 hover:bg-cream-200 text-stone-700 rounded-lg transition"
                >
                  +{inc} pgs
                </button>
              ))}
              <button
                type="button"
                onClick={() => setNewPage(total)}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition ml-auto"
              >
                Mark Finished
              </button>
            </div>
          </div>

          {/* Session Note */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Session Note (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Read chapter 4 on commute; intriguing character reveal..."
              value={sessionNote}
              onChange={(e) => setSessionNote(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white border border-cream-300 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-navy-900 rounded-xl hover:bg-cream-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Progress'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

