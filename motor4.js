var Gpio = require('onoff').Gpio, // Constructor function for Gpio objects.
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
iv=setInterval(drive,3);

ivTarget=setInterval(setTarget,2000);

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
