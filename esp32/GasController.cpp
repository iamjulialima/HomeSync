#include "GasController.h"
#include <WiFi.h>
#include <HTTPClient.h>

GasController::GasController(const char* ssid, const char* password, const char* baseUrl, const char* endpoint, int sensorPin, int gasLimit, int numReadings)
: _ssid(ssid), _password(password), _baseUrl(baseUrl), _endpoint(endpoint), _sensorPin(sensorPin), _gasLimit(gasLimit), _numReadings(numReadings)
{}

void GasController::begin() {
    Serial.begin(115200);
    delay(1000);
    conectarWiFi();
    Serial.println("Monitorando sensor de gás MQ-135...");
    delay(3000); // Tempo para estabilizar o sensor
}

void GasController::conectarWiFi() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.print("Conectando ao WiFi");
        WiFi.begin(_ssid, _password);
        int tentativas = 0;
        while (WiFi.status() != WL_CONNECTED && tentativas < 20) {
            delay(500);
            Serial.print(".");
            tentativas++;
        }
        if (WiFi.status() == WL_CONNECTED) {
            Serial.println("\nWiFi conectado!");
            Serial.println(WiFi.localIP());
        } else {
            Serial.println("\nFalha ao conectar WiFi");
        }
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
    String url = String(_baseUrl) + String(_endpoint);
    return url;
}

void GasController::atualizar() {
    conectarWiFi();

    int valorSensor = lerMediaSensor();
    Serial.print("Valor do sensor (média): ");
    Serial.println(valorSensor);

    String status = (valorSensor > _gasLimit) ? "vazamento" : "seguro";

    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        String urlCompleta = montarUrlCompleta();
        http.begin(urlCompleta);
        http.addHeader("Content-Type", "application/json");

        String json = "{\"valor\":";
        json += valorSensor;
        json += ",\"status\":\"";
        json += status;
        json += "\"}";

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
    } else {
        Serial.println("Erro: WiFi desconectado.");
    }

    delay(2000);
}
