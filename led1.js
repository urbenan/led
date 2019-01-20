var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var Gpio = require('pigpio').Gpio, //include pigpio to interact with the GPIO
ledRed = new Gpio(4, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
redRGB = 0; 

//RESET RGB LED
ledRed.digitalWrite(0); // Turn RED LED off

app.listen(8080,'172.24.1.1');

function handler (req, res) {
  fs.readFile(__dirname + '/led1.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });

    console.log('log');
    ledRed.pwmWrite(50); //set RED LED to specified value 

  socket.on('my other event', function (data) {
    redRGB=parseInt(data.my);
    // ledRed.pwmWrite(redRGB); //set RED LED to specified value 
  
    console.log(data);
  });
});

