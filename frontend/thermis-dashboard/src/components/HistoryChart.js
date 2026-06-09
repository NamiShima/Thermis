import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function HistoryChart() {
  // Estado que armazena o histórico de 7 dias
  const [history, setHistory] = useState([]);

  // Busca o histórico da API ao montar o componente
  useEffect(() => {
    fetch('http://localhost:8000/history/weekly')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error('Erro ao buscar histórico:', err));
  }, []);

  // Cores de cada bairro no gráfico
  const colors = {
    Centro:      '#e24b4a',  // Vermelho — zona crítica
    Brás:        '#f5a623',  // Laranja — zona de alerta
    Mooca:       '#BA7517',  // Âmbar — zona de alerta
    Pinheiros:   '#533483',  // Roxo — zona moderada
    Parelheiros: '#4a9eff',  // Azul — zona normal
  };

  return (
    <div className="card">
      <div className="card-title">📈 Histórico LST — Últimos 7 dias</div>

      {/* Gráfico de linhas com Recharts */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          {/* Grade de fundo sutil */}
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />

          {/* Eixo X com as datas */}
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} />

          {/* Eixo Y com temperaturas */}
          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} domain={[25, 50]} />

          {/* Tooltip ao passar o mouse */}
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #1e3a5f', borderRadius: '6px' }}
            labelStyle={{ color: '#e0e6f0' }}
            itemStyle={{ color: '#e0e6f0' }}
            formatter={(value) => [`${value}°C`]}
          />

          {/* Legenda dos bairros */}
          <Legend wrapperStyle={{ fontSize: '10px', color: '#6b7280' }} />

          {/* Uma linha por bairro */}
          {Object.entries(colors).map(([zone, color]) => (
            <Line
              key={zone}
              type="monotone"
              dataKey={zone}
              stroke={color}
              strokeWidth={2}
              dot={false}        // Sem pontos para ficar mais limpo
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Fonte dos dados */}
      <div style={{ fontSize: '10px', color: '#4b5563', marginTop: '8px', textAlign: 'right' }}>
        Fonte: NASA MODIS · Landsat 8 · Amorim (2019) UNESP
      </div>
    </div>
  );
}

export default HistoryChart;