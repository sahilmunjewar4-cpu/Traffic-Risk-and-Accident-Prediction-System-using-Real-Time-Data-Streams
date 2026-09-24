import React, { useState } from 'react';
import { NagpurArea, NagpurRoad } from '../types';
import {
  Search,
  MapPin,
  Route,
  Activity,
  AlertTriangle,
  Siren,
  CloudRain,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface NagpurAreasViewProps {
  areas: NagpurArea[];
  roads: NagpurRoad[];
  onSelectArea: (area: NagpurArea) => void;
  onNavigateToPrediction: (areaName: string) => void;
}

export const NagpurAreasView: React.FC<NagpurAreasViewProps> = ({
  areas,
  roads,
  onSelectArea,
  onNavigateToPrediction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [detailedArea, setDetailedArea] = useState<NagpurArea | null>(null);

  const zones = ['ALL', 'Central', 'South', 'North', 'East', 'West', 'Industrial'];

  const filteredAreas = areas.filter((area) => {
    const matchesSearch =
      area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.nearbyRoads.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      area.nearbyJunctions.some((j) => j.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesZone = selectedZone === 'ALL' || area.zone === selectedZone;
    const matchesRisk = selectedRiskFilter === 'ALL' || area.riskLevel === selectedRiskFilter;

    return matchesSearch && matchesZone && matchesRisk;
  });

  return (
    <div id="nagpur-areas-container" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141418] via-[#101014] to-[#0D0D10] p-6 rounded-2xl border border-[#222228] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#E5C07B] font-bold text-xs border border-[#C5A059]/30">
                NAGPUR LOCALITY MONITORING
              </span>
              <span className="text-xs text-zinc-500 font-mono">41 Monitored Nodes</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              Nagpur Areas & Arterial Hubs
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Granular traffic density, accident risk indexes, and junction status across all 41 municipal sectors of Nagpur, Maharashtra.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-xl bg-[#16161C] border border-[#282832] text-center">
              <span className="text-xs text-zinc-400 block">Total Areas</span>
              <span className="text-lg font-black text-white">{areas.length}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
              <span className="text-xs text-red-300 block">High Risk Areas</span>
              <span className="text-lg font-black text-red-400">
                {areas.filter((a) => a.riskLevel === 'HIGH').length}
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="nagpur-area-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Nagpur area, road or junction..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0A0C] border border-[#282832] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A059] transition-colors"
            />
          </div>

          {/* Zone Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
            {zones.map((z) => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedZone === z
                    ? 'bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/10 font-bold'
                    : 'bg-[#16161C] hover:bg-[#1E1E26] text-zinc-300 border border-[#282832]'
                }`}
              >
                {z === 'ALL' ? 'All Zones' : `${z} Nagpur`}
              </button>
            ))}
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5 justify-end">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedRiskFilter(lvl)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedRiskFilter === lvl
                    ? lvl === 'HIGH'
                      ? 'bg-red-500 text-white font-bold'
                      : lvl === 'MEDIUM'
                      ? 'bg-[#C5A059] text-black font-bold'
                      : lvl === 'LOW'
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'bg-zinc-100 text-black font-bold'
                    : 'bg-[#16161C] hover:bg-[#1E1E26] text-zinc-300 border border-[#282832]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAreas.map((area) => {
          const isHigh = area.riskLevel === 'HIGH';
          const isMed = area.riskLevel === 'MEDIUM';

          return (
            <div
              key={area.id}
              onClick={() => setDetailedArea(area)}
              className={`p-4 rounded-2xl bg-[#111115] border transition-all cursor-pointer hover:border-[#C5A059]/50 shadow-lg flex flex-col justify-between ${
                isHigh
                  ? 'border-red-500/30 hover:border-red-400'
                  : isMed
                  ? 'border-[#C5A059]/30 hover:border-[#C5A059]'
                  : 'border-[#222228] hover:border-emerald-500/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-[#18181E] border border-[#222228]">
                    {area.zone} Zone
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isHigh
                        ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                        : isMed
                        ? 'bg-[#C5A059]/15 text-[#E5C07B] border border-[#C5A059]/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    Risk Score: {area.riskScore}/100 ({area.riskLevel})
                  </span>
                </div>

                <h3 className="text-base font-bold text-white flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{area.name}</span>
                </h3>

                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                  {area.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div className="bg-[#17171E] p-2.5 rounded-xl border border-[#222228] text-center">
                    <span className="text-[10px] text-zinc-400 block">Avg Speed</span>
                    <span className="font-bold text-white text-sm">{area.avgSpeed} <span className="text-[9px] font-normal text-zinc-400">km/h</span></span>
                  </div>
                  <div className="bg-[#17171E] p-2.5 rounded-xl border border-[#222228] text-center">
                    <span className="text-[10px] text-zinc-400 block">Density</span>
                    <span className="font-bold text-white text-sm">{area.trafficDensity}%</span>
                  </div>
                  <div className="bg-[#17171E] p-2.5 rounded-xl border border-[#222228] text-center">
                    <span className="text-[10px] text-zinc-400 block">Incidents</span>
                    <span
                      className={`font-bold text-sm ${
                        area.incidentsCount > 0 ? 'text-red-400' : 'text-zinc-300'
                      }`}
                    >
                      {area.incidentsCount}
                    </span>
                  </div>
                </div>

                {/* Nearby Roads */}
                <div className="mt-3 text-[11px] text-zinc-400">
                  <span className="text-zinc-500">Connected Arteries:</span>{' '}
                  <span className="text-zinc-300 font-medium">{area.nearbyRoads.join(', ')}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-[#1F1F24] flex items-center justify-between">
                <span className="text-[10px] text-zinc-500">Updated {area.lastUpdated}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToPrediction(area.name);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#C5A059]/20 text-[#E5C07B] hover:bg-[#C5A059]/30 border border-[#C5A059]/40 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Predict Risk</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectArea(area);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#18181E] hover:bg-[#22222A] text-zinc-200 border border-[#282832] font-semibold transition-colors"
                  >
                    View Map
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Area Inspection Modal */}
      {detailedArea && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111115] border border-[#282832] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F1F24] pb-3">
              <div>
                <span className="text-xs font-mono text-[#E5C07B]">{detailedArea.zone} Zone, Nagpur</span>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#C5A059]" />
                  <span>{detailedArea.name}</span>
                </h2>
              </div>
              <button
                onClick={() => setDetailedArea(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg bg-[#18181E] border border-[#282832]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#17171E] border border-[#222228] rounded-xl">
                <span className="text-zinc-400 block text-[10px]">Accident Risk Score</span>
                <span className="text-lg font-black text-[#E5C07B]">{detailedArea.riskScore}/100</span>
                <span className="text-[11px] text-zinc-400 block">Level: {detailedArea.riskLevel}</span>
              </div>
              <div className="p-3 bg-[#17171E] border border-[#222228] rounded-xl">
                <span className="text-zinc-400 block text-[10px]">Traffic Congestion</span>
                <span className="text-lg font-black text-white">{detailedArea.trafficLevel}</span>
                <span className="text-[11px] text-zinc-400 block">{detailedArea.trafficDensity}% Density Load</span>
              </div>
              <div className="p-3 bg-[#17171E] border border-[#222228] rounded-xl">
                <span className="text-zinc-400 block text-[10px]">Velocity Baseline</span>
                <span className="text-lg font-black text-white">{detailedArea.avgSpeed} km/h</span>
              </div>
              <div className="p-3 bg-[#17171E] border border-[#222228] rounded-xl">
                <span className="text-zinc-400 block text-[10px]">Weather State</span>
                <span className="text-lg font-black text-sky-400">{detailedArea.weather}</span>
              </div>
            </div>

            <div className="text-xs space-y-2 text-zinc-300">
              <p>
                <strong className="text-zinc-400">Connected Nagpur Roads:</strong> {detailedArea.nearbyRoads.join(', ')}
              </p>
              <p>
                <strong className="text-zinc-400">Key Junctions & Intersections:</strong> {detailedArea.nearbyJunctions.join(', ')}
              </p>
              <p>
                <strong className="text-zinc-400">Emergency Corridor Status:</strong>{' '}
                <span className={detailedArea.emergencyActive ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {detailedArea.emergencyActive ? 'Priority Routing Active' : 'Clear / Standby'}
                </span>
              </p>
            </div>

            <div className="pt-3 border-t border-[#1F1F24] flex gap-2 justify-end">
              <button
                onClick={() => {
                  onSelectArea(detailedArea);
                  setDetailedArea(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#18181E] hover:bg-[#22222A] text-zinc-200 text-xs font-semibold border border-[#282832] transition-colors"
              >
                Focus on Map
              </button>
              <button
                onClick={() => {
                  onNavigateToPrediction(detailedArea.name);
                  setDetailedArea(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-black text-xs font-bold transition-all"
              >
                Run ML Risk Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
