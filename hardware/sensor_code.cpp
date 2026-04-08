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
