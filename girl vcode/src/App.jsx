import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RecommendationCard from './components/RecommendationCard';
import InterestVault from './components/InterestVault';
import Dashboard from './components/Dashboard';

import { localStore } from './storage/localStore';
import { getContext, applyTheme } from './utils/contextEngine';
import { getRecommendations } from './utils/recommendationEngine';
import { dummyData } from './utils/dummyData';
import { checkOnline, trackCategory, fetchGlobalAnalytics, isOnline } from './utils/api';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('E-commerce');
  const [darkMode, setDarkMode] = useState(false);
  const [online, setOnline] = useState(true);

  // Local storage state
  const [interests, setInterests] = useState([]);
  const [clicks, setClicks] = useState({});
  const [sensitivity, setSensitivity] = useState(50);
  const [localAnalytics, setLocalAnalytics] = useState({});

  // Global analytics from backend
  const [globalAnalytics, setGlobalAnalytics] = useState({});

  // Context
  const [timeOfDay, setTimeOfDay] = useState('Evening');

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    setInterests(localStore.getInterests());
    setClicks(localStore.getClicks());
    setSensitivity(localStore.getSensitivity());
    setLocalAnalytics(localStore.getAnalytics());

    const { timeOfDay: tod } = getContext();
    setTimeOfDay(tod);

    // Dark mode: check local preference then system
    const savedTheme = localStorage.getItem('pwa_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setDarkMode(isDark);
    applyTheme(isDark ? 'dark' : 'light');

    // Backend connectivity
    checkOnline().then((status) => {
      setOnline(status);
      if (status) {
        fetchGlobalAnalytics().then(data => { if (data) setGlobalAnalytics(data); });
      }
    });

    // Refresh time context every minute
    const timer = setInterval(() => {
      const { timeOfDay: newTod } = getContext();
      setTimeOfDay(newTod);
    }, 60_000);

    return () => clearInterval(timer);
  }, []);

  // ── Dark mode toggle ───────────────────────────────────────────────────────
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      applyTheme(next ? 'dark' : 'light');
      localStorage.setItem('pwa_theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  // ── Like / click ──────────────────────────────────────────────────────────
  const handleLike = useCallback((interest, category) => {
    // 1. Update React state for interests, then sync to localStorage
    setInterests(prev => {
      const updatedInterests = !prev.includes(interest)
        ? [interest, ...prev].slice(0, 50)
        : prev;
      localStorage.setItem('pwa_interests', JSON.stringify(updatedInterests));
      return updatedInterests;
    });

    if (category) {
      // 2. Update React state for clicks, then sync to localStorage
      setClicks(prev => {
        const updatedClicks = { ...prev, [category]: (prev[category] || 0) + 1 };
        localStorage.setItem('pwa_clicks', JSON.stringify(updatedClicks));
        return updatedClicks;
      });

      // Update analytics (keeping existing analytics sync)
      const newAnalytics = localStore.recordAnalytics(category);
      setLocalAnalytics(newAnalytics);

      // 3. Backend Integration (explicitly sending fetch)
      fetch("http://localhost:5000/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category })
      }).then(() => {
        setOnline(true);
        fetchGlobalAnalytics().then(data => { if (data) setGlobalAnalytics(data); });
      }).catch(() => {
        setOnline(false);
      });
    }
  }, []);

  // ── Clear ─────────────────────────────────────────────────────────────────
  const handleClearInterests = useCallback(() => {
    localStore.clearInterests();
    setInterests([]);
    setClicks({});
    setLocalAnalytics({});
  }, []);

  // ── Sensitivity ───────────────────────────────────────────────────────────
  const handleSetSensitivity = useCallback((val) => {
    setSensitivity(val);
    localStore.setSensitivity(val);
  }, []);

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = useCallback(() => {
    const blob = new Blob([localStore.exportProfile()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privacy_profile_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // ── Import ────────────────────────────────────────────────────────────────
  const handleImport = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const ok = localStore.importProfile(e.target.result);
      if (ok) {
        setInterests(localStore.getInterests());
        setClicks(localStore.getClicks());
        setSensitivity(localStore.getSensitivity());
        setLocalAnalytics(localStore.getAnalytics());
        alert('✅ Profile imported successfully!');
      } else {
        alert('❌ Failed to import profile. Check the file format.');
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be re-imported
    event.target.value = '';
  }, []);

  // ── Recommendations ───────────────────────────────────────────────────────
  const filteredFeed = useMemo(() => {
    const items = dummyData.filter(item => item.type === activeTab);
    return getRecommendations(items, interests, sensitivity, timeOfDay, clicks);
  }, [activeTab, interests, sensitivity, timeOfDay, clicks]);

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex-1 flex flex-col relative min-w-0">
          <Header
            setIsOpen={setSidebarOpen}
            timeOfDay={timeOfDay}
            sensitivity={sensitivity}
            setSensitivity={handleSetSensitivity}
            handleExport={handleExport}
            handleImport={handleImport}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            online={online}
          />

          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-7xl mx-auto pb-24">

              {activeTab !== 'Dashboard' && (
                <InterestVault
                  interests={interests}
                  clicks={clicks}
                  onClear={handleClearInterests}
                />
              )}

              {activeTab === 'Dashboard' ? (
                <Dashboard
                  localAnalytics={localAnalytics}
                  globalAnalytics={globalAnalytics}
                  online={online}
                />
              ) : (
                <section>
                  <div className="flex items-center justify-between mb-6 px-1">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                        {activeTab} Feed
                      </h2>
                      <h3 className="text-sm font-medium text-slate-500 mt-1">
                        Personalized for you
                      </h3>
                    </div>
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                      {filteredFeed.length} recommended
                    </span>
                  </div>

                  {interests.length === 0 && (
                    <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md text-sm font-medium border border-blue-100 dark:border-blue-800/30">
                      Interact with items to personalize your feed
                    </div>
                  )}

                  {filteredFeed.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredFeed.map((item, index) => (
                        <RecommendationCard
                          key={item.id}
                          item={item}
                          onLike={handleLike}
                          isTopPick={index === 0}
                          isPersonalized={interests.some(i => i.toLowerCase() === item.category.toLowerCase())}
                          debugMode={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24 text-gray-400 dark:text-gray-500">
                      <div className="text-5xl mb-4">🔍</div>
                      <p className="text-xl mb-2 font-medium">No matches found</p>
                      <p className="text-sm">Lower your sensitivity or interact with more content.</p>
                    </div>
                  )}
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
