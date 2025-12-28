<<<<<<< HEAD
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
- measure voltage on accu
- send info from all ESP32 + DS18B20 to Orange Pi 3 Wifi
- make web site to manage measurements (React/Angular)

## Software and hardware of sensor system
- Model sensor + ESP32
[*Model and simulation (Wokwi) ESP32 + DS18B20*](https://wokwi.com/projects/451127223539529729)

- Image of the model:

<img width="200" alt="Model ESP32 + DS18B20 " src="https://github.com/user-attachments/assets/6520138d-0d08-46f9-95cb-77e060e2bcb1" />


```C++
#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 4
const int Analog_channel_pin= 15;
double ADC_VALUE = 0;
double voltage_value = 0; 

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);


void setup() {
  Serial.begin(115200);
  sensors.begin();
}

void loop() {
// Temperature
  sensors.requestTemperatures();
  float temp = sensors.getTempCByIndex(0);
  Serial.print("Temperature: ");
  Serial.print(temp);
  Serial.print(" °C | ");
// Volage
  ADC_VALUE = analogRead(Analog_channel_pin);
  voltage_value = (ADC_VALUE * 3.3 ) / (4095);
  Serial.print("Voltage: ");
  Serial.print(voltage_value);
  Serial.print(" V\n");
                          
  delay(2000);
}
```
- Output:

<img width="200" alt="output" src="https://github.com/user-attachments/assets/4c224ee6-8dba-4492-ae80-441411214dee" />

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










 

=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
>>>>>>> 125fac5 (first commit)
