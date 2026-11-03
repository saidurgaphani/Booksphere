import React from 'react';
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Sparkles,
  TrendingUp,
  Highlighter,
  BarChart3,
  Settings,
  X,
  ExternalLink
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'library', label: 'My Library', icon: Library },
  { id: 'discover', label: 'Discover Books', icon: Sparkles, badge: 'AI' },
  { id: 'progress', label: 'Reading Progress', icon: TrendingUp },
  { id: 'notes', label: 'Notes & Highlights', icon: Highlighter },
  { id: 'insights', label: 'Reading Insights', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen, settings }) {
  const hasGeminiKey = Boolean(settings?.gemini_api_key);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-cream-50/95 lg:bg-cream-50 border-r border-cream-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-cream-200/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-navy-900 tracking-tight leading-none">
                BookSphere
              </h1>
              <span className="text-[11px] font-medium text-stone-500 tracking-wide uppercase">
                AI Reading Companion
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-cream-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                    : 'text-stone-600 hover:text-navy-900 hover:bg-cream-100/90'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-white' : 'text-stone-400 group-hover:text-stone-700'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-brand-100 text-brand-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* AI Status / Quick Info Badge */}
        <div className="p-4 m-3 rounded-2xl bg-cream-100/80 border border-cream-200/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              AI Intelligence
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                hasGeminiKey ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
          </div>
          <p className="text-[12px] text-stone-500 leading-relaxed">
            {hasGeminiKey
              ? 'Gemini 2.5 Flash active for smart recommendations.'
              : 'Curated Fallback active. Add key in Settings for live Gemini.'}
          </p>
          {!hasGeminiKey && (
            <button
              onClick={() => {
                setActiveTab('settings');
                setMobileOpen(false);
              }}
              className="mt-2 text-[11px] font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1 transition"
            >
              Configure Gemini <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* User Mini Profile / College Project Footer */}
        <div className="px-5 py-3 border-t border-cream-200/60 flex items-center justify-between text-xs text-stone-500">
          <span>BookSphere v1.0</span>
          <span className="font-medium text-stone-400">PBL Mini-Project</span>
        </div>
      </aside>
    </>
  );
}

