#include "LuzesController.h"

LuzesController::LuzesController(const char* ssid, const char* password, const char* servidorBase, const char* endpoint, const int* ledPins, int numLeds, int codUsuario)
  : _ssid(ssid), _password(password), _servidorBase(servidorBase), _endpoint(endpoint), _ledPins(ledPins), _numLeds(numLeds), _codUsuario(codUsuario) {}

void LuzesController::begin() {
  // Conecta ao Wi-Fi
  WiFi.begin(_ssid, _password);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado!");

  // Configura os pinos dos LEDs
  for (int i = 0; i < _numLeds; i++) {
    pinMode(_ledPins[i], OUTPUT);
    digitalWrite(_ledPins[i], LOW);
  }
}

void LuzesController::atualizar() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String urlCompleta = String(_servidorBase) + String(_endpoint) + "/" + String(_codUsuario);

    http.begin(urlCompleta);
    int httpCode = http.GET();

    if (httpCode == 200) {
      String payload = http.getString();
      DynamicJsonDocument doc(1024);
      DeserializationError error = deserializeJson(doc, payload);

      if (!error) {
        for (int i = 0; i < doc.size() && i < _numLeds; i++) {
          String estado = doc[i]["estado"];
          digitalWrite(_ledPins[i], (estado == "ligado") ? HIGH : LOW);
        }
      } else {
        Serial.print("Erro ao fazer parse do JSON: ");
        Serial.println(error.c_str());
      }
    } else {
      Serial.print("Erro na requisição de luzes: ");
      Serial.println(httpCode);
    }

    http.end();
  } else {
    Serial.println("Wi-Fi desconectado, tentando reconectar...");
    WiFi.begin(_ssid, _password);
  }
}
