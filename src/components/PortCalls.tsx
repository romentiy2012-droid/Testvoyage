import { useState } from 'react';
import { PortCall } from '../types';
import { getPortCalls, savePortCall, deletePortCall, getVoyages } from '../store';

interface Props {
  onChange: () => void;
}

const EMPTY_FORM = {
  voyageId: '',
  portName: '',
  country: '',
  arrivalDate: '',
  arrivalTime: '',
  departureDate: '',
  departureTime: '',
  berthNumber: '',
  passengersOnboard: 0,
  passengersDisembarked: 0,
  passengersEmbarked: 0,
  cargoOperations: '',
  notes: '',
};

export default function PortCalls({ onChange }: Props) {
  const [portCalls, setPortCalls] = useState<PortCall[]>(getPortCalls());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const voyages = getVoyages();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePortCall(form);
    setPortCalls(getPortCalls());
    setForm(EMPTY_FORM);
    setShowForm(false);
    onChange();
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить запись о заходе?')) {
      deletePortCall(id);
      setPortCalls(getPortCalls());
      onChange();
    }
  };

  const getVoyageName = (id: string) => {
    const v = voyages.find(v => v.id === id);
    return v ? v.name : '—';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🏗️</span> Заходы в порты
          <span className="text-sm font-normal text-slate-400">({portCalls.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          {showForm ? '✕ Отмена' : '+ Добавить заход'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 space-y-4">
          <h3 className="text-lg font-semibold text-white">Заход в порт</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Рейс</label>
              <select value={form.voyageId} onChange={e => setForm({...form, voyageId: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50">
                <option value="">Не привязан</option>
                {voyages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Порт *</label>
              <input required value={form.portName} onChange={e => setForm({...form, portName: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Страна</label>
              <input value={form.country} onChange={e => setForm({...form, country: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Дата прибытия</label>
              <input type="date" value={form.arrivalDate} onChange={e => setForm({...form, arrivalDate: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Время прибытия</label>
              <input type="time" value={form.arrivalTime} onChange={e => setForm({...form, arrivalTime: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Дата отбытия</label>
              <input type="date" value={form.departureDate} onChange={e => setForm({...form, departureDate: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Время отбытия</label>
              <input type="time" value={form.departureTime} onChange={e => setForm({...form, departureTime: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Номер причала</label>
              <input value={form.berthNumber} onChange={e => setForm({...form, berthNumber: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Пассажиров на борту</label>
              <input type="number" value={form.passengersOnboard} onChange={e => setForm({...form, passengersOnboard: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Высажено</label>
              <input type="number" value={form.passengersDisembarked} onChange={e => setForm({...form, passengersDisembarked: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Посажено</label>
              <input type="number" value={form.passengersEmbarked} onChange={e => setForm({...form, passengersEmbarked: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Грузовые операции</label>
            <textarea value={form.cargoOperations} onChange={e => setForm({...form, cargoOperations: e.target.value})} rows={2}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Примечания</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none" />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all">
            Сохранить
          </button>
        </form>
      )}

      {/* Port Calls List */}
      <div className="space-y-3">
        {portCalls.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-3">🏗️</div>
            <p>Нет записей о заходах в порты.</p>
          </div>
        ) : (
          portCalls.map(pc => (
            <div key={pc.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-blue-500/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">🏗️ {pc.portName}</h3>
                    {pc.country && <span className="text-sm text-slate-400">{pc.country}</span>}
                  </div>
                  <div className="text-sm text-slate-400 space-y-1">
                    <div className="flex flex-wrap gap-4">
                      {pc.arrivalDate && (
                        <span>⬇️ Прибытие: {new Date(pc.arrivalDate).toLocaleDateString('ru-RU')} {pc.arrivalTime}</span>
                      )}
                      {pc.departureDate && (
                        <span>⬆️ Отбытие: {new Date(pc.departureDate).toLocaleDateString('ru-RU')} {pc.departureTime}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {pc.berthNumber && <span>📍 Причал: {pc.berthNumber}</span>}
                      {pc.voyageId && <span>🚢 {getVoyageName(pc.voyageId)}</span>}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span className="text-blue-300">На борту: {pc.passengersOnboard}</span>
                      <span className="text-red-300">Высажено: {pc.passengersDisembarked}</span>
                      <span className="text-emerald-300">Посажено: {pc.passengersEmbarked}</span>
                    </div>
                    {pc.cargoOperations && <p className="text-xs text-slate-500 mt-1">📦 {pc.cargoOperations}</p>}
                    {pc.notes && <p className="text-xs text-slate-500 mt-1">{pc.notes}</p>}
                  </div>
                </div>
                <button onClick={() => handleDelete(pc.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all self-start">
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
