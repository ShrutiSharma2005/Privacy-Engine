import React from 'react';
import { Home, ShoppingBag, Film, HeartPulse, BarChart3, Shield, X, LayoutTemplate } from 'lucide-react';

const tabs = [
  { id: 'E-commerce', label: 'E-commerce',  icon: ShoppingBag },
  { id: 'Media',      label: 'Media',        icon: Film        },
  { id: 'Healthcare', label: 'Healthcare',   icon: HeartPulse  },
  { id: 'Dashboard',  label: 'Analytics',    icon: BarChart3   },
];

const Sidebar = ({ isOpen, setIsOpen, activeTab, setActiveTab }) => (
  <>
    {/* Mobile overlay */}
    <div
      className={`fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={() => setIsOpen(false)}
    />

    {/* Panel */}
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#f8fafc] dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800
        flex flex-col transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#0f172a]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-600 text-white shadow-sm">
            <LayoutTemplate className="w-4 h-4" />
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Nexus
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Platform</p>
          </div>
        </div>
        <button
          className="lg:hidden p-1.5 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <p className="px-2 mb-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Main Menu
        </p>
        <ul className="space-y-1.5">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <li key={id}>
                <button
                  id={`tab-${id.toLowerCase()}`}
                  onClick={() => { setActiveTab(id); setIsOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200
                    ${active
                      ? 'bg-white dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700/50 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 font-normal border border-transparent'}`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Privacy badge - subtle */}
      <div className="mx-4 my-6 px-4 py-3.5 bg-white dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Privacy Mode Active</p>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Local personalization engine. Zero PII transmitted.
        </p>
      </div>
    </aside>
  </>
);

export default Sidebar;
