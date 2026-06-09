# Função que classifica uma zona com base na temperatura de superfície (LST)
def classify(lst: float) -> dict:

    # Se temperatura acima de 42°C = zona crítica
    if lst >= 42:
        return {
            "label": "Crítica",
            # Score máximo de 100, aumenta conforme temperatura sobe
            "score": round(min(100, (lst - 42) * 10 + 80), 1),
            "color": "#e24b4a",  # Vermelho
            "level": 4           # Nível mais alto de risco
        }
    # Se entre 38°C e 42°C = zona de alerta
    elif lst >= 38:
        return {
            "label": "Alerta",
            # Score proporcional dentro da faixa de alerta
            "score": round((lst - 38) * 7 + 50, 1),
            "color": "#f5a623",  # Laranja
            "level": 3
        }
    # Se entre 34°C e 38°C = zona moderada
    elif lst >= 34:
        return {
            "label": "Moderada",
            # Score mais baixo, risco intermediário
            "score": round((lst - 34) * 5 + 25, 1),
            "color": "#533483",  # Roxo
            "level": 2
        }
    # Abaixo de 34°C = zona normal, sem risco significativo
    else:
        return {
            "label": "Normal",
            # Score mínimo, começa a contar só acima de 20°C
            "score": round(max(0, lst - 20) * 2, 1),
            "color": "#0f3460",  # Azul escuro
            "level": 1           # Nível mais baixo de risco
        }
    