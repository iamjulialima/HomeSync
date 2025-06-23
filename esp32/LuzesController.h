#ifndef LUZES_CONTROLLER_H
#define LUZES_CONTROLLER_H

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

class LuzesController {
public:
  LuzesController(const char* ssid, const char* password, const char* servidorBase, const char* endpoint, const int* ledPins, int numLeds);
  void begin();
  void atualizar();

private:
  const char* _ssid;
  const char* _password;
  const char* _url;
  const int* _ledPins;
  int _numLeds;
};

#endif
