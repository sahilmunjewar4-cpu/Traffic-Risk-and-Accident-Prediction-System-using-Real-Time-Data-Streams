import React, { useState, useEffect } from 'react';
import {
  predictNagpurAccidentRisk,
  logPredictionRecord,
  getPersistedPredictions,
  MLPredictionResult,
} from '../services/trafficEngine';
import { NAGPUR_AREAS_LIST } from '../config/nagpur';
import { NagpurRoad, WeatherCondition, PredictionRecord } from '../types';
import { INITIAL_PREDICTIONS } from '../data/nagpurMockData';
import {
  BrainCircuit,
  Sliders,
  Sparkles,
  Download,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Clock,
  MapPin,
  Route,
  Gauge,
  CloudRain,
  Sun,
  Cloud,
  CheckCircle2,
} from 'lucide-react';

interface AccidentPredictionViewProps {
  roads: NagpurRoad[];
  initialTargetRoad?: string;
}

export const AccidentPredictionView: React.FC<AccidentPredictionViewProps> = ({
  roads,
  initialTargetRoad,
}) => {
  // Input parameters
  const [selectedArea, setSelectedArea] = useState<string>('Sitabuldi');
  const [selectedRoad, setSelectedRoad] = useState<string>(
    initialTargetRoad || 'Wardha Road (NH-44)'
  );
  const [speed, setSpeed] = useState<number>(32);
  const [density, setDensity] = useState<number>(72);
  const [weather, setWeather] = useState<WeatherCondition>('Rainy');
  const [timeHour, setTimeHour] = useState<number>(18);
  const [potholes, setPotholes] = useState<boolean>(false);

  // Prediction State
  const [predictionResult, setPredictionResult] = useState<MLPredictionResult | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionRecord[]>([]);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    const saved = getPersistedPredictions();
    if (saved.length > 0) {
      setPredictionHistory(saved);
    } else {
      setPredictionHistory(INITIAL_PREDICTIONS);
    }

    // Run initial prediction
    runPrediction();
  }, []);

  const runPrediction = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const res = predictNagpurAccidentRisk({
        city: 'Nagpur',
        area: selectedArea,
        road: selectedRoad,
        speed,
        density,
        weather,
        timeHour,
        potholesOrDamage: potholes,
      });
      setPredictionResult(res);

      const logged = logPredictionRecord({
        area: selectedArea,
        road: selectedRoad,
        speed,
        density,
        weather,
        timeHour,
        riskScore: res.riskScore,
        confidence: res.confidence,
        riskLevel: res.riskLevel,
        primaryRiskFactor: res.primaryRiskFactor,
        preventiveAction: res.preventiveAction,
      });

      setPredictionHistory((prev) => [logged, ...prev.slice(0, 40)]);
      setIsCalculating(false);
    }, 250);
  };

  const exportCSV = () => {
    const headers = [
      'ID',
      'Timestamp',
      'City',
      'Area',
      'Road',
      'Speed_kmh',
      'Density_pct',
      'Weather',
      'Time_Hour',
      'Risk_Score',
      'Confidence',
      'Risk_Level',
      'Primary_Factor',
    ];

    const rows = predictionHistory.map((p) => [
      p.id,
      `"${p.timestamp}"`,
      p.city,
      `"${p.area}"`,
      `"${p.road}"`,
      p.speed,
      p.density,
      p.weather,
      p.timeHour,
      p.riskScore,
      p.confidence,
      p.riskLevel,
      `"${p.primaryRiskFactor.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TRAAP_Nagpur_Accident_Predictions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="accident-prediction-container" className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#141418] via-[#101014] to-[#0D0D10] p-6 rounded-2xl border border-[#222228] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#E5C07B] font-bold text-xs border border-[#C5A059]/30">
                ML PREDICTION ENGINE
              </span>
              <span className="text-xs text-zinc-500 font-mono">XGBoost Surrogate Model</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              Nagpur Accident Risk Assessment & Prediction
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Simulate traffic conditions, weather factors, and commuter load across Nagpur's road network to calculate accident probabilities and recommended preventive interventions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#16161C] hover:bg-[#202028] text-zinc-200 text-xs font-semibold border border-[#282832] transition-colors"
            >
              <Download className="w-4 h-4 text-[#C5A059]" />
              <span>Export CSV Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Inputs & Real-time Output Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Simulator Parameter Sliders */}
        <div className="lg:col-span-6 bg-[#111115] border border-[#222228] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#1F1F24] pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C5A059]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Telemetry & Environmental Inputs
              </h2>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">Scope: Nagpur City</span>
          </div>

          {/* Area & Road Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 font-medium block mb-1.5">
                Nagpur Locality / Area
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0A0A0C] border border-[#282832] text-xs text-white font-semibold focus:outline-none focus:border-[#C5A059]"
              >
                {NAGPUR_AREAS_LIST.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name} ({a.zone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-medium block mb-1.5">
                Nagpur Road Corridor
              </label>
              <select
                value={selectedRoad}
                onChange={(e) => setSelectedRoad(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0A0A0C] border border-[#282832] text-xs text-white font-semibold focus:outline-none focus:border-[#C5A059] truncate"
              >
                {roads.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Speed Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-sky-400" /> Average Vehicle Speed
              </span>
              <span className="font-mono font-bold text-[#E5C07B] text-sm">{speed} km/h</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-[#C5A059] h-2 bg-[#1A1A22] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>5 km/h (Gridlock)</span>
              <span>45 km/h (Nominal)</span>
              <span>100 km/h (Expressway)</span>
            </div>
          </div>

          {/* Density Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Traffic Density Load
              </span>
              <span className="font-mono font-bold text-[#E5C07B] text-sm">{density}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
              className="w-full accent-[#C5A059] h-2 bg-[#1A1A22] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>5% (Empty)</span>
              <span>50% (Moderate)</span>
              <span>100% (Saturated)</span>
            </div>
          </div>

          {/* Time of Day Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" /> Time of Day
              </span>
              <span className="font-mono font-bold text-purple-300 text-sm">
                {timeHour.toString().padStart(2, '0')}:00 hrs
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={23}
              step={1}
              value={timeHour}
              onChange={(e) => setTimeHour(Number(e.target.value))}
              className="w-full accent-[#C5A059] h-2 bg-[#1A1A22] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>00:00 (Midnight)</span>
              <span>09:00 (Morning Rush)</span>
              <span>18:00 (Evening Rush)</span>
              <span>23:00</span>
            </div>
          </div>

          {/* Weather Options */}
          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-2">
              Atmospheric & Road Condition
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Heavy Rain', 'Fog'] as WeatherCondition[]).map(
                (w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeather(w)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-semibold text-center transition-all ${
                      weather === w
                        ? 'bg-[#C5A059] text-black font-bold shadow-md shadow-[#C5A059]/15'
                        : 'bg-[#16161C] hover:bg-[#1F1F28] text-zinc-300 border border-[#282832]'
                    }`}
                  >
                    {w}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Road Surface Quality Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1F1F24]">
            <span className="text-xs text-zinc-300">Surface Degradation / Active Construction</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={potholes}
                onChange={(e) => setPotholes(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#1A1A22] border border-[#282832] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C5A059]"></div>
            </label>
          </div>

          <button
            id="run-ml-prediction-btn"
            onClick={runPrediction}
            disabled={isCalculating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFBA73] hover:from-[#B8924B] hover:to-[#C5A059] text-black font-black text-sm shadow-xl shadow-[#C5A059]/10 transition-all flex items-center justify-center gap-2"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{isCalculating ? 'Computing Nagpur Risk Inference...' : 'Evaluate Accident Risk'}</span>
          </button>
        </div>

        {/* Right 6 Cols: ML Output Diagnostics */}
        <div className="lg:col-span-6 bg-[#111115] border border-[#222228] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#1F1F24] pb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  ML Prediction Result
                </h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                Confidence: {predictionResult ? `${Math.round(predictionResult.confidence * 100)}%` : '89%'}
              </span>
            </div>

            {predictionResult && (
              <div className="space-y-4 mt-4">
                {/* Risk Score Highlight Banner */}
                <div
                  className={`p-5 rounded-2xl border flex items-center justify-between ${
                    predictionResult.riskLevel === 'HIGH'
                      ? 'bg-red-500/10 border-red-500/30 text-red-300'
                      : predictionResult.riskLevel === 'MEDIUM'
                      ? 'bg-[#C5A059]/10 border-[#C5A059]/30 text-[#E5C07B]'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider">Accident Risk Level</span>
                    <div className="text-3xl font-black tracking-tight mt-0.5">
                      {predictionResult.riskLevel} RISK
                    </div>
                    <p className="text-xs text-zinc-300 mt-1">
                      {predictionResult.area} • {predictionResult.road}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-4xl font-black font-mono">{predictionResult.riskScore}</span>
                    <span className="text-xs font-medium block">/ 100 Index</span>
                  </div>
                </div>

                {/* Primary Risk Contributing Factor */}
                <div className="p-4 rounded-xl bg-[#17171E] border border-[#222228] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5C07B] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Primary Driver
                  </span>
                  <p className="text-xs text-zinc-200 font-medium">
                    {predictionResult.primaryRiskFactor}
                  </p>
                </div>

                {/* Preventive Action Recommendation */}
                <div className="p-4 rounded-xl bg-[#17171E] border border-[#222228] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Recommended Traffic Management Mitigation
                  </span>
                  <p className="text-xs text-zinc-200">
                    {predictionResult.preventiveAction}
                  </p>
                </div>

                {/* Feature Importance Bars */}
                <div>
                  <span className="text-xs font-bold text-zinc-300 block mb-2">
                    XGBoost Feature Attribution Breakdown
                  </span>
                  <div className="space-y-2">
                    {predictionResult.factors.map((f, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-300">{f.name}</span>
                          <span className="text-zinc-400 font-mono">{f.weight}% weight ({f.impactScore} pts)</span>
                        </div>
                        <div className="w-full bg-[#18181E] border border-[#222228] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#C5A059] h-full rounded-full"
                            style={{ width: `${f.weight * 2.2}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#1F1F24] text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Model Jurisdiction: Nagpur, MH</span>
            <span className="text-zinc-300 font-mono">Dataset: 12,450 Historic Records</span>
          </div>
        </div>
      </div>

      {/* Prediction History Table */}
      <div className="bg-[#111115] border border-[#222228] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Nagpur Prediction Evaluation History</h3>
            <p className="text-xs text-zinc-400">Archived assessment logs and automated inference runs</p>
          </div>
          <span className="text-xs text-zinc-500 font-mono">{predictionHistory.length} Recorded Logs</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-[#0C0C0E] border-b border-[#222228]">
              <tr>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">City</th>
                <th className="py-2.5 px-3">Area</th>
                <th className="py-2.5 px-3">Road Corridor</th>
                <th className="py-2.5 px-3">Speed</th>
                <th className="py-2.5 px-3">Density</th>
                <th className="py-2.5 px-3">Weather</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F24] font-medium">
              {predictionHistory.slice(0, 8).map((p) => (
                <tr key={p.id} className="hover:bg-[#16161C] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">{p.timestamp}</td>
                  <td className="py-2.5 px-3 font-bold text-[#E5C07B]">{p.city}</td>
                  <td className="py-2.5 px-3 text-white">{p.area}</td>
                  <td className="py-2.5 px-3 text-zinc-200">{p.road}</td>
                  <td className="py-2.5 px-3 font-mono">{p.speed} km/h</td>
                  <td className="py-2.5 px-3 font-mono">{p.density}%</td>
                  <td className="py-2.5 px-3">{p.weather}</td>
                  <td className="py-2.5 px-3 font-mono font-bold">{p.riskScore}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.riskLevel === 'HIGH'
                          ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                          : p.riskLevel === 'MEDIUM'
                          ? 'bg-[#C5A059]/15 text-[#E5C07B] border border-[#C5A059]/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {p.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
