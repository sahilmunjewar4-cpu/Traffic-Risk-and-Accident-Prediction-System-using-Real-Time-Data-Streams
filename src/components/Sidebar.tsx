import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Activity,
  BrainCircuit,
  Siren,
  CloudRain,
  Bell,
  FileBarChart2,
  BookOpen,
  Settings,
  Radio,
} from 'lucide-react';
import { NAGPUR_CONFIG } from '../config/nagpur';

export type ActiveTab =
  | 'dashboard'
  | 'areas'
  | 'live_traffic'
  | 'prediction'
  | 'emergency'
  | 'weather'
  | 'alerts'
  | 'reports'
  | 'kb'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadAlertsCount: number;
  emergencyActive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unreadAlertsCount,
  emergencyActive,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'areas', label: 'Nagpur Areas', icon: MapPin, badge: '41 Areas' },
    { id: 'live_traffic', label: 'Live Traffic', icon: Activity, badge: null },
    { id: 'prediction', label: 'Accident Prediction', icon: BrainCircuit, badge: 'ML XGB' },
    {
      id: 'emergency',
      label: 'Emergency Priority',
      icon: Siren,
      badge: emergencyActive ? 'ACTIVE' : 'Green Wave',
      badgeColor: emergencyActive ? 'bg-red-500 text-white animate-pulse' : 'bg-[#15231B] text-emerald-300 border border-emerald-800/40',
    },
    { id: 'weather', label: 'Weather Impact', icon: CloudRain, badge: null },
    {
      id: 'alerts',
      label: 'Nagpur Alerts',
      icon: Bell,
      badge: unreadAlertsCount > 0 ? `${unreadAlertsCount} New` : null,
      badgeColor: 'bg-[#C5A059] text-black font-bold',
    },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart2, badge: 'CSV/PDF' },
    { id: 'kb', label: 'Knowledge Base', icon: BookOpen, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside id="sidebar-container" className="w-64 bg-[#09090B] border-r border-[#1F1F24] flex flex-col justify-between shrink-0 z-30 select-none backdrop-blur-md">
      <div>
        {/* Brand & City Identification */}
        <div className="p-5 border-b border-[#1F1F24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#9A7B38] flex items-center justify-center shadow-lg shadow-[#C5A059]/10 text-black font-black text-lg tracking-wider">
              TR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">TRAAP</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-[#C5A059]/15 text-[#E5C07B] font-semibold border border-[#C5A059]/30">
                  NAGPUR
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">Smart Traffic & Risk AI</p>
            </div>
          </div>

          {/* Global City Scope Badge */}
          <div className="mt-3.5 px-3 py-2 rounded-lg bg-[#121216] border border-[#222228] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-semibold text-zinc-200">{NAGPUR_CONFIG.city}</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">21.1458° N</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C5A059]/15 to-[#C5A059]/5 text-[#E5C07B] border border-[#C5A059]/35 shadow-sm shadow-[#C5A059]/5 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#141418] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#E5C07B]' : 'text-zinc-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      item.badgeColor || 'bg-[#18181D] text-zinc-300 border border-[#2A2A32]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-[#1F1F24] bg-[#0A0A0C]">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
          <span className="flex items-center gap-1.5 font-medium">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Nagpur RTMC Node
          </span>
          <span className="text-emerald-400 font-mono font-semibold">ONLINE</span>
        </div>
        <div className="w-full bg-[#1A1A22] rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 via-[#C5A059] to-emerald-400 h-full w-[94%]"></div>
        </div>
        <p className="text-[10px] text-zinc-500 mt-2 font-mono flex items-center justify-between">
          <span>Jurisdiction: Nagpur Metro</span>
          <span>v2.4 Nagpur-Only</span>
        </p>
      </div>
    </aside>
  );
};
