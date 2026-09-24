import React, { useState } from 'react';
import {
  EMERGENCY_PRESETS,
  EmergencyPreset,
  playEmergencySiren,
  stopEmergencySiren,
} from '../services/emergencyRouting';
import { EmergencyVehicleType, NagpurSignal } from '../types';
import { INITIAL_NAGPUR_SIGNALS } from '../data/nagpurMockData';
import {
  Siren,
  Route,
  Clock,
  Radio,
  Volume2,
  VolumeX,
  Play,
  Square,
  ArrowRight,
  ShieldAlert,
  Hospital,
  Flame,
  Shield,
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

interface EmergencyPriorityViewProps {
  activeEmergency: EmergencyPreset | null;
  setActiveEmergency: (preset: EmergencyPreset | null) => void;
  onFocusMap: () => void;
}

export const EmergencyPriorityView: React.FC<EmergencyPriorityViewProps> = ({
  activeEmergency,
  setActiveEmergency,
  onFocusMap,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(EMERGENCY_PRESETS[0].id);
  const [isSirenPlaying, setIsSirenPlaying] = useState<boolean>(false);
  const [activeSignals, setActiveSignals] = useState<NagpurSignal[]>(INITIAL_NAGPUR_SIGNALS);

  const currentPreset =
    EMERGENCY_PRESETS.find((p) => p.id === selectedPresetId) || EMERGENCY_PRESETS[0];

  const handleStartGreenWave = () => {
    setActiveEmergency(currentPreset);
    // Switch all relevant signals to GREEN for priority wave
    setActiveSignals((prev) =>
      prev.map((s) => ({
        ...s,
        currentState: 'GREEN',
        recommendedState: 'GREEN',
        priorityStatus: 'GREEN_WAVE_ACTIVE',
      }))
    );
    if (!isSirenPlaying) {
      playEmergencySiren(8);
      setIsSirenPlaying(true);
      setTimeout(() => setIsSirenPlaying(false), 8000);
    }
  };

  const handleStopGreenWave = () => {
    setActiveEmergency(null);
    stopEmergencySiren();
    setIsSirenPlaying(false);
    setActiveSignals(INITIAL_NAGPUR_SIGNALS);
  };

  const toggleSirenAudio = () => {
    if (isSirenPlaying) {
      stopEmergencySiren();
      setIsSirenPlaying(false);
    } else {
      playEmergencySiren(10);
      setIsSirenPlaying(true);
    }
  };

  const getVehicleIcon = (type: EmergencyVehicleType) => {
    switch (type) {
      case 'AMBULANCE':
        return <Hospital className="w-5 h-5 text-red-400" />;
      case 'ORGAN_TRANSPORT':
        return <HeartPulse className="w-5 h-5 text-pink-400" />;
      case 'FIRE_BRIGADE':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'POLICE':
        return <Shield className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div id="emergency-priority-container" className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#141418] via-[#101014] to-[#0D0D10] p-6 rounded-2xl border border-[#222228] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-300 font-bold text-xs border border-red-500/30">
                EMERGENCY CORRIDOR DISPATCH
              </span>
              <span className="text-xs text-[#E5C07B] font-mono font-bold bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/30">
                SIMULATION PROTOCOL
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <Siren className="w-6 h-6 text-red-500" />
              <span>Nagpur Emergency Green Wave & Signal Priority</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Automated intersection preemption, dynamic signal synchronization, and high-speed corridor routing for ambulances, fire engines, and police interceptors in Nagpur.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSirenAudio}
              className={`p-2.5 rounded-xl border transition-all ${
                isSirenPlaying
                  ? 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse'
                  : 'bg-[#16161C] text-zinc-300 border-[#282832] hover:bg-[#202028]'
              }`}
              title="Test Acoustic Siren Generator"
            >
              {isSirenPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {activeEmergency ? (
              <button
                id="stop-green-wave-btn"
                onClick={handleStopGreenWave}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16161C] hover:bg-[#202028] text-red-400 font-bold text-xs border border-red-500/40 shadow-lg transition-all"
              >
                <Square className="w-4 h-4 fill-red-400" />
                <span>Deactivate Corridor</span>
              </button>
            ) : (
              <button
                id="start-green-wave-btn"
                onClick={handleStartGreenWave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-xl shadow-red-600/30 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Engage Green Wave</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preset Route Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {EMERGENCY_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          const isActive = activeEmergency?.id === preset.id;

          return (
            <div
              key={preset.id}
              onClick={() => {
                setSelectedPresetId(preset.id);
                if (activeEmergency) {
                  setActiveEmergency(preset);
                }
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg flex flex-col justify-between ${
                isActive
                  ? 'bg-red-500/10 border-red-500 text-red-300 ring-2 ring-red-500/40'
                  : isSelected
                  ? 'bg-[#181820] border-[#C5A059] text-white shadow-[#C5A059]/10'
                  : 'bg-[#111115] border-[#222228] text-zinc-300 hover:border-[#2E2E38]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getVehicleIcon(preset.vehicleType)}
                    <span className="text-xs font-bold">{preset.vehicleType.replace('_', ' ')}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#17171E] text-zinc-300 border border-[#222228]">
                    {preset.distanceKm} km
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white mt-1 line-clamp-1">{preset.vehicleNumber}</h3>

                <div className="mt-3 space-y-1 text-[11px]">
                  <div className="flex items-start gap-1.5 text-zinc-300">
                    <span className="text-emerald-400 font-bold shrink-0">From:</span>
                    <span className="truncate">{preset.originName}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-zinc-300">
                    <span className="text-red-400 font-bold shrink-0">To:</span>
                    <span className="truncate">{preset.destinationName}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1F1F24] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 block">Normal ETA</span>
                  <span className="font-mono text-zinc-300">{preset.normalEtaMin} min</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-bold block">Green Wave ETA</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {preset.greenWaveEtaMin} min (-{preset.timeSavedMin}m)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Corridor Analysis & Signal Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Route Telemetry */}
        <div className="lg:col-span-6 bg-[#111115] border border-[#222228] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F1F24] pb-3">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Corridor Navigation Telemetry
              </h2>
            </div>
            <button
              onClick={onFocusMap}
              className="text-xs text-[#E5C07B] hover:text-[#D4AF37] font-semibold"
            >
              View Route on Map &rarr;
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#17171E] border border-[#222228] rounded-xl text-center">
              <span className="text-zinc-400 text-[10px] block">Distance</span>
              <span className="text-lg font-black text-white font-mono">{currentPreset.distanceKm} km</span>
            </div>
            <div className="p-3 bg-[#17171E] border border-[#222228] rounded-xl text-center">
              <span className="text-zinc-400 text-[10px] block">Standard Delay</span>
              <span className="text-lg font-black text-zinc-300 font-mono">{currentPreset.normalEtaMin} min</span>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
              <span className="text-emerald-300 text-[10px] font-bold block">Priority Wave ETA</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {currentPreset.greenWaveEtaMin} min
              </span>
            </div>
          </div>

          {/* Sequential Transit Roads */}
          <div className="p-4 rounded-xl bg-[#17171E] border border-[#222228] space-y-2">
            <span className="text-xs font-bold text-zinc-300 block">Arterial Road Sequence</span>
            <div className="flex flex-wrap items-center gap-2">
              {currentPreset.routeRoads.map((road, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-2.5 py-1 rounded-lg bg-[#111115] text-zinc-200 text-xs font-medium border border-[#282832]">
                    {road}
                  </span>
                  {idx < currentPreset.routeRoads.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Bottlenecks & Hazards */}
          <div className="p-4 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 space-y-1.5">
            <span className="text-xs font-bold text-[#E5C07B] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> High Congestion Critical Nodes
            </span>
            <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
              {currentPreset.congestionPoints.map((pt, idx) => (
                <li key={idx}>{pt}</li>
              ))}
            </ul>
          </div>

          {/* Alternative Bypass */}
          {currentPreset.alternativeRoute && (
            <div className="p-3 bg-[#17171E] border border-[#222228] rounded-xl text-xs flex items-center justify-between text-zinc-400">
              <span>
                <strong className="text-zinc-300">Contingency Bypass:</strong> {currentPreset.alternativeRoute.roads.join(' → ')}
              </span>
              <span className="font-mono text-zinc-300">
                {currentPreset.alternativeRoute.distanceKm} km ({currentPreset.alternativeRoute.etaMin}m)
              </span>
            </div>
          )}
        </div>

        {/* Right 6 Cols: Signal Preemption Queue */}
        <div className="lg:col-span-6 bg-[#111115] border border-[#222228] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F1F24] pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Traffic Signal Preemption Controller
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              {activeEmergency ? 'GREEN WAVE SYNC: ACTIVE' : 'STANDBY MODE'}
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
            {activeSignals.map((sig, idx) => {
              const isWave = activeEmergency !== null;
              return (
                <div
                  key={sig.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isWave
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-zinc-200'
                      : 'bg-[#17171E] border-[#222228] text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#0A0A0C] flex items-center justify-center font-bold text-xs font-mono border border-[#282832]">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{sig.name}</h4>
                      <p className="text-[11px] text-zinc-400">
                        {sig.road} ({sig.area})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">Current Signal</span>
                      <span
                        className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                          isWave || sig.currentState === 'GREEN'
                            ? 'bg-emerald-500 text-black font-bold'
                            : sig.currentState === 'AMBER'
                            ? 'bg-[#C5A059] text-black font-bold'
                            : 'bg-red-500 text-white font-bold'
                        }`}
                      >
                        {isWave ? 'GREEN' : sig.currentState}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">Preemption State</span>
                      <span className="font-bold text-sky-400 font-mono">
                        {isWave ? 'HOLD_GREEN' : 'NORMAL_CYCLE'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
