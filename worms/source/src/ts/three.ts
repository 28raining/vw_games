import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as gb from './gameGlobals'
import * as gameState from './gameState'
import imgBg from '../images/desert.jpg'
import imgWood from '../images/wood_texture.jpg'
import { ResolvePlugin } from 'webpack';

var nextTick = 0;
var runRender = true;
var objs = [];
var worms = [];
var delta = 0;
var textures = {
  wood : null
};
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
  camera : new THREE.OrthographicCamera(  0, gb.fulstrum_width, 0, gb.fulstrum_height, 0, 1000 ),
  clock : new THREE.Clock(),
  GLTFloader : new GLTFLoader(),
  textureLoader : new THREE.TextureLoader(),
  start : function() {
    this.scene.add(new THREE.AmbientLight(0xffffff));
    this.scene.background = new THREE.Color( 0xffffff  );
    //Setting up renderer
    this.renderer.setSize( gb.canvas_width, gb.canvas_height);
    //add background
    this.textureLoader.load(
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
  },
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
        let player = gb.gameGlobals.gameState.players[obj.player];
        obj.gltf.scene.position.set(player.x, player.y, -300);
        obj.health_bar.outline.position.set(player.x-50, player.y-130, -300)
        obj.health_bar.fill.position.set(player.x-50, player.y-130, -300)
        if (player.ml) {
          //Move Left
          obj.gltf.scene.scale.x = -25;
          obj.animations['walk_body'].play();
          obj.animations['walk_head'].play();
          obj.animations['walk_eyeright'].play();
          obj.animations['walk_eyeleft'].play();
        } else if (player.mr) {
          //Move Right
          obj.gltf.scene.scale.x = 25;
          obj.animations['walk_body'].play();
          obj.animations['walk_head'].play();
          obj.animations['walk_eyeright'].play();
          obj.animations['walk_eyeleft'].play();
        } else {
          //No movement
          obj.animations['walk_body'].stop();
          obj.animations['walk_head'].stop();
          obj.animations['walk_eyeright'].stop();
          obj.animations['walk_eyeleft'].stop();
        }

        //Loop through all the weapons, draw which ever one is selected
        gb.localState.weapons.forEach((val) => {
          if (val.selected) {
            obj.weapons[val.name].visible = true;
            obj.animations[val.name].loop = THREE.LoopOnce;
            obj.animations[val.name].timeScale = 2;
            if (gb.localState.shoot && !gb.localState.shootDone) {
              // gb.localState.shootDone = true;
              gb.localState.health_percent = Math.max(0,gb.localState.health_percent - 10);
              obj.health_bar = update_health_bar(gb.localState.health_percent, obj.health_bar,player.x-50, player.y-130)
              obj.animations[val.name].play();
              if (!obj.animations[val.name].enabled) obj.animations[val.name].reset();
            }
            // else obj.mixer.clipAction(obj.animations[val.name]).stop();
          } else {
            obj.weapons[val.name].visible = false;
            // obj.mixer.clipAction(obj.animations[val.name]).stop();
          }
        });

      });
      gameState.generateNextState();

      myGameArea.renderer.render( myGameArea.scene, myGameArea.camera );
    }
  }
}

//this runs asnychronously. It is in a seperate function so that 'missing' doesn't change before it's completed
//If there was a for loop creating all the worms, the for loop would finish and then much later the async worm generation would finish.
function gen_worm (player: Number) {
  myGameArea.GLTFloader.load("./worm.glb", gltf => {                        
    const mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.scene.scale.set(25, 25, 25);
    gltf.scene.rotation.copy(new THREE.Euler(Math.PI,0,0));
    gltf.scene.position.set(0,0,-300);
    myGameArea.scene.add(gltf.scene);
    var model = gltf.scene;
    var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
    //separate each weapon into an array
    var weapons = {};
    model.traverse((o) => {
      if (o.type === "Mesh") {
        if(o.name == "baseballbat") {
          (o as any).material = textures['wood'];
          (o as any).visible = false;
          weapons["baseballbat"] = o;
        }
      }
    });
    //separate each animation into an array
    var animations = {};
    gltf.animations.forEach((val) => {
      var anim = mixer.clipAction(val);
      animations[val.name] = anim; 
    });

    //Create a health bar
    //example code here view-source:https://threejs.org/examples/webgl_geometry_shapes.html
    var health_bar = update_health_bar(100);

    worms.push({gltf,mixer,player,animations,weapons,health_bar});
  });
}

function update_health_bar(health_percent, prev_obj=null,x=0,y=0) {
    var health_bar = {};
    console.log("health:" + health_percent)

    if (prev_obj) myGameArea.scene.remove(prev_obj['fill']);

    //Create the filled rectangle
    if (health_percent > 0) {
      var roundedRectShape = new THREE.Shape();
      var rad_right = (health_percent==100) ? 10 : 0;
      roundedRect( roundedRectShape, 0, 0, Math.round(50 * health_percent / 100), 20, 10,rad_right);
      var geometry = new THREE.ShapeBufferGeometry( roundedRectShape );
      var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0x8080f0, side: THREE.DoubleSide } ) );
      mesh.position.set(x,y,-50);
      myGameArea.scene.add(mesh)
      health_bar['fill']=mesh;
    } else health_bar['fill']=prev_obj['fill'];

    // create the outline
    if (prev_obj) health_bar['outline'] = prev_obj['outline'];
    else {
      var lineShape = addLineShape (roundedRectShape,0xF080f0);
      myGameArea.scene.add(lineShape);
      health_bar['outline'] = lineShape;
    }

    return health_bar;
}

function roundedRect( ctx, x, y, width, height, radius_left, radius_right ) {

  ctx.moveTo( x, y + radius_left );
  ctx.lineTo( x, y + height - radius_left );
  ctx.quadraticCurveTo( x, y + height, x + radius_left, y + height );
  ctx.lineTo( x + width - radius_right, y + height );
  ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius_right );
  ctx.lineTo( x + width, y + radius_right );
  ctx.quadraticCurveTo( x + width, y, x + width - radius_right, y );
  ctx.lineTo( x + radius_left, y );
  ctx.quadraticCurveTo( x, y, x, y + radius_left );

}
function addLineShape( shape, color) {

  shape.autoClose = true;
  var points = shape.getPoints();
  var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
  // solid line
  var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( { color: color } ) );
  return line;

}


export function add_player() {
  //first list the missing players
  let existingPlayers = [];
  worms.forEach(obj => existingPlayers.push(String(obj.player)));
  // console.log ("Existing = " + existingPlayers);
  // console.log ("server players = " + Object.keys(gb.gameGlobals.gameState.players));
  let difference = Object.keys(gb.gameGlobals.gameState.players).filter(x => !existingPlayers.includes(x));
  // console.log("Missing players: " + difference);

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
}




//load textures here... move somewhere better soon
//load wood for the baseball bat

textures['wood'] = new THREE.MeshBasicMaterial({
  map: myGameArea.textureLoader.load(imgWood),
});

// myGameArea.textureLoader.load(
//   // resource URL
//   imgWood,
//   // onLoad callback
//   function ( woodTexture ) {
//     textures['wood'] =  new THREE.MeshBasicMaterial({woodTexture});
//     console.log('wood_loaded');
//   },
//   // onProgress callback currently not supported
//   undefined,
//   // onError callback
//   function ( err ) {
//     console.error( 'An error happened when loading wood texture' );
//   }
// );
