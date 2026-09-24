import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { NagpurAreasView } from './components/NagpurAreasView';
import { LiveTrafficView } from './components/LiveTrafficView';
import { AccidentPredictionView } from './components/AccidentPredictionView';
import { EmergencyPriorityView } from './components/EmergencyPriorityView';
import { WeatherImpactView } from './components/WeatherImpactView';
import { AlertsView } from './components/AlertsView';
import { ReportsView } from './components/ReportsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { SettingsView } from './components/SettingsView';

import {
  NagpurRoad,
  NagpurIncident,
  NagpurSignal,
  NagpurArea,
  NagpurWeatherReport,
  NagpurAlert,
  PredictionRecord,
} from './types';
import {
  INITIAL_NAGPUR_ROADS,
  INITIAL_NAGPUR_INCIDENTS,
  INITIAL_NAGPUR_SIGNALS,
  INITIAL_NAGPUR_WEATHER,
  INITIAL_NAGPUR_ALERTS,
  INITIAL_PREDICTIONS,
  generateNagpurAreasData,
} from './data/nagpurMockData';
import { EmergencyPreset } from './services/emergencyRouting';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [roads, setRoads] = useState<NagpurRoad[]>(INITIAL_NAGPUR_ROADS);
  const [incidents, setIncidents] = useState<NagpurIncident[]>(INITIAL_NAGPUR_INCIDENTS);
  const [signals, setSignals] = useState<NagpurSignal[]>(INITIAL_NAGPUR_SIGNALS);
  const [areas, setAreas] = useState<NagpurArea[]>(generateNagpurAreasData());
  const [weather, setWeather] = useState<NagpurWeatherReport>(INITIAL_NAGPUR_WEATHER);
  const [alerts, setAlerts] = useState<NagpurAlert[]>(INITIAL_NAGPUR_ALERTS);
  const [predictions, setPredictions] = useState<PredictionRecord[]>(INITIAL_PREDICTIONS);

  const [activeEmergency, setActiveEmergency] = useState<EmergencyPreset | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [selectedRoad, setSelectedRoad] = useState<string>('All Roads');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [targetRoadForPrediction, setTargetRoadForPrediction] = useState<string>('Wardha Road (NH-44)');

  // Simulation tick: periodically update speed, density, and risk across Nagpur roads
  useEffect(() => {
    if (!isDemoMode) return;

    const interval = setInterval(() => {
      setRoads((prevRoads) =>
        prevRoads.map((road) => {
          // Subtle realistic fluctuation
          const delta = (Math.random() - 0.48) * 3;
          const newSpeed = Math.min(
            road.freeFlowSpeed,
            Math.max(12, Math.round(road.currentSpeed + delta))
          );
          const densityDelta = Math.round((Math.random() - 0.5) * 4);
          const newDensity = Math.min(98, Math.max(15, road.trafficDensity + densityDelta));

          let status: 'HEAVY' | 'MODERATE' | 'LIGHT' = 'MODERATE';
          if (newSpeed < 20) status = 'HEAVY';
          else if (newSpeed > 50) status = 'LIGHT';

          let riskScore = Math.round(
            (newDensity / 100) * 45 + (1 - newSpeed / road.freeFlowSpeed) * 45 + (road.activeIncidents > 0 ? 10 : 0)
          );
          riskScore = Math.min(99, Math.max(10, riskScore));

          const riskLevel = riskScore >= 70 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW';

          return {
            ...road,
            currentSpeed: newSpeed,
            trafficDensity: newDensity,
            congestionIndex: Math.min(100, Math.round((newDensity * 0.7) + (100 - newSpeed) * 0.3)),
            status,
            riskScore,
            riskLevel,
            lastUpdated: 'Live Feed',
          };
        })
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [isDemoMode]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setWeather((prev) => ({
        ...prev,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      setIsRefreshing(false);
    }, 600);
  };

  const handleTriggerTestAlert = () => {
    const randomArea = areas[Math.floor(Math.random() * areas.length)];
    const randomRoad = roads[Math.floor(Math.random() * roads.length)];

    const newAlert: NagpurAlert = {
      id: `alt_${Date.now()}`,
      city: 'Nagpur',
      area: randomArea.name,
      road: randomRoad.name,
      title: `Sudden Traffic Surge detected near ${randomArea.name}`,
      message: `Density rose to 86% with risk index ${randomRoad.riskScore}/100. Commuters advised to divert via Outer Ring Road.`,
      severity: 'HIGH',
      riskScore: Math.min(92, randomRoad.riskScore + 10),
      weather: weather.condition,
      trafficDensity: 86,
      timestamp: 'Just now',
      isRead: false,
      category: 'CONGESTION',
    };

    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleMarkAlertAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const handleSelectRoad = (road: NagpurRoad) => {
    setSelectedRoad(road.name);
    if (activeTab !== 'dashboard' && activeTab !== 'live_traffic') {
      setActiveTab('dashboard');
    }
  };

  const handleSelectArea = (area: NagpurArea) => {
    setSelectedArea(area.name);
    if (activeTab !== 'dashboard' && activeTab !== 'areas') {
      setActiveTab('dashboard');
    }
  };

  const handleSelectIncident = (incident: NagpurIncident) => {
    setSelectedRoad(incident.road);
    setSelectedArea(incident.area);
    if (activeTab !== 'dashboard') {
      setActiveTab('dashboard');
    }
  };

  const handleNavigateToPrediction = (locationName: string) => {
    setTargetRoadForPrediction(locationName);
    setActiveTab('prediction');
  };

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0B] text-zinc-100 font-sans">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadAlertsCount={unreadAlertsCount}
        emergencyActive={activeEmergency !== null}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* Global Nagpur Header */}
        <Header
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          selectedRoad={selectedRoad}
          setSelectedRoad={setSelectedRoad}
          roads={roads}
          isDemoMode={isDemoMode}
          setIsDemoMode={setIsDemoMode}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          emergencyActive={activeEmergency !== null}
          onTriggerTestAlert={handleTriggerTestAlert}
        />

        {/* Dynamic View Canvas */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0A0A0B]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="max-w-7xl mx-auto"
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  roads={roads}
                  incidents={incidents}
                  signals={signals}
                  areas={areas}
                  weather={weather}
                  alerts={alerts}
                  activeEmergency={activeEmergency}
                  onNavigateToTab={setActiveTab}
                  onSelectRoad={handleSelectRoad}
                  onSelectIncident={handleSelectIncident}
                  onSelectArea={handleSelectArea}
                  selectedRoadName={selectedRoad}
                  selectedAreaName={selectedArea}
                />
              )}

              {activeTab === 'areas' && (
                <NagpurAreasView
                  areas={areas}
                  roads={roads}
                  onSelectArea={handleSelectArea}
                  onNavigateToPrediction={handleNavigateToPrediction}
                />
              )}

              {activeTab === 'live_traffic' && (
                <LiveTrafficView
                  roads={roads}
                  incidents={incidents}
                  isDemoMode={isDemoMode}
                  onSelectRoad={handleSelectRoad}
                  onNavigateToPrediction={handleNavigateToPrediction}
                />
              )}

              {activeTab === 'prediction' && (
                <AccidentPredictionView
                  roads={roads}
                  initialTargetRoad={targetRoadForPrediction}
                />
              )}

              {activeTab === 'emergency' && (
                <EmergencyPriorityView
                  activeEmergency={activeEmergency}
                  setActiveEmergency={setActiveEmergency}
                  onFocusMap={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'weather' && (
                <WeatherImpactView weather={weather} />
              )}

              {activeTab === 'alerts' && (
                <AlertsView
                  alerts={alerts}
                  roads={roads}
                  onTriggerTestAlert={handleTriggerTestAlert}
                  onMarkAsRead={handleMarkAlertAsRead}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsView
                  roads={roads}
                  incidents={incidents}
                  areas={areas}
                  predictions={predictions}
                  weather={weather}
                />
              )}

              {activeTab === 'kb' && <KnowledgeBaseView />}

              {activeTab === 'settings' && (
                <SettingsView
                  isDemoMode={isDemoMode}
                  setIsDemoMode={setIsDemoMode}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
