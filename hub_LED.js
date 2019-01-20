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

var Gpio = require('pigpio').Gpio, //include pigpio to interact with the GPIO
ledBr = new Gpio(4, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
redRGB = 0; //set starting value of RED variable to off (0 for common cathode)


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

      ledBr.pwmWrite(parseInt(parameterValue/1.5)); 
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
var Gpio = require('onoff').Gpio, // Constructor function for Gpio objects.
  GPIO_04 = new Gpio(4, 'out'),      // Export GPIO #4 as an output.
  GPIO_07 = new Gpio(7, 'out'),      // Export GPIO #7 as an output.
  GPIO_08 = new Gpio(8, 'out'),      // Export GPIO #8 as an output.
  GPIO_09 = new Gpio(9, 'out'),      // Export GPIO #9 as an output.
  GPIO_10 = new Gpio(10, 'out'),      // Export GPIO #10 as an output.
iv,ivTarget;



var step_number=0; // Total Steps
var step_current=2; // Current Motor Step 1,2,3,4
var step_target=100; // Target Steps
var step_direction=1; // left:-1, right:1

step_off();

// Toggle the state of the LED on GPIO #7 every 200ms.
// Here synchronous methods are used. Asynchronous methods are also available.
//      iv=setInterval(drive,3);

//      ivTarget=setInterval(setTarget,2000);

function setTarget() {
  step_target=100;
  step_direction=step_direction*-1;
  step_number=0;

//  step_off();
  console.log("Interval Start");
}

// Stop blinking the LED and turn it off after 5 seconds.
/*
setTimeout(function () {
  clearInterval(iv); // Stop blinking

  GPIO_04.writeSync(0);  // Turn LED off.
  GPIO_04.unexport();    // Unexport GPIO and free resources
  GPIO_07.writeSync(0);  // Turn LED off.
  GPIO_07.unexport();    // Unexport GPIO and free resources
  GPIO_08.writeSync(0);  // Turn LED off.
  GPIO_08.unexport();    // Unexport GPIO and free resources
  GPIO_09.writeSync(0);  // Turn LED off.
  GPIO_09.unexport();    // Unexport GPIO and free resources
  GPIO_10.writeSync(0);  // Turn LED off.
  GPIO_10.unexport();    // Unexport GPIO and free resources
}, 5000);
*/

function step_off() {
  GPIO_07.writeSync(0);
  GPIO_08.writeSync(0);
  GPIO_09.writeSync(0);
  GPIO_10.writeSync(0);
}


function step_1() {
  GPIO_07.writeSync(1);
  GPIO_08.writeSync(0);
  GPIO_09.writeSync(0);
  GPIO_10.writeSync(1);
}

function step_2() {
    GPIO_07.writeSync(0);
    GPIO_08.writeSync(1);
    GPIO_09.writeSync(0);
    GPIO_10.writeSync(1);
}

function step_3() {
  GPIO_07.writeSync(0);
  GPIO_08.writeSync(1);
  GPIO_09.writeSync(1);
  GPIO_10.writeSync(0);
}

function step_4() {
  GPIO_07.writeSync(1);
  GPIO_08.writeSync(0);
  GPIO_09.writeSync(1);
  GPIO_10.writeSync(0);
}


function drive() {
 console.log("Motor Step");
 if(step_number<step_target) {
  if(step_direction==1) {
    if(step_current==1) {
      step_2();
    }
    if(step_current==2) {
      step_3();
    }
    if(step_current==3) {
      step_4();
    }
    if(step_current==4) {
      step_1();
    }
    step_current=step_current+1;
    if(step_current>4) {
      step_current=1;
      step_number=step_number+1;
    }
    // step_number=step_number+1;
  }

  if(step_direction==-1) {
    if(step_current==4) {
      step_3();
    }
    if(step_current==3) {
      step_2();
    }
    if(step_current==2) {
      step_1();
    }
    if(step_current==1) {
      step_4();
    }
    step_current=step_current-1;
    if(step_current<1) {
      step_current=4;
      step_number=step_number+1;
    }
    // step_number=step_number+1;
  }
//  clearInterval(iv);
// step_off();
}
}




// ------------------------------- Web Server ----------------------------------
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080);
