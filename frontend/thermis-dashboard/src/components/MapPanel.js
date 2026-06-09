import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // CSS obrigatório do Leaflet

// Componente auxiliar que ajusta o zoom do mapa para SP
function SetView() {
  const map = useMap();
  useEffect(() => {
    map.setView([-23.5505, -46.6333], 12); // Centraliza em São Paulo
  }, [map]);
  return null;
}

function MapPanel({ zones, selectedZone, onZoneSelect }) {
  // Define o raio do círculo baseado no nível de risco — valores grandes para cobrir os bairros
  const getRadius = (level) => {
    if (level === 4) return 80;  // Crítica — mancha grande cobrindo o bairro
    if (level === 3) return 70;  // Alerta
    if (level === 2) return 60;  // Moderada
    return 50;                   // Normal
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Cabeçalho do painel do mapa */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #1e3a5f',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="card-title" style={{ margin: 0 }}>
          🗺️ Mapa de Temperatura — LST São Paulo
        </div>
        {/* Legenda de cores do mapa */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { color: '#e24b4a', label: 'Crítica' },
            { color: '#f5a623', label: 'Alerta' },
            { color: '#533483', label: 'Moderada' },
            { color: '#4a9eff', label: 'Normal' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}/>
              <span style={{ fontSize: '10px', color: '#6b7280' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mapa Leaflet */}
      <div style={{ height: 'calc(100vh - 200px)' }}>
        <MapContainer
          center={[-23.5505, -46.6333]} // Centro de São Paulo
          zoom={12}
          style={{ height: '100%', width: '100%', background: '#0a0e1a' }}
          zoomControl={true}
        >
          <SetView />

          {/* Camada de mapa escuro do CartoDB — combina com o tema Mission Control */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {/* Renderiza uma mancha colorida para cada zona */}
          {zones.map((zone) => (
            <CircleMarker
              key={zone.id}
              center={[zone.lat, zone.lng]}   // Posição geográfica do bairro
              radius={getRadius(zone.level)}  // Raio grande para cobrir o bairro
              fillColor={zone.color}          // Cor da classificação de risco
              color={zone.color}              // Cor da borda do círculo
              weight={0.5}                    // Borda fina
              opacity={0.6}                   // Transparência da borda
              fillOpacity={0.35}              // Transparência do preenchimento — sobrepõe o mapa
              eventHandlers={{
                click: () => onZoneSelect(zone) // Seleciona a zona ao clicar
              }}
            >
              {/* Popup com informações da zona ao clicar */}
              <Popup>
                <div style={{ background: '#111827', color: '#e0e6f0', padding: '8px', borderRadius: '6px', minWidth: '160px' }}>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>{zone.name}</div>
                  <div style={{ fontSize: '12px', color: zone.color }}>🌡️ {zone.lst}°C — {zone.label}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Score de risco: {zone.score}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPanel;