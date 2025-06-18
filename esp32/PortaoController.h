#ifndef PORTAOCONTROLLER_H
#define PORTAOCONTROLLER_H

#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>

class PortaoController {
  public:
    PortaoController(const char* ssid, const char* password, const char* servidorBase, const char* endpoint, int pinoServo);
    void begin();
    void atualizar();

  private:
    const char* _ssid;
    const char* _password;
    String _servidorApi;
    Servo _servoPortao;
    int _pinoServo;
    String _ultimoComando;

    void conectaWiFi();
    void abrePortao();
    void fechaPortao();
    void verificaComando();
};

#endif
