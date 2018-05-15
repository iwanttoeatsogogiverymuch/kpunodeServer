#include <SoftwareSerial.h> 
#include <SparkFunESP8266WiFi.h>
#include "HX711.h"

//Pin 
int remotePin = 4;
int soilhumiditySeonsorPin=A4;

HX711 scale(A1, A0);    // parameter "gain" is ommited; the default value 128 is used by the library

//wifi
const char mySSID[] = "U+NetE2D7";
const char myPSK[] = "32F8011697";

//host domain
const char destServer[] = "ec2-52-79-75-141.ap-northeast-2.compute.amazonaws.com";

//api endpoint
const char entranceCheck[] = "POST /api/devicelog/?device_id=2014&sensor=1";
const char remotecontrol[] = "GET /alram/2014";
const char humidityStr1[]  = "POST /humidity/?device_id=2014&humidity=";
const char humidityStr2[]  = " HTTP/1.1\nHost: ec2-52-79-75-141.ap-northeast-2.compute.amazonaws.com:3000\nConnection: close\n\n";

//request string
char humidityStr3[200];
  
//weight sensor 

//min,max of weight sensor 
//in 50~500 values of weight when  would be 
//sent to the server by POST 

const int maxWeight=500;
const int minWeight=50;
int sendCount=0;

//remotecontrol
//if 0->  value sensing state
//if 1 -> start 
//if 5->  end

//default is 0
int cooltimeNum = 0;
                                             
void setup() 
{
  pinMode(remotePin, OUTPUT); 
  //serial init
  Serial.begin(9600);
  //serialTrigger(F("Press any key to begin."));

  //weigth sensor init
  scale.set_scale(2280.f);      // this value is obtained by calibrating the scale with known weights; see the README for details
  scale.tare();                // reset the scale to 0
  
  //wifi init
  initializeESP8266();
  connectESP8266();
  displayConnectInfo();
}

void loop() 
{
  //get sensor value
  int soilSensorValue = analogRead(soilhumiditySeonsorPin);
  int weightSensorValue = scale.get_units(10) * -1 ;
  
  //weight Print
  Serial.print(F("weight sensor average:\t"));
  Serial.print(weightSensorValue);

  //soil sensor Print
  Serial.print(F("soil sensor :\t"));
  Serial.println(soilSensorValue);
  Serial.println(weightSensorValue);

  if(weightSensorValue > minWeight && weightSensorValue < maxWeight){
    if(sendCount==0){
        sprintf(humidityStr3,"%s%s",entranceCheck,humidityStr2);
        requeestHttp(humidityStr3);
        sendCount++;
    }
  }
  else{
    sendCount=0;
  }
//  serialTrigger(F("Press any key to connect humiditylog."));
  
  sprintf(humidityStr3,"%s%d%s",humidityStr1,soilSensorValue,humidityStr2);
  requestHttp(humidityStr3);

  sprintf(humidityStr3,"%s%s",remotecontrol,humidityStr2);
  if(requestHttpRead(humidityStr3)==999){
    if(cooltimeNum == 0){
          cooltimeNum = 1;
      }
    }
    if(cooltimeNum >= 1 && cooltimeNum <5 ){
        digitalWrite(remotePin,HIGH);
    } 
    else if(cooltimeNum == 5){
        digitalWrite(remotePin,LOW);
        cooltimeNum = 0;
    }



  //1초에 한번
  delay(1000);
  
}

void initializeESP8266()
{
  int test = esp8266.begin();
  if (test != true)
  {
    Serial.println(F("Error talking to ESP8266."));
    errorLoop(test);
  }
  Serial.println(F("ESP8266 Shield Present"));
}

void connectESP8266()
{

  int retVal = esp8266.getMode();
  if (retVal != ESP8266_MODE_STA)
  { 
    retVal = esp8266.setMode(ESP8266_MODE_STA);
    if (retVal < 0)
    {
      Serial.println(F("Error setting mode."));
      errorLoop(retVal);
    }
  }
  Serial.println(F("Mode set to station"));

 
  retVal = esp8266.status();
  if (retVal <= 0)
  {
    Serial.print(F("Connecting to "));
    Serial.println(mySSID);
    retVal = esp8266.connect(mySSID, myPSK);
    if (retVal < 0)
    {
      Serial.println(F("Error connecting"));
      errorLoop(retVal);
    }
  }
}

void displayConnectInfo()
{
  char connectedSSID[24];
  memset(connectedSSID, 0, 24);
  int retVal = esp8266.getAP(connectedSSID);
  if (retVal > 0)
  {
    Serial.print(F("Connected to: "));
    Serial.println(connectedSSID);
  }

  IPAddress myIP = esp8266.localIP();
  Serial.print(F("My IP: ")); Serial.println(myIP);
}

void requestHttp(String request)
{

  ESP8266Client client;

  int retVal = client.connect(destServer, 3000);
  if (retVal <= 0)
  {
    Serial.println(F("Failed to connect to server."));
    return;
  }

  client.print(request);
  while (client.available())
    Serial.write(client.read()); // read() gets the FIFO char


  }
  // stop() closes a TCP connection.
  if (client.connected()){
    client.stop(); 
}

int requestHttpRead(String request)
{

  ESP8266Client client;

  int retVal = client.connect(destServer, 3000);
  if (retVal <= 0)
  {
    Serial.println(F("Failed to connect to server."));
    return -1;
  }

  client.print(request);
  int returnValue=-1;
  while (client.available()){
    String c=client.readStringUntil('\r');
    //if(c.indexOf("{\"msg\":\"1\"")!=-1){
    if(c.indexOf("{\"msg\":\"1")!=-1){
      Serial.print("hello");
      returnValue=999;
     // break;
    }
    Serial.print(c);
  }

  int count=0;
  if (client.connected()){
    client.stop(); // stop() closes a TCP connection.
  }

  return returnValue;
}

void errorLoop(int error)
{
  Serial.print(F("Error: ")); Serial.println(error);
  Serial.println(F("Looping forever."));
  for (;;)
    ;
}

void serialTrigger(String message)
{
  Serial.println();
  Serial.println(message);
  Serial.println();
  while (!Serial.available())
    ;
  while (Serial.available())
    Serial.read();
}