#include "PortaoController.h"
#include "TemperaturaController.h"
#include "LuzesController.h"

const char* ssid = "nome da rede";
const char* password = "senha da rede";
const char* servidorBase = "http://endereçoIP:3000";

// Endpoints
const char* endpointPortao = "/api/portao/comando";
const char* endpointTemperatura = "/api/temperatura/salvar";
const char* endpointLuzes = "/api/luzes";

// Pinos
const int pinoServo = 18;
const int pinoDHT = 4;
const int numLeds = 6; //tamanho do vetor
const int ledPins[numLeds] = {12, 13, 14, 27, 26, 25};

// Objetos
PortaoController portao(ssid, password, servidorBase, endpointPortao, pinoServo);
TemperaturaController temperatura(ssid, password, servidorBase, endpointTemperatura, pinoDHT);
LuzesController luzes(ssid, password, servidorBase, endpointLuzes, ledPins, numLeds);

unsigned long ultimaLeituraTemp = 0;
const unsigned long intervaloLeitura = 60000; // 1 minuto

void setup() {
  portao.begin();
  temperatura.begin();
  luzes.begin();
}

void loop() {
  portao.atualizar();
  luzes.atualizar();

  if (millis() - ultimaLeituraTemp >= intervaloLeitura) {
    temperatura.atualizar();
    ultimaLeituraTemp = millis();
  }
}
