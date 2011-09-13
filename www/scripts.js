/**
 * Author: Vesa "VesQ" Laakso
 */

$(document).ready( function () {
var canvas = $("#maincanvas")[0];
var ctx = canvas.getContext("2d");


// Load sprites, one is 16x24
var spriteLoaded = false;
var spriteImg = new Image();
spriteImg.onload = function () {
	spriteLoaded = true;
};
spriteImg.src = "images/running.png";
var sprites = {
  run = false,
  jump = false,
  climb = false
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  if( e.keyCode in keysDown ) {
    delete keysDown[e.keyCode];
  }
}, false);

// V�lk�ytys
var flash = {
  toggled: false,   // Onko v�l�ytys k�ynniss�
  val: 0.0,         // T�m�nhetkinen v�l�ytysarvo
  mod: 1,           // Menn��nk� tummempaan vai kirkkaampaan.
  running: false,   // Py�riik� v�l�ytys
  speed: 1.0        // V�l�hdyksen nopeus sekunneissa
}

var render = function() {
  var tmp = Math.round( 64.0 + flash.val * 191 );
  ctx.fillStyle = "rgb("+0+","+0+","+0+")";
  ctx.fillRect(0,0,640,480);
  
  // Teksti�
  ctx.fillStyle = "rgb("+tmp+","+tmp+","+tmp+")";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Hei, maailma!", 32, 32);
  
  ctx.fillStyle = "rgb(128,128,128)";
  ctx.font = "12px Helvetica";
  ctx.textAlign = "right";
  ctx.fillText("flash.toggled:", 580, 32 );
  ctx.fillText("flash.val:", 580, 46 );
  ctx.fillText("flash.mod:", 580, 60 );
  ctx.fillText("flash.speed:", 580, 74 );
  
  ctx.textAlign = "left";
  ctx.fillText(flash.toggled, 590, 32 );
  ctx.fillText(flash.val, 590, 46 );
  ctx.fillText(flash.mod, 590, 60 );
  ctx.fillText(flash.speed, 590, 74 );
}

var runFlash = function(delta) {
  if( flash.toggled ) {
    flash.running = true;
    flash.val = flash.val + delta * flash.mod * flash.speed;
    if( flash.val > 1.0 ) { flash.val = 1.0; flash.mod = -1; }
    if( flash.val < 0.0 ) { flash.val = 0.0; flash.mod = 1; }
  } else if( flash.running ) {
    flash.mod = 1;
    flash.val = flash.val - delta * flash.speed;
    if( flash.val < 0.0 ) {
      flash.val = 0.0;
      flash.running = false;
    }
  } else {
    flash.val = 0.0;
  }
}

// P�ivitykset
var update = function(delta) {
  if( 32 in keysDown) {
    flash.toggled = !flash.toggled;
    delete keysDown[32];
  }
}

// P��silmukka
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  runFlash( delta / 1000 );
  render();

  then = now;
};

// Resetointi
var reset = function() {
  flash.startVal = 0.0;
}

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 10); // Execute as fast as possible

});