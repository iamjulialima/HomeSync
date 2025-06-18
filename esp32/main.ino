#include "PortaoController.h"
#include "TemperaturaController.h"

const char* ssid = "nome_wifi";
const char* password = "senha_wifi";
const char* servidorBase = "http://localhost:3000";

// Endpoints
const char* endpointPortao = "/api/portao/comando";
const char* endpointTemperatura = "/api/temperatura/salvar";

// Pinos
const int pinoServo = 18;
const int pinoDHT = 4;

// Objetos
PortaoController portao(ssid, password, servidorBase, endpointPortao, pinoServo);
TemperaturaController temperatura(ssid, password, servidorBase, endpointTemperatura, pinoDHT);

unsigned long ultimaLeituraTemp = 0;
const unsigned long intervaloLeitura = 60000; // 1 minuto

void setup() {
  portao.begin();
  temperatura.begin();
}

void loop() {
  portao.atualizar();

  if (millis() - ultimaLeituraTemp >= intervaloLeitura) {
    temperatura.atualizar();
    ultimaLeituraTemp = millis();
  }
}
