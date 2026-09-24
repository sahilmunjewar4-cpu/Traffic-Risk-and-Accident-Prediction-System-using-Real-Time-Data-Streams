import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { NagpurRoad, NagpurIncident, NagpurSignal, NagpurArea } from '../types';
import { NAGPUR_CONFIG } from '../config/nagpur';
import { EmergencyPreset } from '../services/emergencyRouting';
import { AlertCircle, AlertTriangle, ShieldAlert, Siren, Crosshair, Navigation, Layers } from 'lucide-react';

// Fix standard Leaflet default icon issues in bundler
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom HTML Pin Generators
const createRiskIcon = (level: 'LOW' | 'MEDIUM' | 'HIGH', label: string) => {
  const bg =
    level === 'HIGH'
      ? 'bg-red-500 border-red-300 shadow-red-500/50'
      : level === 'MEDIUM'
      ? 'bg-amber-500 border-amber-300 shadow-amber-500/50'
      : 'bg-emerald-500 border-emerald-300 shadow-emerald-500/50';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${bg} border shadow-lg whitespace-nowrap -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110">
      <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
      <span>${label}</span>
    </div>`,
    iconSize: [80, 24],
    iconAnchor: [40, 12],
  });
};

const createIncidentIcon = (severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'MINOR') => {
  const isCrit = severity === 'CRITICAL' || severity === 'HIGH';
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="w-7 h-7 rounded-full ${
      isCrit ? 'bg-red-600 border-2 border-white animate-bounce' : 'bg-amber-600 border-2 border-white'
    } flex items-center justify-center text-white shadow-xl cursor-pointer text-xs font-black">
      !
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const createSignalIcon = (state: 'RED' | 'GREEN' | 'AMBER', priority: boolean) => {
  const color =
    state === 'GREEN' ? 'bg-emerald-500' : state === 'AMBER' ? 'bg-amber-500' : 'bg-red-500';
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="w-5 h-5 rounded-full bg-slate-900 border-2 ${
      priority ? 'border-cyan-400 ring-2 ring-cyan-400/80 animate-pulse' : 'border-slate-500'
    } flex items-center justify-center">
      <div class="w-2.5 h-2.5 rounded-full ${color}"></div>
    </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const createHospitalIcon = (name: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 rounded-md border border-blue-300 text-[10px] font-bold shadow-lg -translate-x-1/2 -translate-y-1/2">
      <span class="text-xs">🏥</span>
      <span>${name}</span>
    </div>`,
    iconSize: [90, 22],
    iconAnchor: [45, 11],
  });
};

const createEmergencyVehicleMarker = (vehicleType: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="relative flex items-center justify-center w-10 h-10 -translate-x-1/2 -translate-y-1/2">
      <span class="absolute w-10 h-10 rounded-full bg-red-500/40 animate-ping"></span>
      <span class="absolute w-8 h-8 rounded-full bg-red-500/80 animate-pulse"></span>
      <div class="relative z-10 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-sm shadow-2xl border-2 border-white font-bold">
        🚨
      </div>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Map View Controller Helper
function MapFlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

interface NagpurMapProps {
  roads: NagpurRoad[];
  incidents: NagpurIncident[];
  signals: NagpurSignal[];
  areas: NagpurArea[];
  activeEmergency: EmergencyPreset | null;
  selectedRoadName?: string;
  selectedAreaName?: string;
  onSelectRoad?: (road: NagpurRoad) => void;
  onSelectIncident?: (incident: NagpurIncident) => void;
  onSelectArea?: (area: NagpurArea) => void;
}

export const NagpurMap: React.FC<NagpurMapProps> = ({
  roads,
  incidents,
  signals,
  areas,
  activeEmergency,
  selectedRoadName,
  selectedAreaName,
  onSelectRoad,
  onSelectIncident,
  onSelectArea,
}) => {
  const [showRoads, setShowRoads] = React.useState(true);
  const [showIncidents, setShowIncidents] = React.useState(true);
  const [showSignals, setShowSignals] = React.useState(true);
  const [showAreas, setShowAreas] = React.useState(true);
  const [showHospitals, setShowHospitals] = React.useState(true);

  // Map center calculation
  const defaultCenter: [number, number] = [NAGPUR_CONFIG.latitude, NAGPUR_CONFIG.longitude];
  const [mapCenter, setMapCenter] = React.useState<[number, number]>(defaultCenter);
  const [mapZoom, setMapZoom] = React.useState<number>(13);

  // Vehicle progress simulation on emergency corridor
  const [vehicleProgressIndex, setVehicleProgressIndex] = React.useState<number>(0);

  useEffect(() => {
    if (!activeEmergency) return;
    const interval = setInterval(() => {
      setVehicleProgressIndex((prev) => (prev + 1) % activeEmergency.routePath.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [activeEmergency]);

  // Center on selected area
  useEffect(() => {
    if (selectedAreaName && selectedAreaName !== 'All Areas') {
      const area = areas.find((a) => a.name === selectedAreaName);
      if (area) {
        setMapCenter([area.lat, area.lng]);
        setMapZoom(14);
      }
    } else if (selectedRoadName && selectedRoadName !== 'All Roads') {
      const road = roads.find((r) => r.name === selectedRoadName);
      if (road && road.coordinates.length > 0) {
        setMapCenter(road.coordinates[Math.floor(road.coordinates.length / 2)]);
        setMapZoom(13);
      }
    } else {
      setMapCenter(defaultCenter);
      setMapZoom(13);
    }
  }, [selectedAreaName, selectedRoadName, areas, roads]);

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden border border-[#222228] shadow-2xl bg-[#0A0A0B]">
      {/* Map Layer Controls floating bar */}
      <div className="absolute top-4 right-4 z-[1000] bg-[#111115]/95 backdrop-blur-md border border-[#282832] rounded-xl p-2 shadow-2xl flex flex-wrap gap-2 text-[11px] font-medium text-zinc-300">
        <button
          id="toggle-roads-layer"
          onClick={() => setShowRoads(!showRoads)}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            showRoads ? 'bg-[#C5A059]/20 text-[#E5C07B] border border-[#C5A059]/40' : 'bg-[#18181E] text-zinc-400 border border-transparent'
          }`}
        >
          🛣️ Roads ({roads.length})
        </button>
        <button
          id="toggle-incidents-layer"
          onClick={() => setShowIncidents(!showIncidents)}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            showIncidents ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-[#18181E] text-zinc-400 border border-transparent'
          }`}
        >
          ⚠️ Incidents ({incidents.length})
        </button>
        <button
          id="toggle-signals-layer"
          onClick={() => setShowSignals(!showSignals)}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            showSignals ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-[#18181E] text-zinc-400 border border-transparent'
          }`}
        >
          🚦 Signals ({signals.length})
        </button>
        <button
          id="toggle-areas-layer"
          onClick={() => setShowAreas(!showAreas)}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            showAreas ? 'bg-[#C5A059]/20 text-[#E5C07B] border border-[#C5A059]/40' : 'bg-[#18181E] text-zinc-400 border border-transparent'
          }`}
        >
          📍 Areas
        </button>
        <button
          id="toggle-hospitals-layer"
          onClick={() => setShowHospitals(!showHospitals)}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            showHospitals ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-[#18181E] text-zinc-400 border border-transparent'
          }`}
        >
          🏥 Hospitals
        </button>
        <button
          id="reset-map-view"
          onClick={() => {
            setMapCenter(defaultCenter);
            setMapZoom(13);
          }}
          className="px-2 py-1 rounded-lg bg-[#18181E] hover:bg-[#22222A] text-zinc-200 border border-[#282832] flex items-center gap-1 transition-colors"
          title="Reset Nagpur City View"
        >
          <Crosshair className="w-3 h-3 text-[#C5A059]" />
          <span>Reset</span>
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-[#111115]/95 backdrop-blur-md border border-[#282832] rounded-xl p-3 shadow-2xl text-[11px] text-zinc-300 space-y-1.5 pointer-events-auto">
        <div className="font-bold text-white flex items-center justify-between gap-4 border-b border-[#222228] pb-1">
          <span>Nagpur Traffic Risk Matrix</span>
          <span className="text-[10px] text-[#E5C07B] font-mono">RTMC v2.4</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded-full bg-emerald-400"></span>
          <span>Low Risk (0–39 score / &gt;50 km/h)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded-full bg-[#C5A059]"></span>
          <span>Medium Risk (40–69 score / 20–50 km/h)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded-full bg-red-500"></span>
          <span>High Risk (70–100 score / &lt;20 km/h)</span>
        </div>
        {activeEmergency && (
          <div className="flex items-center gap-2 pt-1 border-t border-[#222228] text-sky-300 font-semibold">
            <span className="w-3 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
            <span>Active Emergency Green Wave</span>
          </div>
        )}
      </div>

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <MapFlyTo center={mapCenter} zoom={mapZoom} />

        {/* High-contrast CartoDB Dark Matter / OSM Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Nagpur City Boundary Circle Accent */}
        <CircleMarker
          center={defaultCenter}
          radius={120}
          pathOptions={{
            color: '#C5A059',
            fillColor: '#C5A059',
            fillOpacity: 0.02,
            weight: 1,
            dashArray: '4, 8',
          }}
        />

        {/* Road Polylines */}
        {showRoads &&
          roads.map((road) => {
            const isSelected = selectedRoadName === road.name;
            const color =
              road.riskLevel === 'HIGH'
                ? '#ef4444'
                : road.riskLevel === 'MEDIUM'
                ? '#C5A059'
                : '#10b981';

            return (
              <React.Fragment key={road.id}>
                {/* Glow polyline for selected road */}
                {isSelected && (
                  <Polyline
                    positions={road.coordinates}
                    pathOptions={{
                      color: '#ffffff',
                      weight: 10,
                      opacity: 0.5,
                      lineCap: 'round',
                    }}
                  />
                )}
                <Polyline
                  positions={road.coordinates}
                  pathOptions={{
                    color,
                    weight: isSelected ? 7 : 5,
                    opacity: 0.9,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                  eventHandlers={{
                    click: () => onSelectRoad && onSelectRoad(road),
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 text-zinc-100">
                      <div className="font-extrabold text-sm border-b border-[#282832] pb-1 mb-1 text-white">{road.name}</div>
                      <div className="text-xs space-y-0.5">
                        <p>
                          <strong className="text-zinc-400">Speed:</strong> {road.currentSpeed} km/h (Free flow: {road.freeFlowSpeed})
                        </p>
                        <p>
                          <strong className="text-zinc-400">Density:</strong> {road.trafficDensity}% | <strong className="text-zinc-400">Risk:</strong>{' '}
                          <span
                            className={
                              road.riskLevel === 'HIGH'
                                ? 'text-red-400 font-bold'
                                : road.riskLevel === 'MEDIUM'
                                ? 'text-[#E5C07B] font-bold'
                                : 'text-emerald-400 font-bold'
                            }
                          >
                            {road.riskScore}/100 ({road.riskLevel})
                          </span>
                        </p>
                        <p>
                          <strong className="text-zinc-400">Status:</strong> {road.status} | <strong className="text-zinc-400">Incidents:</strong>{' '}
                          {road.activeIncidents}
                        </p>
                        <p className="text-zinc-400">
                          <strong>Areas:</strong> {road.areasCovered.slice(0, 4).join(', ')}...
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Polyline>
              </React.Fragment>
            );
          })}

        {/* Emergency Corridor Active Wave Polyline */}
        {activeEmergency && (
          <>
            <Polyline
              positions={activeEmergency.routePath}
              pathOptions={{
                color: '#38bdf8',
                weight: 8,
                opacity: 0.95,
                dashArray: '8, 8',
                lineCap: 'round',
              }}
            />
            {/* Animated Emergency Vehicle Marker */}
            {activeEmergency.routePath[vehicleProgressIndex] && (
              <Marker
                position={activeEmergency.routePath[vehicleProgressIndex]}
                icon={createEmergencyVehicleMarker(activeEmergency.vehicleType)}
              >
                <Popup>
                  <div className="p-2 text-zinc-100 text-xs">
                    <div className="font-bold text-red-400 flex items-center gap-1">
                      🚨 {activeEmergency.vehicleNumber}
                    </div>
                    <p className="mt-1">
                      <strong className="text-zinc-400">To:</strong> {activeEmergency.destinationName}
                    </p>
                    <p>
                      <strong className="text-zinc-400">Priority ETA:</strong> {activeEmergency.greenWaveEtaMin} mins (Saved{' '}
                      {activeEmergency.timeSavedMin} mins)
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </>
        )}

        {/* Incident Markers */}
        {showIncidents &&
          incidents.map((inc) => (
            <Marker
              key={inc.id}
              position={[inc.lat, inc.lng]}
              icon={createIncidentIcon(inc.severity)}
              eventHandlers={{
                click: () => onSelectIncident && onSelectIncident(inc),
              }}
            >
              <Popup>
                <div className="p-2 text-zinc-100 text-xs">
                  <div className="font-bold text-red-400 border-b border-[#282832] pb-1 flex items-center justify-between">
                    <span>{inc.type}</span>
                    <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-mono border border-red-500/30">
                      {inc.severity}
                    </span>
                  </div>
                  <p className="font-semibold text-white mt-1">{inc.title}</p>
                  <p className="text-zinc-300 mt-0.5">
                    <strong className="text-zinc-400">Road:</strong> {inc.road} ({inc.area})
                  </p>
                  <p className="text-zinc-300">
                    <strong className="text-zinc-400">Delay:</strong> {inc.trafficImpact}
                  </p>
                  <p className="text-zinc-400 text-[11px] mt-1 italic">{inc.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Traffic Signals */}
        {showSignals &&
          signals.map((sig) => {
            const isPriority = sig.priorityStatus === 'GREEN_WAVE_ACTIVE';
            return (
              <Marker
                key={sig.id}
                position={[sig.lat, sig.lng]}
                icon={createSignalIcon(sig.currentState, isPriority)}
              >
                <Popup>
                  <div className="p-2 text-zinc-100 text-xs">
                    <div className="font-bold flex items-center justify-between border-b border-[#282832] pb-1 text-white">
                      <span>{sig.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          sig.currentState === 'GREEN'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : sig.currentState === 'AMBER'
                            ? 'bg-[#C5A059]/20 text-[#E5C07B] border border-[#C5A059]/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {sig.currentState}
                      </span>
                    </div>
                    <p className="mt-1">
                      <strong className="text-zinc-400">Junction:</strong> {sig.junctionName}
                    </p>
                    <p>
                      <strong className="text-zinc-400">Queue:</strong> ~{sig.queueLengthMeters} meters
                    </p>
                    <p>
                      <strong className="text-zinc-400">Green Wave State:</strong>{' '}
                      <span className="text-emerald-400 font-bold">{sig.recommendedState}</span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Major Nagpur Hospitals */}
        {showHospitals &&
          NAGPUR_CONFIG.hospitals.map((hosp) => (
            <Marker
              key={hosp.id}
              position={[hosp.lat, hosp.lng]}
              icon={createHospitalIcon(hosp.name)}
            >
              <Popup>
                <div className="p-1.5 text-zinc-100 text-xs">
                  <div className="font-bold text-sky-400">{hosp.name}</div>
                  <p className="text-[11px] text-zinc-400">Nagpur Emergency Trauma Node ({hosp.area})</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Nagpur Areas Markers */}
        {showAreas &&
          areas.map((area) => (
            <Marker
              key={area.id}
              position={[area.lat, area.lng]}
              icon={createRiskIcon(area.riskLevel, `${area.name} (${area.riskScore})`)}
              eventHandlers={{
                click: () => onSelectArea && onSelectArea(area),
              }}
            >
              <Popup>
                <div className="p-2 text-zinc-100 text-xs">
                  <div className="font-bold text-sm border-b border-[#282832] pb-1 mb-1 flex items-center justify-between text-white">
                    <span>{area.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{area.zone} Zone</span>
                  </div>
                  <p>
                    <strong className="text-zinc-400">Risk Score:</strong>{' '}
                    <span className="font-bold text-white">{area.riskScore}/100</span> ({area.riskLevel})
                  </p>
                  <p>
                    <strong className="text-zinc-400">Avg Speed:</strong> {area.avgSpeed} km/h | <strong className="text-zinc-400">Density:</strong>{' '}
                    {area.trafficDensity}%
                  </p>
                  <p>
                    <strong className="text-zinc-400">Nearby Roads:</strong> {area.nearbyRoads.join(', ')}
                  </p>
                  {area.incidentsCount > 0 && (
                    <p className="text-red-400 font-semibold mt-1">
                      ⚠️ {area.incidentsCount} active incident(s) reported
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};
