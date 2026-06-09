import React, { useState, useEffect } from 'react';

function CorrelationChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/history/correlation')
      .then(res => res.json())
      .then(raw => setData(raw))
      .catch(err => console.error('Erro:', err));
  }, []);

  // Retorna cor baseada no valor normalizado de 0 a 1
  const getHeatColor = (value, min, max, invert = false) => {
    const ratio = (value - min) / (max - min);
    const r = invert ? ratio : 1 - ratio;
    // Gradiente do azul escuro ao vermelho
    const colors = [
      [10, 14, 26],    // Azul escuro — valor baixo
      [83, 52, 131],   // Roxo — valor médio-baixo
      [245, 166, 35],  // Laranja — valor médio-alto
      [226, 75, 74],   // Vermelho — valor alto
    ];
    const scaled = r * (colors.length - 1);
    const idx = Math.floor(scaled);
    const t = scaled - idx;
    const c1 = colors[Math.min(idx, colors.length - 1)];
    const c2 = colors[Math.min(idx + 1, colors.length - 1)];
    const rgb = c1.map((v, i) => Math.round(v + t * (c2[i] - v)));
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  };

  // Métricas exibidas no heatmap
  const metrics = [
    { key: 'lst',       label: 'LST (°C)',        invert: false, unit: '°C'       },
    { key: 'vegetation',label: 'Vegetação',        invert: true,  unit: 'm²/hab'  },
    { key: 'density',   label: 'Densidade Urbana', invert: false, unit: 'hab/km²' },
  ];

  return (
    <div className="card">
      <div className="card-title">🌡️ Mapa de Calor — Indicadores por Zona</div>

      {/* Tabela heatmap */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
          {/* Cabeçalho com nomes das métricas */}
          <thead>
            <tr>
              <th style={{ color: '#6b7280', padding: '4px 6px', textAlign: 'left', fontWeight: 400 }}>
                Bairro
              </th>
              {metrics.map(m => (
                <th key={m.key} style={{ color: '#6b7280', padding: '4px 6px', textAlign: 'center', fontWeight: 400 }}>
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Linhas com células coloridas por intensidade */}
          <tbody>
            {data.map((zone, i) => (
              <tr key={i}>
                {/* Nome do bairro */}
                <td style={{ color: '#e0e6f0', padding: '4px 6px', whiteSpace: 'nowrap' }}>
                  {zone.zone}
                </td>

                {/* Célula colorida para cada métrica */}
                {metrics.map(m => {
                  const values = data.map(d => d[m.key]);
                  const min = Math.min(...values);
                  const max = Math.max(...values);
                  const bg = getHeatColor(zone[m.key], min, max, m.invert);

                  return (
                    <td key={m.key} style={{ padding: '3px 4px', textAlign: 'center' }}>
                      <div style={{
                        background: bg,
                        borderRadius: '4px',
                        padding: '5px 4px',
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: '10px',
                        minWidth: '70px'
                      }}>
                        {/* Formata número de acordo com a unidade */}
                        {m.key === 'density'
                          ? zone[m.key].toLocaleString('pt-BR')
                          : zone[m.key]}
                        <span style={{ fontSize: '8px', opacity: 0.8 }}> {m.unit}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legenda de cores */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
        <span style={{ fontSize: '9px', color: '#4b5563' }}>Baixo</span>
        <div style={{
          flex: 1, height: '6px', borderRadius: '3px',
          background: 'linear-gradient(to right, #0a0e1a, #533483, #f5a623, #e24b4a)'
        }}/>
        <span style={{ fontSize: '9px', color: '#4b5563' }}>Alto</span>
      </div>

      {/* Fonte científica */}
      <div style={{
        marginTop: '8px', padding: '8px', background: '#0a0e1a',
        borderRadius: '6px', borderLeft: '3px solid #e24b4a'
      }}>
        <div style={{ fontSize: '10px', color: '#4b5563', lineHeight: '1.5' }}>
          Correlação negativa: ↑ vegetação → ↓ LST · Fonte: UNESP (2019) · LABVERDE/USP (2020)
        </div>
      </div>
    </div>
  );
}

export default CorrelationChart;