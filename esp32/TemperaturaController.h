#ifndef TEMPERATURACONTROLLER_H
#define TEMPERATURACONTROLLER_H

#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

class TemperaturaController {
  public:
    TemperaturaController(const char* ssid, const char* password, const char* servidorBase, const char* endpoint, int pinoDHT);
    void begin();
    void atualizar();

  private:
    const char* _ssid;
    const char* _password;
    String _servidorApi;
    int _pinoDHT;
    DHT _dht;

    void conectaWiFi();
    void enviaDados(float temperatura, float umidade);
};

#endif