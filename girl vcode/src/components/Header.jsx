import React from 'react';
import {
  Menu, Sun, Moon, Download, Upload,
  SlidersHorizontal, Wifi, WifiOff,
} from 'lucide-react';

const sensitivityLabel = (v) => v < 34 ? 'Low' : v < 67 ? 'Medium' : 'High';

const Header = ({
  setIsOpen, timeOfDay, sensitivity, setSensitivity,
  handleExport, handleImport, darkMode, toggleDarkMode, online,
}) => {
  const timeIcon = ['Morning', 'Afternoon'].includes(timeOfDay)
    ? <Sun className="w-3.5 h-3.5 text-amber-500" />
    : <Moon className="w-3.5 h-3.5 text-blue-500" />;

  return (
    <header className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20">

      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          id="sidebar-toggle"
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-1.5 -ml-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">
            System Context
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            {timeIcon} {timeOfDay} Phase
          </span>
        </div>

        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 ml-4">
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium tracking-wide uppercase
            ${online
              ? 'text-slate-500 dark:text-slate-400'
              : 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20'}`}
          >
            {online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {online ? 'API Linked' : 'Local Only'}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Sensitivity */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Sensitivity</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{sensitivityLabel(sensitivity)}</span>
          </div>
          <input
            id="sensitivity-slider"
            type="range"
            min="0"
            max="100"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseInt(e.target.value))}
            className="w-24 md:w-32 h-1 rounded-full cursor-pointer accent-blue-600 bg-slate-200 dark:bg-slate-700"
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-6">
          <button
            id="dark-mode-toggle"
            onClick={toggleDarkMode}
            className="p-2 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="hidden sm:flex items-center gap-1 ml-1">
            <button
              id="export-btn"
              onClick={handleExport}
              className="p-2 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Export profile mapping"
            >
              <Download className="w-4 h-4" />
            </button>
            <label
              className="p-2 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Import profile mapping"
            >
              <Upload className="w-4 h-4" />
              <input id="import-input" type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
