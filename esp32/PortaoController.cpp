#include "PortaoController.h"

PortaoController::PortaoController(const char* ssid, const char* password, const char* servidorApi, int pinoServo)
  : _ssid(ssid), _password(password), _servidorApi(servidorApi), _pinoServo(pinoServo), _ultimoComando("nenhum") {}

void PortaoController::begin() {
  Serial.begin(115200);
  _servoPortao.setPeriodHertz(50);
  _servoPortao.attach(_pinoServo, 500, 2400);
  fechaPortao();
  conectaWiFi();
}

void PortaoController::conectaWiFi() {
  WiFi.begin(_ssid, _password);
  Serial.print("Conectando ao WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Conectado!");
}

void PortaoController::abrePortao() {
  for (int ang = 0; ang <= 90; ang++) {
    _servoPortao.write(ang);
    delay(15); 
  }
}

void PortaoController::fechaPortao() {
  for (int ang = 90; ang >= 0; ang--) {
    _servoPortao.write(ang);
    delay(15);
  }
}

void PortaoController::verificaComando() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(_servidorApi);
    int httpCode = http.GET();

    if (httpCode == 200) {
      String payload = http.getString();
      Serial.println("Resposta API: " + payload);

      if (payload.indexOf("\"comando\":\"abrir\"") != -1 && _ultimoComando != "abrir") {
        abrePortao();
        _ultimoComando = "abrir";
      } else if (payload.indexOf("\"comando\":\"fechar\"") != -1 && _ultimoComando != "fechar") {
        fechaPortao();
        _ultimoComando = "fechar";
      }
    } else {
      Serial.println("Erro na requisição HTTP");
    }
    http.end();
  } else {
    Serial.println("WiFi desconectado");
  }
}

void PortaoController::atualizar() {
  verificaComando();
  delay(3000);
}
