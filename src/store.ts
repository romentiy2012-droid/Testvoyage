import { Passenger, Voyage, PortCall, FuelRecord, DailyReport, ShipInfo } from './types';

const STORAGE_KEYS = {
  passengers: 'voyage_log_passengers',
  voyages: 'voyage_log_voyages',
  portCalls: 'voyage_log_port_calls',
  fuel: 'voyage_log_fuel',
  dailyReports: 'voyage_log_daily_reports',
  shipInfo: 'voyage_log_ship_info',
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Passengers
export function getPassengers(): Passenger[] {
  return getItem<Passenger[]>(STORAGE_KEYS.passengers, []);
}

export function savePassenger(passenger: Omit<Passenger, 'id' | 'createdAt'>): Passenger {
  const passengers = getPassengers();
  const newPassenger: Passenger = {
    ...passenger,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  passengers.push(newPassenger);
  setItem(STORAGE_KEYS.passengers, passengers);
  return newPassenger;
}

export function updatePassenger(id: string, data: Partial<Passenger>): void {
  const passengers = getPassengers();
  const index = passengers.findIndex(p => p.id === id);
  if (index !== -1) {
    passengers[index] = { ...passengers[index], ...data };
    setItem(STORAGE_KEYS.passengers, passengers);
  }
}

export function deletePassenger(id: string): void {
  const passengers = getPassengers().filter(p => p.id !== id);
  setItem(STORAGE_KEYS.passengers, passengers);
}

// Voyages
export function getVoyages(): Voyage[] {
  return getItem<Voyage[]>(STORAGE_KEYS.voyages, []);
}

export function saveVoyage(voyage: Omit<Voyage, 'id' | 'createdAt'>): Voyage {
  const voyages = getVoyages();
  const newVoyage: Voyage = {
    ...voyage,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  voyages.push(newVoyage);
  setItem(STORAGE_KEYS.voyages, voyages);
  return newVoyage;
}

export function updateVoyage(id: string, data: Partial<Voyage>): void {
  const voyages = getVoyages();
  const index = voyages.findIndex(v => v.id === id);
  if (index !== -1) {
    voyages[index] = { ...voyages[index], ...data };
    setItem(STORAGE_KEYS.voyages, voyages);
  }
}

export function deleteVoyage(id: string): void {
  const voyages = getVoyages().filter(v => v.id !== id);
  setItem(STORAGE_KEYS.voyages, voyages);
}

// Port Calls
export function getPortCalls(): PortCall[] {
  return getItem<PortCall[]>(STORAGE_KEYS.portCalls, []);
}

export function savePortCall(portCall: Omit<PortCall, 'id' | 'createdAt'>): PortCall {
  const portCalls = getPortCalls();
  const newPortCall: PortCall = {
    ...portCall,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  portCalls.push(newPortCall);
  setItem(STORAGE_KEYS.portCalls, portCalls);
  return newPortCall;
}

export function updatePortCall(id: string, data: Partial<PortCall>): void {
  const portCalls = getPortCalls();
  const index = portCalls.findIndex(p => p.id === id);
  if (index !== -1) {
    portCalls[index] = { ...portCalls[index], ...data };
    setItem(STORAGE_KEYS.portCalls, portCalls);
  }
}

export function deletePortCall(id: string): void {
  const portCalls = getPortCalls().filter(p => p.id !== id);
  setItem(STORAGE_KEYS.portCalls, portCalls);
}

// Fuel Records
export function getFuelRecords(): FuelRecord[] {
  return getItem<FuelRecord[]>(STORAGE_KEYS.fuel, []);
}

export function saveFuelRecord(record: Omit<FuelRecord, 'id' | 'createdAt'>): FuelRecord {
  const records = getFuelRecords();
  const newRecord: FuelRecord = {
    ...record,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  records.push(newRecord);
  setItem(STORAGE_KEYS.fuel, records);
  return newRecord;
}

export function deleteFuelRecord(id: string): void {
  const records = getFuelRecords().filter(r => r.id !== id);
  setItem(STORAGE_KEYS.fuel, records);
}

// Daily Reports
export function getDailyReports(): DailyReport[] {
  return getItem<DailyReport[]>(STORAGE_KEYS.dailyReports, []);
}

export function saveDailyReport(report: Omit<DailyReport, 'id' | 'createdAt'>): DailyReport {
  const reports = getDailyReports();
  const newReport: DailyReport = {
    ...report,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  reports.push(newReport);
  setItem(STORAGE_KEYS.dailyReports, reports);
  return newReport;
}

export function deleteDailyReport(id: string): void {
  const reports = getDailyReports().filter(r => r.id !== id);
  setItem(STORAGE_KEYS.dailyReports, reports);
}

// Ship Info
export function getShipInfo(): ShipInfo {
  return getItem<ShipInfo>(STORAGE_KEYS.shipInfo, {
    name: '',
    imo: '',
    callSign: '',
    flag: '',
    type: '',
    length: 0,
    beam: 0,
    draft: 0,
    grossTonnage: 0,
    passengerCapacity: 0,
    crewCapacity: 0,
    enginePower: 0,
    yearBuilt: 0,
  });
}

export function saveShipInfo(info: ShipInfo): void {
  setItem(STORAGE_KEYS.shipInfo, info);
}

// Export/Import
export function exportAllData(): string {
  const data = {
    passengers: getPassengers(),
    voyages: getVoyages(),
    portCalls: getPortCalls(),
    fuel: getFuelRecords(),
    dailyReports: getDailyReports(),
    shipInfo: getShipInfo(),
    exportDate: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.passengers) setItem(STORAGE_KEYS.passengers, data.passengers);
    if (data.voyages) setItem(STORAGE_KEYS.voyages, data.voyages);
    if (data.portCalls) setItem(STORAGE_KEYS.portCalls, data.portCalls);
    if (data.fuel) setItem(STORAGE_KEYS.fuel, data.fuel);
    if (data.dailyReports) setItem(STORAGE_KEYS.dailyReports, data.dailyReports);
    if (data.shipInfo) setItem(STORAGE_KEYS.shipInfo, data.shipInfo);
    return true;
  } catch {
    return false;
  }
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}
