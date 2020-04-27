import img_caterpillar_left  from '../images/caterpillar-left.svg'
import img_caterpillar_right from '../images/caterpillar-right.png'
import img_background from '../images/desert.jpg'
import {generateNextState} from './gameState'
import * as gb from './gameGlobals'

/*
* Code to redraw canvas at a specific frame rate
* https://developer.mozilla.org/en-US/docs/Games/Anatomy
*
* render() is passed tFrame because it is assumed that the render method will calculate
*          how long it has been since the most recently passed update tick for 
*          extrapolation (purely cosmetic for fast devices). It draws the scene.
*
* setInitialState() Performs whatever tasks are leftover before the mainloop must run.
*                   It is just a generic example function that you might have added.
*/

// All variables below are in units of ms. framePeriod determins frame rate (50=20fps)
var MyGame = {
    lastTick : 0,
    framePeriod : 50,
    nextTick : 0
}

var runRender = 1;

//tframe is a time in ms
function main( tFrame ) {
  //this means on each browser frame draw, main is called. If user goes to a different tab then it stops
  window.requestAnimationFrame( main );
  if (runRender) {
    // If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
    // If tFrame = nextTick then 1 tick needs to be updated (and so forth).
    // Note: As we mention in summary, you should keep track of how large numTicks is.
    // If it is large, then either your game was asleep, or the machine cannot keep up.
    if (tFrame > MyGame.nextTick) {
      MyGame.nextTick = tFrame + MyGame.framePeriod;
      render(); //fixed frame rate. If not fixed, will have to pass the current time into render
    }
  }
}

export var myWorm;
var myBackground;
export var myContour;
var worms = [];

var canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");

export function startGame() {
    myGameArea.start();
    myContour = new contour_component();
    myContour.createContour();
    myBackground = new bg_component(960, 450, img_background, 0, 0);
    main(performance.now()); // Start the cycle. Performance gives current time in accurate precision
    console.log("updating game");
}

function add_player() {
  generateWorms();
  gb.localState.numPlayers = gb.gameGlobals.gameState.numPlayers;
}

function generateWorms () {
  var i;
  for (i=1; i<=gb.gameGlobals.gameState.numPlayers; i++) {
    worms[i] = new component(30, gb.localState.wormHeight, img_caterpillar_left, img_caterpillar_right, 10, 120, "image");
  }
}

var myGameArea = {
    context : canvas.getContext("2d"),
    start : function() {
        canvas.width = 960;
        canvas.height = 450;
        this.frameNo = 0;
        },
    clear : function() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function component(width, height, src_left, src_right, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image_left = new Image();
        this.image_left.src = src_left;
        this.image_right = new Image();
        this.image_right.src = src_right;
    }
    this.src_left = src_left;
    this.src_right = src_right;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.update = function(x, y) {
        let ctx = myGameArea.context;
        // if (gb.localState.lastMove == 'left') this.image.src = this.src_left;
        // else this.image.src = this.src_left;
        if (gb.localState.lastMove == 'left') {
            ctx.drawImage(this.image_left, 
                x, 
                y, 
                this.width, this.height);
        } else {
          ctx.drawImage(this.image_right, 
            x, 
            y, 
            this.width, this.height); 
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }    
}

function bg_component(width, height, src, x, y) {
    this.image = new Image();
    this.image.src = src;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.update = function() {
        let ctx = myGameArea.context;
          ctx.drawImage(this.image, 
              x, 
              y, 
              this.width, this.height);
    }  
}

/*
* Draws the line which the worm must stay above
*/
function contour_component () {
  this.contour = [];
  this.createContour = function() {
    //define a handful of points, x increases in 100's. Then just draw straight lines between thhem
    let y = [];
    y.push(270,285,270,240,250,270,295,275,290,295,310)
    let i = 0, j=0, index = 0;;
    console.log(canvas.width);
    for (i=0; i<canvas.width;i+=1){
        j = i%100;
        index = Math.floor(i/100);
        this.contour[i] = (y[index] + (j * (y[index+1] - y[index])/100));
    }
  };
  this.update = function () {
    let ctx = myGameArea.context;
    let i = 0;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "green"; // Green path
    ctx.moveTo(0, this.contour[0]);
    for (i=1; i<canvas.width; i++) {
      ctx.lineTo(i, this.contour[i]);
    }
    ctx.stroke(); // Draw it
  }
}

function render() {
    if (gb.gameGlobals.gameID>0) { //don't try to write to db before joined a game
      var i;
      //check if a new player has joined
      if (gb.gameGlobals.gameState.numPlayers > gb.localState.numPlayers) add_player();
      myGameArea.clear();
      // myBackground.newPos();    
      myBackground.update();
      // myWorm.newPos();   
      for (i=1; i<=gb.gameGlobals.gameState.numPlayers; i++) {
        var player_index = 'player' + i;
        worms[i].update(gb.gameGlobals.gameState[player_index].x,gb.gameGlobals.gameState[player_index].y);
      } 

      myContour.update();
      generateNextState();
    } 
}

// function move(dir) {
//     myGamePiece.image.src = "angry.gif";
//     if (dir == "up") {myGamePiece.speedY = -1; }
//     if (dir == "down") {myGamePiece.speedY = 1; }
//     if (dir == "left") {myGamePiece.speedX = -1; }
//     if (dir == "right") {myGamePiece.speedX = 1; }
// }