import React from 'react';
import { Menu, Plus, BookmarkCheck, Download, Search } from 'lucide-react';
import { exportReportUrl } from '../services/api';

const TITLES = {
  dashboard: { title: 'Dashboard', subtitle: 'Welcome back to your reading sanctuary' },
  library: { title: 'My Library', subtitle: 'Manage, search, and organize your collection' },
  discover: { title: 'Discover Books', subtitle: 'AI-tailored reading recommendations and curation' },
  progress: { title: 'Reading Progress', subtitle: 'Track your daily pages, pace, and reading history' },
  notes: { title: 'Notes & Highlights', subtitle: 'Capture memorable quotes, thoughts, and reflections' },
  insights: { title: 'Reading Insights', subtitle: 'In-depth analytics on your reading velocity and habits' },
  settings: { title: 'Settings', subtitle: 'Configure AI keys, reading goals, and app preferences' },
};

export default function Header({
  activeTab,
  setMobileOpen,
  onOpenAddBook,
  onOpenLogProgress,
  searchQuery,
  setSearchQuery,
  onExportReport
}) {
  const current = TITLES[activeTab] || TITLES.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-cream-50/80 backdrop-blur-md border-b border-cream-200/60 px-4 sm:px-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Mobile hamburger & title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-navy-900 hover:bg-cream-100 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 tracking-tight">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Quick Search (when on library or dashboard) */}
          {(activeTab === 'library' || activeTab === 'dashboard') && (
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search titles, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl bg-white border border-cream-300/80 placeholder-stone-400 text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition shadow-2xs"
              />
            </div>
          )}

          {/* Log Progress Button */}
          <button
            onClick={onOpenLogProgress}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-stone-700 bg-white hover:bg-cream-100 border border-cream-300/80 shadow-2xs hover:border-cream-300 transition"
            title="Log reading session"
          >
            <BookmarkCheck className="w-4 h-4 text-brand-600" />
            <span className="hidden sm:inline">Log Progress</span>
          </button>

          {/* Export Report Action */}
          <button
            onClick={onExportReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-stone-700 bg-white hover:bg-cream-100 border border-cream-300/80 shadow-2xs hover:border-cream-300 transition"
            title="Export reading report (CSV/TXT)"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Add Book Button */}
          <button
            onClick={onOpenAddBook}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-600/20 transition active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book</span>
          </button>
        </div>
      </div>
    </header>
  );
}

