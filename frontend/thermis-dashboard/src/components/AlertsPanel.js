import React from 'react';

function AlertsPanel({ alerts }) {
  // Define cor e ícone baseado na severidade do alerta
  const getSeverityStyle = (severity) => {
    if (severity === 'critical') return { color: '#e24b4a', icon: '🔴', label: 'CRÍTICO' };
    if (severity === 'warning')  return { color: '#f5a623', icon: '🟡', label: 'ATENÇÃO' };
    return                              { color: '#4a9eff', icon: '🔵', label: 'INFO'    };
  };

  return (
    <div className="card">
      {/* Título do painel */}
      <div className="card-title">⚡ Alertas Ativos</div>

      {/* Lista de alertas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {alerts.map((alert) => {
          const style = getSeverityStyle(alert.severity);
          return (
            <div key={alert.id} style={{
              background: '#0a0e1a',
              border: `1px solid ${style.color}`,  // Borda colorida por severidade
              borderRadius: '6px',
              padding: '10px 12px',
              borderLeft: `3px solid ${style.color}` // Destaque lateral colorido
            }}>
              {/* Cabeçalho do alerta com zona e severidade */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: style.color }}>
                  {style.icon} {alert.zone}
                </span>
                <span style={{
                  fontSize: '10px', color: style.color,
                  background: `${style.color}22`,  // Fundo semitransparente da cor
                  padding: '2px 6px', borderRadius: '4px'
                }}>
                  {style.label}
                </span>
              </div>

              {/* Mensagem do alerta */}
              <div style={{ fontSize: '11px', color: '#9ca3af', lineHeight: '1.5' }}>
                {alert.message}
              </div>

              {/* Temperatura e horário do alerta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: style.color }}>
                  {alert.lst}°C
                </span>
                <span style={{ fontSize: '10px', color: '#4b5563' }}>
                  {new Date(alert.timestamp).toLocaleTimeString('pt-BR')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AlertsPanel;