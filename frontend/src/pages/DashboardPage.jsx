import React from 'react';
import {
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Flame,
  Plus
} from 'lucide-react';
import StatCard from '../components/StatCard';
import BookCard from '../components/BookCard';

export default function DashboardPage({
  dashboardData,
  onNavigate,
  onSelectBook,
  onQuickProgress,
  onOpenAddBook,
  onEditBook,
  onDeleteBook,
  insightsData,
}) {
  if (!dashboardData) {
    return (
      <div className="p-8 text-center text-stone-400">
        Loading reading companion dashboard...
      </div>
    );
  }

  const {
    total_books,
    currently_reading,
    completed_books,
    planned_books,
    total_pages_read,
    total_library_pages,
    overall_progress_percentage,
    recently_added_books = [],
    currently_reading_books = [],
    recent_activity = [],
  } = dashboardData;

  const streakDays = insightsData?.reading_streak_days ?? 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-indigo-950 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{streakDays} Day Reading Streak</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight">
            Cultivate your intellectual life, page by page.
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
            You've completed <strong className="text-white">{completed_books} books</strong> and read{' '}
            <strong className="text-white">{total_pages_read.toLocaleString()} pages</strong> across your personal library.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('discover')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get AI Book Suggestions</span>
            </button>
            <button
              onClick={() => onNavigate('library')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
            >
              <span>Explore My Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
          <BookOpen className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Books"
          value={total_books}
          subtitle={`${planned_books} on wish list`}
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Currently Reading"
          value={currently_reading}
          subtitle="Active books in progress"
          icon={BookmarkCheck}
          color="sky"
        />
        <StatCard
          title="Completed Books"
          value={completed_books}
          subtitle="Fully finished titles"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Total Progress"
          value={`${overall_progress_percentage}%`}
          subtitle={`${total_pages_read} of ${total_library_pages} pages`}
          icon={TrendingUp}
          color="amber"
          progress={overall_progress_percentage}
        />
      </div>

      {/* Currently Reading Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-navy-900">
              Currently Reading
            </h2>
            <p className="text-xs text-stone-500">Pick up right where you left off</p>
          </div>
          <button
            onClick={() => onNavigate('progress')}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition"
          >
            Track All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {currently_reading_books.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-cream-200 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-sm font-medium text-stone-600">
              No books currently in progress.
            </p>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs font-semibold px-4 py-2 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-xl transition"
            >
              Start Reading a Book from Library
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currently_reading_books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelectBook={onSelectBook}
                onQuickProgress={onQuickProgress}
                onEditBook={onEditBook}
                onDeleteBook={onDeleteBook}
              />
            ))}
          </div>
        )}
      </section>

      {/* Grid: Recently Added & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left (2 cols): Recently Added Books */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-navy-900">
                Recently Added to Library
              </h2>
              <p className="text-xs text-stone-500">Latest titles in your collection</p>
            </div>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition"
            >
              View Full Library <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recently_added_books.map((book) => (
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
        </section>

        {/* Right (1 col): Recent Reading Activity Timeline */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-navy-900">
                Recent Activity
              </h2>
              <p className="text-xs text-stone-500">Live progress log</p>
            </div>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>

          <div className="bg-white rounded-3xl p-5 border border-cream-200/80 shadow-2xs space-y-4">
            {recent_activity.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-6">
                No activity logged yet. Use 'Log Progress' to start tracking.
              </p>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cream-200">
                {recent_activity.map((act) => (
                  <div key={act.id} className="relative space-y-1">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-600 border-2 border-white ring-2 ring-brand-100" />
                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span>{act.timestamp ? act.timestamp.slice(0, 10) : ''}</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        +{act.pages_read} pgs
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-navy-900">
                      {act.book_title}
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-tight">
                      {act.note || `Progressed to page ${act.new_page}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

