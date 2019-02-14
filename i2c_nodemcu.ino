#include <bme280.h>
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <stdio.h>
#include <string.h>

#ifndef STASSID
#define STASSID "Placeholder" // nazwa sieci
#define STAPSK  "Password" // hasło do sieci
#endif

const char* ssid     = STASSID;
const char* password = STAPSK;

const char* url = "http://192.168.4.1:3000/bme_sensor";

struct bme280_dev dev;
struct bme280_data comp_data;
int8_t rslt = BME280_OK;
  
void setup() {
  int SCL_pin = 5; // GPIO5 - D1
  int SDA_pin = 4; // GPIO4 - D2

  Wire.begin(SDA_pin, SCL_pin);
  
  dev.dev_id = BME280_I2C_ADDR_PRIM;
  dev.intf = BME280_I2C_INTF;
  dev.read = user_i2c_read;
  dev.write = user_i2c_write;
  dev.delay_ms = user_delay_ms;
  
  rslt = bme280_init(&dev);

  rslt = stream_sensor_data_forced_mode(&dev);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
   delay(500);
  }
}

int8_t stream_sensor_data_forced_mode(struct bme280_dev *dev)
{
    int8_t rslt;
    uint8_t settings_sel;

    dev->settings.osr_h = BME280_OVERSAMPLING_1X;
    dev->settings.osr_p = BME280_OVERSAMPLING_1X;
    dev->settings.osr_t = BME280_OVERSAMPLING_1X;
    dev->settings.filter = BME280_FILTER_COEFF_OFF;

    settings_sel = BME280_OSR_PRESS_SEL | BME280_OSR_TEMP_SEL | BME280_OSR_HUM_SEL | BME280_FILTER_SEL;

    rslt = bme280_set_sensor_settings(settings_sel, dev);
    
    return rslt;
}

void user_delay_ms(uint32_t period)
{
  delay(period);
}

int8_t user_i2c_read(uint8_t dev_id, uint8_t reg_addr, uint8_t *reg_data, uint16_t len)
{
    int8_t rslt = 0; /* Return 0 for Success, non-zero for failure */


    Wire.beginTransmission(dev_id);
    Wire.write(reg_addr);
    Wire.endTransmission();

    
    Wire.requestFrom(dev_id, len);

    for(int x = 0; x < len; x++){
      reg_data[x] = Wire.read();
    }

    return rslt;
}

int8_t user_i2c_write(uint8_t dev_id, uint8_t reg_addr, uint8_t *reg_data, uint16_t len)
{
    int8_t rslt = 0; /* Return 0 for Success, non-zero for failure */

    Wire.beginTransmission(dev_id);
    Wire.write(reg_addr);
    for(int x = 0; x < len; x++)
      Wire.write(reg_data[x]);
    Wire.endTransmission();

    return rslt;
}
     
void httpPost(uint32_t temp, uint32_t hum, uint32_t pre)
{
  char temperature[11];
  char humidity[11];
  char pressure[11];
  char buffor[200];
  sprintf(temperature, "%u", temp);
  sprintf(humidity, "%u", hum);
  sprintf(pressure, "%u", pre);
  strcpy(buffor, "temperature=");
  strcat(buffor, temperature);
  strcat(buffor, "&humidity=");
  strcat(buffor, humidity);
  strcat(buffor, "&pressure=");
  strcat(buffor, pressure);
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  http.POST(buffor);
  http.end();
}

void loop() {
        rslt = bme280_set_sensor_mode(BME280_FORCED_MODE, &dev);
        dev.delay_ms(1000);
        rslt = bme280_get_sensor_data(BME280_ALL, &comp_data, &dev);

        httpPost(comp_data.temperature, comp_data.humidity, comp_data.pressure);
}
