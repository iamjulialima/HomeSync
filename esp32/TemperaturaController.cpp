#include "TemperaturaController.h"

TemperaturaController::TemperaturaController(const char* ssid, const char* password, const char* servidorBase, const char* endpoint, int pinoDHT)
  : _ssid(ssid), _password(password), _pinoDHT(pinoDHT), _dht(pinoDHT, DHT22) {
  _servidorApi = String(servidorBase) + endpoint;
}

void TemperaturaController::begin() {
  _dht.begin();
  conectaWiFi();
}

void TemperaturaController::conectaWiFi() {
  WiFi.begin(_ssid, _password);
  Serial.print("Conectando ao WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" Conectado!");
}

void TemperaturaController::enviaDados(float temperatura, float umidade) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(_servidorApi);
    http.addHeader("Content-Type", "application/json");

    String json = "{\"temperatura\":" + String(temperatura) + 
              ",\"umidade\":" + String(umidade) + 
              ",\"cod_sensor\":1}";  // Coloque aqui o cod_sensor correto

    int httpCode = http.POST(json);

    if (httpCode > 0) {
      String response = http.getString();
      Serial.println(response);
    } else {
      Serial.println("Erro no POST: " + String(httpCode));
    }

    http.end();
  }
}

void TemperaturaController::atualizar() {
  float temperatura = _dht.readTemperature();
  float umidade = _dht.readHumidity();

  if (isnan(temperatura) || isnan(umidade)) {
    Serial.println("Falha na leitura do sensor DHT!");
    return;
  }

  Serial.print("Temperatura: ");
  Serial.print(temperatura);
  Serial.print(" °C | Umidade: ");
  Serial.print(umidade);
  Serial.println(" %");

  enviaDados(temperatura, umidade);
}
