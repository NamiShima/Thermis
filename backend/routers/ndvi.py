from fastapi import APIRouter
from ndvi_analysis import get_all_ndvi, generate_ndvi_chart, calculate_ndvi, classify_ndvi

router = APIRouter()

@router.get("/")
def get_ndvi():
    """Retorna NDVI calculado para todos os bairros via Sentinel-2"""
    return get_all_ndvi()

@router.get("/chart")
def get_ndvi_chart():
    """Retorna grafico NDVI em base64 para exibicao no dashboard"""
    image = generate_ndvi_chart()
    return {"chart": image, "format": "png/base64"}

@router.get("/zone/{zone_name}")
def get_zone_ndvi(zone_name: str):
    """Retorna NDVI de uma zona especifica"""
    all_data = get_all_ndvi()
    zone = next((z for z in all_data if z["zone"].lower() == zone_name.lower()), None)
    if not zone:
        return {"error": "Zona nao encontrada"}
    return zone