import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'indigo', progress }) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      bar: 'bg-indigo-600',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      bar: 'bg-amber-500',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      bar: 'bg-emerald-500',
    },
    sky: {
      bg: 'bg-sky-50',
      text: 'text-sky-600',
      bar: 'bg-sky-500',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      bar: 'bg-purple-500',
    },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-2xl p-5 border border-cream-200/80 shadow-2xs hover:shadow-xs transition flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-stone-500 tracking-wide uppercase">
            {title}
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 mt-1">
            {value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl ${c.bg} ${c.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        {progress !== undefined && (
          <div className="w-full bg-cream-100 rounded-full h-1.5 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${c.bar}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-stone-500 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

