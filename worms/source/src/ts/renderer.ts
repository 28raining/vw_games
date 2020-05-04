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

// All variables below are in units of ms. 
var MyGame = {
    lastTick : 0,
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
      MyGame.nextTick = tFrame + gb.frame_period;
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
    worms[i] = new new_worm_component(30, gb.localState.wormHeight, img_caterpillar_left, img_caterpillar_right, 10, 120, "image");
  }
}

var myGameArea = {
    context : canvas.getContext("2d"),
    start : function() {
        canvas.width = 960;
        canvas.height = 450;
        this.frameNo = 0;
        this.context.translate(0, 0);
        },
    clear : function() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    },
}

function new_worm_component(width, height, src_left, src_right, x, y, type) {
  this.height = 30;
  this.offset_x = 191;
  this.offset_y = 280;
  this.worm_mouth = new Path2D("M191.67 372.87L153.15 368.28L153.15 331.49L286.67 310.8L286.67 347.59L191.67 372.87Z");
  this.worm_head = new Path2D("");
  this.worm_eye_right = new Path2D("");
  this.worm_eye_left = new Path2D("");
  this.worm_tail = new Path2D("M192.82 369.43L274.02 333.79L287.82 346.44L287.82 436.09L353.33 488.97L406.21 456.78L461.38 506.21L461.38 528.05L187.82 531.49L154.3 517.7L139.54 483.22L169.43 398.16L154.3 365.98L192.82 369.43Z");
  this.worm_pupil_left = new Path2D("");
  this.worm_pupil_right = new Path2D("");
  this.walk_frame=0;
  this.update = function(x, y) {
    let walk=false;
    if (gb.localState.moveLeft || gb.localState.moveRight) walk = true;
    let ctx = myGameArea.context;
    ctx.save();
    let y_scale = this.height / 250;
    let flip = 1;
    let squeeze = 1;
    if (gb.localState.lastMove == 'right') flip = -1;
    if (walk==true || this.walk_frame>0) {
      //walk animation takes 500ms. 250ms squeeze, 250ms relax
      let num_frames = Math.floor(250 / gb.frame_period);
      let max_squeeze = 0.7;
      if (this.walk_frame > num_frames) {
        squeeze = 1.0 - ((1.0 - max_squeeze) * (2*num_frames - this.walk_frame)/num_frames);
      } else {
        squeeze = 1.0 - ((1.0 - max_squeeze) * this.walk_frame / num_frames);
      }
      this.walk_frame = (this.walk_frame + 1) % (2*num_frames);
      // console.log(squeeze,this.walk_frame);
    }

    let x_scale = y_scale * squeeze;
    ctx.scale(x_scale*flip, y_scale);
    ctx.translate(((x/x_scale)*flip-this.offset_x), (y/y_scale)-this.offset_y);
    ctx.fill(this.worm_tail);
    ctx.restore();

  }
}

function worm_component(width, height, src_left, src_right, x, y, type) {
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
      myBackground.update();
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