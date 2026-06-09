from fastapi import APIRouter
import random           # Para simular variação nos dados do sensor
from datetime import datetime  # Para registrar o timestamp da leitura

router = APIRouter()  # Cria o roteador do sensor ESP32

# Rota GET /sensor/esp32 = simula leitura em tempo real do sensor físico DHT22
@router.get("/esp32")
def get_sensor_data():
    base_temp = 38.5  # Temperatura base do Centro de SP

    # Simula umidade relativa do ar entre 35% e 55%
    humidity = round(random.uniform(35, 55), 1)

    # Simula temperatura com variação de ±1.5 a +2.5°C em relação à base
    temperature = round(base_temp + random.uniform(-1.5, 2.5), 1)

    # Calcula índice de calor (sensação térmica) com base em temperatura e umidade
    heat_index = round(temperature + (0.33 * (humidity / 100 * 6.105)) - 4.0, 1)

    return {
        "device_id": "ESP32-THERMIS-001",     # ID único do dispositivo
        "location": "Centro, São Paulo",       # Localização física do sensor
        "temperature_c": temperature,          # Temperatura medida em Celsius
        "humidity_pct": humidity,              # Umidade relativa em porcentagem
        "heat_index": heat_index,              # Sensação térmica calculada
        "timestamp": datetime.now().isoformat(), # Momento exato da leitura
        "status": "online"                     # Status do dispositivo
    }