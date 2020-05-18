import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as gb from './gameGlobals'
import * as gameState from './gameState'
import imgBg from '../images/desert.jpg'
import { ResolvePlugin } from 'webpack';

var nextTick = 0;
var runRender = true;
var objs = [];
var worms = [];
var delta = 0;
export var myContour;
const canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
// const canvas = canvas_dom.getContext("gameCanvas");

export function startGame() {
  myGameArea.start();
  myContour = new contour_component();
  myContour.createContour();
  // myBackground = new bg_component(960, 450, img_background, 0, 0);
  animate(0); // Start the cycle. Performance gives current time in accurate precision
  console.log("updating game");
}

var myGameArea = {
  renderer : new THREE.WebGLRenderer( {canvas: canvas, antialias: true}),
  scene : new THREE.Scene(),
  camera : new THREE.OrthographicCamera(  0, gb.fulstrum_width, 0, gb.fulstrum_height, 1, 1000 ),
  clock : new THREE.Clock(),
  GLTFloader : new GLTFLoader(),
  start : function() {
        this.scene.add(new THREE.AmbientLight(0xffffff));
        this.scene.background = new THREE.Color( 0xffffff  );
        this.camera.position.z = 5;
        //Setting up renderer
        this.renderer.setSize( gb.canvas_width, gb.canvas_height);
        //add background
        const loader = new THREE.TextureLoader();
        loader.load(
          // resource URL
          imgBg,
          // onLoad callback
          function ( bgTexture ) {
            const canvasAspect = canvas.clientWidth / canvas.clientHeight;
            const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
            console.log(canvasAspect, imageAspect)
            const aspect = imageAspect / canvasAspect;
            bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
            bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;
            bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
            bgTexture.repeat.y = aspect > 1 ? 1 : aspect;
            myGameArea.scene.background = bgTexture;
          },
          // onProgress callback currently not supported
          undefined,
          // onError callback
          function ( err ) {
            console.error( 'An error happened.' );
          }
        );
      }
}

function animate( tFrame ) {
  var j=1;
  //requestAnimationFrame means on each browser frame draw, animate is called. If user goes to a different tab then it stops
  window.requestAnimationFrame( animate );
  if (runRender) {
    if (tFrame > nextTick) {
      nextTick = tFrame + gb.frame_period
      delta = 5*myGameArea.clock.getDelta();
      worms.forEach(function(obj) {
        obj.mixer.update(delta);
        let player = gb.gameGlobals.gameState.players[obj.missing];
        obj.gltf.scene.position.set(player.x, player.y, 0);
        if (player.ml) {
          obj.gltf.scene.scale.x = -25;
          for (const anim of obj.gltf.animations) {
            // console.log(anim);
            obj.mixer.clipAction(anim).play();
          }
        } else if (player.mr) {
          obj.gltf.scene.scale.x = 25;
          for (const anim of obj.gltf.animations) {
            obj.mixer.clipAction(anim).play();
          }
        } else {
          for (const anim of obj.gltf.animations) {
            obj.mixer.clipAction(anim).stop();
          }
        }

        //Probaby best to store baseball bat as a seperate object in the obj array
        if (gb.localState.baseball) {
          obj.gltf.scene.traverse((o) => {
            if (o.type === "Mesh") if(o.name == "baseballbat") (o as any).visible = true; 
          });
        } else {
          obj.gltf.scene.traverse((o) => {
            if (o.type === "Mesh") if(o.name == "baseballbat") (o as any).visible = false;
          });
        }
      });
      gameState.generateNextState();

      //Move the worms around
      // for (j=1; j<=gb.gameGlobals.gameState.numPlayers; j++) {
      //   var player_index = 'player' + j;
      //   console.log('player' + j);
      //   let obj = worms[j];
      //   console.log(obj);
      //   obj.mixer.update(delta);
      //   obj.gltf.scene.position.set(gb.gameGlobals.gameState[player_index].x, gb.gameGlobals.gameState[player_index].y, 0);
      // } 

      myGameArea.renderer.render( myGameArea.scene, myGameArea.camera );
    }
  }
}

//this runs asnychronously. It is in a seperate function so that 'missing' doesn't change before it's completed
//If there was a for loop creating all the worms, the for loop would finish and then much later the async worm generation would finish.
function gen_worm (missing: Number) {
  myGameArea.GLTFloader.load("./worm.glb", gltf => {                        
    const mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.scene.scale.set(25, 25, 25);
    gltf.scene.rotation.copy(new THREE.Euler(Math.PI,0,0));
    gltf.scene.position.set(0,0,0);
    myGameArea.scene.add(gltf.scene);
    worms.push({gltf,mixer,missing});
    var model = gltf.scene;
    var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
    model.traverse((o) => {
      if (o.type === "Mesh") {
        // if(o.name == "eye_right") (o as any).material = newMaterial;
        if(o.name == "baseballbat") (o as any).material = newMaterial;
        if(o.name == "baseballbat") (o as any).visible = false;
        // if(o.name == "eye_left") (o as any).material = newMaterial;
        // if(o.name == "worm_body") (o as any).material = newMaterial;
      }
    });
  });
}


export function add_player() {
  //first list the missing players
  let existingPlayers = [];
  worms.forEach(obj => existingPlayers.push(obj.player));
  let difference = Object.keys(gb.gameGlobals.gameState.players).filter(x => !existingPlayers.includes(x));
  console.log("Missing players: " + difference);

  //then add the missing players to the object (color them differently?)
  difference.forEach(missing => gen_worm(parseInt(missing)))
}

function contour_component () {
  this.contour = [];
  this.createContour = function() {
    //define a handful of points, x increases in 100's. Then just draw straight lines between thhem
    let y = [];
    y.push(270,285,270,240,250,270,295,275,290,295,310)
    y = y.map(function(y) { return  y * gb.fulstrum_height / gb.canvas_height; });
    let i = 0, j=0, index = 0;;
    for (i=0; i<300;i+=1){
        j = i%100;
        index = Math.floor(i/100);
        this.contour[i] = (y[index] + (j * (y[index+1] - y[index])/100));
    }
  };
  // this.update = function () {
  //   let ctx = myGameArea.context;
  //   let i = 0;
  //   ctx.beginPath();
  //   ctx.lineWidth = 1;
  //   ctx.strokeStyle = "green"; // Green path
  //   ctx.moveTo(0, this.contour[0]);
  //   for (i=1; i<canvas.width; i++) {
  //     ctx.lineTo(i, this.contour[i]);
  //   }
  //   ctx.stroke(); // Draw it
  // }
}
