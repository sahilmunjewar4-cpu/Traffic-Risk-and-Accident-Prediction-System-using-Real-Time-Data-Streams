import React, { useState } from 'react';
import {
  NagpurRoad,
  NagpurIncident,
  NagpurArea,
  PredictionRecord,
  NagpurWeatherReport,
} from '../types';
import {
  FileBarChart2,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  Activity,
  AlertTriangle,
  Siren,
  CheckCircle2,
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
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

interface ReportsViewProps {
  roads: NagpurRoad[];
  incidents: NagpurIncident[];
  areas: NagpurArea[];
  predictions: PredictionRecord[];
  weather: NagpurWeatherReport;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  roads,
  incidents,
  areas,
  predictions,
  weather,
}) => {
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('ALL');
  const [selectedRoadFilter, setSelectedRoadFilter] = useState<string>('ALL');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');

  // Chart data: Incidents by Road
  const incidentsByRoadData = roads.map((r) => ({
    name: r.name.split(' (')[0].replace('Road', 'Rd'),
    Incidents: incidents.filter((i) => i.road.includes(r.name) || r.name.includes(i.road)).length,
    RiskScore: r.riskScore,
  }));

  // Chart data: 24h Risk Curve Projection
  const riskTrendData = [
    { time: '00:00', Risk: 28, Speed: 54, Density: 20 },
    { time: '04:00', Risk: 32, Speed: 56, Density: 18 },
    { time: '08:00', Risk: 68, Speed: 28, Density: 76 },
    { time: '10:00', Risk: 84, Speed: 19, Density: 88 },
    { time: '13:00', Risk: 52, Speed: 38, Density: 52 },
    { time: '16:00', Risk: 64, Speed: 31, Density: 68 },
    { time: '18:00', Risk: 89, Speed: 16, Density: 92 },
    { time: '21:00', Risk: 60, Speed: 36, Density: 58 },
    { time: '23:00', Risk: 38, Speed: 48, Density: 32 },
  ];

  // Pie Data: Risk Levels in Nagpur
  const riskPieData = [
    { name: 'Low Risk', value: areas.filter((a) => a.riskLevel === 'LOW').length, color: '#10b981' },
    { name: 'Medium Risk', value: areas.filter((a) => a.riskLevel === 'MEDIUM').length, color: '#f59e0b' },
    { name: 'High Risk', value: areas.filter((a) => a.riskLevel === 'HIGH').length, color: '#ef4444' },
  ];

  const exportFullReportCSV = () => {
    const headers = ['City', 'Road_Name', 'Length_km', 'Avg_Speed_kmh', 'Density_pct', 'Risk_Score', 'Risk_Level', 'Incidents'];
    const rows = roads.map((r) => [
      'Nagpur',
      `"${r.name}"`,
      r.lengthKm,
      r.currentSpeed,
      r.trafficDensity,
      r.riskScore,
      r.riskLevel,
      r.activeIncidents,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Nagpur_Traffic_Accident_Risk_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="reports-analytics-container" className="space-y-6 pb-12 print:p-0 print:bg-white print:text-black">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#141418] via-[#101014] to-[#0D0D10] p-6 rounded-2xl border border-[#222228] shadow-xl print:border-none print:shadow-none print:bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#E5C07B] font-bold text-xs border border-[#C5A059]/30 print:border-black print:text-black">
                NAGPUR METROPOLITAN TRAFFIC AUDIT
              </span>
              <span className="text-xs text-zinc-500 font-mono print:text-black">Jurisdiction: Nagpur, MH</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1 print:text-black flex items-center gap-2">
              <FileBarChart2 className="w-6 h-6 text-[#E5C07B] print:text-black" />
              <span>Nagpur Traffic Risk Analytics & Safety Audit Report</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl print:text-slate-600">
              Aggregated empirical telemetry, speed variance profiles, accident probability distributions, and emergency corridor effectiveness in Nagpur.
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={exportFullReportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#17171E] hover:bg-[#202028] text-zinc-200 text-xs font-semibold border border-[#282832] transition-colors"
            >
              <Download className="w-4 h-4 text-[#E5C07B]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs shadow-lg shadow-[#C5A059]/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#111115] border border-[#222228] shadow-lg print:border-slate-300 print:bg-slate-50">
          <span className="text-xs text-zinc-400 print:text-slate-600 block">Total Monitored Roads</span>
          <span className="text-2xl font-black text-white print:text-black mt-1 block">{roads.length} Corridors</span>
          <span className="text-[11px] text-zinc-500 mt-1 block">154.7 km Network</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111115] border border-[#222228] shadow-lg print:border-slate-300 print:bg-slate-50">
          <span className="text-xs text-zinc-400 print:text-slate-600 block">Total Recorded Incidents</span>
          <span className="text-2xl font-black text-orange-400 print:text-orange-600 mt-1 block">{incidents.length}</span>
          <span className="text-[11px] text-zinc-500 mt-1 block">8 Resolved Today</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111115] border border-[#222228] shadow-lg print:border-slate-300 print:bg-slate-50">
          <span className="text-xs text-zinc-400 print:text-slate-600 block">Accident Risk Predictions</span>
          <span className="text-2xl font-black text-[#E5C07B] print:text-amber-600 mt-1 block">{predictions.length} Evaluated</span>
          <span className="text-[11px] text-zinc-500 mt-1 block">XGBoost ML Surrogate</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111115] border border-[#222228] shadow-lg print:border-slate-300 print:bg-slate-50">
          <span className="text-xs text-zinc-400 print:text-slate-600 block">Emergency Corridor Savings</span>
          <span className="text-2xl font-black text-emerald-400 print:text-emerald-600 mt-1 block">54% Avg Time Saved</span>
          <span className="text-[11px] text-zinc-500 mt-1 block">Green Wave Preemption</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: 24h Risk Curve */}
        <div className="bg-[#111115] border border-[#222228] rounded-2xl p-5 shadow-xl print:border-slate-300 print:bg-white">
          <h3 className="text-sm font-bold text-white print:text-black mb-1">
            Nagpur 24-Hour Accident Risk vs. Traffic Density Curve
          </h3>
          <p className="text-xs text-zinc-400 print:text-slate-600 mb-4">
            Shows morning (09:00-11:00) and evening (17:30-20:30) peak vulnerability windows
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222228" opacity={0.8} />
                <XAxis dataKey="time" stroke="#71717A" tick={{ fontSize: 11 }} />
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
                <Line type="monotone" dataKey="Risk" stroke="#ef4444" strokeWidth={3} name="Accident Risk" />
                <Line type="monotone" dataKey="Density" stroke="#C5A059" strokeWidth={2} name="Density (%)" />
                <Line type="monotone" dataKey="Speed" stroke="#38bdf8" strokeWidth={2} name="Speed (km/h)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Incidents by Road */}
        <div className="bg-[#111115] border border-[#222228] rounded-2xl p-5 shadow-xl print:border-slate-300 print:bg-white">
          <h3 className="text-sm font-bold text-white print:text-black mb-1">
            Incidents & Risk Distribution by Nagpur Road Corridor
          </h3>
          <p className="text-xs text-zinc-400 print:text-slate-600 mb-4">
            Correlating reported traffic bottlenecks with computed XGBoost safety risk scores
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentsByRoadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222228" opacity={0.8} />
                <XAxis dataKey="name" stroke="#71717A" tick={{ fontSize: 10 }} />
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
                <Bar dataKey="RiskScore" fill="#ef4444" name="Risk Score (0-100)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Incidents" fill="#C5A059" name="Active Incidents" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Nagpur Road Inventory Audit Table */}
      <div className="bg-[#111115] border border-[#222228] rounded-2xl p-6 shadow-xl space-y-4 print:border-slate-300 print:bg-white">
        <h3 className="text-sm font-bold text-white print:text-black">
          Comprehensive Nagpur Road Safety & Congestion Index Audit
        </h3>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-zinc-300 print:text-black">
            <thead className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-[#0E0E12] border-b border-[#222228] print:bg-slate-100 print:border-slate-300 print:text-black">
              <tr>
                <th className="py-3 px-3">Nagpur Road Corridor</th>
                <th className="py-3 px-3">Length</th>
                <th className="py-3 px-3">Avg Speed</th>
                <th className="py-3 px-3">Density</th>
                <th className="py-3 px-3">Congestion</th>
                <th className="py-3 px-3">Risk Score</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Incidents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F24] font-medium print:divide-slate-200">
              {roads.map((r) => (
                <tr key={r.id} className="hover:bg-[#17171E] transition-colors">
                  <td className="py-3 px-3 font-bold text-white print:text-black">{r.name}</td>
                  <td className="py-3 px-3 font-mono">{r.lengthKm} km</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#E5C07B] print:text-black">{r.currentSpeed} km/h</td>
                  <td className="py-3 px-3 font-mono">{r.trafficDensity}%</td>
                  <td className="py-3 px-3 font-mono">{r.congestionIndex}%</td>
                  <td className="py-3 px-3 font-mono font-black text-red-400 print:text-black">{r.riskScore}/100</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.riskLevel === 'HIGH'
                          ? 'bg-red-500/15 text-red-300 border border-red-500/30 print:bg-red-100 print:text-red-800'
                          : r.riskLevel === 'MEDIUM'
                          ? 'bg-[#C5A059]/15 text-[#E5C07B] border border-[#C5A059]/30 print:bg-amber-100 print:text-amber-800'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 print:bg-emerald-100 print:text-emerald-800'
                      }`}
                    >
                      {r.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">{r.activeIncidents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
