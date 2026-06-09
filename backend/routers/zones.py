from fastapi import APIRouter
from ml_model import classify  # Importa a função de classificação de risco

router = APIRouter()  # Cria o roteador de zonas

# Lista de bairros de SP com coordenadas e LST simulada
# Dados baseados em período de calor (março/abril) — Amorim (2019) UNESP
# LST (Land Surface Temperature) = temperatura da superfície captada por satélite
SP_ZONES = [
    {"id": 1,  "name": "Centro",            "lat": -23.5505, "lng": -46.6333, "lst": 44.2},  # Alta densidade — asfalto retém calor
    {"id": 2,  "name": "Brás",              "lat": -23.5489, "lng": -46.6188, "lst": 43.1},  # Conjunto habitacional popular — baixa vegetação
    {"id": 3,  "name": "Mooca",             "lat": -23.5558, "lng": -46.6027, "lst": 42.8},  # Bairro densamente construído
    {"id": 4,  "name": "Ipiranga",          "lat": -23.5894, "lng": -46.6114, "lst": 41.5},  # Zona industrial — superfícies impermeáveis
    {"id": 5,  "name": "Santana",           "lat": -23.5019, "lng": -46.6277, "lst": 38.9},  # Bairro misto — temperatura intermediária
    {"id": 6,  "name": "Pinheiros",         "lat": -23.5631, "lng": -46.6897, "lst": 34.4},  # Bairro arborizado — menor LST
    {"id": 7,  "name": "Vila Madalena",     "lat": -23.5534, "lng": -46.6917, "lst": 33.8},  # Alta arborização — boa cobertura vegetal
    {"id": 8,  "name": "Perdizes",          "lat": -23.5374, "lng": -46.6664, "lst": 33.2},  # Bairro residencial arborizado
    {"id": 9,  "name": "Lapa",              "lat": -23.5224, "lng": -46.7011, "lst": 36.1},  # Zona mista — temperatura moderada
    {"id": 10, "name": "Tatuapé",           "lat": -23.5411, "lng": -46.5769, "lst": 40.3},  # Alta densidade — pouca vegetação
    {"id": 11, "name": "Itaquera",          "lat": -23.5369, "lng": -46.4558, "lst": 39.7},  # Periferia densa — baixa cobertura vegetal
    {"id": 12, "name": "Cidade Tiradentes", "lat": -23.5893, "lng": -46.3972, "lst": 38.2},  # Conjunto habitacional periférico
    {"id": 13, "name": "Parelheiros",       "lat": -23.8275, "lng": -46.7278, "lst": 24.1},  # Parque Estadual Serra do Mar — máxima vegetação
    {"id": 14, "name": "Parque do Estado",  "lat": -23.6467, "lng": -46.6228, "lst": 27.4},  # Área verde urbana — LST reduzida
    {"id": 15, "name": "Santo André",       "lat": -23.6639, "lng": -46.5383, "lst": 40.8},  # Região industrial — superfícies quentes
]

# Rota GET /zones/ — retorna todas as zonas com classificação de risco
@router.get("/")
def get_zones():
    result = []
    for zone in SP_ZONES:
        classification = classify(zone["lst"])  # Classifica cada zona pela temperatura
        result.append({**zone, **classification})  # Junta dados da zona com classificação
    return result

# Rota GET /zones/{id} — retorna uma zona específica pelo ID
@router.get("/{zone_id}")
def get_zone(zone_id: int):
    zone = next((z for z in SP_ZONES if z["id"] == zone_id), None)  # Busca zona pelo ID
    if not zone:
        return {"error": "Zone not found"}  # Retorna erro se não encontrar
    classification = classify(zone["lst"])  # Classifica a zona encontrada
    return {**zone, **classification}