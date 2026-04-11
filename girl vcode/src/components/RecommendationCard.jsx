import React, { useState } from 'react';
import { Bookmark, Info, Fingerprint } from 'lucide-react';

const RecommendationCard = ({ item, onLike, isTopPick, isPersonalized, debugMode = true }) => {
  const [liked, setLiked] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [pulse, setPulse] = useState(false);

  const handleClick = () => {
    if (!liked) {
      setLiked(true);
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }
    onLike(item.category, item.category);
    if (item.tags.length > 0) onLike(item.tags[0], null);
  };

  const scorePercent = Math.min(100, Math.round((item.score || 0) * 6));

  return (
    <article
      className="group bg-white dark:bg-[#0f172a] rounded-lg shadow-sm hover:shadow-md
        transition-all duration-300 ease flex flex-col border border-slate-200 dark:border-slate-800/60 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Subtle Match Bar */}
        {item.score > 0 && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/10">
            <div
              className="h-full bg-blue-500 transition-all duration-700"
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        )}

        {/* Top Pick Badge */}
        {isTopPick && (
          <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase rounded shadow-md">
            🔥 Top Pick
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setShowReason(r => !r)}
            className="p-1.5 bg-white/95 dark:bg-slate-900/95 shadow-sm rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 transition-colors"
            title="Algorithm transparency"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 rounded shadow-sm text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            {item.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1 line-clamp-1">
          {item.title}
        </h3>

        {/* Personalized Tag */}
        {isPersonalized && (
          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-500 mb-1.5">
            ✨ Recommended for you
          </span>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Debug Mode Score */}
        {debugMode && (
          <div className="text-[10px] font-mono text-slate-400 mb-3 bg-slate-100 dark:bg-slate-800/50 p-1 rounded inline-block w-fit">
            Score: {item.score}
          </div>
        )}

        {/* Transparency Panel */}
        {showReason && (
          <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-100 dark:border-slate-700/50 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in shadow-inner">
            <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1 uppercase tracking-wider text-[9px] flex items-center gap-1.5">
              <Fingerprint className="w-3 h-3 text-blue-500" /> Profiling Insight
            </span>
            {item.reasonString}
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {item.tags[0]}
            {item.tags[1] && <span className="hidden sm:inline">• {item.tags[1]}</span>}
          </div>
          <button
            onClick={handleClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border
              ${liked
                ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400'
                : 'border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700/80'}
            `}
          >
            <Bookmark className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            {liked ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default RecommendationCard;
