#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include "config.h"

#define HOME_TEAM_GOAL_SENSOR D1
#define AWAY_TEAM_GOAL_SENSOR D2

int sensorStateHome = 0, lastStateHome = 0, sensorStateAway = 0, lastStateAway = 0;

const char *mqtt_server = "mqtt.devilsoft.de";
const int mqtt_port = 8883;

const char *tableName = "ads_1";

WiFiClientSecure espClientSecure;
PubSubClient client(espClientSecure);

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
  }
  Serial.println();
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

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void setup_goal_sensors()
{
  // initialize the sensor pin as an input:
  pinMode(HOME_TEAM_GOAL_SENSOR, INPUT_PULLUP);
}

void setup()
{
  Serial.begin(9600);
  setup_wifi();
  setup_goal_sensors();
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

  sensorStateHome = digitalRead(HOME_TEAM_GOAL_SENSOR);

  if (!sensorStateHome && lastStateHome)
  {
    Serial.println("Goal detected!");
    String topic = "/table/" + String(tableName) + "/goal";
    client.publish(topic.c_str(), "HOME");
  }
  lastStateHome = sensorStateHome;

  sensorStateAway = digitalRead(AWAY_TEAM_GOAL_SENSOR);

  if (!sensorStateAway && lastStateAway)
  {
    Serial.println("Goal detected!");
    String topic = "/table/" + String(tableName) + "/goal";
    client.publish(topic.c_str(), "AWAY");
    ;
  }
  lastStateAway = sensorStateAway;
}