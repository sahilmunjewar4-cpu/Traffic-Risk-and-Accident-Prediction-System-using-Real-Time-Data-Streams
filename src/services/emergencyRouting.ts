import { EmergencyRoutePlan, EmergencyVehicleType, NagpurSignal } from '../types';
import { NAGPUR_CONFIG } from '../config/nagpur';
import { INITIAL_NAGPUR_SIGNALS } from '../data/nagpurMockData';

export interface EmergencyPreset {
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
  alternativeRoute?: {
    roads: string[];
    distanceKm: number;
    etaMin: number;
  };
}

export const EMERGENCY_PRESETS: EmergencyPreset[] = [
  {
    id: 'emg_1',
    vehicleType: 'AMBULANCE',
    vehicleNumber: 'MH-31-EM-1081 (ALS Alpha-1)',
    originName: 'AIIMS Nagpur (MIHAN Campus)',
    originCoords: [21.0428, 79.0345],
    destinationName: 'Government Medical College & Hospital (GMC)',
    destinationCoords: [21.1294, 79.0984],
    routeRoads: ['Wardha Road (NH-44)', 'Ajni Link Rd', 'Manewada Road', 'Medical Square'],
    routePath: [
      [21.0428, 79.0345],
      [21.0740, 79.0550],
      [21.0945, 79.0650],
      [21.1070, 79.0710],
      [21.1220, 79.0780],
      [21.1250, 79.0880],
      [21.1294, 79.0984],
    ],
    distanceKm: 14.2,
    normalEtaMin: 32,
    greenWaveEtaMin: 14,
    timeSavedMin: 18,
    congestionPoints: ['Chhatrapati Square Bottleneck', 'Medical Square Intersection'],
    alternativeRoute: {
      roads: ['Inner Ring Road East', 'Umred Road (SH-9)'],
      distanceKm: 16.8,
      etaMin: 22,
    },
  },
  {
    id: 'emg_2',
    vehicleType: 'ORGAN_TRANSPORT',
    vehicleNumber: 'MH-31-OT-0007 (Green Corridor Express)',
    originName: 'Dr. Babasaheb Ambedkar International Airport',
    originCoords: [21.0922, 79.0472],
    destinationName: 'Kingsway Hospitals (Sadar)',
    destinationCoords: [21.1565, 79.0862],
    routeRoads: ['Airport Road', 'Wardha Road (NH-44)', 'Sitabuldi Flyover', 'Residency Road'],
    routePath: [
      [21.0922, 79.0472],
      [21.1070, 79.0650],
      [21.1220, 79.0780],
      [21.1360, 79.0810],
      [21.1466, 79.0825],
      [21.1565, 79.0862],
    ],
    distanceKm: 11.5,
    normalEtaMin: 28,
    greenWaveEtaMin: 11,
    timeSavedMin: 17,
    congestionPoints: ['Rahate Colony Junction', 'Sitabuldi Interchange'],
    alternativeRoute: {
      roads: ['South Ambazari Rd', 'Civil Lines Outer Link'],
      distanceKm: 13.0,
      etaMin: 18,
    },
  },
  {
    id: 'emg_3',
    vehicleType: 'FIRE_BRIGADE',
    vehicleNumber: 'MH-31-FB-9112 (Nagpur Municipal Fire Tender)',
    originName: 'Civil Lines Fire Command Station',
    originCoords: [21.1558, 79.0712],
    destinationName: 'Itwari Wholesale Market Cluster',
    destinationCoords: [21.1545, 79.1120],
    routeRoads: ['Temple Road', 'Central Avenue (CA Road)', 'Dosar Bhavan Chowk'],
    routePath: [
      [21.1558, 79.0712],
      [21.1520, 79.0845],
      [21.1522, 79.0965],
      [21.1545, 79.1120],
    ],
    distanceKm: 5.8,
    normalEtaMin: 22,
    greenWaveEtaMin: 8,
    timeSavedMin: 14,
    congestionPoints: ['Mominpura Dense Market Alley', 'Dosar Bhavan Junction'],
    alternativeRoute: {
      roads: ['Mayo Hospital Link Road', 'Hansapuri By-lane'],
      distanceKm: 6.4,
      etaMin: 14,
    },
  },
  {
    id: 'emg_4',
    vehicleType: 'POLICE',
    vehicleNumber: 'MH-31-PC-1120 (Nagpur Traffic Rapid Interceptor)',
    originName: 'Sitabuldi Traffic Police Headquarters',
    originCoords: [21.1466, 79.0825],
    destinationName: 'Kalamna Wholesale Grain & Vegetable Yard',
    destinationCoords: [21.1780, 79.1430],
    routeRoads: ['Central Avenue', 'Bhandara Road (NH-53)', 'Kalamna Road'],
    routePath: [
      [21.1466, 79.0825],
      [21.1470, 79.1290],
      [21.1510, 79.1550],
      [21.1780, 79.1430],
    ],
    distanceKm: 9.6,
    normalEtaMin: 24,
    greenWaveEtaMin: 10,
    timeSavedMin: 14,
    congestionPoints: ['Pardi Octroi Naka', 'Wardhaman Nagar Square'],
  },
];

export function getSignalsForRoute(routeRoads: string[]): NagpurSignal[] {
  return INITIAL_NAGPUR_SIGNALS.filter(sig => 
    routeRoads.some(r => sig.road.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(sig.road.toLowerCase()))
  );
}

// Siren sound synthesizer using Web Audio API
let audioCtx: AudioContext | null = null;
let sirenOsc: OscillatorNode | null = null;
let sirenGain: GainNode | null = null;
let sirenInterval: any = null;

export function playEmergencySiren(durationSec = 5) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (sirenOsc) {
      stopEmergencySiren();
    }

    sirenOsc = audioCtx.createOscillator();
    sirenGain = audioCtx.createGain();

    sirenOsc.type = 'sawtooth';
    sirenGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

    sirenOsc.connect(sirenGain);
    sirenGain.connect(audioCtx.destination);

    sirenOsc.start();

    let high = true;
    sirenInterval = setInterval(() => {
      if (!sirenOsc || !audioCtx) return;
      sirenOsc.frequency.setTargetAtTime(high ? 960 : 640, audioCtx.currentTime, 0.15);
      high = !high;
    }, 450);

    setTimeout(() => {
      stopEmergencySiren();
    }, durationSec * 1000);
  } catch (err) {
    console.warn('Audio siren error', err);
  }
}

export function stopEmergencySiren() {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (sirenOsc) {
    try {
      sirenOsc.stop();
      sirenOsc.disconnect();
    } catch (e) {}
    sirenOsc = null;
  }
}
