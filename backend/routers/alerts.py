from fastapi import APIRouter

router = APIRouter()  # Cria o roteador de alertas

# Lista de alertas gerados pelo sistema com base nas zonas críticas
ALERTS = [
    {
        "id": 1,
        "zone": "Centro",
        "severity": "critical",  # Nível crítico de severidade
        "message": "Temperatura 6°C acima da média histórica. Risco de estresse térmico elevado para população vulnerável.",
        "timestamp": "2026-06-08T14:32:00",
        "lst": 44.2  # Temperatura registrada no momento do alerta
    },
    {
        "id": 2,
        "zone": "Brás",
        "severity": "critical",
        "message": "Ilha de calor intensificada. Cobertura vegetal abaixo de 5% na área.",
        "timestamp": "2026-06-08T14:28:00",
        "lst": 43.1
    },
    {
        "id": 3,
        "zone": "Tatuapé",
        "severity": "warning",  # Nível de atenção, menos grave que critical
        "message": "Temperatura em elevação nas últimas 3h. Monitoramento contínuo ativado.",
        "timestamp": "2026-06-08T14:15:00",
        "lst": 40.3
    },
]

# Rota GET /alerts/ = retorna todos os alertas ativos
@router.get("/")
def get_alerts():
    return ALERTS

# Rota GET /alerts/latest = retorna apenas o alerta mais recente
@router.get("/latest")
def get_latest():
    return ALERTS[0]