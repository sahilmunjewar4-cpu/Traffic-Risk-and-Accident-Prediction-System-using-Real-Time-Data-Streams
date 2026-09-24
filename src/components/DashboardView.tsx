import React from 'react';
import {
  NagpurRoad,
  NagpurIncident,
  NagpurSignal,
  NagpurArea,
  NagpurWeatherReport,
  NagpurAlert,
} from '../types';
import { NagpurMap } from './NagpurMap';
import { EmergencyPreset } from '../services/emergencyRouting';
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  Gauge,
  CloudRain,
  Siren,
  ChevronRight,
  TrendingUp,
  Radio,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

interface DashboardViewProps {
  roads: NagpurRoad[];
  incidents: NagpurIncident[];
  signals: NagpurSignal[];
  areas: NagpurArea[];
  weather: NagpurWeatherReport;
  alerts: NagpurAlert[];
  activeEmergency: EmergencyPreset | null;
  onNavigateToTab: (tab: any) => void;
  onSelectRoad: (road: NagpurRoad) => void;
  onSelectIncident: (incident: NagpurIncident) => void;
  onSelectArea: (area: NagpurArea) => void;
  selectedRoadName: string;
  selectedAreaName: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  roads,
  incidents,
  signals,
  areas,
  weather,
  alerts,
  activeEmergency,
  onNavigateToTab,
  onSelectRoad,
  onSelectIncident,
  onSelectArea,
  selectedRoadName,
  selectedAreaName,
}) => {
  // Compute Nagpur Risk Metrics
  const lowRiskRoads = roads.filter((r) => r.riskLevel === 'LOW').length;
  const medRiskRoads = roads.filter((r) => r.riskLevel === 'MEDIUM').length;
  const highRiskRoads = roads.filter((r) => r.riskLevel === 'HIGH').length;

  const lowRiskAreas = areas.filter((a) => a.riskLevel === 'LOW').length;
  const medRiskAreas = areas.filter((a) => a.riskLevel === 'MEDIUM').length;
  const highRiskAreas = areas.filter((a) => a.riskLevel === 'HIGH').length;

  const activeIncidentsCount = incidents.filter((i) => i.status === 'ACTIVE').length;
  const respondingIncidentsCount = incidents.filter((i) => i.status === 'RESPONDING').length;
  const resolvedCount = 8; // demonstration baseline

  const avgNagpurSpeed = Math.round(
    roads.reduce((acc, r) => acc + r.currentSpeed, 0) / (roads.length || 1)
  );
  const avgNagpurDensity = Math.round(
    roads.reduce((acc, r) => acc + r.trafficDensity, 0) / (roads.length || 1)
  );

  // Chart dataset for Nagpur roads speed vs density
  const roadChartData = roads.map((r) => ({
    name: r.name.split(' (')[0].replace('Road', 'Rd'),
    Speed: r.currentSpeed,
    Density: r.trafficDensity,
    RiskScore: r.riskScore,
  }));

  return (
    <div id="dashboard-view-container" className="space-y-6 pb-12">
      {/* Top Banner / Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#141418] via-[#101014] to-[#0D0D10] p-6 rounded-2xl border border-[#222228] shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#E5C07B] font-bold text-xs border border-[#C5A059]/30">
              NAGPUR METROPOLITAN REGION
            </span>
            <span className="text-xs text-zinc-500 font-mono">RTMC Command Center</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Nagpur Traffic & Accident Risk Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time traffic risk analysis, AI accident prediction, and emergency green-wave management for Nagpur, Maharashtra.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTab('emergency')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-semibold text-xs shadow-md shadow-red-600/20 transition-all"
          >
            <Siren className="w-4 h-4" />
            <span>Green Wave Corridor</span>
          </button>
          <button
            onClick={() => onNavigateToTab('prediction')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-black font-semibold text-xs shadow-md shadow-[#C5A059]/10 transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            <span>ML Accident Predictor</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Low Risk */}
        <div className="bg-[#111115] border border-[#222228] rounded-2xl p-4 shadow-lg hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Low Risk Zones</span>
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/30"></div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-emerald-400">{lowRiskRoads + lowRiskAreas}</span>
            <span className="text-xs font-medium text-emerald-400/80">
              {lowRiskRoads} Roads, {lowRiskAreas} Areas
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Normal flow &gt;50 km/h</p>
        </div>

        {/* Medium Risk */}
        <div className="bg-[#111115] border border-[#222228] rounded-2xl p-4 shadow-lg hover:border-[#C5A059]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Medium Risk Zones</span>
            <div className="w-3 h-3 rounded-full bg-[#C5A059] shadow-md shadow-[#C5A059]/30"></div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-[#E5C07B]">{medRiskRoads + medRiskAreas}</span>
            <span className="text-xs font-medium text-[#C5A059]/80">
              {medRiskRoads} Roads, {medRiskAreas} Areas
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Moderate crawl 20–50 km/h</p>
        </div>

        {/* High Risk */}
        <div className="bg-[#111115] border border-[#222228] rounded-2xl p-4 shadow-lg hover:border-red-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">High Risk Hotspots</span>
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-md shadow-red-500/30"></div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-red-400">{highRiskRoads + highRiskAreas}</span>
            <span className="text-xs font-medium text-red-400/80">
              {highRiskRoads} Roads, {highRiskAreas} Areas
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Congestion &lt;20 km/h or wet skid</p>
        </div>

        {/* Incidents & Emergency Status */}
        <div className="bg-[#111115] border border-[#222228] rounded-2xl p-4 shadow-lg hover:border-[#C5A059]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Active Incidents</span>
            <AlertTriangle className="w-4 h-4 text-[#E5C07B]" />
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-[#E5C07B]">
              {activeIncidentsCount + respondingIncidentsCount}
            </span>
            <span className="text-xs font-medium text-zinc-400">
              {activeIncidentsCount} Active, {respondingIncidentsCount} Responding
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Avg City Speed: <span className="text-zinc-200 font-bold">{avgNagpurSpeed} km/h</span> ({avgNagpurDensity}% density)
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Quick Detail Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Nagpur Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">Nagpur Live Risk & Traffic Map</h2>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#16161B] text-zinc-400 border border-[#222228] font-mono">
                Lat: 21.1458, Lng: 79.0882
              </span>
            </div>
            <button
              onClick={() => onNavigateToTab('live_traffic')}
              className="text-xs text-[#E5C07B] hover:text-[#C5A059] font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Road Monitor</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[460px] w-full">
            <NagpurMap
              roads={roads}
              incidents={incidents}
              signals={signals}
              areas={areas}
              activeEmergency={activeEmergency}
              selectedRoadName={selectedRoadName}
              selectedAreaName={selectedAreaName}
              onSelectRoad={onSelectRoad}
              onSelectIncident={onSelectIncident}
              onSelectArea={onSelectArea}
            />
          </div>
        </div>

        {/* Right 1 Col: Nagpur Weather Impact & Critical Incidents */}
        <div className="space-y-4">
          {/* Nagpur Weather Card */}
          <div className="bg-[#111115] border border-[#222228] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1F1F24] pb-3">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Nagpur Weather & Road Impact
                </h3>
              </div>
              <span className="text-[10px] text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 font-bold border border-sky-500/20">
                {weather.condition}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-3xl font-black text-white">{weather.temperature}°C</span>
                <p className="text-[11px] text-zinc-400">Feels like {weather.feelsLike}°C</p>
              </div>
              <div className="text-right text-xs space-y-0.5">
                <p className="text-zinc-300">
                  Humidity: <span className="font-bold text-white">{weather.humidity}%</span>
                </p>
                <p className="text-zinc-300">
                  Wind: <span className="font-bold text-white">{weather.windSpeed} km/h</span>
                </p>
                <p className="text-zinc-300">
                  Visibility: <span className="font-bold text-white">{weather.visibilityKm} km</span>
                </p>
              </div>
            </div>

            {/* Traction impact */}
            <div className="mt-3 pt-3 border-t border-[#1F1F24] flex items-center justify-between text-xs">
              <span className="text-zinc-400">Road Traction Reduction:</span>
              <span className="font-bold text-[#E5C07B]">-{weather.tractionReductionPercent}%</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Accident Risk Multiplier:</span>
              <span className="font-bold text-red-400">+35% (Wet Asphalt)</span>
            </div>
          </div>

          {/* Critical Nagpur Incidents Feed */}
          <div className="bg-[#111115] border border-[#222228] rounded-2xl p-4 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#1F1F24] pb-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#E5C07B]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Active Nagpur Incidents
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('alerts')}
                className="text-[11px] text-[#E5C07B] hover:text-[#C5A059] font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5 mt-3 max-h-[260px] overflow-y-auto custom-scrollbar pr-1">
              {incidents.slice(0, 3).map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc)}
                  className="p-2.5 rounded-xl bg-[#16161C] hover:bg-[#1C1C24] border border-[#23232A] cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-100 truncate max-w-[180px]">
                      {inc.road}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        inc.severity === 'CRITICAL' || inc.severity === 'HIGH'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-[#C5A059]/20 text-[#E5C07B] border border-[#C5A059]/40'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 line-clamp-2">{inc.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                    <span>{inc.area}</span>
                    <span className="text-[#E5C07B] font-medium">{inc.trafficImpact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Major Nagpur Roads Live Snapshot */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Major Nagpur Road Corridors</h2>
            <p className="text-xs text-zinc-400">Live velocity, density load, and risk scores across key transit arteries</p>
          </div>
          <button
            onClick={() => onNavigateToTab('live_traffic')}
            className="text-xs text-[#E5C07B] hover:text-[#C5A059] font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Full Road Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {roads.slice(0, 4).map((road) => {
            const isHigh = road.riskLevel === 'HIGH';
            const isMed = road.riskLevel === 'MEDIUM';
            return (
              <div
                key={road.id}
                onClick={() => onSelectRoad(road)}
                className={`p-4 rounded-2xl bg-[#111115] border transition-all cursor-pointer hover:border-[#C5A059]/50 shadow-lg ${
                  isHigh
                    ? 'border-red-500/30 hover:border-red-400'
                    : isMed
                    ? 'border-[#C5A059]/30 hover:border-[#C5A059]'
                    : 'border-[#222228] hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">{road.codeName || 'Nagpur Corridor'}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isHigh
                        ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                        : isMed
                        ? 'bg-[#C5A059]/15 text-[#E5C07B] border border-[#C5A059]/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {road.status} ({road.riskScore} Risk)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-1 truncate">{road.name}</h3>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="bg-[#17171E] p-2.5 rounded-xl border border-[#222228]">
                    <span className="text-[10px] text-zinc-400 block">Avg Speed</span>
                    <span className="text-base font-bold text-white">{road.currentSpeed} <span className="text-[10px] font-normal text-zinc-400">km/h</span></span>
                  </div>
                  <div className="bg-[#17171E] p-2.5 rounded-xl border border-[#222228]">
                    <span className="text-[10px] text-zinc-400 block">Density Load</span>
                    <span className="text-base font-bold text-white">{road.trafficDensity}%</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-[#1F1F24]">
                  <span>{road.activeIncidents} Active Incidents</span>
                  <span className="text-[#E5C07B] font-semibold">Inspect &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Chart: Speed vs Density */}
      <div className="bg-[#111115] border border-[#222228] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Nagpur Road Speed vs. Traffic Density Correlation</h3>
            <p className="text-xs text-zinc-400">Empirical telemetry for accident risk anomaly detection</p>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">XGBoost ML Pipeline Active</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roadChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222228" opacity={0.7} />
              <XAxis dataKey="name" stroke="#71717A" tick={{ fontSize: 11 }} />
              <YAxis stroke="#71717A" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111115',
                  borderColor: '#282832',
                  borderRadius: '12px',
                  color: '#F4F4F5',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Speed" fill="#38bdf8" name="Speed (km/h)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Density" fill="#C5A059" name="Density (%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="RiskScore" fill="#ef4444" name="Risk Score (0-100)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
