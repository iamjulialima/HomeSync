#include "GasController.h"
#include <WiFi.h>
#include <HTTPClient.h>

GasController::GasController(const char* ssid, const char* password, const char* baseUrl, const char* endpoint, int sensorPin, int codSensor, int gasLimit, int numReadings)
: _ssid(ssid), _password(password), _baseUrl(baseUrl), _endpoint(endpoint),
  _sensorPin(sensorPin), _codSensor(codSensor), _gasLimit(gasLimit), _numReadings(numReadings), wifiConectado(false)
{}

void GasController::begin() {
    // Serial.begin(115200); // REMOVER daqui, já chama no setup principal!
    conectarWiFi();
    Serial.println("Monitorando sensor de gás MQ-135...");
    delay(3000); // Tempo para estabilizar o sensor
}

void GasController::conectarWiFi() {
    if (WiFi.status() == WL_CONNECTED) {
        wifiConectado = true;
        return;
    }

    Serial.print("Conectando ao WiFi");
    WiFi.begin(_ssid, _password);
    int tentativas = 0;
    while (WiFi.status() != WL_CONNECTED && tentativas < 20) {
        delay(500);
        Serial.print(".");
        tentativas++;
    }
    if (WiFi.status() == WL_CONNECTED) {
        wifiConectado = true;
        Serial.println("\nWiFi conectado!");
        Serial.println(WiFi.localIP());
    } else {
        wifiConectado = false;
        Serial.println("\nFalha ao conectar WiFi");
    }
}

int GasController::lerMediaSensor() {
    long soma = 0;
    for (int i = 0; i < _numReadings; i++) {
        int leitura = analogRead(_sensorPin);
        soma += leitura;
        delay(20);
    }
    return soma / _numReadings;
}

String GasController::montarUrlCompleta() {
    return String(_baseUrl) + String(_endpoint);
}

void GasController::atualizar() {
    // Tentar reconectar só se desconectado
    if (!wifiConectado) {
        conectarWiFi();
        if (!wifiConectado) {
            Serial.println("WiFi ainda desconectado, pulando envio.");
            return; // Não faz nada se não tiver conexão
        }
    }

    int valorSensor = lerMediaSensor();
    Serial.print("Valor do sensor (média): ");
    Serial.println(valorSensor);

    String status = (valorSensor > _gasLimit) ? "vazamento" : "seguro";

    HTTPClient http;
    String urlCompleta = montarUrlCompleta();
    http.begin(urlCompleta);
    http.addHeader("Content-Type", "application/json");

    String json = "{\"valor\":";
    json += valorSensor;
    json += ",\"cod_sensor\":";
    json += _codSensor;
    json += "}";

    int codigoResposta = http.POST(json);

    if (codigoResposta > 0) {
        String resposta = http.getString();
        Serial.print("Resposta da API: ");
        Serial.println(resposta);
    } else {
        Serial.print("Erro no POST: ");
        Serial.println(codigoResposta);
    }

    http.end();

    // REMOVER delay daqui! Use no loop principal, se precisar.
}
