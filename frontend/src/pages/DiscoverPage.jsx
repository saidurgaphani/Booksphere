import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Plus,
  RefreshCw,
  Lightbulb,
  Check,
  Compass,
  ArrowRight,
  Info,
  Loader2
} from 'lucide-react';
import { getRecommendations } from '../services/api';

const POPULAR_GENRES = [
  'Science Fiction',
  'Self-Help',
  'Productivity',
  'Literary Fiction',
  'Finance',
  'Philosophy',
  'Psychology',
  'History',
  'Fantasy',
];

export default function DiscoverPage({
  books = [],
  onAddBookToLibrary,
  onNavigate,
  settings,
}) {
  const [selectedGenres, setSelectedGenres] = useState(['Science Fiction', 'Self-Help']);
  const [customPrompt, setCustomPrompt] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('curated_fallback');
  const [statusMessage, setStatusMessage] = useState('');
  const [addedTitles, setAddedTitles] = useState(new Set());

  // Auto load recommendations on initial mount
  useEffect(() => {
    fetchRecs();
  }, []);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const fetchRecs = async () => {
    setLoading(true);
    try {
      const res = await getRecommendations({
        favorite_genres: selectedGenres.length > 0 ? selectedGenres : null,
        custom_prompt: customPrompt.trim() || null,
        count: 4,
      });
      setRecommendations(res.recommendations || []);
      setSource(res.source);
      setStatusMessage(res.message || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDirect = async (rec) => {
    try {
      await onAddBookToLibrary({
        title: rec.title,
        author: rec.author,
        genre: rec.genre,
        description: rec.description,
        total_pages: rec.estimated_pages || 320,
        current_page: 0,
        status: 'want_to_read',
        cover_image: '',
      });
      setAddedTitles((prev) => new Set(prev).add(rec.title));
    } catch (err) {
      console.error(err);
    }
  };

  const hasGeminiKey = Boolean(settings?.gemini_api_key);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* AI Intelligence Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Recommendation Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy-900">
              Personalized Reading Suggestions
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Curated based on your library, genre affinities, and custom literary desires.
            </p>
          </div>

          <button
            onClick={fetchRecs}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>Generate New Suggestions</span>
          </button>
        </div>

        {/* Status / Mode Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 ${
            source === 'gemini'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}
        >
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="text-xs space-y-0.5">
            <strong className="block font-semibold">
              {source === 'gemini'
                ? 'Gemini 2.5 Flash Online Mode'
                : 'Curated Fallback Engine Active'}
            </strong>
            <p className="text-stone-600">
              {statusMessage ||
                (source === 'gemini'
                  ? 'Generating real-time dynamic recommendations tailored to your profile.'
                  : 'Running in robust offline fallback mode. Enter your Gemini API key in Settings to unlock real-time generative recommendations.')}
            </p>
            {source !== 'gemini' && !hasGeminiKey && (
              <button
                onClick={() => onNavigate('settings')}
                className="font-semibold text-brand-700 hover:underline pt-1 block"
              >
                Go to Settings to enter Gemini API key →
              </button>
            )}
          </div>
        </div>

        {/* Preference Filters */}
        <div className="space-y-4 pt-2 border-t border-cream-100">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Select Desired Genres
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_GENRES.map((g) => {
                const isSelected = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition ${
                      isSelected
                        ? 'bg-brand-600 border-brand-600 text-white font-medium shadow-2xs'
                        : 'bg-white border-cream-200 text-stone-600 hover:border-cream-300'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Custom Reading Wish (optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 'I want an engrossing sci-fi book with deep exploration of AI ethics and human memory'..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchRecs()}
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white border border-cream-300 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <button
                onClick={fetchRecs}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-cream-100 hover:bg-cream-200 rounded-xl transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-navy-900">
            Suggested Reading Selection ({recommendations.length})
          </h3>
          <span className="text-xs text-stone-500">
            AI-generated recommendations • Distinguishable from library
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-cream-200 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-600" />
            <p className="text-sm font-medium text-stone-600">
              Consulting literary knowledge graph and synthesizing recommendations...
            </p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-cream-200 text-stone-500">
            No recommendations generated. Try selecting a different genre or clearing the prompt.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommendations.map((rec, idx) => {
              const isAlreadyInLibrary =
                books.some((b) => b.title.toLowerCase() === rec.title.toLowerCase()) ||
                addedTitles.has(rec.title);

              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-cream-200/80 shadow-2xs hover:shadow-xs transition flex flex-col justify-between space-y-4 relative overflow-hidden group"
                >
                  {/* Subtle top indicator */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-cream-100 text-stone-600 border border-cream-200">
                          {rec.genre}
                        </span>
                        <span className="text-[11px] font-medium text-stone-400">
                          ~{rec.estimated_pages} pages
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-lg text-navy-900 group-hover:text-brand-600 transition">
                        {rec.title}
                      </h4>
                      <p className="text-xs text-stone-500 font-medium">by {rec.author}</p>
                    </div>

                    <div className="p-2 rounded-xl bg-brand-50 text-brand-600 flex-shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Synopsis */}
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-serif">
                    {rec.description}
                  </p>

                  {/* Why recommended explanation */}
                  <div className="p-3.5 rounded-2xl bg-cream-50/90 border border-cream-200/80 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-brand-600" />
                      Why This Fits You
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {rec.why_recommended}
                    </p>
                  </div>

                  {/* Key themes */}
                  {rec.key_themes && rec.key_themes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {rec.key_themes.map((theme, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600"
                        >
                          #{theme}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action */}
                  <div className="pt-2 border-t border-cream-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-stone-400">
                      Recommendation #{idx + 1}
                    </span>

                    {isAlreadyInLibrary ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        In Your Library
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddDirect(rec)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-2xs transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to My Library</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

