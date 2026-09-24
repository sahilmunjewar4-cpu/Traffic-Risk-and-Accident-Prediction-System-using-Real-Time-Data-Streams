import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  BrainCircuit,
  Siren,
  Route,
  ShieldCheck,
  CloudRain,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const topics = [
    {
      id: 'overview',
      title: '1. TRAAP Nagpur System Overview',
      icon: BookOpen,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">TRAAP: Nagpur Smart Traffic & Risk Assessment System</h3>
          <p>
            TRAAP (Traffic Accident Risk Assessment and Prediction) is a unified intelligent traffic management system engineered exclusively for the metropolitan jurisdiction of <strong>Nagpur, Maharashtra, India</strong>.
          </p>
          <div className="p-4 bg-[#17171E] rounded-xl border border-[#222228] space-y-2">
            <h4 className="font-bold text-[#E5C07B]">Core Objectives for Nagpur:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Continuous telemetry ingestion across 41 Nagpur municipal zones and 12+ primary highway corridors.</li>
              <li>Real-time XGBoost ML accident risk inference based on velocity differentials, volume saturation, and meteorological hazards.</li>
              <li>Emergency Green Wave signal preemption reducing ambulance transit times between tertiary trauma centers (AIIMS Nagpur, GMC, Kingsway).</li>
              <li>Public safety broadcast advisories dispatched via automated WhatsApp and SMS gateways.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'ml_prediction',
      title: '2. ML Accident Prediction Methodology',
      icon: BrainCircuit,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">XGBoost Surrogate Risk Inference Model</h3>
          <p>
            The prediction engine evaluates real-time telemetry inputs against calibrated empirical decision trees derived from historical traffic incident archives in Nagpur.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#17171E] rounded-xl border border-[#222228]">
              <span className="font-bold text-white block">Key Feature Weights:</span>
              <ul className="mt-1 space-y-1 text-zinc-300">
                <li>&bull; Traffic Density Load: <strong>38%</strong></li>
                <li>&bull; Speed Variance Differential: <strong>28%</strong></li>
                <li>&bull; Atmospheric / Road Friction: <strong>22%</strong></li>
                <li>&bull; Peak Commute Window: <strong>12%</strong></li>
              </ul>
            </div>
            <div className="p-3 bg-[#17171E] rounded-xl border border-[#222228]">
              <span className="font-bold text-white block">Output Classifications:</span>
              <ul className="mt-1 space-y-1 text-zinc-300">
                <li>&bull; Low Risk (0–39): Nominal surveillance</li>
                <li>&bull; Medium Risk (40–69): Staggered signal splits</li>
                <li>&bull; High Risk (70–100): Priority speed damping</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'green_wave',
      title: '3. Emergency Green Wave Protocol',
      icon: Siren,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">Intersection Preemption & Dynamic Clear Corridors</h3>
          <p>
            When an Advanced Life Support (ALS) Ambulance, Fire Tender, or Organ Transport vehicle is dispatched across Nagpur, the Green Wave controller overrides regular cyclical signal clocks.
          </p>
          <div className="p-4 bg-[#17171E] rounded-xl border border-[#222228] space-y-2">
            <h4 className="font-bold text-sky-400">Preemption Sequence:</h4>
            <p>
              1. GPS Telemetry locks vehicle trajectory onto Nagpur's arterial road network.
            </p>
            <p>
              2. Downstream signals within a 2.5 km forward cone switch phase to <span className="text-emerald-400 font-bold">HOLD_GREEN</span> 45 seconds prior to arrival.
            </p>
            <p>
              3. Cross-traffic queues receive early yellow/red transitions to evacuate intersection boxes cleanly.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'weather_impact',
      title: '4. Weather & Road Hydroplaning Impact',
      icon: CloudRain,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">Monsoon & Fog Hazard Modeling</h3>
          <p>
            Nagpur encounters torrential monsoon cloudbursts and winter fog. When precipitation exceeds 10 mm/h, the roadway friction coefficient (&mu;) drops from 0.75 to &le;0.42.
          </p>
          <div className="p-4 bg-[#17171E] rounded-xl border border-[#222228]">
            <h4 className="font-bold text-[#E5C07B]">Braking Distance Multiplier:</h4>
            <p className="mt-1 font-mono text-zinc-200">
              d_braking = v^2 / (254 * (&mu; - gradient))
            </p>
            <p className="mt-2 text-zinc-400">
              Wet asphalt extends average 50 km/h braking distance by 8.4 meters, triggering automated cautionary VMS speed advisories on Wardha and Bhandara highways.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const filteredTopics = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTopicObj = topics.find((t) => t.id === activeTopic) || topics[0];

  return (
    <div id="knowledge-base-container" className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#141418] via-[#101014] to-[#0D0D10] p-6 rounded-2xl border border-[#222228] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#E5C07B] font-bold text-xs border border-[#C5A059]/30">
                SYSTEM DOCUMENTATION
              </span>
              <span className="text-xs text-zinc-500 font-mono">TRAAP Nagpur Reference Manual</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#E5C07B]" />
              <span>Nagpur Smart Traffic Knowledge Base</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Engineering specifications, ML prediction algorithms, green wave preemption protocols, and operational blueprints for the Nagpur system.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation topics, algorithms, protocols..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0E0E12] border border-[#282832] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A059] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Topic List */}
        <div className="lg:col-span-4 space-y-2">
          {filteredTopics.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#181820] border-[#C5A059] text-[#E5C07B] shadow-lg shadow-[#C5A059]/10'
                    : 'bg-[#111115] border-[#222228] text-zinc-300 hover:bg-[#17171E]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#E5C07B]' : 'text-zinc-400'}`} />
                  <span className="text-xs font-bold">{t.title}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#E5C07B]' : 'text-zinc-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right 8 Cols: Topic Article */}
        <div className="lg:col-span-8 bg-[#111115] border border-[#222228] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-[#1F1F24] pb-3 flex items-center justify-between">
            <span className="text-xs font-mono text-[#E5C07B]">Technical Briefing</span>
            <span className="text-xs text-zinc-500 font-mono">Document v2.4</span>
          </div>

          <div className="pt-2">{selectedTopicObj.content}</div>
        </div>
      </div>
    </div>
  );
};
