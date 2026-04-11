import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  Activity, Trophy, MousePointerClick, Globe2,
  MonitorSmartphone, RefreshCw, WifiOff,
} from 'lucide-react';

const PALETTE = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#475569', '#64748b', '#94a3b8'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#0f172a] shadow-md rounded-md px-3 py-2 border border-slate-200 dark:border-slate-800 text-xs font-mono">
        <p className="font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">{payload[0].payload.name}</p>
        <p className="text-blue-600 dark:text-blue-400 mt-1">{payload[0].value} EVENTS</p>
      </div>
    );
  }
  return null;
};

const Dashboard = ({ localAnalytics, globalAnalytics, online }) => {
  const [tab, setTab] = useState('local');

  const localData = useMemo(() =>
    Object.entries(localAnalytics)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    [localAnalytics]
  );

  const globalData = useMemo(() =>
    Object.entries(globalAnalytics)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    [globalAnalytics]
  );

  const chartData  = tab === 'local' ? localData   : globalData;

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-end mb-6 pb-4 border-b border-slate-200 dark:border-slate-800/60">
        <div>
           <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Telemetry Metrics
          </h2>
          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest mt-1">
            Data visualization & behavioral tracking
          </p>
        </div>
        {!online && (
           <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 px-2 py-1 rounded border border-rose-200 dark:border-rose-900/50">
            <WifiOff className="w-3.5 h-3.5" /> API Disconnected
          </span>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Primary Vector', value: localData[0]?.name || '—', icon: Trophy },
          { label: 'Local Volume', value: localData.reduce((s,d) => s+d.count, 0), icon: MousePointerClick },
          { label: 'Global Trend', value: globalData[0]?.name || (online ? '—' : 'Offline'), icon: Globe2 },
          { label: 'Global Volume',    value: globalData.reduce((s,d) => s+d.count, 0), icon: RefreshCw },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800/60 p-4 flex items-center justify-between shadow-sm"
          >
             <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-1">{label}</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate uppercase tracking-tight">{value}</p>
            </div>
            <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 flex-shrink-0">
              <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Data Visualization */}
      <div className="bg-white dark:bg-[#0f172a] rounded-lg shadow-sm border border-slate-200 dark:border-slate-800/60 p-5">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
           <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            Distribution Analysis
          </h3>
          <div className="flex bg-slate-100 dark:bg-slate-800/80 rounded-md p-1">
            <button
              onClick={() => setTab('local')}
              className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all
                ${tab === 'local'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              Local Set
            </button>
            <button
              onClick={() => setTab('global')}
              disabled={!online}
              className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1
                ${tab === 'global'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}
                ${!online ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Global Set {!online && <WifiOff className="w-3 h-3 ml-1" />}
            </button>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center font-mono">
            <Activity className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-3" />
            <p className="text-xs text-slate-400 dark:text-slate-600 uppercase tracking-widest">
              {tab === 'local' ? '[AWAITING_EVENTS]' : (online ? '[NO_REMOTE_DATA]' : '[API_DISCONNECTED]')}
            </p>
          </div>
        ) : (
          <div className="h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 10, textTransform: 'uppercase' }}
                  axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                  tickLine={false}
                  interval={0}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickCount={5}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
                <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={40}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} className="opacity-90 hover:opacity-100 transition-opacity" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
