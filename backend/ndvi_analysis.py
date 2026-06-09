import numpy as np
import matplotlib
matplotlib.use('Agg')  # Usa backend sem interface grafica
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from io import BytesIO
import base64

# =============================================
# THERMIS - Analise NDVI com Sentinel-2
# NDVI = (NIR - RED) / (NIR + RED)
# Valores: -1 a 0 = sem vegetacao
#           0 a 0.2 = vegetacao escassa
#           0.2 a 0.4 = vegetacao moderada
#           0.4 a 1.0 = vegetacao densa
# =============================================

# Dados simulados de reflectancia Sentinel-2
# Baseados em valores reais de banda NIR (B8) e RED (B4)
# Fonte: ESA Sentinel-2 User Handbook, 2015
SENTINEL2_DATA = {
    "Centro":      {"nir": 0.08, "red": 0.07, "lat": -23.5505, "lng": -46.6333},
    "Bras":        {"nir": 0.07, "red": 0.06, "lat": -23.5489, "lng": -46.6188},
    "Mooca":       {"nir": 0.09, "red": 0.08, "lat": -23.5558, "lng": -46.6027},
    "Ipiranga":    {"nir": 0.11, "red": 0.09, "lat": -23.5894, "lng": -46.6114},
    "Santana":     {"nir": 0.15, "red": 0.10, "lat": -23.5019, "lng": -46.6277},
    "Pinheiros":   {"nir": 0.25, "red": 0.12, "lat": -23.5631, "lng": -46.6897},
    "Vila Madalena":{"nir": 0.28, "red": 0.13, "lat": -23.5534, "lng": -46.6917},
    "Perdizes":    {"nir": 0.30, "red": 0.14, "lat": -23.5374, "lng": -46.6664},
    "Parelheiros": {"nir": 0.65, "red": 0.10, "lat": -23.8275, "lng": -46.7278},
    "Parque do Estado": {"nir": 0.55, "red": 0.12, "lat": -23.6467, "lng": -46.6228},
}

def calculate_ndvi(nir: float, red: float) -> float:
    """
    Calcula o Indice de Vegetacao por Diferenca Normalizada (NDVI).
    Formula: NDVI = (NIR - RED) / (NIR + RED)
    Fonte: Rouse et al. (1974)
    """
    if (nir + red) == 0:
        return 0.0
    return round((nir - red) / (nir + red), 4)

def classify_ndvi(ndvi: float) -> dict:
    """
    Classifica a cobertura vegetal baseada no valor NDVI.
    Limiares baseados em Rosa (2018) USP - Sentinel-2 SP.
    """
    if ndvi < 0.0:
        return {"label": "Agua/Nuvem",     "color": "#1a6aff", "level": 0}
    elif ndvi < 0.2:
        return {"label": "Sem Vegetacao",  "color": "#e24b4a", "level": 1}
    elif ndvi < 0.4:
        return {"label": "Veg. Escassa",   "color": "#f5a623", "level": 2}
    elif ndvi < 0.6:
        return {"label": "Veg. Moderada",  "color": "#90c945", "level": 3}
    else:
        return {"label": "Veg. Densa",     "color": "#22c55e", "level": 4}

def get_all_ndvi() -> list:
    """
    Retorna NDVI calculado para todos os bairros monitorados.
    Simula processamento de imagens Sentinel-2 banda B4 (RED) e B8 (NIR).
    """
    result = []
    for zone, data in SENTINEL2_DATA.items():
        ndvi = calculate_ndvi(data["nir"], data["red"])
        classification = classify_ndvi(ndvi)
        result.append({
            "zone":       zone,
            "ndvi":       ndvi,
            "nir":        data["nir"],
            "red":        data["red"],
            "lat":        data["lat"],
            "lng":        data["lng"],
            "label":      classification["label"],
            "color":      classification["color"],
            "level":      classification["level"],
            "source":     "Sentinel-2 B4/B8 simulado"
        })
    return sorted(result, key=lambda x: x["ndvi"])

def generate_ndvi_chart() -> str:
    """
    Gera grafico de barras NDVI por bairro.
    Retorna imagem em base64 para exibicao no dashboard.
    """
    data = get_all_ndvi()
    zones = [d["zone"] for d in data]
    ndvi_values = [d["ndvi"] for d in data]
    colors = [d["color"] for d in data]

    fig, ax = plt.subplots(figsize=(10, 5))
    fig.patch.set_facecolor('#111827')
    ax.set_facecolor('#0a0e1a')

    bars = ax.barh(zones, ndvi_values, color=colors, edgecolor='none', height=0.6)

    # Linha de referencia OMS (vegetacao minima recomendada)
    ax.axvline(x=0.2, color='#ffffff', linestyle='--', alpha=0.5, label='Limite min. vegetacao')

    ax.set_xlabel('NDVI', color='#6b7280', fontsize=10)
    ax.set_title('NDVI por Bairro - Sentinel-2', color='#4a9eff', fontsize=12, pad=10)
    ax.tick_params(colors='#6b7280')
    ax.spines['bottom'].set_color('#1e3a5f')
    ax.spines['left'].set_color('#1e3a5f')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.legend(facecolor='#111827', labelcolor='#6b7280', fontsize=8)
    ax.set_xlim(-0.1, 0.8)

    # Adiciona valores nas barras
    for bar, val in zip(bars, ndvi_values):
        ax.text(val + 0.01, bar.get_y() + bar.get_height()/2,
                f'{val:.3f}', va='center', ha='left', color='#e0e6f0', fontsize=8)

    plt.tight_layout()

    # Converte para base64
    buffer = BytesIO()
    plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight',
                facecolor='#111827', edgecolor='none')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    plt.close()

    return image_base64