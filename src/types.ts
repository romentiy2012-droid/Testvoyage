export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  documentType: string;
  documentNumber: string;
  citizenship: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  cabinNumber: string;
  ticketNumber: string;
  voyageId: string;
  embarkationPort: string;
  disembarkationPort: string;
  category: 'adult' | 'child' | 'infant';
  notes: string;
  createdAt: string;
}

export interface Voyage {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  departurePort: string;
  arrivalPort: string;
  shipName: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  route: string[];
  notes: string;
  createdAt: string;
}

export interface PortCall {
  id: string;
  voyageId: string;
  portName: string;
  country: string;
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  departureTime: string;
  berthNumber: string;
  passengersOnboard: number;
  passengersDisembarked: number;
  passengersEmbarked: number;
  cargoOperations: string;
  notes: string;
  createdAt: string;
}

export interface FuelRecord {
  id: string;
  voyageId: string;
  date: string;
  fuelType: 'diesel' | 'heavy' | 'gas';
  quantityLiters: number;
  portName: string;
  supplier: string;
  costPerLiter: number;
  totalCost: number;
  tankLevelBefore: number;
  tankLevelAfter: number;
  consumption: number;
  notes: string;
  createdAt: string;
}

export interface DailyReport {
  id: string;
  voyageId: string;
  date: string;
  time: string;
  position: {
    latitude: string;
    longitude: string;
  };
  speed: number;
  course: number;
  windDirection: string;
  windForce: number;
  seaState: number;
  visibility: string;
  weather: string;
  temperature: number;
  pressure: number;
  passengersOnboard: number;
  crewOnboard: number;
  fuelRemaining: number;
  distanceCovered: number;
  engineHours: number;
  notes: string;
  createdAt: string;
}

export interface ShipInfo {
  name: string;
  imo: string;
  callSign: string;
  flag: string;
  type: string;
  length: number;
  beam: number;
  draft: number;
  grossTonnage: number;
  passengerCapacity: number;
  crewCapacity: number;
  enginePower: number;
  yearBuilt: number;
}

export type TabType = 'dashboard' | 'passengers' | 'voyages' | 'portcalls' | 'fuel' | 'daily' | 'settings';
