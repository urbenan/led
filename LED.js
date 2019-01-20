//===============================================
// Websocket Server
// Data Hub
// Programmiert: Andreas Urben 2015
//===============================================

// ----------------- Websocket-Server Hub --------------------------------------
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({host: '172.24.1.1',port: 8000});
// var wss = new WebSocketServer({host: '192.168.1.40',port: 8000});
var clients=[];
clients.push("");

const Gpio = require('pigpio').Gpio; //include pigpio to interact with the GPIO
const led = new Gpio(4, {mode: Gpio.OUTPUT, alert:true}); //use GPIO pin 4 as output for RED
// redRGB = 0; //set starting value of RED variable to off (0 for common cathode)

let pulseWidth = 500;



 
const watchLed = () => {
  let startTick;
 
  // Use alerts to determine how long the LED was turned on
  led.on('alert', (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      console.log(diff);
    }
  });
};
 
watchLed();
 
// Turn the LED on for 15 microseconds once per second
setInterval(() => {
  led.trigger(15, 1);
}, 1000);







wss.addListener("connection",function(ws) {
  var clientID;
  console.log('client verbunden...');
  clients.push(ws);
  clientID=clients.length-1;
  // ws.send("Ein neuer Benutzer ist eingetreten");
  ws.send("0;"+clientID+";setClientID;"+clientID);

  ws.addListener("message",function(message) {
    var messageArray=message.split(";");
    var senderID=messageArray[0];
    var receiverID=messageArray[1];
    var parameterName=messageArray[2];
    var parameterValue=messageArray[3];
 //   console.log(message);
    for(var i = 1; i < clients.length; i++) {
      if (clients[i]!=null) {
        clients[i].send(senderID+";"+i+";"+parameterName+";"+parameterValue);
      }
    }
    
    if (parameterName=="rot_dx") {
      if (parameterValue>50) {
           // GPIO_04.writeSync(1);
        } else {
           // GPIO_04.writeSync(0);
      }

      ledBr.servoWrite(pulseWidth+parseInt(parameterValue*2)); 
     for(var i = 1; i < parameterValue; i++) { 
          // GPIO_04.writeSync(1);
      }
      for(var i = 1; i < 360-parameterValue; i++) { 
          // GPIO_04.writeSync(0);
      }


    }  


  });

  ws.addListener("close", function () {
    // emitted when server or client closes connection
    var message;
    for(var i = 1; i < clients.length; i++) {
      // # Remove from our connections list so we don't send
      // # to a dead socket
      if(clients[i] == ws) {
        // clients.splice(i);
        clients[i]=null;


        for(var n = 1; n < clients.length; n++) {
          if (clients[n]!=null) {
            message=i+";"+n+";closeConnection;"+i;
            clients[n].send(message);
//            console.log(message);
          }
        }

        break;


      }
    }
  });

});

// ------------------------------- Motor Steuerung GPIO ------------------------



// ------------------------------- Web Server ----------------------------------
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080);
