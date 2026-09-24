import React from 'react';
import {
  MapPin,
  Route,
  Clock,
  Radio,
  Sparkles,
  AlertTriangle,
  Siren,
  RefreshCw,
  Building2,
} from 'lucide-react';
import { NAGPUR_CONFIG, NAGPUR_AREAS_LIST } from '../config/nagpur';
import { NagpurRoad } from '../types';

interface HeaderProps {
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  selectedRoad: string;
  setSelectedRoad: (road: string) => void;
  roads: NagpurRoad[];
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  emergencyActive: boolean;
  onTriggerTestAlert: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedArea,
  setSelectedArea,
  selectedRoad,
  setSelectedRoad,
  roads,
  isDemoMode,
  setIsDemoMode,
  onRefresh,
  isRefreshing,
  emergencyActive,
  onTriggerTestAlert,
}) => {
  const [timeStr, setTimeStr] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      id="top-header"
      className="bg-[#0B0B0E]/90 border-b border-[#1F1F24] px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md"
    >
      {/* Location Filter & Global Scope */}
      <div className="flex flex-wrap items-center gap-3">
        {/* City Scope (Strictly Nagpur) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121216] border border-[#222228] text-xs font-semibold text-zinc-200">
          <Building2 className="w-4 h-4 text-[#C5A059]" />
          <span className="text-zinc-400 font-normal">City:</span>
          <span className="text-white font-bold tracking-wide">Nagpur</span>
          <span className="text-[10px] text-[#E5C07B] font-mono px-1 rounded bg-[#C5A059]/15 border border-[#C5A059]/30">
            MH-31
          </span>
        </div>

        {/* Nagpur Area Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121216] border border-[#222228] text-xs">
          <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
          <span className="text-zinc-400 text-[11px] font-medium">Area:</span>
          <select
            id="nagpur-area-selector"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            aria-label="Filter by Nagpur Area"
            className="bg-transparent text-zinc-100 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
          >
            <option value="All Areas" className="bg-[#111115] text-zinc-200">
              All Nagpur Areas (41)
            </option>
            {NAGPUR_AREAS_LIST.map((area) => (
              <option key={area.id} value={area.name} className="bg-[#111115] text-zinc-200">
                {area.name} ({area.zone})
              </option>
            ))}
          </select>
        </div>

        {/* Nagpur Road Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121216] border border-[#222228] text-xs">
          <Route className="w-3.5 h-3.5 text-[#E5C07B] shrink-0" />
          <span className="text-zinc-400 text-[11px] font-medium">Road:</span>
          <select
            id="nagpur-road-selector"
            value={selectedRoad}
            onChange={(e) => setSelectedRoad(e.target.value)}
            aria-label="Filter by Nagpur Road"
            className="bg-transparent text-zinc-100 text-xs font-semibold focus:outline-none cursor-pointer max-w-[180px] truncate"
          >
            <option value="All Roads" className="bg-[#111115] text-zinc-200">
              All Major Roads ({roads.length})
            </option>
            {roads.map((r) => (
              <option key={r.id} value={r.name} className="bg-[#111115] text-zinc-200">
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls: Live/Demo Mode, Time, Quick Action */}
      <div className="flex items-center gap-3">
        {/* Emergency Active Pulse */}
        {emergencyActive && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold animate-pulse">
            <Siren className="w-4 h-4 text-red-400" />
            <span>GREEN WAVE CORRIDOR ACTIVE</span>
          </div>
        )}

        {/* Live vs Demo Data Toggle */}
        <button
          id="mode-toggle-button"
          onClick={() => setIsDemoMode(!isDemoMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isDemoMode
              ? 'bg-[#C5A059]/10 border-[#C5A059]/40 text-[#E5C07B] hover:bg-[#C5A059]/20'
              : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20'
          }`}
          title="Toggle between Live Sensor Feed and Simulation Data"
        >
          <Radio
            className={`w-3.5 h-3.5 ${
              isDemoMode ? 'text-[#C5A059]' : 'text-emerald-400 animate-pulse'
            }`}
          />
          <span>{isDemoMode ? 'DEMO SIMULATION' : 'LIVE RTMC FEED'}</span>
        </button>

        {/* Refresh button */}
        <button
          id="refresh-feed-button"
          onClick={onRefresh}
          className="p-2 rounded-xl bg-[#141418] hover:bg-[#1E1E26] text-zinc-300 border border-[#222228] transition-colors"
          title="Refresh Nagpur Traffic Snapshot"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C5A059]' : ''}`} />
        </button>

        {/* Quick Test Alert */}
        <button
          id="trigger-test-alert-btn"
          onClick={onTriggerTestAlert}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141418] hover:bg-[#1E1E26] border border-[#222228] text-xs font-medium text-zinc-300 hover:text-white transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Simulate Alert</span>
        </button>

        {/* Real-time Clock */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A0A0C] border border-[#1F1F24] text-xs font-mono text-zinc-300">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span>{timeStr || '00:00:00'}</span>
        </div>
      </div>
    </header>
  );
};
