import { useState } from 'react';
import { DailyReport as DailyReportType } from '../types';
import { getDailyReports, saveDailyReport, deleteDailyReport, getVoyages } from '../store';

interface Props {
  onChange: () => void;
}

const EMPTY_FORM = {
  voyageId: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  position: { latitude: '', longitude: '' },
  speed: 0,
  course: 0,
  windDirection: '',
  windForce: 0,
  seaState: 0,
  visibility: '',
  weather: '',
  temperature: 0,
  pressure: 0,
  passengersOnboard: 0,
  crewOnboard: 0,
  fuelRemaining: 0,
  distanceCovered: 0,
  engineHours: 0,
  notes: '',
};

export default function DailyReport({ onChange }: Props) {
  const [reports, setReports] = useState<DailyReportType[]>(getDailyReports());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const voyages = getVoyages();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDailyReport(form);
    setReports(getDailyReports());
    setForm(EMPTY_FORM);
    setShowForm(false);
    onChange();
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить суточное донесение?')) {
      deleteDailyReport(id);
      setReports(getDailyReports());
      onChange();
    }
  };

  const seaStateLabels = ['Штиль', 'Рябь', 'Слабое', 'Умеренное', 'Крупное', 'Грубое', 'Очень крупное', 'Чрезмерное'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📋</span> Суточные донесения (DRR)
          <span className="text-sm font-normal text-slate-400">({reports.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          {showForm ? '✕ Отмена' : '+ Новое донесение'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 space-y-4">
          <h3 className="text-lg font-semibold text-white">Суточное донесение</h3>
          
          {/* Navigation */}
          <div className="border-b border-slate-700/50 pb-3 mb-3">
            <h4 className="text-sm font-medium text-blue-300 mb-3">🧭 Навигация</h4>
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
                <label className="text-xs text-slate-400 mb-1 block">Время</label>
                <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Широта</label>
                <input value={form.position.latitude} onChange={e => setForm({...form, position: {...form.position, latitude: e.target.value}})}
                  placeholder="напр. 68°58'N"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Долгота</label>
                <input value={form.position.longitude} onChange={e => setForm({...form, position: {...form.position, longitude: e.target.value}})}
                  placeholder="напр. 33°05'E"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Скорость (узлы)</label>
                <input type="number" step="0.1" value={form.speed} onChange={e => setForm({...form, speed: +e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Курс (°)</label>
                <input type="number" min="0" max="360" value={form.course} onChange={e => setForm({...form, course: +e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Пройдено (мили)</label>
                <input type="number" step="0.1" value={form.distanceCovered} onChange={e => setForm({...form, distanceCovered: +e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Моточасы</label>
                <input type="number" step="0.1" value={form.engineHours} onChange={e => setForm({...form, engineHours: +e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
            </div>
          </div>

          {/* Weather */}
          <div className="border-b border-slate-700/50 pb-3 mb-3">
            <h4 className="text-sm font-medium text-blue-300 mb-3">🌤️ Метеоусловия</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Направление ветра</label>
                <input value={form.windDirection} onChange={e => setForm({...form, windDirection: e.target.value})}
                  placeholder="напр. NW, S, NE"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Сила ветра (баллы)</label>
                <input type="number" min="0" max="12" value={form.windForce} onChange={e => setForm({...form, windForce: +e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Волнение моря (баллы)</label>
                <select value={form.seaState} onChange={e => setForm({...form, seaState: +e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50">
                  {seaStateLabels.map((label, i) => (
                    <option key={i} value={i}>{i} — {label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Видимость</label>
                <input value={form.visibility} onChange={e => setForm({...form, visibility: e.target.value})}
                  placeholder="напр. 10 миль"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Погода</label>
                <input value={form.weather} onChange={e => setForm({...form, weather: e.target.value})}
                  placeholder="напр. Облачно, дождь"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Температура (°C)</label>
                <input type="number" step="0.1" value={form.temperature} onChange={e => setForm({...form, temperature: +e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Давление (мм рт.ст.)</label>
                <input type="number" value={form.pressure} onChange={e => setForm({...form, pressure: +e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
            </div>
          </div>

          {/* People & Fuel */}
          <div className="border-b border-slate-700/50 pb-3 mb-3">
            <h4 className="text-sm font-medium text-blue-300 mb-3">👥 Люди и топливо</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Пассажиров на борту</label>
                <input type="number" value={form.passengersOnboard} onChange={e => setForm({...form, passengersOnboard: +e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Экипаж на борту</label>
                <input type="number" value={form.crewOnboard} onChange={e => setForm({...form, crewOnboard: +e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Топливо остаток (л)</label>
                <input type="number" value={form.fuelRemaining} onChange={e => setForm({...form, fuelRemaining: +e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Примечания</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none" />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all">
            Сохранить
          </button>
        </form>
      )}

      {/* Reports List */}
      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-3">📋</div>
            <p>Нет суточных донесений.</p>
          </div>
        ) : (
          reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(r => (
            <div key={r.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-blue-500/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      📋 {r.date ? new Date(r.date).toLocaleDateString('ru-RU') : '—'} {r.time && `в ${r.time}`}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-slate-400">
                    {(r.position.latitude || r.position.longitude) && (
                      <span>📍 {r.position.latitude} {r.position.longitude}</span>
                    )}
                    {r.speed > 0 && <span>🏎️ {r.speed} уз</span>}
                    {r.course > 0 && <span>🧭 {r.course}°</span>}
                    {r.distanceCovered > 0 && <span>📏 {r.distanceCovered} миль</span>}
                    {r.windDirection && <span>💨 {r.windDirection} {r.windForce} б</span>}
                    {r.weather && <span>🌤️ {r.weather}</span>}
                    {r.temperature !== 0 && <span>🌡️ {r.temperature}°C</span>}
                    {r.pressure > 0 && <span>📊 {r.pressure} мм</span>}
                    <span>👥 {r.passengersOnboard} пасс / {r.crewOnboard} экипаж</span>
                    {r.fuelRemaining > 0 && <span>⛽ {r.fuelRemaining} л</span>}
                  </div>
                  {r.notes && <p className="text-xs text-slate-500 mt-2">{r.notes}</p>}
                </div>
                <button onClick={() => handleDelete(r.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all self-start">
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
