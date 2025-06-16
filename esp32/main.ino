#include "PortaoController.h"

const char* ssid = "nome-wifi";
const char* password = "senha-wifi";
const char* servidorAPI = "http://localhost:3000/api/portao/comando";
const int pinoServo = 18;

PortaoController portao(ssid, password, servidorAPI, pinoServo);

void setup() {
  Serial.println(WiFi.localIP()); 
  portao.begin();
}

void loop() {
  portao.atualizar();
}
