import React, { useState } from 'react';
import { NAGPUR_CONFIG } from '../config/nagpur';
import {
  Settings,
  Building2,
  Sliders,
  Bell,
  Siren,
  Database,
  Radio,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface SettingsViewProps {
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ isDemoMode, setIsDemoMode }) => {
  const [refreshInterval, setRefreshInterval] = useState<number>(15);
  const [highRiskThreshold, setHighRiskThreshold] = useState<number>(70);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClearCache = () => {
    try {
      localStorage.removeItem('traap_nagpur_predictions');
      alert('Nagpur local prediction cache cleared successfully.');
    } catch (e) {}
  };

  return (
    <div id="settings-container" className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#141418] via-[#101014] to-[#0D0D10] p-6 rounded-2xl border border-[#222228] shadow-xl">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#E5C07B] font-bold text-xs border border-[#C5A059]/30">
            SYSTEM PREFERENCES
          </span>
          <span className="text-xs text-zinc-500 font-mono">RTMC Command Configuration</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#E5C07B]" />
          <span>TRAAP Nagpur System Configuration</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
          Global jurisdiction parameters, telemetry synchronization frequencies, and alert thresholds for the Nagpur Metropolitan traffic grid.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Jurisdiction & System Identity */}
        <div className="bg-[#111115] border border-[#222228] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1F1F24] pb-3">
            <Building2 className="w-4 h-4 text-[#E5C07B]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Fixed Municipal Jurisdiction
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Monitored City (Fixed Global Scope)</label>
              <input
                type="text"
                disabled
                value="Nagpur"
                className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-[#222228] text-[#E5C07B] font-bold cursor-not-allowed text-xs"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                This system is architected strictly for Nagpur, Maharashtra. Multi-city mode is decommissioned.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 block mb-1">State / Province</label>
                <input
                  type="text"
                  disabled
                  value="Maharashtra"
                  className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-[#222228] text-zinc-300 font-semibold cursor-not-allowed text-xs"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Country</label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-[#222228] text-zinc-300 font-semibold cursor-not-allowed text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 block mb-1">Geographic Center Latitude</label>
                <input
                  type="text"
                  disabled
                  value={NAGPUR_CONFIG.latitude.toString()}
                  className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-[#222228] text-zinc-400 font-mono cursor-not-allowed text-xs"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Geographic Center Longitude</label>
                <input
                  type="text"
                  disabled
                  value={NAGPUR_CONFIG.longitude.toString()}
                  className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-[#222228] text-zinc-400 font-mono cursor-not-allowed text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Runtime & Telemetry Settings */}
        <div className="bg-[#111115] border border-[#222228] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1F1F24] pb-3">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Telemetry & Simulation Parameters
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1.5">
                Telemetry Synchronization Interval (Seconds)
              </label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0E0E12] border border-[#282832] text-white font-semibold text-xs focus:outline-none focus:border-[#C5A059]"
              >
                <option value={5}>5 Seconds (High frequency)</option>
                <option value={15}>15 Seconds (Optimal balance)</option>
                <option value={30}>30 Seconds (Low bandwidth)</option>
                <option value={60}>60 Seconds (Conservation)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-zinc-300 font-semibold">High Accident Risk Trigger Threshold</label>
                <span className="font-mono font-bold text-red-400">{highRiskThreshold} / 100</span>
              </div>
              <input
                type="range"
                min={50}
                max={90}
                step={5}
                value={highRiskThreshold}
                onChange={(e) => setHighRiskThreshold(Number(e.target.value))}
                className="w-full accent-[#C5A059] h-2 bg-[#17171E] rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Roads exceeding {highRiskThreshold} risk score automatically trigger broadcast alerts.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1F1F24]">
              <div>
                <span className="text-zinc-200 font-semibold block">Acoustic Emergency Siren Synthesis</span>
                <span className="text-[11px] text-zinc-500">Play web audio synthesized siren during green wave test</span>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#C5A059] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1F1F24]">
              <div>
                <span className="text-zinc-200 font-semibold block">Simulation Fallback Mode</span>
                <span className="text-[11px] text-zinc-500">Inject synthetic Nagpur traffic fluctuations</span>
              </div>
              <input
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => setIsDemoMode(e.target.checked)}
                className="w-4 h-4 accent-[#C5A059] rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1F1F24] flex items-center justify-between">
            <button
              type="button"
              onClick={handleClearCache}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17171E] hover:bg-[#202028] text-zinc-300 border border-[#282832] text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Prediction Cache</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs shadow-lg shadow-[#C5A059]/20 transition-all"
            >
              {savedSuccess ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Preferences Saved
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Save className="w-4 h-4" /> Save Configuration
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
