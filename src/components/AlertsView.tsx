import React, { useState } from 'react';
import { NagpurAlert, NagpurRoad } from '../types';
import { NAGPUR_AREAS_LIST } from '../config/nagpur';
import {
  Bell,
  AlertTriangle,
  Send,
  CheckCircle2,
  Filter,
  MessageSquare,
  Radio,
  Siren,
  CloudRain,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface AlertsViewProps {
  alerts: NagpurAlert[];
  roads: NagpurRoad[];
  onTriggerTestAlert: () => void;
  onMarkAsRead: (id: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  roads,
  onTriggerTestAlert,
  onMarkAsRead,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('ALL');
  const [whatsappModalOpen, setWhatsappModalOpen] = useState<boolean>(false);
  const [targetAlertForShare, setTargetAlertForShare] = useState<NagpurAlert | null>(null);
  const [whatsappPhone, setWhatsappPhone] = useState<string>('+91 98230 12345');
  const [dispatchStatus, setDispatchStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
    const matchesArea = selectedAreaFilter === 'ALL' || alert.area === selectedAreaFilter;
    return matchesSeverity && matchesArea;
  });

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setDispatchStatus('SENDING');
    setTimeout(() => {
      setDispatchStatus('SENT');
      setTimeout(() => {
        setDispatchStatus('IDLE');
        setWhatsappModalOpen(false);
      }, 1600);
    }, 800);
  };

  return (
    <div id="nagpur-alerts-container" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141418] via-[#101014] to-[#0D0D10] p-6 rounded-2xl border border-[#222228] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#E5C07B] font-bold text-xs border border-[#C5A059]/30">
                REAL-TIME NOTIFICATION BUS
              </span>
              <span className="text-xs text-zinc-500 font-mono">Scope: All Nagpur Locations</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <Bell className="w-6 h-6 text-[#E5C07B]" />
              <span>Nagpur Smart Traffic Alerts & Incident Advisories</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Automated high-risk collision warnings, weather-induced road hazards, and priority clearance broadcasts across Nagpur.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onTriggerTestAlert}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs shadow-lg shadow-[#C5A059]/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate Nagpur Incident Alert</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Severity:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'INFO'].map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  severityFilter === s
                    ? 'bg-[#C5A059] text-black font-bold shadow-md'
                    : 'bg-[#17171E] hover:bg-[#202028] text-zinc-300 border border-[#282832]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400">Nagpur Location:</span>
            <select
              value={selectedAreaFilter}
              onChange={(e) => setSelectedAreaFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#0E0E12] border border-[#282832] text-zinc-200 font-semibold focus:outline-none focus:border-[#C5A059]"
            >
              <option value="ALL">All Nagpur Locations</option>
              {NAGPUR_AREAS_LIST.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name} ({a.zone})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-[#111115] border border-[#222228] rounded-2xl text-zinc-400">
            <p className="text-sm font-semibold">No alerts matching current filters.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCrit = alert.severity === 'CRITICAL' || alert.severity === 'HIGH';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  alert.isRead ? 'bg-[#0E0E12] border-[#1F1F24] opacity-85' : 'bg-[#111115] border-[#222228]'
                } ${
                  isCrit ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-[#C5A059]'
                }`}
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                          : alert.severity === 'HIGH'
                          ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                          : 'bg-[#C5A059]/15 text-[#E5C07B] border border-[#C5A059]/30'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#E5C07B]">
                      Nagpur &bull; {alert.area}
                    </span>
                    <span className="text-xs text-zinc-400">&bull; {alert.road}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">({alert.timestamp})</span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{alert.title}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{alert.message}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 pt-1">
                    <span>
                      Risk Score: <strong className="text-white font-mono">{alert.riskScore}/100</strong>
                    </span>
                    <span>
                      Weather: <strong className="text-sky-300">{alert.weather}</strong>
                    </span>
                    <span>
                      Traffic Density: <strong className="text-white font-mono">{alert.trafficDensity}%</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => {
                      setTargetAlertForShare(alert);
                      setWhatsappModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp / SMS</span>
                  </button>

                  {!alert.isRead && (
                    <button
                      onClick={() => onMarkAsRead(alert.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#17171E] hover:bg-[#202028] text-zinc-300 border border-[#282832] text-xs font-semibold transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* WhatsApp / SMS Dispatcher Modal */}
      {whatsappModalOpen && targetAlertForShare && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111115] border border-[#282832] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F1F24] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Twilio / WhatsApp Traffic Advisory</h3>
              </div>
              <button
                onClick={() => setWhatsappModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg bg-[#17171E] border border-[#282832]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendWhatsApp} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Recipient Mobile / WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="+91 98230 XXXXX"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-[#282832] text-white font-mono text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Automated Nagpur Traffic Bulletin</label>
                <div className="p-3 bg-[#09090C] rounded-xl border border-[#222228] text-zinc-300 font-mono text-[11px] space-y-1">
                  <p className="font-bold text-[#E5C07B]">[TRAAP NAGPUR TRAFFIC ADVISORY]</p>
                  <p><strong className="text-zinc-200">Location:</strong> {targetAlertForShare.area}, {targetAlertForShare.road}</p>
                  <p><strong className="text-zinc-200">Alert:</strong> {targetAlertForShare.title}</p>
                  <p><strong className="text-zinc-200">Risk Score:</strong> {targetAlertForShare.riskScore}/100 ({targetAlertForShare.severity})</p>
                  <p className="text-zinc-400 pt-1">Please use alternate arterial corridors if possible.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={dispatchStatus !== 'IDLE'}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                {dispatchStatus === 'SENDING' ? (
                  <span>Transmitting via Twilio SMS API...</span>
                ) : dispatchStatus === 'SENT' ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Sent Successfully
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" /> Dispatch Emergency Advisory
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
