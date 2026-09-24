import React, { useState } from 'react';
import { NagpurRoad, TrafficStatus, NagpurIncident } from '../types';
import {
  Activity,
  Gauge,
  AlertTriangle,
  Route,
  Radio,
  Search,
  CheckCircle2,
  ShieldAlert,
  Siren,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface LiveTrafficViewProps {
  roads: NagpurRoad[];
  incidents: NagpurIncident[];
  isDemoMode: boolean;
  onSelectRoad: (road: NagpurRoad) => void;
  onNavigateToPrediction: (roadName: string) => void;
}

export const LiveTrafficView: React.FC<LiveTrafficViewProps> = ({
  roads,
  incidents,
  isDemoMode,
  onSelectRoad,
  onNavigateToPrediction,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoadModal, setSelectedRoadModal] = useState<NagpurRoad | null>(null);

  const filteredRoads = roads.filter((road) => {
    const matchesSearch =
      road.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      road.areasCovered.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || road.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const heavyCount = roads.filter((r) => r.status === 'HEAVY').length;
  const modCount = roads.filter((r) => r.status === 'MODERATE').length;
  const lightCount = roads.filter((r) => r.status === 'LIGHT').length;

  const totalIncidentsCount = incidents.length;
  const avgSpeed = Math.round(roads.reduce((a, r) => a + r.currentSpeed, 0) / (roads.length || 1));
  const estimatedVehicles = 42800;

  return (
    <div id="live-traffic-container" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141418] via-[#101014] to-[#0D0D10] p-6 rounded-2xl border border-[#222228] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#E5C07B] font-bold text-xs border border-[#C5A059]/30">
                NAGPUR ARTERIAL MONITOR
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded font-bold border ${
                  isDemoMode
                    ? 'bg-[#C5A059]/10 text-[#E5C07B] border-[#C5A059]/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {isDemoMode ? 'DEMO SIMULATION' : 'LIVE TOMTOM/RTMC FEED'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              Nagpur Live Traffic Monitor
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Real-time traffic velocity, density saturation, and bottleneck diagnostics across all major roads and transit corridors in Nagpur.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-[#16161C] border border-[#282832] text-center">
              <span className="text-xs text-zinc-400 block">Avg City Speed</span>
              <span className="text-lg font-black text-[#E5C07B]">{avgSpeed} <span className="text-xs font-normal text-zinc-400">km/h</span></span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#16161C] border border-[#282832] text-center">
              <span className="text-xs text-zinc-400 block">Active Corridors</span>
              <span className="text-lg font-black text-white">{roads.length}</span>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="live-traffic-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Nagpur road name or covered area..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0A0A0C] border border-[#282832] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A059] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'ALL', label: `All Roads (${roads.length})` },
              { id: 'HEAVY', label: `Heavy (${heavyCount})`, color: 'text-red-400' },
              { id: 'MODERATE', label: `Moderate (${modCount})`, color: 'text-[#E5C07B]' },
              { id: 'LIGHT', label: `Light (${lightCount})`, color: 'text-emerald-400' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === f.id
                    ? 'bg-[#C5A059] text-black font-bold shadow-md shadow-[#C5A059]/10'
                    : 'bg-[#16161C] hover:bg-[#1E1E26] text-zinc-300 border border-[#282832]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Road Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoads.map((road) => {
          const isHeavy = road.status === 'HEAVY';
          const isMod = road.status === 'MODERATE';

          return (
            <div
              key={road.id}
              onClick={() => setSelectedRoadModal(road)}
              className={`p-5 rounded-2xl bg-[#111115] border transition-all cursor-pointer hover:border-[#C5A059]/50 shadow-xl flex flex-col justify-between ${
                isHeavy
                  ? 'border-red-500/30 hover:border-red-400'
                  : isMod
                  ? 'border-[#C5A059]/30 hover:border-[#C5A059]'
                  : 'border-[#222228] hover:border-emerald-500/40'
              }`}
            >
              <div>
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-[#18181E] border border-[#222228]">
                    {road.lengthKm} km • {road.signalsCount} Signals
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isHeavy
                        ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                        : isMod
                        ? 'bg-[#C5A059]/15 text-[#E5C07B] border border-[#C5A059]/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {road.status} ({road.currentSpeed} km/h)
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-2 truncate">{road.name}</h3>
                <p className="text-[11px] text-zinc-400 font-mono">{road.codeName || 'Nagpur Arterial'}</p>

                {/* Progress bar for traffic density */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Traffic Density Load</span>
                    <span className="font-bold text-white">{road.trafficDensity}%</span>
                  </div>
                  <div className="w-full bg-[#18181E] rounded-full h-2 overflow-hidden border border-[#222228]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHeavy ? 'bg-red-500' : isMod ? 'bg-[#C5A059]' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${road.trafficDensity}%` }}
                    ></div>
                  </div>
                </div>

                {/* Speed vs Freeflow */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="p-2.5 bg-[#17171E] border border-[#222228] rounded-xl">
                    <span className="text-[10px] text-zinc-400 block">Current Velocity</span>
                    <span className="text-sm font-black text-white">{road.currentSpeed} km/h</span>
                  </div>
                  <div className="p-2.5 bg-[#17171E] border border-[#222228] rounded-xl">
                    <span className="text-[10px] text-zinc-400 block">Free-Flow Velocity</span>
                    <span className="text-sm font-black text-zinc-300">{road.freeFlowSpeed} km/h</span>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="mt-3 flex items-center justify-between p-2 rounded-xl bg-[#17171E] border border-[#222228] text-xs">
                  <span className="text-zinc-400">Calculated Risk Index:</span>
                  <span
                    className={`font-black ${
                      road.riskLevel === 'HIGH'
                        ? 'text-red-400'
                        : road.riskLevel === 'MEDIUM'
                        ? 'text-[#E5C07B]'
                        : 'text-emerald-400'
                    }`}
                  >
                    {road.riskScore}/100 ({road.riskLevel})
                  </span>
                </div>

                <div className="mt-2 text-[11px] text-zinc-400">
                  <span className="text-zinc-500">Passing Areas:</span>{' '}
                  <span className="text-zinc-300">{road.areasCovered.join(', ')}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-[#1F1F24] flex items-center justify-between">
                <span className="text-[10px] text-zinc-500">
                  {road.activeIncidents > 0 ? (
                    <span className="text-red-400 font-bold">⚠️ {road.activeIncidents} Incidents</span>
                  ) : (
                    'No active incidents'
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToPrediction(road.name);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#C5A059]/20 text-[#E5C07B] hover:bg-[#C5A059]/30 border border-[#C5A059]/40 font-semibold transition-colors"
                  >
                    Simulate ML
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRoad(road);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#18181E] hover:bg-[#22222A] text-zinc-200 border border-[#282832] font-semibold transition-colors"
                  >
                    Map
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Road Inspection Modal */}
      {selectedRoadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111115] border border-[#282832] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F1F24] pb-3">
              <div>
                <span className="text-xs font-mono text-[#E5C07B]">Nagpur Road Telemetry</span>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Route className="w-5 h-5 text-[#C5A059]" />
                  <span>{selectedRoadModal.name}</span>
                </h2>
              </div>
              <button
                onClick={() => setSelectedRoadModal(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg bg-[#18181E] border border-[#282832]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#17171E] border border-[#222228] rounded-xl">
                <span className="text-zinc-400 block text-[10px]">Traffic Status</span>
                <span className="text-lg font-black text-white">{selectedRoadModal.status}</span>
                <span className="text-[11px] text-zinc-400 block">
                  {selectedRoadModal.currentSpeed} km/h (Limit: {selectedRoadModal.freeFlowSpeed})
                </span>
              </div>
              <div className="p-3 bg-[#17171E] border border-[#222228] rounded-xl">
                <span className="text-zinc-400 block text-[10px]">Accident Risk Score</span>
                <span className="text-lg font-black text-[#E5C07B]">{selectedRoadModal.riskScore}/100</span>
                <span className="text-[11px] text-zinc-400 block">Level: {selectedRoadModal.riskLevel}</span>
              </div>
              <div className="p-3 bg-[#17171E] border border-[#222228] rounded-xl">
                <span className="text-zinc-400 block text-[10px]">Congestion Index</span>
                <span className="text-lg font-black text-white">{selectedRoadModal.congestionIndex}%</span>
              </div>
              <div className="p-3 bg-[#17171E] border border-[#222228] rounded-xl">
                <span className="text-zinc-400 block text-[10px]">Weather Hazard</span>
                <span className="text-lg font-black text-sky-400">{selectedRoadModal.weatherImpact}</span>
              </div>
            </div>

            <div className="text-xs space-y-1.5 text-zinc-300">
              <p>
                <strong className="text-zinc-400">Covered Municipal Areas:</strong> {selectedRoadModal.areasCovered.join(', ')}
              </p>
              <p>
                <strong className="text-zinc-400">Emergency Priority Lane:</strong>{' '}
                <span className="text-emerald-400 font-semibold">
                  {selectedRoadModal.emergencyLaneAvailable ? 'Designated & Available' : 'No Dedicated Lane'}
                </span>
              </p>
              <p>
                <strong className="text-zinc-400">Active RTMC Signals:</strong> {selectedRoadModal.signalsCount} Intelligent Intersection Controllers
              </p>
            </div>

            <div className="pt-3 border-t border-[#1F1F24] flex gap-2 justify-end">
              <button
                onClick={() => {
                  onSelectRoad(selectedRoadModal);
                  setSelectedRoadModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#18181E] hover:bg-[#22222A] text-zinc-200 text-xs font-semibold border border-[#282832] transition-colors"
              >
                Show on Nagpur Map
              </button>
              <button
                onClick={() => {
                  onNavigateToPrediction(selectedRoadModal.name);
                  setSelectedRoadModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-black text-xs font-bold transition-all"
              >
                Run ML Risk Predictor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
