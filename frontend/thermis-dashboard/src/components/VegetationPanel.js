import React, { useState, useEffect } from 'react';

function VegetationPanel() {
  // Estado com dados de vegetação por zona
  const [vegetation, setVegetation] = useState([]);

  // Busca dados de vegetação da API
  useEffect(() => {
    fetch('http://localhost:8000/history/vegetation')
      .then(res => res.json())
      .then(data => setVegetation(data))
      .catch(err => console.error('Erro ao buscar vegetação:', err));
  }, []);

  return (
    <div className="card">
      <div className="card-title">🌿 Cobertura Vegetal por Zona</div>

      {/* Lista de zonas com barra de progresso */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {vegetation.map((zone) => (
          <div key={zone.zone}>
            {/* Nome da zona e temperatura */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '11px', color: '#e0e6f0' }}>{zone.zone}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {/* Badge OMS */}
                <span style={{
                  fontSize: '9px',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  background: zone.oms_compliant ? '#22c55e22' : '#e24b4a22',
                  color: zone.oms_compliant ? '#22c55e' : '#e24b4a'
                }}>
                  {zone.oms_compliant ? '✓ OMS' : '✗ OMS'}
                </span>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>
                  {zone.vegetation_m2_hab}m²/hab · {zone.lst}°C
                </span>
              </div>
            </div>

            {/* Barra de progresso de vegetação */}
            <div style={{ background: '#0a0e1a', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                borderRadius: '4px',
                // Cor baseada no cumprimento da norma OMS
                background: zone.oms_compliant ? '#22c55e' : zone.vegetation_m2_hab > 5 ? '#f5a623' : '#e24b4a',
                // Largura proporcional ao máximo de Parelheiros (100m²)
                width: `${Math.min(zone.vegetation_m2_hab, 100)}%`,
                transition: 'width 0.5s ease'
              }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Nota científica com fonte */}
      <div style={{
        marginTop: '12px', padding: '8px', background: '#0a0e1a',
        borderRadius: '6px', borderLeft: '3px solid #22c55e'
      }}>
        <div style={{ fontSize: '10px', color: '#4b5563', lineHeight: '1.5' }}>
          OMS recomenda mín. 12m²/hab · Fonte: LABVERDE/USP (2020) · SVMA SP (2017)
        </div>
      </div>
    </div>
  );
}

export default VegetationPanel;