import json
import boto3  # Biblioteca oficial AWS para Python
from datetime import datetime

# =============================================
# THERMIS — Arquitetura AWS Serverless
# Em produção, este código rodaria na AWS Lambda
# acionado automaticamente a cada 30 minutos
# via AWS EventBridge (agendador de tarefas)
# =============================================

# Configuração dos serviços AWS utilizados
S3_BUCKET = "thermis-lst-data"          # Bucket S3 para armazenar dados LST
SNS_TOPIC = "thermis-alerts"            # Tópico SNS para envio de alertas
LAMBDA_REGION = "sa-east-1"             # Região São Paulo

def lambda_handler(event, context):
    """
    Função principal da AWS Lambda.
    Executada automaticamente a cada 30 minutos via EventBridge.
    Responsável por: buscar dados satelitais, processar com ML e salvar no S3.
    """

    print(f"[THERMIS] Iniciando processamento — {datetime.now().isoformat()}")

    # PASSO 1: Busca dados de temperatura LST da NASA MODIS API
    lst_data = fetch_modis_data()
    print(f"[THERMIS] Dados MODIS recebidos: {len(lst_data)} zonas")

    # PASSO 2: Processa dados com modelo de classificação ML
    classified_zones = classify_zones(lst_data)
    print(f"[THERMIS] Zonas classificadas: {len(classified_zones)}")

    # PASSO 3: Salva resultado processado no AWS S3
    save_to_s3(classified_zones)
    print(f"[THERMIS] Dados salvos no S3: s3://{S3_BUCKET}/zones/latest.json")

    # PASSO 4: Verifica zonas críticas e dispara alertas via SNS
    critical_zones = [z for z in classified_zones if z["level"] == 4]
    if critical_zones:
        send_alerts(critical_zones)
        print(f"[THERMIS] Alertas disparados para {len(critical_zones)} zonas críticas")

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Processamento concluído com sucesso",
            "zones_processed": len(classified_zones),
            "critical_zones": len(critical_zones),
            "timestamp": datetime.now().isoformat()
        })
    }


def fetch_modis_data():
    """
    Em produção: busca dados reais de LST da API NASA MODIS.
    Endpoint: https://modis.gsfc.nasa.gov/data/
    Produto: MOD11A1 — Land Surface Temperature diária com resolução de 1km
    """
    # Simulação dos dados que viriam da NASA MODIS API
    return [
        {"zone": "Centro",      "lat": -23.5505, "lng": -46.6333, "lst": 44.2},
        {"zone": "Brás",        "lat": -23.5489, "lng": -46.6188, "lst": 43.1},
        {"zone": "Mooca",       "lat": -23.5558, "lng": -46.6027, "lst": 42.8},
        {"zone": "Pinheiros",   "lat": -23.5631, "lng": -46.6897, "lst": 34.4},
        {"zone": "Parelheiros", "lat": -23.8275, "lng": -46.7278, "lst": 24.1},
    ]


def classify_zones(zones):
    """
    Aplica modelo de classificação ML para categorizar zonas de risco.
    Baseado em Amorim (2019) UNESP — limiares de intensidade LST.
    """
    classified = []
    for zone in zones:
        lst = zone["lst"]

        # Classificação baseada nos limiares científicos de Amorim (2019)
        if lst >= 42:
            level, label, color = 4, "Crítica",  "#e24b4a"
        elif lst >= 38:
            level, label, color = 3, "Alerta",   "#f5a623"
        elif lst >= 34:
            level, label, color = 2, "Moderada", "#533483"
        else:
            level, label, color = 1, "Normal",   "#4a9eff"

        classified.append({**zone, "level": level, "label": label, "color": color})

    return classified


def save_to_s3(data):
    """
    Em produção: salva dados processados no AWS S3.
    Estrutura de pastas no bucket:
        s3://thermis-lst-data/
            zones/latest.json       — dados mais recentes
            zones/history/          — histórico por data
            alerts/                 — alertas gerados
    """
    # Simulação — em produção usaria boto3:
    # s3 = boto3.client("s3", region_name=LAMBDA_REGION)
    # s3.put_object(
    #     Bucket=S3_BUCKET,
    #     Key="zones/latest.json",
    #     Body=json.dumps(data),
    #     ContentType="application/json"
    # )
    print(f"[S3] Dados salvos em s3://{S3_BUCKET}/zones/latest.json")


def send_alerts(critical_zones):
    """
    Em produção: dispara alertas via AWS SNS (Simple Notification Service).
    Notifica gestores públicos e sistemas integrados sobre zonas críticas.
    """
    for zone in critical_zones:
        message = (
            f"ALERTA THERMIS — Zona Crítica detectada\n"
            f"Bairro: {zone['zone']}\n"
            f"Temperatura LST: {zone['lst']}°C\n"
            f"Timestamp: {datetime.now().isoformat()}"
        )
        # Simulação — em produção usaria boto3:
        # sns = boto3.client("sns", region_name=LAMBDA_REGION)
        # sns.publish(TopicArn=SNS_TOPIC, Message=message, Subject="THERMIS — Alerta Crítico")
        print(f"[SNS] Alerta enviado: {message}")