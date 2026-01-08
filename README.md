# TEMPERATURE SENSOR WIFI
WiFi temperature sensor made of Orange Pi 3 WiFi (server and site for managment), ESP32 (30/38pin type-c) + DS18B20 (with probe).

## Parts 
- Orange Pi 3 WiFi * 1
  
<img width="200" alt="Orange Pi 3 WiFi" src="https://github.com/user-attachments/assets/dab5d86d-6c8f-4421-9173-b0c9df18d54e" />

- ESP32 (30/38pin type-c) * 4 or 6
  
<img width="200" alt="ESP32" src="https://github.com/user-attachments/assets/1a51a3b0-29a1-487d-b6ee-2f3e4c39d63e" />

- DS18B20
  
<img width="200" height="512" alt="DS18B20" src="https://github.com/user-attachments/assets/42074440-b991-48c0-a4aa-3e0e4d49be1c" />

- resistors 4.7 kOhm * 6
- wire
- [Arduino IDE](https://support.arduino.cc/hc/en-us/articles/360019833020-Download-and-install-Arduino-IDE) 

## Functions
- measure temperature
- send info from all ESP32 + DS18B20 to Orange Pi 3 Wifi
- make web site to manage measurements (React/Angular)

## Software and hardware of sensor system
- Model sensor + ESP32
[*Model and simulation (Wokwi) ESP32 + DS18B20*](https://wokwi.com/projects/451127223539529729)

- Image of the model:

<img width="200" alt="Model ESP32 + DS18B20 " src="https://github.com/user-attachments/assets/6520138d-0d08-46f9-95cb-77e060e2bcb1" />


```C++
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "esp_sleep.h"

// ===== Wi-Fi =====
const char* ssid = "WIFI_SSID(NAME)";
const char* password = "WIFI_PASSWORD";

// ===== API =====
const char* serverUrl = "SERVER_URL";

// ===== Sleep time =====
#define SLEEP_MINUTES 30
#define uS_TO_S_FACTOR 1000000ULL

// ===== DS18B20 =====
#define ONE_WIRE_BUS 4
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

// ===== Sensor ID =====
const int sensorID = SENSOR_ID;

float temperature = 0.0;


// ===== Read sensors =====
void readSensors() {
  tempSensor.requestTemperatures();
  temperature = tempSensor.getTempCByIndex(0);

}

// ===== Send data =====
void sendData() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi NOT connected");
    return;
  }

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<128> doc;
  doc["sensor_id"] = sensorID;
  doc["temperature"] = temperature;
  doc["voltage"] = voltage;

  String payload;
  serializeJson(doc, payload);

  int code = http.POST(payload);
  Serial.print("HTTP status: ");
  Serial.println(code);

  http.end();
}

// ===== Setup =====
void setup() {
  Serial.begin(115200);
  delay(100);

  esp_sleep_wakeup_cause_t cause = esp_sleep_get_wakeup_cause();
  Serial.print("Wakeup cause: ");
  Serial.println(cause);

  // Sensors
  tempSensor.begin();

  // Wi-Fi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.print("Connecting WiFi");
  uint8_t tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries < 20) {
    delay(500);
    Serial.print(".");
    tries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected");
    readSensors();

    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" °C | Voltage: ");
    Serial.println(voltage);

    sendData();
  } else {
    Serial.println("\nWiFi FAILED");
  }

  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);

  Serial.println("Going to deep sleep...");
  esp_sleep_enable_timer_wakeup(
    (uint64_t)SLEEP_MINUTES * 60ULL * uS_TO_S_FACTOR
  );

  delay(100);
  esp_deep_sleep_start();
}

void loop() {

}
```
- Output:

//input img

## Server set up (Orange Pi 3 WiFi)
- SD card with [ubuntu server for Orange Pi 3 LTS](https://drive.google.com/drive/folders/1KzyzyByev-fpZat7yvgYz1omOqFFqt1k) distro
- Orange Pi 3 LTS + display (connected with HDMI) + keyboard

**Standart loging and password for Orange Pi are:**

Login: `orangepi`
Password: `orangepi`

 - [ ] Connect WiFi or LAN:
  ```
  sudo nmtui
  ```
Then you would see menu. In this menu choose:
 ```
  Activate a connection
 ```
Choose your WiFi and input password of WiFi. Also you can connect LAN cable and choose LAN network.
 To test connection:
 ```
  ip a
 ```
 Output will contain:
 ```
  wlan0:UP
  inet IP_ORANGE_PI
  ```
  Using IP:
  ```
  sudo systemctl status ssh
  ```
  Should be:
  ```
  active (running)
  ```
- [ ] Now you can connect to server with PC:
  ```
  ssh NAME_OF_ADMIN@IP_ORANGE_PI
  ```
- [ ] Then update apt, install nginx:
 ```
  sudo apt update
  sudo apt upgrade
  sudo apt install nginx -y
 ```
 Test and in browser (http://IP_ORANGE_PI):
  ```
  systemctl status nginx
  ```
 ** Congrats you have made server with http! **

# React + TypeScript + Vite site
If you want start site on your machine load this repo then in cmd run:
```
npm run dev
```
To upload site on server you should build it:
```
npm build
```
After that copy dist directory to /var/www/react-app/ on Orange Pi. It can be a little bit complicated because you should also write/load script in /etc/nginx/sites-available/react
```
server {
    listen 80;
    server_name _;

    root /var/www/react-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
