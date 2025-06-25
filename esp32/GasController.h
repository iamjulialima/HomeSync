#ifndef GAS_CONTROLLER_H
#define GAS_CONTROLLER_H

#include <Arduino.h>

class GasController {
public:
    GasController(const char* ssid, const char* password, const char* baseUrl, const char* endpoint, int sensorPin, int gasLimit = 2000, int numReadings = 10);

    void begin();
    void atualizar();

private:
    const char* _ssid;
    const char* _password;
    const char* _baseUrl;
    const char* _endpoint;
    int _sensorPin;
    int _gasLimit;
    int _numReadings;

    void conectarWiFi();
    int lerMediaSensor();
    String montarUrlCompleta();
};

#endif
