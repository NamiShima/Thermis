import React from 'react';

function MetricsPanel({ zones }) {
  // Calcula a temperatura média de todas as zonas
  const avgTemp = zones.length
    ? (zones.reduce((sum, z) => sum + z.lst, 0) / zones.length).toFixed(1)
    : '--';

  // Conta quantas zonas estão em nível crítico
  const criticalCount = zones.filter(z => z.label === 'Crítica').length;

  // Conta quantas zonas estão em alerta
  const alertCount = zones.filter(z => z.label === 'Alerta').length;

  // Temperatura máxima registrada entre todas as zonas
  const maxTemp = zones.length
    ? Math.max(...zones.map(z => z.lst)).toFixed(1)
    : '--';

  // Dados dos cards de métricas
  const metrics = [
    {
      label: 'Temperatura Média SP',
      value: `${avgTemp}°C`,
      sub: '+4.1°C acima da média histórica',
      color: '#e24b4a',        // Vermelho para temperatura alta
      icon: '🌡️'
    },
    {
      label: 'Zonas Críticas',
      value: criticalCount,
      sub: 'Acima de 42°C',
      color: '#e24b4a',
      icon: '⚠️'
    },
    {
      label: 'Zonas em Alerta',
      value: alertCount,
      sub: 'Entre 38°C e 42°C',
      color: '#f5a623',        // Laranja para alerta
      icon: '🔶'
    },
    {
      label: 'Pico de Temperatura',
      value: `${maxTemp}°C`,
      sub: 'Máxima registrada hoje',
      color: '#f5a623',
      icon: '📡'
    },
    {
      label: 'Fonte de Dados',
      value: 'NASA MODIS',
      sub: 'Satélite Terra · Band 31',
      color: '#4a9eff',        // Azul para informações técnicas
      icon: '🛰️'
    },
    {
      label: 'Última Atualização',
      value: 'Ao vivo',
      sub: new Date().toLocaleTimeString('pt-BR'),
      color: '#22c55e',        // Verde para status online
      icon: '🟢'
    },
  ];

  return (
    // Grid de 6 cards de métricas
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '12px'
    }}>
      {metrics.map((m, i) => (
        <div key={i} style={{
          background: '#111827',
          border: '1px solid #1e3a5f',
          borderRadius: '8px',
          padding: '14px 16px',
          borderTop: `2px solid ${m.color}` /* Linha colorida no topo indica categoria */
        }}>
          {/* Ícone e label da métrica */}
          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', letterSpacing: '0.05em' }}>
            {m.icon} {m.label}
          </div>
          {/* Valor principal da métrica */}
          <div style={{ fontSize: '22px', fontWeight: '700', color: m.color }}>
            {m.value}
          </div>
          {/* Informação complementar */}
          <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '4px' }}>
            {m.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MetricsPanel;