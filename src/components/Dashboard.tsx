import { getPassengers, getVoyages, getPortCalls, getFuelRecords, getDailyReports, getShipInfo } from '../store';

export default function Dashboard() {
  const passengers = getPassengers();
  const voyages = getVoyages();
  const portCalls = getPortCalls();
  const fuelRecords = getFuelRecords();
  const dailyReports = getDailyReports();
  const shipInfo = getShipInfo();

  const activeVoyage = voyages.find(v => v.status === 'active');
  const totalFuel = fuelRecords.reduce((sum, r) => sum + r.quantityLiters, 0);
  const totalFuelCost = fuelRecords.reduce((sum, r) => sum + r.totalCost, 0);

  const stats = [
    { label: 'Пассажиры', value: passengers.length, icon: '👥', color: 'from-blue-500 to-blue-600' },
    { label: 'Рейсы', value: voyages.length, icon: '🚢', color: 'from-cyan-500 to-cyan-600' },
    { label: 'Заходы в порты', value: portCalls.length, icon: '🏗️', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Суточные донесения', value: dailyReports.length, icon: '📋', color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {shipInfo.name ? shipInfo.name : 'Судовой журнал'}
            </h2>
            <p className="text-slate-300">
              {activeVoyage
                ? `Активный рейс: ${activeVoyage.name} (${activeVoyage.departurePort} → ${activeVoyage.arrivalPort})`
                : 'Нет активного рейса'}
            </p>
          </div>
          {shipInfo.imo && (
            <div className="text-right text-sm text-slate-400">
              <div>IMO: {shipInfo.imo}</div>
              <div>Позывной: {shipInfo.callSign}</div>
              <div>Флаг: {shipInfo.flag}</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fuel Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>⛽</span> Топливо
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Всего заправлено:</span>
              <span className="text-white font-semibold">{totalFuel.toLocaleString('ru-RU')} л</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Общая стоимость:</span>
              <span className="text-emerald-400 font-semibold">{totalFuelCost.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Записей:</span>
              <span className="text-white font-semibold">{fuelRecords.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🚢</span> Судно
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Название:</span>
              <span className="text-white font-semibold">{shipInfo.name || '—'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Тип:</span>
              <span className="text-white font-semibold">{shipInfo.type || '—'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Вместимость:</span>
              <span className="text-white font-semibold">
                {shipInfo.passengerCapacity || 0} пасс. / {shipInfo.crewCapacity || 0} экипаж
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>📊</span> Последние записи
        </h3>
        <div className="space-y-2">
          {passengers.length === 0 && voyages.length === 0 && portCalls.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <div className="text-4xl mb-3">📝</div>
              <p>Нет записей. Начните с создания рейса и добавления пассажиров.</p>
            </div>
          ) : (
            <>
              {voyages.slice(-3).reverse().map(v => (
                <div key={v.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                  <span className="text-lg">🚢</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{v.name}</div>
                    <div className="text-xs text-slate-400">{v.departurePort} → {v.arrivalPort}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    v.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' :
                    v.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                    v.status === 'planned' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {v.status === 'active' ? 'Активный' : v.status === 'completed' ? 'Завершён' : v.status === 'planned' ? 'Запланирован' : 'Отменён'}
                  </span>
                </div>
              ))}
              {passengers.slice(-3).reverse().map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                  <span className="text-lg">👤</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{p.lastName} {p.firstName}</div>
                    <div className="text-xs text-slate-400">Каютa: {p.cabinNumber} | Билет: {p.ticketNumber}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
