#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include "config.h"

const char *mqtt_server = "mqtt.devilsoft.de";
const int mqtt_port = 8883;
const char *tableName = "ads_1";
const char *scoreTopic = "table/ads_1/score";
const char *resetTopic = "table/ads_1/reset";

// Button configuration
#define BUTTON_PIN D4 // GPIO14 (D5 on NodeMCU) - safe general purpose pin
bool lastButtonState = HIGH;
bool currentButtonState = HIGH;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;

WiFiClientSecure espClientSecure;
PubSubClient client(espClientSecure);

String lastScore = "0:0";
bool displayNeedsUpdate = true;
int homeScore = 0;
int awayScore = 0;

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET -1 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  String message = "";
  for (int i = 0; i < length; i++)
  {
    message += (char)payload[i];
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // If this is a score message, update the display
  if (String(topic) == scoreTopic)
  {
    // Parse JSON message
    StaticJsonDocument<100> doc;
    DeserializationError error = deserializeJson(doc, message);

    if (!error)
    {
      homeScore = doc["home"];
      awayScore = doc["away"];
      lastScore = String(homeScore) + ":" + String(awayScore);
      displayNeedsUpdate = true;
    }
    else
    {
      Serial.print("JSON parsing failed: ");
      Serial.println(error.c_str());
    }
  }
}

void reconnect()
{
  // Loop until we're reconnected
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Client"))
    {
      Serial.println("connected");
      // Subscribe to the score topic
      client.subscribe(scoreTopic);
      // Publish
      client.publish("/presence", tableName);
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup_wifi()
{
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  // Show connection status on display
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Connecting to WiFi...");
  display.println(ssid);
  display.display();

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
    display.print(".");
    display.display();
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Show connected status
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("WiFi Connected!");
  display.println("IP:");
  display.println(WiFi.localIP());
  display.display();
  delay(2000);
}

void setup()
{
  Serial.begin(9600);

  // Initialize button pin
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  // Initialize display first
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
  { // Address 0x3C for 128x64
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ; // Don't proceed, loop forever
  }

  // Clear the buffer
  display.clearDisplay();
  display.display();

  setup_wifi();
  espClientSecure.setInsecure(); // For this example, we'll allow insecure connections
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  // Handle button press with debouncing
  int reading = digitalRead(BUTTON_PIN);

  if (reading != lastButtonState)
  {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay)
  {
    if (reading != currentButtonState)
    {
      currentButtonState = reading;

      // Button pressed (LOW because of INPUT_PULLUP)
      if (currentButtonState == LOW)
      {
        Serial.println("Reset button pressed!");
        client.publish(resetTopic, "reset");
      }
    }
  }

  lastButtonState = reading;

  // Update display if needed
  if (displayNeedsUpdate)
  {
    display.clearDisplay();

    // Calculate position to center the score
    display.setTextSize(4);
    display.setTextColor(SSD1306_WHITE);

    // Get text bounds to center it
    int16_t x1, y1;
    uint16_t w, h;
    display.getTextBounds(lastScore, 0, 0, &x1, &y1, &w, &h);

    // Center the text on screen
    int x = (SCREEN_WIDTH - w) / 2;
    int y = (SCREEN_HEIGHT - h) / 2;

    display.setCursor(x, y);
    display.println(lastScore);
    display.display();
    displayNeedsUpdate = false;
  }
}