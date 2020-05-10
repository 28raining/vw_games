import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

var screenHeight = 500;
var height = 500;
var width = 500;
var nextTick = 0;
var framePeriod = 33;

// Creating the scene
var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/screenHeight, 0.1, 1000 );
var camera = new THREE.OrthographicCamera(  50 / - 2, 50 / 2, 50 / 2, 50 / - 2, 1, 1000 );
scene.add(new THREE.AmbientLight(0xcccccc));
scene.background = new THREE.Color( 0xffffff  );

//Setting up renderer
var renderer = new THREE.WebGLRenderer( {antialias: true});
renderer.setSize( 800, 600  );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

const clock = new THREE.Clock();             

//
// var animate = function () {
//   requestAnimationFrame( animate );
//   let delta = 5*clock.getDelta();
//   objs.forEach(({mixer}) => {mixer.update(delta);});

//   renderer.render( scene, camera );
// };

function animate( tFrame ) {
  //this means on each browser frame draw, main is called. If user goes to a different tab then it stops
  window.requestAnimationFrame( animate );
  // if (runRender) {
    // If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
    // If tFrame = nextTick then 1 tick needs to be updated (and so forth).
    // Note: As we mention in summary, you should keep track of how large numTicks is.
    // If it is large, then either your game was asleep, or the machine cannot keep up.
    if (tFrame > nextTick) {
      let delta = 5*clock.getDelta();
      objs.forEach(({mixer}) => {mixer.update(delta);});

      nextTick = tFrame + framePeriod;
      renderer.render( scene, camera );
    }
  // }
}

/*NEW CODE*/
const objs = [];
const loader = new GLTFLoader();
loader.load("./worm.gltf", gltf => {
    // model is a THREE.Group (THREE.Object3D)                              
    const mixer = new THREE.AnimationMixer(gltf.scene);
    // animations is a list of THREE.AnimationClip
    for (const anim of gltf.animations) {
        mixer.clipAction(anim).play();
    }
    // settings in `sceneList` "Monster"
    gltf.scene.scale.set(3, 3, 3);
    gltf.scene.rotation.copy(new THREE.Euler(0,  Math.PI, 0));
    gltf.scene.position.set(2, 1, 0);
    
    scene.add(gltf.scene);
    objs.push({gltf, mixer});
});

loader.load("./worm.gltf", gltf => {
    // model is a THREE.Group (THREE.Object3D)                              
    const mixer = new THREE.AnimationMixer(gltf.scene);
    // animations is a list of THREE.AnimationClip
    for (const anim of gltf.animations) {
        mixer.clipAction(anim).play();
    }
    // settings in `sceneList` "Monster"
    gltf.scene.scale.set(3, 3, 3);
    gltf.scene.rotation.copy(new THREE.Euler(0,  Math.PI, 0));
    gltf.scene.position.set(-2, 1, 0);
    
    scene.add(gltf.scene);
    objs.push({gltf, mixer});
});
/*END OF NEW CODE*/

animate(0);