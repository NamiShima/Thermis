# THERMIS

Sistema inteligente de monitoramento de ilhas de calor urbano em São Paulo, desenvolvido como Prova de Conceito (POC) para a Global Solution da FIAP.

---

## Integrantes

- Jacqueline Nanami Matushima
- Pedro Zanon Castro Santana
- Victor Araujo Ferreira da Silva

---

## Problema

São Paulo é uma das metrópoles brasileiras mais afetadas pelas ilhas de calor urbano, pois a substituição da cobertura vegetal por superfícies impermeáveis eleva a temperatura de superfície (LST) em até 10°C acima das áreas vegetadas, impactando diretamente a saúde da população mais vulnerável. Segundo a SVMA (2017), 16 subprefeituras de São Paulo apresentam índice de área verde inferior a 5m²/hab, bem abaixo dos 12m²/hab recomendados pela OMS, portanto, o monitoramento inteligente das zonas de risco térmico torna-se essencial para subsidiar políticas públicas urbanas mais equitativas.
---

## Solução

O THERMIS utiliza dados de satélite (NASA MODIS e Sentinel-2) combinados com Inteligência Artificial para monitorar, classificar e prever zonas de risco térmico em tempo real na cidade de São Paulo. A solução integra sensoriamento remoto, machine learning, visualização interativa e IoT em uma plataforma unificada de monitoramento urbano.

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| Frontend | React.js, Leaflet, Recharts |
| Backend | Python, FastAPI |
| Machine Learning | Scikit-learn, Regressão Linear, Padrão Diurno LST |
| Dados satelitais | NASA MODIS, Sentinel-2 |
| IoT | ESP32 + Sensor DHT22 (simulado) |
| Cloud | AWS Lambda + S3 (arquitetura simulada) |
| Versionamento | Git, GitHub |

---

## Funcionalidades

- Mapa interativo de temperatura de superfície (LST) por bairro de São Paulo
- Classificação automática de zonas de risco: Crítica, Alerta, Moderada e Normal
- Histórico de temperatura dos últimos 7 dias por bairro
- Previsão de temperatura para as próximas 6 horas com modelo de IA
- Índice de cobertura vegetal por zona com referência à norma OMS (mínimo 12m²/hab)
- Mapa de calor multidimensional: LST, Vegetação e Densidade Urbana
- Leitura simulada de sensor ESP32 com temperatura, umidade e índice de calor
- Alertas automáticos para zonas em situação crítica

---

## Base Científica

- AMORIM, M.C.C.T. Ilhas de calor superficiais: frequência da intensidade e variabilidade espacial em cidade de clima tropical continental. **Geo UERJ**, Rio de Janeiro, n. 34, 2019.
- FERREIRA, T.L.S. Vegetação, temperatura de superfície e morfologia urbana: um retrato da região metropolitana de São Paulo. **Revista Brasileira de Geografia Física**, 2019.
- ROSA, M.R. Classificação do padrão de ocupação urbana de São Paulo utilizando aprendizagem de máquina e Sentinel-2. **Revista do Departamento de Geografia**, USP, 2018.
- XIMENES, D.S.S. et al. A importância dos espaços públicos e áreas verdes pós-pandemia na cidade de São Paulo. **Revista LABVERDE**, FAUUSP, v. 10, n. 01, 2020.

---

## Como Executar

### Pré-requisitos

- Python 3.10+
- Node.js 18+
- Git

### Backend

    cd backend
    python -m venv venv
    venv\Scripts\activate
    pip install fastapi uvicorn scikit-learn pandas numpy requests python-dotenv
    uvicorn main:app --reload

A API estará disponível em: http://localhost:8000

A documentação interativa da API estará disponível em: http://localhost:8000/docs

### Frontend

    cd frontend/thermis-dashboard
    npm install
    npm start

A aplicação estará disponível em: http://localhost:3000

---

## Arquitetura da Solução

    Fontes de dados satelitais (NASA MODIS / Sentinel-2)
                        |
             Backend Python + FastAPI
             (processamento + modelo ML)
                        |
          Dashboard React + Leaflet + Recharts
             (visualização interativa)
                        |
             AWS Lambda + S3 (cloud)
                        |
          ESP32 + DHT22 (sensor IoT local)

---

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /zones/ | Lista todas as zonas com classificação de risco |
| GET | /alerts/ | Retorna alertas ativos |
| GET | /sensor/esp32 | Leitura simulada do sensor ESP32 |
| GET | /history/weekly | Histórico de temperatura dos últimos 7 dias |
| GET | /history/prediction/{zone} | Previsão de temperatura para as próximas 6 horas |
| GET | /history/vegetation | Índice de cobertura vegetal por zona |
| GET | /history/correlation | Dados de correlação para análise multidimensional |

---

## Estrutura do Repositório

    THERMIS/
    ├── backend/
    │   ├── main.py
    │   ├── ml_model.py
    │   └── routers/
    │       ├── zones.py
    │       ├── alerts.py
    │       ├── sensor.py
    │       └── history.py
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
    │           │   └── CorrelationChart.js
    │           ├── App.js
    │           └── index.js
    └── README.md

---
