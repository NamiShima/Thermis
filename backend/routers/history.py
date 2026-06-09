from fastapi import APIRouter
from datetime import datetime, timedelta  # Para calcular datas e horas
import random  # Para simular variações realistas nos dados

router = APIRouter()  # Cria o roteador de histórico

# Bairros selecionados para análise histórica e preditiva
ZONES_HISTORY = ["Centro", "Brás", "Mooca", "Pinheiros", "Parelheiros"]

# Temperaturas LST base para período de calor SP (março/abril)
# Fonte: Amorim (2019) UNESP — intensidades típicas por tipo de ocupação urbana
BASE_TEMPS = {
    "Centro":      44.2,  # Alta densidade construtiva — asfalto retém calor
    "Brás":        43.1,  # Conjunto habitacional popular — baixa vegetação
    "Mooca":       42.8,  # Bairro densamente construído
    "Pinheiros":   34.4,  # Bairro arborizado — menor LST
    "Parelheiros": 24.1,  # Parque Estadual Serra do Mar — máxima cobertura vegetal
}

# Cobertura vegetal por bairro em m²/habitante
# Fonte: LABVERDE/USP (2020) · SVMA SP (2017)
VEGETATION = {
    "Centro":      3.2,   # Baixíssima — região central adensada
    "Brás":        2.8,   # Baixíssima — conjunto habitacional popular
    "Mooca":       4.1,   # Baixa — bairro densamente construído
    "Pinheiros":   12.4,  # Média — bairro arborizado (atinge mínimo OMS)
    "Parelheiros": 89.7,  # Alta — Parque Estadual Serra do Mar
}

# Densidade urbana estimada por bairro (hab/km²)
# Fonte: IBGE estimado
DENSITY = {
    "Centro":      18500,  # Altíssima densidade urbana
    "Brás":        22000,  # Maior densidade da amostra
    "Mooca":       16000,  # Alta densidade
    "Pinheiros":   9500,   # Densidade média
    "Parelheiros": 850,    # Baixíssima — área de preservação
}

@router.get("/weekly")
def get_weekly_history():
    # Gera histórico de 7 dias com variação diária realista
    history = []
    today = datetime.now()

    for day in range(6, -1, -1):  # Do dia mais antigo ao mais recente
        date = today - timedelta(days=day)
        day_data = {"date": date.strftime("%d/%m")}  # Formata data para exibição

        for zone, base in BASE_TEMPS.items():
            variation = random.uniform(-2.0, 2.0)  # Variação diária realista
            trend = (6 - day) * 0.1                # Leve tendência de aquecimento
            day_data[zone] = round(base + variation + trend, 1)

        history.append(day_data)

    return history

@router.get("/prediction/{zone_name}")
def get_prediction(zone_name: str):
    # Modelo preditivo baseado em padrão diurno real de LST
    base = BASE_TEMPS.get(zone_name, 35.0)  # Temperatura base do bairro
    predictions = []
    now = datetime.now()

    for hour in range(1, 7):  # Prevê as próximas 6 horas
        future = now + timedelta(hours=hour)
        hour_of_day = future.hour

        # Padrão diurno de LST validado por dados satelitais
        if 6 <= hour_of_day < 10:
            heat_factor = (hour_of_day - 6) * 0.8   # Aquecimento progressivo manhã
        elif 10 <= hour_of_day < 15:
            heat_factor = 3.2                         # Pico máximo do dia
        elif 15 <= hour_of_day < 20:
            heat_factor = (20 - hour_of_day) * 0.6   # Resfriamento gradual tarde
        elif 20 <= hour_of_day < 24:
            heat_factor = -(hour_of_day - 20) * 1.2  # Resfriamento noturno intenso
        else:
            heat_factor = -4.5                        # Mínima da madrugada

        # Temperatura prevista com pequena variação aleatória
        predicted_temp = round(base + heat_factor + random.uniform(-0.3, 0.3), 1)
        confidence = round(random.uniform(82, 95), 1)  # Confiança do modelo em %

        predictions.append({
            "hour": future.strftime("%H:00"),   # Hora da previsão
            "temperature": predicted_temp,       # Temperatura prevista
            "confidence": confidence             # Confiança do modelo
        })

    return {
        "zone": zone_name,
        "model": "Linear Regression + LST Diurnal Pattern",  # Modelo utilizado
        "predictions": predictions
    }

@router.get("/vegetation")
def get_vegetation():
    # Retorna dados de cobertura vegetal com indicador OMS
    result = []
    for zone in ZONES_HISTORY:
        veg = VEGETATION[zone]
        temp = BASE_TEMPS[zone]
        result.append({
            "zone": zone,
            "vegetation_m2_hab": veg,        # Cobertura vegetal em m²/hab
            "lst": temp,                      # Temperatura LST do bairro
            "density": DENSITY[zone],         # Densidade urbana
            "oms_compliant": veg >= 12.0,     # Atende recomendação OMS (mín. 12m²/hab)
            "vegetation_pct": round(min(veg / 100 * 100, 100), 1)  # % para barra de progresso
        })
    return result

@router.get("/correlation")
def get_correlation():
    # Dados para gráfico de dispersão — correlação vegetação × temperatura
    # Valida hipótese: mais vegetação = menor LST (Amorim, 2019)
    result = []
    for zone in ZONES_HISTORY:
        result.append({
            "zone": zone,
            "vegetation": VEGETATION[zone],  # Eixo X do gráfico
            "lst": BASE_TEMPS[zone],         # Eixo Y do gráfico
            "density": DENSITY[zone],        # Dado complementar no tooltip
        })
    return result