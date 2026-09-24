import React from 'react';
import { NagpurWeatherReport } from '../types';
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  AlertTriangle,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface WeatherImpactViewProps {
  weather: NagpurWeatherReport;
}

export const WeatherImpactView: React.FC<WeatherImpactViewProps> = ({ weather }) => {
  const zonesImpact = [
    { zone: 'Central Nagpur (Sitabuldi / Mahal / CA Road)', risk: 'HIGH', impact: 'Severe Waterlogging at CA Road underpasses & market choke' },
    { zone: 'South Nagpur (Wardha Rd / Manish Nagar / Somalwada)', risk: 'HIGH', impact: 'Reduced traction near Chhatrapati Flyover & Railway Underpass' },
    { zone: 'North Nagpur (Sadar / Jaripatka / Kamptee Rd)', risk: 'MEDIUM', impact: 'Moderate surface wetness on Kamptee Road freight artery' },
    { zone: 'East Nagpur (Pardi / Kalamna / Bhandara Rd)', risk: 'HIGH', impact: 'Pardi Octroi Naka storm drain overflow & standing water' },
    { zone: 'West Nagpur (Dharampeth / Amravati Rd / Futala)', risk: 'LOW', impact: 'Adequate gradient drainage on Amravati Highway corridor' },
  ];

  return (
    <div id="weather-impact-container" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141418] via-[#101014] to-[#0D0D10] p-6 rounded-2xl border border-[#222228] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 font-bold text-xs border border-sky-500/30">
                METEOROLOGICAL SENSORS
              </span>
              <span className="text-xs text-zinc-500 font-mono">Scope: Nagpur City</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <CloudRain className="w-6 h-6 text-sky-400" />
              <span>Nagpur Weather & Traffic Impact Matrix</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Real-time atmospheric monitoring, roadway hydroplaning vulnerability, and rainfall-induced braking distance compensation across Nagpur.
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-[#16161C] border border-[#282832] text-right">
            <span className="text-xs text-zinc-400 block">Overall Traffic Impact</span>
            <span className="text-lg font-black text-red-400">{weather.trafficImpact} IMPACT</span>
          </div>
        </div>
      </div>

      {/* Main Meteorological Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-[#111115] border border-[#222228] shadow-lg">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5 mb-2">
            <Thermometer className="w-4 h-4 text-amber-500" /> Temperature
          </span>
          <span className="text-2xl font-black text-white">{weather.temperature}°C</span>
          <span className="text-[11px] text-zinc-500 block mt-1">Feels like {weather.feelsLike}°C</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111115] border border-[#222228] shadow-lg">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5 mb-2">
            <Droplets className="w-4 h-4 text-sky-400" /> Humidity
          </span>
          <span className="text-2xl font-black text-white">{weather.humidity}%</span>
          <span className="text-[11px] text-zinc-500 block mt-1">High moisture index</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111115] border border-[#222228] shadow-lg">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5 mb-2">
            <Wind className="w-4 h-4 text-teal-400" /> Wind Velocity
          </span>
          <span className="text-2xl font-black text-white">{weather.windSpeed} <span className="text-xs text-zinc-400">km/h</span></span>
          <span className="text-[11px] text-zinc-500 block mt-1">Gusts up to 22 km/h</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111115] border border-[#222228] shadow-lg">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5 mb-2">
            <Eye className="w-4 h-4 text-indigo-400" /> Sight Visibility
          </span>
          <span className="text-2xl font-black text-white">{weather.visibilityKm} <span className="text-xs text-zinc-400">km</span></span>
          <span className="text-[11px] text-[#E5C07B] font-semibold block mt-1">Reduced in showers</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111115] border border-[#222228] shadow-lg">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5 mb-2">
            <CloudRain className="w-4 h-4 text-blue-400" /> Precipitation
          </span>
          <span className="text-2xl font-black text-white">{weather.rainfallMm} <span className="text-xs text-zinc-400">mm</span></span>
          <span className="text-[11px] text-zinc-500 block mt-1">Past 3 hours cumulative</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111115] border border-[#222228] shadow-lg">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5 mb-2">
            <Zap className="w-4 h-4 text-red-400" /> Traction Loss
          </span>
          <span className="text-2xl font-black text-red-400">-{weather.tractionReductionPercent}%</span>
          <span className="text-[11px] text-red-300 font-semibold block mt-1">+35% Stopping Distance</span>
        </div>
      </div>

      {/* Zone-by-Zone Meteorological Road Hazards */}
      <div className="bg-[#111115] border border-[#222228] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1F1F24] pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Nagpur Zonal Weather Impact Breakdown
          </h2>
          <span className="text-xs text-zinc-400 font-mono">Updated: {weather.lastUpdated}</span>
        </div>

        <div className="space-y-3">
          {zonesImpact.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#17171E] border border-[#222228] flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <h3 className="text-xs font-bold text-white">{item.zone}</h3>
                <p className="text-xs text-zinc-300 mt-0.5">{item.impact}</p>
              </div>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                  item.risk === 'HIGH'
                    ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                    : item.risk === 'MEDIUM'
                    ? 'bg-[#C5A059]/15 text-[#E5C07B] border border-[#C5A059]/30'
                    : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {item.risk} RISK IMPACT
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Nagpur Forecast */}
      <div className="bg-[#111115] border border-[#222228] rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Nagpur Hourly Road Hazard Projection
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {weather.forecast.map((fc, idx) => (
            <div key={idx} className="p-3 bg-[#17171E] border border-[#222228] rounded-xl text-center space-y-1">
              <span className="text-xs font-mono text-zinc-400 block">{fc.time}</span>
              <span className="text-lg font-black text-white block">{fc.temp}°C</span>
              <span className="text-xs font-semibold text-sky-300 block">{fc.condition}</span>
              <span className="text-[10px] text-zinc-500 block">Rain Prob: {fc.rainProb}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
