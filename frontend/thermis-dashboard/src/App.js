import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import MapPanel from './components/MapPanel';
import MetricsPanel from './components/MetricsPanel';
import AlertsPanel from './components/AlertsPanel';
import SensorPanel from './components/SensorPanel';
import HistoryChart from './components/HistoryChart';
import PredictionPanel from './components/PredictionPanel';
import VegetationPanel from './components/VegetationPanel';
import NDVIPanel from './components/NDVIPanel';

function App() {
  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [sensor, setSensor] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [zonesRes, alertsRes, sensorRes] = await Promise.all([
        fetch('http://localhost:8000/zones/'),
        fetch('http://localhost:8000/alerts/'),
        fetch('http://localhost:8000/sensor/esp32')
      ]);
      setZones(await zonesRes.json());
      setAlerts(await alertsRes.json());
      setSensor(await sensorRes.json());
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0a0e1a', color: '#4a9eff',
        fontSize: '18px', letterSpacing: '0.1em'
      }}>
        THERMIS — Inicializando sistema...
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Cabecalho */}
      <Header />

      {/* Metricas no topo */}
      <MetricsPanel zones={zones} />

      {/* Area principal: mapa + paineis laterais */}
      <div className="main-content">
        <MapPanel zones={zones} selectedZone={selectedZone} onZoneSelect={setSelectedZone} />

        {/* Painel direito */}
        <div className="side-panels">
          <AlertsPanel alerts={alerts} />
          <SensorPanel sensor={sensor} />
        </div>
      </div>

      {/* Segunda linha: graficos analiticos */}
      <div className="analytics-grid">
        <HistoryChart />
        <PredictionPanel />
        <VegetationPanel />
        <NDVIPanel />
      </div>
    </div>
  );
}

export default App;