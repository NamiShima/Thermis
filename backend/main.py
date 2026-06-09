from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Permite que o frontend acesse o backend
from routers import zones, alerts, sensor, history  # Importa todos os roteadores

# Cria a instância principal da aplicação FastAPI
app = FastAPI(title="THERMIS API", version="1.0.0")

# Configura CORS para aceitar requisições do frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Aceita qualquer origem (dev mode)
    allow_methods=["*"],   # Aceita todos os métodos HTTP
    allow_headers=["*"],   # Aceita todos os headers
)

# Registra as rotas de cada módulo com seus prefixos
app.include_router(zones.router,   prefix="/zones",   tags=["Zones"])
app.include_router(alerts.router,  prefix="/alerts",  tags=["Alerts"])
app.include_router(sensor.router,  prefix="/sensor",  tags=["Sensor"])
app.include_router(history.router, prefix="/history", tags=["History"])  # Nova rota

# Rota raiz — confirma que a API está online
@app.get("/")
def root():
    return {"status": "THERMIS online", "version": "1.0.0"}