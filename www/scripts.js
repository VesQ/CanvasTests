/**
 * Author: Vesa "VesQ" Laakso
 */

var canvas = $("#maincanvas")[0];
var ctx = canvas.getContext("2d");


// Load sprites, one part is 16x24
var spriteLoaded = false;
var spriteImg = new Image();
spriteImg.onload = function () {
  spriteLoaded = true;
};
spriteImg.src = "images/running.png";

function drawSprite(o) {
  if( typeof o.sprite == 'undefined' ||
      typeof o.x == 'undefined' ||
      typeof o.y == 'undefined' ||
      typeof o.frame == 'undefined' )
  {
    return false;
  }
  switch( o.sprite ) {
    case "runright":
      break;
    case "runleft":
      break;
    case "jump":
      break;
    case "climb":
      break;
    default:
      return false;
  }
  return true;
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

// Creating a new flash and appending it to the flashes-object
function createFlash( key, speed ) {
  this.toggled = false; // Is flash toggled
  this.val = 0.0;       // Current value of the flash (from 0.0 to 1.0)
  this.mod = 1;         // Are we going higher or lower
  this.running = false; // Is the flash running
  this.speed = speed;   // How fast does flash go from 0.0 to 1.0 in seconds
  
  flashes[key] = this;
}
var flashes = {};

var render = function() {
  var tmp = Math.round( 64.0 + flashes.maintext.val * 191 );
  ctx.fillStyle = "rgb("+0+","+0+","+0+")";
  ctx.fillRect(0,0,640,480);
  
  // Draw some text
  ctx.fillStyle = "rgb("+tmp+","+tmp+","+tmp+")";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Hei, maailma!", 32, 32);
  
  
  // Draw some debug-info
  ctx.fillStyle = "rgb(128,128,128)";
  ctx.font = "12px Helvetica";
  ctx.textAlign = "right";
  ctx.fillText("flashes.maintext.toggled:", 580, 32 );
  ctx.fillText("flashes.maintext.val:", 580, 46 );
  ctx.fillText("flashes.maintext.mod:", 580, 60 );
  ctx.fillText("flashes.maintext.speed:", 580, 74 );
  
  ctx.textAlign = "left";
  ctx.fillText(flashes.maintext.toggled, 590, 32 );
  ctx.fillText(flashes.maintext.val, 590, 46 );
  ctx.fillText(flashes.maintext.mod, 590, 60 );
  ctx.fillText(flashes.maintext.speed, 590, 74 );
}

// Update all flashes
var runFlashes = function(delta) {
  for( f in flashes ) {
    var flash = flashes[f];
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
}

// Update keys
var update = function(delta) {
  if( 32 in keysDown) {
    // -- Return --
    // Toggle maintext flash
    flashes.maintext.toggled = !flashes.maintext.toggled;
    delete keysDown[32];
  }
  if( 27 in keysDown ) {
    // -- Escape --
    // Pause/resume main interval
    if( mainRunning ) {
      clearInterval( mainInterval );
      mainRunning = false;
    } else {
      mainInterval = setInterval(main, 10);
      mainRunning = true;
    }
    delete keysDown[27];
  }
}

// Main loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  runFlashes( delta / 1000 );
  render();

  then = now;
};

// Reset
var reset = function() {
  for( f in flashes ) {
    var flash = flashes[f];
    flash.toggled = false;
    flash.val = 0.0;
    flash.mod = 1;
    flash.running = false;
  }
}

// Run it!
reset();
createFlash( "maintext", 1.0 );
var then = Date.now();
var mainRunning = true;
var mainInterval = setInterval(main, 10); // Run (almost) as fast as possible
