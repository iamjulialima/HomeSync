#include "PortaoController.h"
#include "TemperaturaController.h"
#include "LuzesController.h"
#include "GasController.h"

const char* ssid = "S23 FE de Júlia Ingrid";
const char* password = "julialima";
const char* servidorBase = "http://192.168.118.78:3000";

// Endpoints
const char* endpointPortao = "/api/portao/comando";
const char* endpointTemperatura = "/api/temperatura/salvar";
const char* endpointLuzes = "/api/luzes";
const char* endpointGas = "/api/gas/leitura";

// Pinos
const int pinoServo = 18;
const int pinoDHT = 4;
const int numLeds = 6;
const int ledPins[numLeds] = {12, 13, 14, 27, 26, 25};
const int sensorPinGas = 34;

// Objetos
PortaoController portao(ssid, password, servidorBase, endpointPortao, pinoServo);
TemperaturaController temperatura(ssid, password, servidorBase, endpointTemperatura, pinoDHT);
LuzesController luzes(ssid, password, servidorBase, endpointLuzes, ledPins, numLeds);
GasController gas(ssid, password, servidorBase, endpointGas, sensorPinGas);

unsigned long ultimaLeituraTemp = 0;
const unsigned long intervaloLeitura = 60000; // 1 minuto

void setup() {
  portao.begin();
  temperatura.begin();
  luzes.begin();
  gas.begin();
}

void loop() {
  portao.atualizar();
  luzes.atualizar();

  if (millis() - ultimaLeituraTemp >= intervaloLeitura) {
    temperatura.atualizar();
    ultimaLeituraTemp = millis();
  }

  gas.atualizar();
}
