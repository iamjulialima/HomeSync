#include "PortaoController.h"

PortaoController::PortaoController(const char* ssid, const char* password, const char* servidorBase, const char* endpoint, int pinoServo, int codPortao)
  : _ssid(ssid), _password(password), _pinoServo(pinoServo), _codPortao(codPortao), _ultimoComando("nenhum") {
  _servidorApi = String(servidorBase) + endpoint;
}

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
  Serial.println(" Conectado!");
}

void PortaoController::abrePortao() {
  for (int ang = 70; ang <= 160; ang++) {
    _servoPortao.write(ang);
    delay(10);
  }
}

void PortaoController::fechaPortao() {
  for (int ang = 160; ang >= 70; ang--) {
    _servoPortao.write(ang);
    delay(10);
  }
}

void PortaoController::verificaComando() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = _servidorApi + "?cod_portao=" + String(_codPortao);
    Serial.println("Fazendo requisição para: " + url); 

    http.begin(url);
    int httpCode = http.GET();

    if (httpCode == 200) {
      String payload = http.getString();
      Serial.println("Resposta API: " + payload);

      if (payload.indexOf("\"comando\":\"abrir\"") != -1 && _ultimoComando != "abrir") {
        abrePortao();
        _ultimoComando = "abrir";
      } 
      else if (payload.indexOf("\"comando\":\"fechar\"") != -1 && _ultimoComando != "fechar") {
        fechaPortao();
        _ultimoComando = "fechar";
      }
    } else {
      Serial.println("Erro na requisição HTTP. Código: " + String(httpCode));
      String payload = http.getString();
      Serial.println("Resposta de erro: " + payload);
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
