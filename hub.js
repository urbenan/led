//===============================================
// Websocket Server
// Data Hub
// Programmiert: Andreas Urben 2015
//===============================================

// Websocket-Server
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({host: '172.24.1.1',port: 8000});
// var wss = new WebSocketServer({host: '192.168.1.40',port: 8000});
var clients=[];
clients.push("");


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
    console.log(message);
    for(var i = 1; i < clients.length; i++) {
      if (clients[i]!=null) {
        clients[i].send(senderID+";"+i+";"+parameterName+";"+parameterValue);
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
            console.log(message);
          }
        }

        break;


      }
    }
  });

});

// Web Server
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080);
