#ifndef PORTAOCONTROLLER_H
#define PORTAOCONTROLLER_H

#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>

class PortaoController {
  public:
    PortaoController(const char* ssid, const char* password, const char* servidorApi, int pinoServo);
    void begin();
    void atualizar();  // deve ser chamada no loop
  private:
    const char* _ssid;
    const char* _password;
    const char* _servidorApi;
    Servo _servoPortao;
    int _pinoServo;
    String _ultimoComando;

    void abrePortao();
    void fechaPortao();
    void conectaWiFi();
    void verificaComando();
};

#endif
