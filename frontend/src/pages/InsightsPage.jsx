import React from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Calendar,
  Flame,
  Award,
  Clock,
  Sparkles
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function InsightsPage({ insightsData }) {
  if (!insightsData) {
    return (
      <div className="p-8 text-center text-stone-400">
        Loading reading insights and analytics...
      </div>
    );
  }

  const {
    total_books_completed,
    total_pages_read,
    average_pages_per_session,
    reading_streak_days,
    favorite_genres = [],
    monthly_summary = [],
    reading_pace_status,
  } = insightsData;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 4 Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Books Completed"
          value={total_books_completed}
          subtitle="Finished titles"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pages Read"
          value={total_pages_read.toLocaleString()}
          subtitle="Total pages turned"
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Avg Session"
          value={`${average_pages_per_session} pgs`}
          subtitle="Pages read per sitting"
          icon={TrendingUp}
          color="sky"
        />
        <StatCard
          title="Reading Streak"
          value={`${reading_streak_days} Days`}
          subtitle={`Status: ${reading_pace_status}`}
          icon={Flame}
          color="amber"
        />
      </div>

      {/* Two columns: Favorite Genres & Monthly Reading Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Favorite Genres Analysis */}
        <section className="bg-white rounded-3xl p-6 border border-cream-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-navy-900">
                Genre Distribution
              </h3>
              <p className="text-xs text-stone-500">
                Your literary diet and genre preferences
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
              <Award className="w-5 h-5" />
            </div>
          </div>

          {favorite_genres.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-8">
              No genre data available yet.
            </p>
          ) : (
            <div className="space-y-4">
              {favorite_genres.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-navy-900">{item.genre}</span>
                    <span className="text-stone-500">
                      {item.count} book{item.count === 1 ? '' : 's'} • {item.pages_read} pgs ({item.percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-cream-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Monthly Reading Velocity */}
        <section className="bg-white rounded-3xl p-6 border border-cream-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-navy-900">
                Monthly Reading Summary
              </h3>
              <p className="text-xs text-stone-500">
                Reading throughput over calendar months
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          {monthly_summary.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-8">
              No monthly activity logged yet.
            </p>
          ) : (
            <div className="space-y-3">
              {monthly_summary.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200/80 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-serif font-bold text-sm text-navy-900">
                      {m.month}
                    </h4>
                    <span className="text-xs text-stone-500">
                      {m.books_completed} book{m.books_completed === 1 ? '' : 's'} completed
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-brand-600 block">
                      +{m.pages_read} pages
                    </span>
                    <span className="text-[11px] text-stone-400">Total read</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Reading Milestones / Habit Reflection Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cream-100 via-cream-50 to-brand-50 border border-cream-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-600 text-white rounded-2xl shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-navy-900">
              Reader Pace: {reading_pace_status}
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              Consistent daily micro-sessions compound faster than sporadic marathon reading. 
              Aim for at least 20 pages every day to build a lifelong reading habit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

