import { useState, useEffect } from 'react';
import { TabType } from './types';
import Dashboard from './components/Dashboard';
import Passengers from './components/Passengers';
import Voyages from './components/Voyages';
import PortCalls from './components/PortCalls';
import Fuel from './components/Fuel';
import DailyReport from './components/DailyReport';
import Settings from './components/Settings';

const NAV_ITEMS: { key: TabType; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Панель', icon: '⚓' },
  { key: 'passengers', label: 'Пассажиры', icon: '👥' },
  { key: 'voyages', label: 'Рейсы', icon: '🚢' },
  { key: 'portcalls', label: 'Заходы', icon: '🏗️' },
  { key: 'fuel', label: 'Топливо', icon: '⛽' },
  { key: 'daily', label: 'Суточный', icon: '📋' },
  { key: 'settings', label: 'Настройки', icon: '⚙️' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(k => k + 1);

  useEffect(() => {
    document.title = 'Судовой журнал - Voyage Passenger Log';
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard key={refreshKey} />;
      case 'passengers':
        return <Passengers key={refreshKey} onChange={refresh} />;
      case 'voyages':
        return <Voyages key={refreshKey} onChange={refresh} />;
      case 'portcalls':
        return <PortCalls key={refreshKey} onChange={refresh} />;
      case 'fuel':
        return <Fuel key={refreshKey} onChange={refresh} />;
      case 'daily':
        return <DailyReport key={refreshKey} onChange={refresh} />;
      case 'settings':
        return <Settings key={refreshKey} onChange={refresh} />;
      default:
        return <Dashboard key={refreshKey} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-blue-800/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
              ⚓
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Судовой журнал
              </h1>
              <p className="text-xs text-slate-400">Voyage Passenger Log</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <nav className="md:w-56 md:min-h-[calc(100vh-64px)] bg-slate-900/50 md:border-r border-blue-800/20 p-2 md:sticky md:top-16 md:self-start">
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === item.key
                    ? 'bg-blue-600/30 text-blue-200 shadow-lg shadow-blue-500/10 border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 min-h-[calc(100vh-64px)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
