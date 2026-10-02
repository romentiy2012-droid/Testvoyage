import { useState } from 'react';
import { Passenger } from '../types';
import { getPassengers, savePassenger, deletePassenger, getVoyages } from '../store';

interface Props {
  onChange: () => void;
}

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  middleName: '',
  documentType: 'passport',
  documentNumber: '',
  citizenship: 'Россия',
  dateOfBirth: '',
  gender: 'male' as 'male' | 'female',
  cabinNumber: '',
  ticketNumber: '',
  voyageId: '',
  embarkationPort: '',
  disembarkationPort: '',
  category: 'adult' as 'adult' | 'child' | 'infant',
  notes: '',
};

export default function Passengers({ onChange }: Props) {
  const [passengers, setPassengers] = useState<Passenger[]>(getPassengers());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [filterVoyage, setFilterVoyage] = useState('');
  const voyages = getVoyages();

  const filtered = passengers.filter(p => {
    const matchSearch = search === '' || 
      `${p.lastName} ${p.firstName} ${p.middleName} ${p.documentNumber} ${p.ticketNumber}`.toLowerCase().includes(search.toLowerCase());
    const matchVoyage = filterVoyage === '' || p.voyageId === filterVoyage;
    return matchSearch && matchVoyage;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePassenger(form);
    setPassengers(getPassengers());
    setForm(EMPTY_FORM);
    setShowForm(false);
    onChange();
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить пассажира?')) {
      deletePassenger(id);
      setPassengers(getPassengers());
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
          <span>👥</span> Пассажиры
          <span className="text-sm font-normal text-slate-400">({passengers.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          {showForm ? '✕ Отмена' : '+ Добавить'}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Поиск по ФИО, документу, билету..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
        />
        <select
          value={filterVoyage}
          onChange={e => setFilterVoyage(e.target.value)}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
        >
          <option value="">Все рейсы</option>
          {voyages.map(v => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 space-y-4">
          <h3 className="text-lg font-semibold text-white">Новый пассажир</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Фамилия *</label>
              <input required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Имя *</label>
              <input required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Отчество</label>
              <input value={form.middleName} onChange={e => setForm({...form, middleName: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Дата рождения</label>
              <input type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Пол</label>
              <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value as 'male' | 'female'})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50">
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Гражданство</label>
              <input value={form.citizenship} onChange={e => setForm({...form, citizenship: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Тип документа</label>
              <select value={form.documentType} onChange={e => setForm({...form, documentType: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50">
                <option value="passport">Паспорт</option>
                <option value="internal">Внутр. паспорт</option>
                <option value="birth_cert">Свид. о рождении</option>
                <option value="foreign_passport">Загранпаспорт</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Номер документа *</label>
              <input required value={form.documentNumber} onChange={e => setForm({...form, documentNumber: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Номер билета *</label>
              <input required value={form.ticketNumber} onChange={e => setForm({...form, ticketNumber: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Номер каюты</label>
              <input value={form.cabinNumber} onChange={e => setForm({...form, cabinNumber: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
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
              <label className="text-xs text-slate-400 mb-1 block">Категория</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value as 'adult' | 'child' | 'infant'})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50">
                <option value="adult">Взрослый</option>
                <option value="child">Ребёнок</option>
                <option value="infant">Младенец</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Порт посадки</label>
              <input value={form.embarkationPort} onChange={e => setForm({...form, embarkationPort: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Порт высадки</label>
              <input value={form.disembarkationPort} onChange={e => setForm({...form, disembarkationPort: e.target.value})}
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

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-3">👥</div>
            <p>{passengers.length === 0 ? 'Список пассажиров пуст' : 'Ничего не найдено'}</p>
          </div>
        ) : (
          filtered.map(p => (
            <div key={p.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {p.lastName[0]}{p.firstName[0]}
                  </div>
                  <div>
                    <div className="font-medium text-white">{p.lastName} {p.firstName} {p.middleName}</div>
                    <div className="text-xs text-slate-400 flex flex-wrap gap-2">
                      <span>🎫 {p.ticketNumber}</span>
                      <span>🚪 Каютa {p.cabinNumber || '—'}</span>
                      <span>📄 {p.documentNumber}</span>
                      {p.voyageId && <span>🚢 {getVoyageName(p.voyageId)}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    p.category === 'adult' ? 'bg-blue-500/20 text-blue-300' :
                    p.category === 'child' ? 'bg-green-500/20 text-green-300' :
                    'bg-purple-500/20 text-purple-300'
                  }`}>
                    {p.category === 'adult' ? 'Взрослый' : p.category === 'child' ? 'Ребёнок' : 'Младенец'}
                  </span>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
