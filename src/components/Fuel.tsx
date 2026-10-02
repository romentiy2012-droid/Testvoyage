import { useState } from 'react';
import { FuelRecord } from '../types';
import { getFuelRecords, saveFuelRecord, deleteFuelRecord, getVoyages } from '../store';

interface Props {
  onChange: () => void;
}

const EMPTY_FORM = {
  voyageId: '',
  date: '',
  fuelType: 'diesel' as FuelRecord['fuelType'],
  quantityLiters: 0,
  portName: '',
  supplier: '',
  costPerLiter: 0,
  totalCost: 0,
  tankLevelBefore: 0,
  tankLevelAfter: 0,
  consumption: 0,
  notes: '',
};

export default function Fuel({ onChange }: Props) {
  const [records, setRecords] = useState<FuelRecord[]>(getFuelRecords());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const voyages = getVoyages();

  const totalFuel = records.reduce((sum, r) => sum + r.quantityLiters, 0);
  const totalCost = records.reduce((sum, r) => sum + r.totalCost, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record = { ...form, totalCost: form.quantityLiters * form.costPerLiter };
    saveFuelRecord(record);
    setRecords(getFuelRecords());
    setForm(EMPTY_FORM);
    setShowForm(false);
    onChange();
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить запись?')) {
      deleteFuelRecord(id);
      setRecords(getFuelRecords());
      onChange();
    }
  };

  const fuelTypeLabels: Record<string, string> = {
    diesel: 'Дизельное',
    heavy: 'Тяжёлое',
    gas: 'Газ',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>⛽</span> Топливо
          <span className="text-sm font-normal text-slate-400">({records.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          {showForm ? '✕ Отмена' : '+ Добавить запись'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{totalFuel.toLocaleString('ru-RU')}</div>
          <div className="text-xs text-slate-400">Всего литров</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-emerald-400">{totalCost.toLocaleString('ru-RU')} ₽</div>
          <div className="text-xs text-slate-400">Общая стоимость</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-400">{records.length}</div>
          <div className="text-xs text-slate-400">Заправок</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-400">
            {records.length > 0 ? Math.round(totalFuel / records.length).toLocaleString('ru-RU') : 0}
          </div>
          <div className="text-xs text-slate-400">Среднее (л/заправка)</div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 space-y-4">
          <h3 className="text-lg font-semibold text-white">Запись о топливе</h3>
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
              <label className="text-xs text-slate-400 mb-1 block">Дата *</label>
              <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Тип топлива</label>
              <select value={form.fuelType} onChange={e => setForm({...form, fuelType: e.target.value as FuelRecord['fuelType']})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50">
                <option value="diesel">Дизельное</option>
                <option value="heavy">Тяжёлое</option>
                <option value="gas">Газ</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Количество (литры) *</label>
              <input type="number" required value={form.quantityLiters} onChange={e => setForm({...form, quantityLiters: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Цена за литр (₽)</label>
              <input type="number" step="0.01" value={form.costPerLiter} onChange={e => setForm({...form, costPerLiter: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Порт / Место</label>
              <input value={form.portName} onChange={e => setForm({...form, portName: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Поставщик</label>
              <input value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Уровень бака до (%)</label>
              <input type="number" min="0" max="100" value={form.tankLevelBefore} onChange={e => setForm({...form, tankLevelBefore: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Уровень бака после (%)</label>
              <input type="number" min="0" max="100" value={form.tankLevelAfter} onChange={e => setForm({...form, tankLevelAfter: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Расход (литры)</label>
              <input type="number" value={form.consumption} onChange={e => setForm({...form, consumption: +e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
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

      {/* Records List */}
      <div className="space-y-2">
        {records.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-3">⛽</div>
            <p>Нет записей о топливе.</p>
          </div>
        ) : (
          records.map(r => (
            <div key={r.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-lg">
                    ⛽
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {fuelTypeLabels[r.fuelType]} — {r.quantityLiters.toLocaleString('ru-RU')} л
                    </div>
                    <div className="text-xs text-slate-400 flex flex-wrap gap-2">
                      <span>📅 {r.date ? new Date(r.date).toLocaleDateString('ru-RU') : '—'}</span>
                      {r.portName && <span>📍 {r.portName}</span>}
                      {r.supplier && <span>🏢 {r.supplier}</span>}
                      {r.totalCost > 0 && <span className="text-emerald-400">💰 {r.totalCost.toLocaleString('ru-RU')} ₽</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(r.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all self-start sm:self-center">
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
