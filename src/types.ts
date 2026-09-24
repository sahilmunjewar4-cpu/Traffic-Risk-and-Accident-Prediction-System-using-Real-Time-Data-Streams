export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type TrafficStatus = 'HEAVY' | 'MODERATE' | 'LIGHT';
export type EmergencyVehicleType = 'AMBULANCE' | 'FIRE_BRIGADE' | 'POLICE' | 'ORGAN_TRANSPORT';
export type WeatherCondition = 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy' | 'Heavy Rain' | 'Fog';

export interface NagpurArea {
  id: string;
  name: string;
  zone: 'Central' | 'South' | 'North' | 'East' | 'West' | 'Industrial' | 'Special';
  lat: number;
  lng: number;
  trafficLevel: TrafficStatus;
  avgSpeed: number; // km/h
  trafficDensity: number; // 0 to 100%
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  incidentsCount: number;
  weather: WeatherCondition;
  lastUpdated: string;
  nearbyRoads: string[];
  nearbyJunctions: string[];
  emergencyActive: boolean;
  description?: string;
}

export interface NagpurRoad {
  id: string;
  name: string;
  codeName?: string;
  lengthKm: number;
  areasCovered: string[];
  coordinates: [number, number][]; // polyline coordinates [lat, lng]
  currentSpeed: number; // km/h
  freeFlowSpeed: number; // km/h
  trafficDensity: number; // percentage 0-100
  congestionIndex: number; // 0-100
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  status: TrafficStatus;
  activeIncidents: number;
  potholesOrDamage?: boolean;
  weatherImpact: 'None' | 'Moderate' | 'Severe';
  emergencyLaneAvailable: boolean;
  signalsCount: number;
  lastUpdated: string;
}

export interface NagpurIncident {
  id: string;
  title: string;
  area: string;
  road: string;
  lat: number;
  lng: number;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'MINOR';
  riskScore: number;
  type: 'Accident' | 'Severe Congestion' | 'Waterlogging' | 'Road Repair' | 'Vehicle Breakdown' | 'Signal Malfunction';
  time: string;
  timestamp: number;
  trafficImpact: 'Severe Delay (+35m)' | 'Moderate Delay (+15m)' | 'Minor Delay (+5m)';
  weather: WeatherCondition;
  status: 'ACTIVE' | 'RESPONDING' | 'RESOLVED';
  vehiclesInvolved?: number;
  casualtiesReported?: number;
  description: string;
}

export interface NagpurSignal {
  id: string;
  name: string;
  junctionName: string;
  road: string;
  area: string;
  lat: number;
  lng: number;
  currentState: 'RED' | 'GREEN' | 'AMBER';
  recommendedState: 'RED' | 'GREEN';
  priorityStatus: 'NORMAL' | 'GREEN_WAVE_ACTIVE' | 'MANUAL_OVERRIDE';
  cycleTimeSec: number;
  queueLengthMeters: number;
}

export interface EmergencyRoutePlan {
  id: string;
  vehicleType: EmergencyVehicleType;
  vehicleNumber: string;
  originName: string;
  originCoords: [number, number];
  destinationName: string;
  destinationCoords: [number, number];
  routeRoads: string[];
  routePath: [number, number][];
  distanceKm: number;
  normalEtaMin: number;
  greenWaveEtaMin: number;
  timeSavedMin: number;
  congestionPoints: string[];
  signalsOnRoute: NagpurSignal[];
  status: 'STANDBY' | 'DISPATCHED' | 'EN_ROUTE' | 'ARRIVED';
  alternativeRoute?: {
    roads: string[];
    distanceKm: number;
    etaMin: number;
  };
}

export interface PredictionRecord {
  id: string;
  timestamp: string;
  city: 'Nagpur';
  area: string;
  road: string;
  speed: number;
  density: number;
  weather: WeatherCondition;
  timeHour: number;
  riskScore: number;
  confidence: number;
  riskLevel: RiskLevel;
  primaryRiskFactor: string;
  preventiveAction: string;
}

export interface NagpurWeatherReport {
  city: 'Nagpur';
  state: 'Maharashtra';
  country: 'India';
  temperature: number; // °C
  feelsLike: number;
  humidity: number; // %
  windSpeed: number; // km/h
  condition: WeatherCondition;
  visibilityKm: number;
  rainfallMm: number;
  uvIndex: number;
  airQualityIndex: number; // AQI
  trafficImpact: 'LOW' | 'MEDIUM' | 'HIGH';
  tractionReductionPercent: number;
  lastUpdated: string;
  forecast: {
    time: string;
    temp: number;
    condition: WeatherCondition;
    rainProb: number;
  }[];
}

export interface NagpurAlert {
  id: string;
  city: 'Nagpur';
  area: string;
  road: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INFO';
  riskScore: number;
  weather: WeatherCondition;
  trafficDensity: number;
  timestamp: string;
  isRead: boolean;
  category: 'RISK' | 'ACCIDENT' | 'WEATHER' | 'EMERGENCY' | 'CONGESTION';
}
