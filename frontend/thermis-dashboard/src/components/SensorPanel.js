import React from 'react';

function SensorPanel({ sensor }) {
  // Retorna mensagem de carregamento se dados ainda não chegaram
  if (!sensor) return (
    <div className="card">
      <div className="card-title">📡 Sensor ESP32</div>
      <div style={{ color: '#4b5563', fontSize: '12px' }}>Conectando ao sensor...</div>
    </div>
  );

  return (
    <div className="card">
      {/* Título e status do dispositivo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div className="card-title" style={{ margin: 0 }}>📡 Sensor ESP32</div>
        {/* Badge de status online */}
        <span style={{
          fontSize: '10px', color: '#22c55e',
          background: '#22c55e22',
          padding: '2px 8px', borderRadius: '4px'
        }}>
          ● {sensor.status.toUpperCase()}
        </span>
      </div>

      {/* ID e localização do dispositivo */}
      <div style={{ fontSize: '11px', color: '#4b5563', marginBottom: '12px' }}>
        {sensor.device_id} · {sensor.location}
      </div>

      {/* Grid com as 3 métricas do sensor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        {/* Temperatura medida */}
        <div style={{ background: '#0a0e1a', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Temp.</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#e24b4a' }}>
            {sensor.temperature_c}°
          </div>
        </div>

        {/* Umidade relativa */}
        <div style={{ background: '#0a0e1a', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Umidade</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#4a9eff' }}>
            {sensor.humidity_pct}%
          </div>
        </div>

        {/* Índice de calor (sensação térmica) */}
        <div style={{ background: '#0a0e1a', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Sensação</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#f5a623' }}>
            {sensor.heat_index}°
          </div>
        </div>
      </div>

      {/* Timestamp da última leitura */}
      <div style={{ fontSize: '10px', color: '#4b5563', marginTop: '10px', textAlign: 'right' }}>
        Última leitura: {new Date(sensor.timestamp).toLocaleTimeString('pt-BR')}
      </div>
    </div>
  );
}

export default SensorPanel;