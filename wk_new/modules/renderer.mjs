import * as THREE from '../external/three.module.js';
import {GLTFLoader} from '../external/GLTFLoader.js';
import * as gameState from './gameState.mjs'
import * as db from './database.mjs'

var nextTick = 0;
var runRender = true;
var worms = [];
var delta = 0;
var textures = {
  wood : null
};
var player_color = [
  "#B0129C",
  "#95F0D2",
  "#FDBFFC",
  "#0B4FE1",
  "#90DF15",
  "#B08687"
]

var drawHistory = {};
var myContour;
const canvas = document.getElementById("gameCanvas");
// const canvas = canvas_dom.getContext("gameCanvas");

export function startGame() {
  myGameArea.start();
  // myBackground = new bg_component(960, 450, img_background, 0, 0);
  animate(1); // Start the cycle. Performance gives current time in accurate precision
  console.log("updating game");
}

var myGameArea = {
  renderer : new THREE.WebGLRenderer( {canvas: canvas, antialias: true}),
  scene : new THREE.Scene(),
  camera : new THREE.OrthographicCamera(  0, gameState.privateState.fulstrum_width, 0, gameState.privateState.fulstrum_height, 0, 1000 ),
  clock : new THREE.Clock(),
  GLTFloader : new GLTFLoader(),
  textureLoader : new THREE.TextureLoader(),
  start : function() {
    this.scene.add(new THREE.AmbientLight(0xffffff));
    this.scene.background = new THREE.Color( 0xffffff  );
    //Setting up renderer
    this.renderer.setSize( gameState.privateState.canvas_width, gameState.privateState.canvas_height);
    //add background
    this.textureLoader.load(
      // resource URL
      '../images/desert.jpg',
      // onLoad callback
      function ( bgTexture ) {
        const canvasAspect = canvas.clientWidth / canvas.clientHeight;
        const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
        // console.log(canvasAspect, imageAspect)
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
      nextTick = tFrame + gameState.privateState.frame_period
      db.reqData();
    }
  }
}

export function genNextFrame() {
  delta = 5*myGameArea.clock.getDelta();
  worms.forEach(function(obj) {
    obj.mixer.update(delta);
    var player = gameState.publicState.gameState.players[obj.player];
    var god = gameState.publicState.gameState.god[obj.player];
    obj.gltf.scene.position.set(player.x, player.y, -300);
    obj.health_bar.outline.position.set(player.x-50, player.y-130, -300)
    obj.health_bar.fill.position.set(player.x-50, player.y-130, -300)
    if (player.Vx < 0) {
      //Move Left
      obj.gltf.scene.scale.x = -25;
      obj.animations['walk_body'].play();
      obj.animations['walk_head'].play();
      obj.animations['walk_eyeright'].play();
      obj.animations['walk_eyeleft'].play();
    } else if (player.Vx > 0) {
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

    obj.health_bar = update_health_bar(god.health, obj.health_bar, player.x-50, player.y-130)

    // Loop through all the weapons, draw which ever one is selected
    if (player.weapon >= 0) var weapon = gameState.privateState.weapons[player.weapon].name;
    else var weapon = "";
    gameState.privateState.weapons.forEach((val) => {
      if (val.name == weapon) {
        obj.weapons[val.name].visible = true;
        obj.animations[val.name].loop = THREE.LoopOnce;
        obj.animations[val.name].timeScale = 2;
        if (drawHistory[obj.player].shoot != player.shoot) {
          drawHistory[obj.player].shoot = player.shoot;
          // gameState.privateState.shootDone = true;
          // gameState.privateState.health_percent = Math.max(0,gameState.privateState.health_percent - 10);
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
  // if (gameState.publicState.gameState.numPlayers > gameState.privateState.numPlayers) add_player();

  //Add any missing players
  var existingPlayers = [];
  worms.forEach(obj => existingPlayers.push(String(obj.player)));
  // console.log ("Existing = " + existingPlayers);
  // console.log ("server players = " + Object.keys(gameState.publicState.gameState.players));
  var difference = Object.keys(gameState.publicState.gameState.players).filter(x => !existingPlayers.includes(x));
  // console.log("Missing players: " + difference);
  //then add the missing players to the object (color them differently?)
  difference.forEach(missing => gen_worm(parseInt(missing)));
  // gameState.privateState.numPlayers = gameState.publicState.gameState.numPlayers;

  // console.log("next frame coming")
  myGameArea.renderer.render( myGameArea.scene, myGameArea.camera );
}

//this runs asnychronously. It is in a seperate function so that 'missing' doesn't change before it's completed
//If there was a for loop creating all the worms, the for loop would finish and then much later the async worm generation would finish.
var wormAdding = []
function gen_worm (player) {
  if (!(wormAdding.includes(player))) {
    wormAdding.push(player)
    console.log("running gen_worm for player " + player)
    myGameArea.GLTFloader.load("./3d/worm.glb", gltf => {                        
      const mixer = new THREE.AnimationMixer(gltf.scene);
      var newMaterial = new THREE.MeshStandardMaterial({color: player_color[player]});
      gltf.scene.scale.set(25, 25, 25);
      gltf.scene.rotation.copy(new THREE.Euler(Math.PI,0,0));
      gltf.scene.position.set(0,0,-300);
      gltf.scene.traverse((o) => {
        if (o.type === "Mesh") {
          if (o.name == 'worm_body') o.material = newMaterial;
          else if (o.name == 'worm_head') o.material = newMaterial;
        }
      })

      myGameArea.scene.add(gltf.scene);
      var model = gltf.scene;
      //separate each weapon into an array
      var weapons = {};
      model.traverse((o) => {
        if (o.type === "Mesh") {
          if(o.name == "baseballbat") {
            o.material = textures['wood'];
            o.visible = false;
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

      //add some draw history
      drawHistory[player] = {shoot:0}

      worms.push({gltf,mixer,player,animations,weapons,health_bar});
    });
  }
}

function update_health_bar(health_percent, prev_obj=null,x=0,y=0) {
    var health_bar = {};
    // console.log("health:" + health_percent)

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
  var existingPlayers = [];
  worms.forEach(obj => existingPlayers.push(String(obj.player)));
  console.log ("Existing = " + existingPlayers);
  console.log ("server players = " + Object.keys(gameState.publicState.gameState.players));
  var difference = Object.keys(gameState.publicState.gameState.players).filter(x => !existingPlayers.includes(x));
  console.log("Missing players: " + difference);

  //then add the missing players to the object (color them differently?)

  difference.forEach(missing => gen_worm(parseInt(missing)));
  gameState.privateState.numPlayers = gameState.publicState.gameState.numPlayers;

}

//load textures here... move somewhere better soon
//load wood for the baseball bat

textures['wood'] = new THREE.MeshBasicMaterial({
  map: myGameArea.textureLoader.load('../images/wood_texture.jpg'),
});

// myGameArea.textureLoader.load(
//   // resource URL
//   '../images/wood_texture.jpg',
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
