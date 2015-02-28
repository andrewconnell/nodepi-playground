var GPIO = require('onoff').Gpio,
    led = new GPIO(18,'out'),
    button = new GPIO(17,'in','both');

function light(err,state){
  console.log('.. light()');
  console.log('.. state = ' +state);

  if(state == 1){
    led.writeSync(1);
  } else {
    led.writeSync(0);
  }
}

console.log('onoff running');

button.watch(light);
