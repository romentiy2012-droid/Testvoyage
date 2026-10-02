import { useState, useRef } from 'react';
import { ShipInfo } from '../types';
import { getShipInfo, saveShipInfo, exportAllData, importAllData, clearAllData } from '../store';

interface Props {
  onChange: () => void;
}

export default function Settings({ onChange }: Props) {
  const [shipInfo, setShipInfo] = useState<ShipInfo>(getShipInfo());
  const [saved, setSaved] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveShip = (e: React.FormEvent) => {
    e.preventDefault();
    saveShipInfo(shipInfo);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onChange();
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voyage-log-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllData(content);
      setImportStatus(success ? 'success' : 'error');
      setTimeout(() => setImportStatus('idle'), 3000);
      if (success) onChange();
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => {
    if (confirm('Вы уверены? Все данные будут удалены безвозвратно!')) {
      if (confirm('Это действие нельзя отменить. Продолжить?')) {
        clearAllData();
        setShipInfo({
          name: '', imo: '', callSign: '', flag: '', type: '',
          length: 0, beam: 0, draft: 0, grossTonnage: 0,
          passengerCapacity: 0, crewCapacity: 0, enginePower: 0, yearBuilt: 0,
        });
        onChange();
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span>⚙️</span> Настройки
      </h2>

      {/* Ship Info */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🚢</span> Информация о судне
        </h3>
        <form onSubmit={handleSaveShip} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Название судна</label>
              <input value={shipInfo.name} onChange={e => setShipInfo({...shipInfo, name: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">IMO номер</label>
              <input value={shipInfo.imo} onChange={e => setShipInfo({...shipInfo, imo: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Позывной</label>
              <input value={shipInfo.callSign} onChange={e => setShipInfo({...shipInfo, callSign: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Флаг</label>
              <input value={shipInfo.flag} onChange={e => setShipInfo({...shipInfo, flag: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Тип судна</label>
              <input value={shipInfo.type} onChange={e => setShipInfo({...shipInfo, type: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Год постройки</label>
              <input type="number" value={shipInfo.yearBuilt} onChange={e => setShipInfo({...shipInfo, yearBuilt: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Длина (м)</label>
              <input type="number" step="0.1" value={shipInfo.length} onChange={e => setShipInfo({...shipInfo, length: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Ширина (м)</label>
              <input type="number" step="0.1" value={shipInfo.beam} onChange={e => setShipInfo({...shipInfo, beam: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Осадка (м)</label>
              <input type="number" step="0.1" value={shipInfo.draft} onChange={e => setShipInfo({...shipInfo, draft: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Валовая вместимость (GT)</label>
              <input type="number" value={shipInfo.grossTonnage} onChange={e => setShipInfo({...shipInfo, grossTonnage: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Вместимость пассажиров</label>
              <input type="number" value={shipInfo.passengerCapacity} onChange={e => setShipInfo({...shipInfo, passengerCapacity: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Вместимость экипажа</label>
              <input type="number" value={shipInfo.crewCapacity} onChange={e => setShipInfo({...shipInfo, crewCapacity: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Мощность двигателя (л.с.)</label>
              <input type="number" value={shipInfo.enginePower} onChange={e => setShipInfo({...shipInfo, enginePower: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all">
              💾 Сохранить
            </button>
            {saved && <span className="text-emerald-400 text-sm">✓ Сохранено!</span>}
          </div>
        </form>
      </div>

      {/* Data Management */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>💾</span> Управление данными
        </h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-all">
            📤 Экспорт (JSON)
          </button>
          <label className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-all cursor-pointer">
            📥 Импорт (JSON)
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button onClick={handleClear}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-all">
            🗑️ Очистить всё
          </button>
        </div>
        {importStatus === 'success' && <p className="text-emerald-400 text-sm mt-3">✓ Данные успешно импортированы!</p>}
        {importStatus === 'error' && <p className="text-red-400 text-sm mt-3">✕ Ошибка при импорте данных.</p>}
      </div>

      {/* About */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>ℹ️</span> О приложении
        </h3>
        <div className="text-sm text-slate-400 space-y-2">
          <p><strong className="text-white">Судовой журнал</strong> — Progressive Web App для учёта пассажиров, рейсов, заходов в порты, топлива и суточных донесений.</p>
          <p>Версия: 5.4.1</p>
          <p>Все данные хранятся локально в вашем браузере (localStorage).</p>
          <p>Для работы офлайн используйте функцию «Установить» в браузере.</p>
        </div>
      </div>
    </div>
  );
}
