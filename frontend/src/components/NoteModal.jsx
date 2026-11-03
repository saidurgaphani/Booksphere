import React, { useState, useEffect } from 'react';
import { X, Highlighter, Quote, FileText } from 'lucide-react';

export default function NoteModal({
  isOpen,
  onClose,
  books = [],
  initialBookId,
  initialData,
  onSaveNote,
}) {
  const [formData, setFormData] = useState({
    book_id: '',
    type: 'note',
    page_number: '',
    content: '',
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        book_id: initialData.book_id || '',
        type: initialData.type || 'note',
        page_number: initialData.page_number !== null ? String(initialData.page_number) : '',
        content: initialData.content || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
      });
    } else {
      setFormData({
        book_id: initialBookId || (books.length > 0 ? books[0].id : ''),
        type: 'quote',
        page_number: '',
        content: '',
        tags: '',
      });
    }
  }, [initialData, initialBookId, books, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;
    setSubmitting(true);
    try {
      const parsedTags = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await onSaveNote({
        book_id: formData.book_id,
        type: formData.type,
        page_number: formData.page_number ? Number(formData.page_number) : null,
        content: formData.content.trim(),
        tags: parsedTags,
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
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-cream-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cream-200/80 flex items-center justify-between bg-cream-50/50">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-navy-900">
              {initialData ? 'Edit Note / Highlight' : 'Save Note or Quote'}
            </h3>
            <p className="text-xs text-stone-500">
              Record meaningful passages or your own analytical reflections
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-navy-900 hover:bg-cream-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Book selector (if not fixed) */}
          {!initialBookId && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Select Book *
              </label>
              <select
                value={formData.book_id}
                onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.author})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Type Selector Pills */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'quote', label: 'Quote', icon: Quote },
                { id: 'note', label: 'Personal Note', icon: FileText },
                { id: 'highlight', label: 'Highlight', icon: Highlighter },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = formData.type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t.id })}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-2xs'
                        : 'bg-white border-cream-200 text-stone-600 hover:border-cream-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Page Number */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Page Reference (optional)
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 142"
              value={formData.page_number}
              onChange={(e) => setFormData({ ...formData, page_number: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-cream-300 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Passage or Note Content *
            </label>
            <textarea
              rows="4"
              required
              placeholder={
                formData.type === 'quote'
                  ? '"Enter the exact quotation from the book..."'
                  : 'Write your thoughts, synthesis, or takeaway here...'
              }
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className={`w-full px-3 py-2 text-sm rounded-xl bg-white border border-cream-300 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                formData.type === 'quote' ? 'font-serif italic text-navy-900' : ''
              }`}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. leadership, mindset, memorable"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-cream-300 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
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
              {submitting ? 'Saving...' : initialData ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

