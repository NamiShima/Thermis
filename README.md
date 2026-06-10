# THERMIS
### 🛰️ Monitoramento Inteligente de Ilhas de Calor Urbano · São Paulo

## Integrantes

- Jacqueline Nanami Matushima — RM568498
- Pedro Zanon Castro Santana — RM567350
- Victor Araujo Ferreira da Silva — RM567619

## Professores

### Tutor(a)
- Sabrina Otoni

### Coordenador(a)
- André Godoi Chiovato

---

## 📜 Descrição

Em São Paulo, os bairros densamente construídos registram temperaturas de superfície até 10°C acima das áreas vegetadas, e 16 subprefeituras têm menos de 5m²/hab de área verde abaixo do mínimo recomendado pela OMS. As regiões mais quentes coincidem com as populações mais vulneráveis, portanto o Thermis foi construído para mudar isso. 
O Thermis utiliza dados de satélite (NASA MODIS e Sentinel-2) combinados com Inteligência Artificial para monitorar, classificar e prever zonas de risco térmico em tempo real na cidade de São Paulo. A solução integra sensoriamento remoto, machine learning, visão computacional (NDVI), banco de dados SQLite, IoT e computação em nuvem em uma plataforma unificada de monitoramento urbano.

---

## 🛠 Tecnologias Utilizadas

| Camada | Tecnologia | Função |
|--------|------------|--------|
| Frontend | React.js, Leaflet, Recharts | Dashboard interativo estilo Mission Control |
| Backend | Python, FastAPI | API REST com 10 rotas documentadas |
| Machine Learning | Scikit-learn, Regressão Linear | Classificação de risco e predição de temperatura |
| Visão Computacional | NDVI Sentinel-2 (B4/B8) | Análise de cobertura vegetal orbital |
| Banco de Dados | SQLite + SQLAlchemy | Persistência de leituras, alertas e dados IoT |
| Dados Satelitais | NASA MODIS, Sentinel-2 | LST e reflectância orbital |
| IoT | ESP32 + Sensor DHT22 | Sensor local de temperatura e umidade (simulado) |
| Cloud | AWS Lambda + S3 + SNS | Processamento serverless (arquitetura simulada) |
| Versionamento | Git, GitHub | Controle de versão e repositório |

---

## ⚙️ Funcionalidades

- Mapa interativo de temperatura de superfície (LST) por bairro de São Paulo com manchas de calor coloridas
- Classificação automática de zonas de risco em quatro níveis: Crítica (>=42°C), Alerta (38-42°C), Moderada (34-38°C) e Normal (<34°C)
- Histórico de temperatura dos últimos 7 dias por bairro com gráfico de linha
- Previsão de temperatura para as próximas 6 horas com modelo de IA e índice de confiança
- Índice NDVI (Normalized Difference Vegetation Index) via Sentinel-2 por bairro
- Índice de cobertura vegetal com referência à norma OMS (mínimo 12m²/hab)
- Mapa de calor multidimensional: LST, Vegetação e Densidade Urbana
- Banco de dados SQLite com persistência de leituras, alertas e dados do sensor
- Leitura simulada de sensor ESP32 + DHT22 com temperatura, umidade e índice de calor em tempo real
- Alertas automáticos para zonas em situação crítica

---

## 📁 Estrutura de Pastas

```
THERMIS/
├── backend/
│   ├── main.py               — Aplicação principal FastAPI + banco de dados
│   ├── ml_model.py           — Modelo de classificação de risco térmico
│   ├── ndvi_analysis.py      — Análise NDVI via Sentinel-2
│   ├── database.py           — Modelos SQLite com SQLAlchemy
│   ├── aws_lambda.py         — Arquitetura AWS Lambda simulada
│   └── routers/
│       ├── zones.py          — Rotas de zonas e classificação
│       ├── alerts.py         — Rotas de alertas
│       ├── sensor.py         — Rotas do sensor ESP32
│       ├── history.py        — Histórico e predição
│       └── ndvi.py           — Rotas NDVI Sentinel-2
├── esp32/
│   └── sensor_dht22.ino      — Código do sensor ESP32 + DHT22
├── frontend/
│   └── thermis-dashboard/
│       ├── public/
│       └── src/
│           ├── components/
│           │   ├── Header.js
│           │   ├── MapPanel.js
│           │   ├── MetricsPanel.js
│           │   ├── AlertsPanel.js
│           │   ├── SensorPanel.js
│           │   ├── HistoryChart.js
│           │   ├── PredictionPanel.js
│           │   ├── VegetationPanel.js
│           │   ├── NDVIPanel.js
│           │   └── CorrelationChart.js
│           ├── App.js
│           └── index.js
├── docs/
├── data/
├── .gitignore
└── README.md
```

---

## 🔧 Como Executar

### Pré-requisitos

- Python 3.10+
- Node.js 18+
- Git

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn scikit-learn pandas numpy requests python-dotenv sqlalchemy matplotlib pillow rasterio scikit-image
uvicorn main:app --reload
```

A API estará disponível em: http://localhost:8000

Documentação interativa: http://localhost:8000/docs

### Frontend

```bash
cd frontend/thermis-dashboard
npm install
npm start
```

A aplicação estará disponível em: http://localhost:3000

---

## 🔄 Pipeline de Dados

```
Fontes de dados satelitais (NASA MODIS / Sentinel-2)
                    |
     AWS Lambda + EventBridge (processamento serverless)
                    |
         Backend Python + FastAPI
      (classificação ML + cálculo NDVI)
                    |
     SQLite + SQLAlchemy (persistência de dados)
                    |
    API REST com 10 rotas (zones, alerts, sensor,
         history, ndvi, db)
                    |
  Dashboard React + Leaflet + Recharts
         (visualização interativa)
                    |
      ESP32 + DHT22 (sensor IoT local)
```

---

## 📡 Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /zones/ | Lista todas as zonas com classificação de risco |
| GET | /alerts/ | Retorna alertas ativos |
| GET | /sensor/esp32 | Leitura simulada do sensor ESP32 |
| GET | /history/weekly | Histórico de temperatura dos últimos 7 dias |
| GET | /history/prediction/{zone} | Previsão de temperatura para as próximas 6 horas |
| GET | /history/vegetation | Índice de cobertura vegetal por zona |
| GET | /history/correlation | Dados de correlação para análise multidimensional |
| GET | /ndvi/ | NDVI Sentinel-2 por bairro |
| GET | /db/zones | Zonas persistidas no banco SQLite |
| GET | /db/stats | Estatísticas gerais do banco de dados |

---

## 🗃 Histórico de Lançamentos

* 1.0.0 - 09/06/2026
    * Dashboard completo com mapa interativo de ilhas de calor
    * API REST com 10 rotas documentadas
    * Análise NDVI via Sentinel-2
    * Banco de dados SQLite com SQLAlchemy
    * Sensor ESP32 + DHT22 simulado
    * Arquitetura AWS Lambda simulada
    * Predição de temperatura com IA

---

## 📎 Links e Observações

- **Repositório GitHub:** https://github.com/NamiShima/Thermis
- **Vídeo demonstrativo:** [INSERIR LINK DO YOUTUBE APÓS GRAVAÇÃO]
- **Observação:** Este projeto concorre ao pódio da Global Solution — FIAP

---

## 📋 Licença

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/agodoi/template">MODELO GIT FIAP</a> por <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://fiap.com.br">FIAP</a> está licenciado sobre <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International</a>.</p>
