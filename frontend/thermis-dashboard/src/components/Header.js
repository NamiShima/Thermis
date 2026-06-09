import React, { useState, useEffect } from 'react';

function Header() {
  // Estado que armazena o horário atual
  const [time, setTime] = useState(new Date());

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // Limpa o timer ao desmontar
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#111827',
      border: '1px solid #1e3a5f',
      borderRadius: '8px',
      padding: '12px 20px',
    }}>
      {/* Logo e nome do sistema */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: '#1a3a6e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}>🌡️</div>
        <div>
          {/* Nome do sistema */}
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#e0e6f0', letterSpacing: '0.05em' }}>
            THERMIS
          </div>
          {/* Subtítulo descritivo */}
          <div style={{ fontSize: '11px', color: '#4a9eff', letterSpacing: '0.1em' }}>
            THERMAL HEAT RISK MONITORING & INTELLIGENCE SYSTEM
          </div>
        </div>
      </div>

      {/* Informações do lado direito */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Indicador de status online */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 6px #22c55e' /* Brilho verde pulsante */
          }}/>
          <span style={{ fontSize: '12px', color: '#22c55e' }}>SISTEMA ONLINE</span>
        </div>

        {/* Fonte dos dados de satélite */}
        <div style={{ fontSize: '11px', color: '#6b7280', letterSpacing: '0.05em' }}>
          NASA MODIS · SENTINEL-2
        </div>

        {/* Relógio em tempo real */}
        <div style={{ fontSize: '13px', color: '#e0e6f0', fontFamily: 'monospace' }}>
          {time.toLocaleTimeString('pt-BR')}
        </div>
      </div>
    </div>
  );
}

export default Header;