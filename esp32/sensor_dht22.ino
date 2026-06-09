// =============================================
// THERMIS — Sensor ESP32 + DHT22
// Coleta temperatura e umidade local
// Envia dados para API THERMIS via WiFi
// =============================================

#include <WiFi.h>           // Biblioteca WiFi do ESP32
#include <HTTPClient.h>     // Biblioteca para requisições HTTP
#include <DHT.h>            // Biblioteca do sensor DHT22
#include <ArduinoJson.h>    // Biblioteca para JSON

// Configurações do sensor DHT22
#define DHTPIN 4            // Pino de dados do sensor
#define DHTTYPE DHT22       // Tipo do sensor
DHT dht(DHTPIN, DHTTYPE);  // Instância do sensor

// Configurações de rede
const char* WIFI_SSID     = "SUA_REDE_WIFI";
const char* WIFI_PASSWORD = "SUA_SENHA_WIFI";

// Endpoint da API THERMIS
const char* API_URL = "http://SEU_IP:8000/sensor/esp32";

// Intervalo de leitura em milissegundos (30 segundos)
const int INTERVALO = 30000;

void setup() {
  Serial.begin(115200);   // Inicializa comunicação serial
  dht.begin();            // Inicializa o sensor DHT22

  // Conecta ao WiFi
  Serial.print("Conectando ao WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Lê temperatura e umidade do sensor
  float temperatura = dht.readTemperature();  // Celsius
  float umidade     = dht.readHumidity();     // Porcentagem

  // Verifica se a leitura foi bem-sucedida
  if (isnan(temperatura) || isnan(umidade)) {
    Serial.println("Erro ao ler sensor DHT22!");
    delay(INTERVALO);
    return;
  }

  // Calcula índice de calor (sensação térmica)
  float indiceCalor = dht.computeHeatIndex(temperatura, umidade, false);

  // Exibe leitura no monitor serial
  Serial.printf("Temp: %.1f°C | Umidade: %.1f%% | Sensação: %.1f°C\n",
    temperatura, umidade, indiceCalor);

  // Envia dados para a API THERMIS via HTTP POST
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(API_URL);
    http.addHeader("Content-Type", "application/json");

    // Monta JSON com os dados do sensor
    StaticJsonDocument<200> doc;
    doc["device_id"]     = "ESP32-THERMIS-001";
    doc["location"]      = "Centro, São Paulo";
    doc["temperature_c"] = temperatura;
    doc["humidity_pct"]  = umidade;
    doc["heat_index"]    = indiceCalor;

    String jsonData;
    serializeJson(doc, jsonData);

    // Envia requisição POST
    int httpCode = http.POST(jsonData);

    if (httpCode == 200) {
      Serial.println("Dados enviados com sucesso!");
    } else {
      Serial.printf("Erro HTTP: %d\n", httpCode);
    }

    http.end();
  }

  delay(INTERVALO);  // Aguarda 30 segundos antes da próxima leitura
}