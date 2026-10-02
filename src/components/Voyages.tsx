import { useState } from 'react';
import { Voyage } from '../types';
import { getVoyages, saveVoyage, deleteVoyage, updateVoyage, getPassengers } from '../store';

interface Props {
  onChange: () => void;
}

const EMPTY_FORM = {
  name: '',
  startDate: '',
  endDate: '',
  departurePort: '',
  arrivalPort: '',
  shipName: '',
  status: 'planned' as Voyage['status'],
  route: [] as string[],
  notes: '',
};

export default function Voyages({ onChange }: Props) {
  const [voyages, setVoyages] = useState<Voyage[]>(getVoyages());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [routeInput, setRouteInput] = useState('');
  const passengers = getPassengers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveVoyage(form);
    setVoyages(getVoyages());
    setForm(EMPTY_FORM);
    setShowForm(false);
    onChange();
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить рейс?')) {
      deleteVoyage(id);
      setVoyages(getVoyages());
      onChange();
    }
  };

  const toggleStatus = (voyage: Voyage) => {
    const statuses: Voyage['status'][] = ['planned', 'active', 'completed', 'cancelled'];
    const currentIndex = statuses.indexOf(voyage.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    updateVoyage(voyage.id, { status: nextStatus });
    setVoyages(getVoyages());
    onChange();
  };

  const addRoutePoint = () => {
    if (routeInput.trim()) {
      setForm({ ...form, route: [...form.route, routeInput.trim()] });
      setRouteInput('');
    }
  };

  const removeRoutePoint = (index: number) => {
    setForm({ ...form, route: form.route.filter((_, i) => i !== index) });
  };

  const getPassengerCount = (voyageId: string) => {
    return passengers.filter(p => p.voyageId === voyageId).length;
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    planned: { label: 'Запланирован', color: 'bg-yellow-500/20 text-yellow-300' },
    active: { label: 'Активный', color: 'bg-emerald-500/20 text-emerald-300' },
    completed: { label: 'Завершён', color: 'bg-blue-500/20 text-blue-300' },
    cancelled: { label: 'Отменён', color: 'bg-red-500/20 text-red-300' },
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🚢</span> Рейсы
          <span className="text-sm font-normal text-slate-400">({voyages.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          {showForm ? '✕ Отмена' : '+ Новый рейс'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 space-y-4">
          <h3 className="text-lg font-semibold text-white">Новый рейс</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Название рейса *</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Судно</label>
              <input value={form.shipName} onChange={e => setForm({...form, shipName: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Статус</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value as Voyage['status']})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50">
                <option value="planned">Запланирован</option>
                <option value="active">Активный</option>
                <option value="completed">Завершён</option>
                <option value="cancelled">Отменён</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Дата отправления *</label>
              <input type="date" required value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Дата прибытия</label>
              <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Порт отправления *</label>
              <input required value={form.departurePort} onChange={e => setForm({...form, departurePort: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Порт прибытия *</label>
              <input required value={form.arrivalPort} onChange={e => setForm({...form, arrivalPort: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Маршрут (порты захода)</label>
            <div className="flex gap-2 mb-2">
              <input value={routeInput} onChange={e => setRouteInput(e.target.value)} placeholder="Добавить порт..."
                className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRoutePoint(); } }} />
              <button type="button" onClick={addRoutePoint} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm">+</button>
            </div>
            {form.route.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.route.map((point, i) => (
                  <span key={i} className="flex items-center gap-1 bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                    {point}
                    <button type="button" onClick={() => removeRoutePoint(i)} className="text-blue-400 hover:text-red-400">×</button>
                  </span>
                ))}
              </div>
            )}
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

      {/* Voyages List */}
      <div className="space-y-3">
        {voyages.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-3">🚢</div>
            <p>Нет рейсов. Создайте первый рейс.</p>
          </div>
        ) : (
          voyages.map(v => (
            <div key={v.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-blue-500/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{v.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full cursor-pointer ${statusLabels[v.status].color}`}
                      onClick={() => toggleStatus(v)} title="Нажмите для смены статуса">
                      {statusLabels[v.status].label}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 space-y-1">
                    <div className="flex flex-wrap gap-4">
                      <span>📅 {v.startDate ? new Date(v.startDate).toLocaleDateString('ru-RU') : '—'} {v.endDate ? `— ${new Date(v.endDate).toLocaleDateString('ru-RU')}` : ''}</span>
                      {v.shipName && <span>🚢 {v.shipName}</span>}
                      <span>👥 {getPassengerCount(v.id)} пасс.</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-300">
                      <span className="font-medium">{v.departurePort}</span>
                      {v.route.length > 0 && (
                        <>
                          <span>→</span>
                          {v.route.map((r, i) => (
                            <span key={i} className="flex items-center gap-1">
                              <span className="text-slate-500">{r}</span>
                              {i < v.route.length - 1 && <span>→</span>}
                            </span>
                          ))}
                          <span>→</span>
                        </>
                      )}
                      <span className="font-medium">{v.arrivalPort}</span>
                    </div>
                    {v.notes && <p className="text-xs text-slate-500 mt-1">{v.notes}</p>}
                  </div>
                </div>
                <button onClick={() => handleDelete(v.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all self-start">
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
