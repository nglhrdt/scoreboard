#include <Arduino.h>

const int trigPin = 5;
const int echoPin = 14;

int score = 0;

#define NOISE_REDUCTION_ARRAY_SIZE 16

long duration;

bool isGoal = false;

float noiseReductionArray[NOISE_REDUCTION_ARRAY_SIZE];
int reductionArrayIndex = 0;
bool noiseFilled = false;

void storeNoise(float value)
{
  noiseReductionArray[reductionArrayIndex] = value;
  reductionArrayIndex = (reductionArrayIndex + 1) % NOISE_REDUCTION_ARRAY_SIZE;
  if (reductionArrayIndex == 0)
    noiseFilled = true;
}

float meanValue()
{
  int count = noiseFilled ? NOISE_REDUCTION_ARRAY_SIZE : reductionArrayIndex;
  if (count == 0)
    return 0.0;
  float sum = 0.0;
  for (int i = 0; i < count; ++i)
  {
    sum += noiseReductionArray[i];
  }
  return sum / count;
}

void setup()
{
  Serial.begin(9600);       // Starts the serial communication
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT);  // Sets the echoPin as an Input
  Serial.println("Ultrasonic Sensor Goal Detection Initialized");
}

void loop()
{
  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);

  Serial.print("Duration: ");
  Serial.print(duration);
  Serial.print(" mean, ");
  Serial.println(meanValue());

  delay(100); // Delay to avoid flooding the serial output

  // storeNoise(duration);

  // float mean = meanValue();
  // if (mean > 0 && fabs(duration - mean) / mean > 0.1)
  // {
  //   if (!isGoal)
  //   {
  //     ++score;
  //     Serial.println("GOAAAAAL");
  //     Serial.println(String(score) + ":0");
  //     isGoal = true;
  //     delay(1000); // Delay to avoid multiple prints for the same goal
  //   }
  // }
  // else if (isGoal)
  // {
  //   isGoal = false;
  // }
}
