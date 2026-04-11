import React from 'react';
import { Database, Trash2, ShieldCheck, Lock, TrendingUp, Terminal } from 'lucide-react';

const InterestVault = ({ interests, clicks, onClear }) => {
  const topClicks = Object.entries(clicks)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const maxCount = topClicks.length > 0 ? topClicks[0][1] : 1;

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-lg shadow-sm border border-slate-200 dark:border-slate-800/60 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-[#0f172a]">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <Database className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-sm">Local Storage Inspector</span>
          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            {interests.length} Entities
          </span>
        </div>
        <button
          id="clear-vault-btn"
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 border border-slate-200 dark:border-slate-700
            px-3 py-1.5 rounded-md transition-all duration-200 shadow-sm"
        >
          <Trash2 className="w-3.5 h-3.5" /> Purge Cache
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Privacy notice */}
        <div className="md:col-span-2 flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-md
          border border-slate-200 dark:border-slate-700/50 text-xs text-slate-600 dark:text-slate-300 shadow-inner">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong className="text-slate-800 dark:text-slate-100 font-semibold uppercase tracking-wider text-[10px]">On-Device Execution — </strong>{' '}
            Algorithm parameters and semantic tags are sandboxed in the browser `<code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-[10px]">localStorage</code>`.
            Telemetry limits outbound transmission to stateless category aggregations. No PII is maintained.
          </span>
        </div>

        {/* Interests */}
        <div className="border border-slate-200 dark:border-slate-800/60 rounded-md p-4">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Lock className="w-3.5 h-3.5" /> Semantic Profile
          </p>
          {interests.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 font-mono">
              [EMPTY_PROFILE]
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded text-[10px] font-semibold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Click counts */}
        <div className="border border-slate-200 dark:border-slate-800/60 rounded-md p-4">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <TrendingUp className="w-3.5 h-3.5" /> Engagement Telemetry
          </p>
          {topClicks.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 font-mono">
              [NO_TELEMETRY]
            </p>
          ) : (
            <ul className="space-y-3">
              {topClicks.map(([cat, count]) => (
                <li key={cat} className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-24 truncate">
                    {cat}
                  </span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-6 text-right font-mono">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Raw JSON Debug */}
        <div className="md:col-span-2">
           <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
            <Terminal className="w-3.5 h-3.5" /> Raw Data Dump (Head)
          </p>
          <pre className="text-[11px] bg-[#1e293b] text-[#818cf8] p-4 rounded-md overflow-x-auto leading-relaxed border border-slate-800 font-mono shadow-inner">
{JSON.stringify({
  interests: interests.slice(0, 5).concat(interests.length > 5 ? ['...'] : []),
  clicks: Object.fromEntries(topClicks.slice(0, 3)),
}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default InterestVault;
