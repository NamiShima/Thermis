import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function PredictionPanel() {
  // Estado com as previsões da IA
  const [predictions, setPredictions] = useState([]);
  // Bairro selecionado para previsão
  const [selectedZone, setSelectedZone] = useState('Centro');
  // Confiança média do modelo
  const [avgConfidence, setAvgConfidence] = useState(0);

  // Lista de zonas disponíveis para previsão
  const zones = ['Centro', 'Brás', 'Mooca', 'Pinheiros', 'Parelheiros'];

  // Busca previsão quando o bairro muda
  useEffect(() => {
    fetch(`http://localhost:8000/history/prediction/${selectedZone}`)
      .then(res => res.json())
      .then(data => {
        setPredictions(data.predictions);
        // Calcula a confiança média do modelo
        const avg = data.predictions.reduce((s, p) => s + p.confidence, 0) / data.predictions.length;
        setAvgConfidence(avg.toFixed(1));
      })
      .catch(err => console.error('Erro ao buscar previsão:', err));
  }, [selectedZone]);

  // Define cor da barra baseada na temperatura prevista
  const getBarColor = (temp) => {
    if (temp >= 42) return '#e24b4a';  // Crítica
    if (temp >= 38) return '#f5a623';  // Alerta
    if (temp >= 34) return '#533483';  // Moderada
    return '#4a9eff';                  // Normal
  };

  return (
    <div className="card">
      {/* Cabeçalho com título e badge de confiança */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div className="card-title" style={{ margin: 0 }}>🔮 Previsão IA — Próximas 6h</div>
        <span style={{
          fontSize: '10px', color: '#22c55e',
          background: '#22c55e22', padding: '2px 8px', borderRadius: '4px'
        }}>
          {avgConfidence}% confiança
        </span>
      </div>

      {/* Seletor de bairro */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {zones.map(zone => (
          <button
            key={zone}
            onClick={() => setSelectedZone(zone)}
            style={{
              fontSize: '10px',
              padding: '3px 8px',
              borderRadius: '4px',
              border: `1px solid ${selectedZone === zone ? '#4a9eff' : '#1e3a5f'}`,
              background: selectedZone === zone ? '#1a3a6e' : 'transparent',
              color: selectedZone === zone ? '#4a9eff' : '#6b7280',
              cursor: 'pointer'
            }}
          >
            {zone}
          </button>
        ))}
      </div>

      {/* Gráfico de barras com previsão */}
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={predictions} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
          <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 10 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} domain={[25, 50]} />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #1e3a5f', borderRadius: '6px' }}
            labelStyle={{ color: '#e0e6f0' }}
            formatter={(value) => [`${value}°C`, 'Temp. prevista']}
          />
          <Bar dataKey="temperature" radius={[3, 3, 0, 0]}>
            {predictions.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.temperature)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Rodapé com modelo usado */}
      <div style={{ fontSize: '10px', color: '#4b5563', marginTop: '8px', textAlign: 'right' }}>
        Modelo: Linear Regression + LST Diurnal Pattern
      </div>
    </div>
  );
}

export default PredictionPanel;