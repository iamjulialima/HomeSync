#include "PortaoController.h"
#include "TemperaturaController.h"
#include "LuzesController.h"
#include "GasController.h"

const char* ssid = "nome_wifi";
const char* password = "senha_wifi";
const char* servidorBase = "http://<ip_maquina>:3000";

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

// Identificadores
const int codPortaoESP = 1;
const int codSensorGas = 1;
const int codUsuarioLuzes = 1; 

// Instâncias
PortaoController portao(ssid, password, servidorBase, endpointPortao, pinoServo, codPortaoESP);
TemperaturaController temperatura(ssid, password, servidorBase, endpointTemperatura, pinoDHT);
LuzesController luzes(ssid, password, servidorBase, endpointLuzes, ledPins, numLeds, codUsuarioLuzes);
GasController gas(ssid, password, servidorBase, endpointGas, sensorPinGas, codSensorGas, 2000, 10);

// Controle de tempo
unsigned long ultimaLeituraTemp = 0;
const unsigned long intervaloLeitura = 60000; // tá 1 minuto

void setup() {
  Serial.begin(115200);
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
  delay(2000);
}
