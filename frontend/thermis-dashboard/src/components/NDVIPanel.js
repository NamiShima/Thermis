import React, { useState, useEffect } from 'react';

function NDVIPanel() {
  const [ndviData, setNdviData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/ndvi/')
      .then(res => res.json())
      .then(data => setNdviData([...data].reverse()))
      .catch(err => console.error('Erro ao buscar NDVI:', err));
  }, []);

  return (
    <div className="card">
      <div className="card-title">🌿 NDVI — Índice de Vegetação Sentinel-2</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ndviData.map((zone) => (
          <div key={zone.zone} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            {/* Nome da zona */}
            <div style={{ fontSize: '11px', color: '#e0e6f0', width: '120px', flexShrink: 0 }}>
              {zone.zone}
            </div>

            {/* Barra de progresso NDVI */}
            <div style={{ flex: 1, background: '#0a0e1a', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                borderRadius: '4px',
                background: zone.color,
                width: `${(zone.ndvi / 0.8) * 100}%`,
                transition: 'width 0.5s ease'
              }}/>
            </div>

            {/* Valor NDVI */}
            <div style={{ fontSize: '11px', color: zone.color, width: '45px', textAlign: 'right', flexShrink: 0 }}>
              {zone.ndvi.toFixed(3)}
            </div>

            {/* Badge de classificação */}
            <div style={{
              fontSize: '9px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: `${zone.color}22`,
              color: zone.color,
              width: '90px',
              textAlign: 'center',
              flexShrink: 0
            }}>
              {zone.label}
            </div>
          </div>
        ))}
      </div>

      {/* Fonte científica */}
      <div style={{
        marginTop: '10px', padding: '8px', background: '#0a0e1a',
        borderRadius: '6px', borderLeft: '3px solid #22c55e'
      }}>
        <div style={{ fontSize: '10px', color: '#4b5563', lineHeight: '1.5' }}>
          NDVI = (NIR - RED) / (NIR + RED) · Sentinel-2 B4/B8 · Rosa (2018) USP
        </div>
      </div>
    </div>
  );
}

export default NDVIPanel;