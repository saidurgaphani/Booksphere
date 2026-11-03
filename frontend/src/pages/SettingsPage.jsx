import React, { useState, useEffect } from 'react';
import {
  Settings,
  Key,
  Download,
  FileSpreadsheet,
  FileText,
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Database,
  ExternalLink
} from 'lucide-react';
import { saveSettings, exportReportUrl } from '../services/api';

export default function SettingsPage({ settings, onSettingsUpdated, onShowToast }) {
  const [apiKey, setApiKey] = useState('');
  const [dailyGoal, setDailyGoal] = useState(30);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setApiKey(settings.gemini_api_key || '');
      setDailyGoal(settings.daily_reading_goal_pages || 30);
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await saveSettings({
        gemini_api_key: apiKey.trim(),
        daily_reading_goal_pages: Number(dailyGoal) || 30,
      });
      onSettingsUpdated(updated);
      onShowToast({
        type: 'success',
        message: 'Settings and Gemini configuration saved successfully!',
      });
    } catch (err) {
      console.error(err);
      onShowToast({
        type: 'error',
        message: 'Failed to save settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = (format) => {
    const url = exportReportUrl(format);
    window.open(url, '_blank');
    onShowToast({
      type: 'info',
      message: `Downloading reading report in ${format.toUpperCase()} format...`,
    });
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      {/* 1. AI Configuration */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200/80 shadow-2xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-navy-900">
              Gemini AI Integration
            </h3>
            <p className="text-xs text-stone-500">
              Configure your Google Gemini API key to unlock dynamic recommendations and insights
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-mono rounded-xl bg-white border border-cream-300 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
              <span>Your key is stored safely in local backend settings.json.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 hover:underline inline-flex items-center gap-0.5 ml-1"
              >
                Get a free key from Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200/80 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-stone-600 space-y-1">
              <span className="font-semibold text-navy-900 block">
                {apiKey ? 'API Key Configured' : 'No API Key? Fallback Mode is Active!'}
              </span>
              <p>
                Even without an API key, BookSphere provides smart, genre-aligned curated recommendations and reading synthesis, so your application is always functional for demonstrations.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-2xs transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save AI Configuration'}
            </button>
          </div>
        </form>
      </section>

      {/* 2. Reading Goals */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200/80 shadow-2xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-navy-900">
              Reading Goals
            </h3>
            <p className="text-xs text-stone-500">
              Daily habits and target reading pacing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Daily Target (Pages / Day)
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-white border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-xs font-semibold text-stone-700 bg-cream-100 hover:bg-cream-200 rounded-xl transition disabled:opacity-50"
          >
            Update Reading Goal
          </button>
        </div>
      </section>

      {/* 3. Export Reports */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200/80 shadow-2xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-navy-900">
              Reading Reports & Exports
            </h3>
            <p className="text-xs text-stone-500">
              Download your reading history, statistics, and book catalogue
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-cream-200 bg-cream-50/50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 mb-1">
                <FileSpreadsheet className="w-4 h-4" />
                <h4 className="font-semibold text-sm text-navy-900">
                  CSV Spreadsheet Report
                </h4>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Complete structured tables of books, reading status, completion percentages, and reading session logs.
              </p>
            </div>
            <button
              onClick={() => handleExport('csv')}
              className="w-full py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-2xs flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export as CSV</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-cream-200 bg-cream-50/50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 mb-1">
                <FileText className="w-4 h-4" />
                <h4 className="font-semibold text-sm text-navy-900">
                  Formatted Text Report (.txt)
                </h4>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                A clean ASCII reading log and executive summary formatted for easy printing, sharing, or college project submission.
              </p>
            </div>
            <button
              onClick={() => handleExport('txt')}
              className="w-full py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition shadow-2xs flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export as TXT</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Project Information */}
      <section className="p-6 rounded-3xl bg-cream-100/60 border border-cream-200/80 text-xs text-stone-600 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-navy-900 text-sm">
          <Database className="w-4 h-4 text-brand-600" />
          <span>About BookSphere Project Architecture</span>
        </div>
        <p>
          BookSphere is an AI-driven personal reading companion built with Python FastAPI, persistent JSON storage, React 18, Vite, and Tailwind CSS.
        </p>
        <p className="text-stone-400">
          Backend: FastAPI • Storage: Atomic JSON Files • AI: Gemini 2.5 Flash with fallback • Frontend: React + Tailwind CSS
        </p>
      </section>
    </div>
  );
}

