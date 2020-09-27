var playerRef;
var localState;
console.log('Worker alive....!');
importScripts("https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.14.1/firebase-database.js");

//Game settings
var gameState = {
  playerNum: -1,
  updatePeriod: 20,
  updatePerStore: 1,
  gameID: -1,
  started : false
}

var updateCount=0;
var meter_to_pixel;
var godRef;

//Initial player settings
var initPlayer = {
  x: 0,
  y: 300,
  Vx: 0,
  Vy: 0,
  weapon: -1,
  shoot: 0
}

var initGod = {
  dx: 0,
  dy: 0,
  health:100
}

//Initial public state used to create a new game
var publicState = {
  can_join: true,
  numPlayers: 0,
  players:[],
  god:{1:initGod}
};

function initGodHistory() {
  this.shoot = 0;
}

var godHistory = {};

onmessage = function(e) {
  if (e.data[0] == 'createGame') {
    createGame(e.data[1]);
  } else if (e.data[0] == 'joinGame') {
    console.log(e.data[1],e.data[2])
    localState = e.data[2];
    joinGame(e.data[1]);
  } else if (e.data[0] == 'reqData') {
    reqData(e.data[1]);
  } else {
    console.log('[WORKER] - Got some unknown data:');
    console.log(e.data);
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////
// CREATIGN & JOINING A NEW GAME
////////////////////////////////////////////////////////////////////////////////////////////////

function createGame(new_localState) {
  localState = new_localState;
  console.log("[WORKER] - trying to create new game");
  //finds next available gameID
  createGameID().then(function(docref) {
      var gameID = docref.snapshot.val();
      console.log("[WORKER] -Got new game ID: ", gameID);
      //If succesfully got a new ID, then createGame with that ID
      firebase.database().ref('gameInfo/game_' + gameID).set(publicState);
      joinGame(gameID);
  }).catch(function(error) {
      console.log('[WORKER] -(Game increment) Transaction failed abnormally!', error);
  })
};

// Creates a new game number
function createGameID () {
  // Increment Ada's rank by 1.
  var incrementGameCount = firebase.database().ref('gameCounter/');
  return incrementGameCount.transaction(function(gameCount) {
    // If users/ada/rank has never been set, currentRank will be `null`.
    return (gameCount || 0) + 1;
  });
};

function joinGame (gameID) {
  gameState.gameID = gameID;
  return firebase.database().ref('gameInfo/game_' + gameID).once('value').then(function(snapshot) {
    //After reading the game state, check it exists
    if (snapshot.val()) {
      gameRef = firebase.database().ref('gameInfo/game_' + gameID);
      //game does exist. Get a player number, subscribe to updates, and start the game
      getPlayerNumber(gameID).then(function(tx_result) {
          console.log("Received player number, numPlayers: ", tx_result.snapshot.val());
          playerRef = firebase.database().ref('gameInfo/game_' + gameID + '/players/' + tx_result.snapshot.val());
          //send gameID and player number back to main program
          postMessage(['gameJoined',gameID, tx_result.snapshot.val()]);
          gameState.playerNum = tx_result.snapshot.val()
          publicState.players[gameState.playerNum] = initPlayer;
          publicState.god[gameState.playerNum] = initGod;
          //write some initial data to this record, then continue
          writeCoords().then(function() {
            //subscribe to updates from this page
            gameRef.on('value', function(snapshot) {
              gotNewData(snapshot.val());
            });
          });
      }).catch(function(error) {
          console.log('(Increase player number) Transaction failed abnormally!', error);
      }) ;
    } else console.log('Game ID doesnt exist')
    // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // ...
  });
}

// Gets a new player number. Uses transaction in case 2 players go at once
function getPlayerNumber (gameID) {
  console.log("Getting player number from " + gameID)
  // Increment Ada's rank by 1.
  var incrementPlayerNumber = firebase.database().ref("gameInfo/game_" + gameID + "/numPlayers");
  //uses transaction to increment and read player number.
  return incrementPlayerNumber.transaction(function(playerNum) {
    return (playerNum || 0) + 1;
  });
}

function writeCoords() {
  var player = publicState.players[gameState.playerNum];
  return playerRef.set({
      x: player.x,
      y: player.y,
      Vx: player.Vx,
      Vy: player.Vy,
      weapon: player.weapon,
      shoot: player.shoot,
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Game State Operations
////////////////////////////////////////////////////////////////////////////////////////////////
function gotNewData(val) {
  publicState = val;
  //make sure god array has an entry for every player
  for (const [key, val] of Object.entries(publicState.players)) {
    if (!(key in publicState.god)) publicState.god[key] = initGod;
  }

  if (gameState.playerNum == 1) {
    if (godFunction()) godRef.set(publicState.god);
  }
}
//Only player 1 executes this function - they are god
function godFunction() {
  var weapon, epicenter_x, epicenter_y, blast_radius, i, j;
  var update = false;
  //detect if any players just got shot
  for (const [key, val] of Object.entries(publicState.players)) {
    if (!(key in godHistory)) godHistory[key] = new initGodHistory();
    if (val.shoot != godHistory[key].shoot) {
      godHistory[key].shoot = val.shoot;
      weapon =  localState.weapons[val.weapon].name
      console.log("got a shooter, weapon = " + weapon);
      epicenter_x = val.x; 
      epicenter_y = val.y;
      if (weapon == "baseballbat") blast_radius = 50;

      for (const [key2, val2] of Object.entries(publicState.players)) {
        if (key2 != key) {
          if (val2.x > (epicenter_x - blast_radius) && val2.x < (epicenter_x + blast_radius)) {
            publicState.god[key2].dx += 10;
            publicState.god[key2].health = Math.max(0,publicState.god[key2].health-10);
            console.log("player just got FUCKED!: " + key2 );
            update = true;
          }
        }
      };
    }
  }
  return update;
}

var update1, update2, update3, update_all;
function generateNextState () {
  update1 = findPlayerPosition ();
  update2 = weapons ();

  update_all = update1 || update2;

  update_all = ((update_all && ((updateCount % gameState.updatePerStore) == 0))); //this doesn't work because must last piece of data is missed.
  updateCount++
  if(update_all) writeCoords();

  //reset some button presses
  localState.toggleWeapon = false;
  localState.shoot = false;
}

function weapons () {
  var update = false;
  var player = publicState.players[gameState.playerNum];
  if (localState.toggleWeapon) {
    player.weapon+=1;
    if (player.weapon == localState.weapons.length) player.weapon = -1;
    update = true;
  }
  if (localState.shoot) {
    player.shoot += 1;
    update = true;
  }
  return update;
}

function findPlayerPosition() {
  var update_db;
  var new_Vx;
  var player = publicState.players[gameState.playerNum];
  var god = publicState.god[gameState.playerNum];
  var player_Vx, player_Vy, decel_x, accel_x;
  player_Vx = player.Vx + god.dx;
  player_Vy = player.Vy + god.dy;

  //always slows down
  decel_x = player_Vx * 0.1;
  if (decel_x > 0) decel_x = Math.ceil(decel_x)
  else if (decel_x < 0) decel_x = Math.floor(decel_x);

  //keyboard movements are limited to a max speed
  if (localState.moveLeft && (player_Vx > -10)) {
    accel_x = -2;
  } else if (localState.moveRight && (player_Vx < 10)) {
    accel_x = 2;
  } else accel_x = 0

  // if (player_Vx < 10 && player_Vx > -10) {

  // }

  // //find player velocity
  // if (localState.moveLeft && (player.Vx > -10)) {
  //   new_Vx = Math.max(player.Vx-2, -10);
  // } else if (localState.moveRight && (player.Vx < 10)) {
  //   new_Vx = Math.min(player.Vx+2, 10);
  // } else if (!localState.moveRight && !localState.moveLeft){
  //   new_Vx = Math.round(player.Vx * 0.4);
  // } else {
  //   new_Vx = player.Vx;
  // }

  if (localState.jump && (player.Vy <= 0)) {
    player.Vy += 5;
  }

  player.Vx += accel_x - decel_x;
  player.x =  Math.min(Math.max(player.x + player_Vx, 1),990);
  update_db = (player_Vx != 0);

  new_y = gravity(player.x, player);
  update_db = update_db || (player.y != new_y);
  player.y = new_y;

  return update_db;
}

//Gravity pulls the worm to the bottom of the map
function gravity(next_x, player) {
    //Gravity a = 9.8m/s
    //Want the objects on the screen to be affected by gravity just like an obj in real life
    //for this we need to map pixels to mm. Actually a css pixel is roughly 26mm. But some screens have more dpi
    //1xcss_pixel = 26e-3 / devicePixelRatio. 
    var new_velocity = player.Vy - (9.8 * gameState.updatePeriod * 1e-3); //frame period unit is ms
    var next_y = player.y - (meter_to_pixel * ((player.Vy + new_velocity) * gameState.updatePeriod * 1e-3 / 2.0));
    player.Vy = new_velocity;
    if (next_y > (gameState.boundaryBottom[next_x] - localState.wormHeight)) {
      player.Vy = 0;
    }
    return Math.min(next_y, gameState.boundaryBottom[next_x] - localState.wormHeight);
}

function reqData(new_localState) {
  if (!gameState.started) {
    startGame();
  }
  localState = new_localState;
  postMessage(['newData', publicState]);
}

function startGame () {
  if (gameState.playerNum == 1) {
    godRef = firebase.database().ref('gameInfo/game_' + gameState.gameID + '/god/');
  }
  //build the map
  var myContour = new contour_component();
  myContour.createContour();
  gameState.boundaryBottom = myContour.contour;

  meter_to_pixel = (localState.fulstrum_height / localState.canvas_height) / (26e-3 / localState.devicePixelRatio);

  //Periodically will update the game state (now we have player num)
  setInterval(function(){generateNextState()}, gameState.updatePeriod);  
  gameState.started = true;
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Map Setup
////////////////////////////////////////////////////////////////////////////////////////////////
function contour_component () {
  this.contour = [];
  this.createContour = function() {
    //define a handful of points, x increases in 100's. Then just draw straight lines between thhem
    let y = [];
    y.push(270,285,270,240,250,270,295,275,290,295,310)
    y = y.map(function(y) { return  y * localState.fulstrum_height / localState.canvas_height; });
    let i = 0, j=0, index = 0;;
    for (i=0; i<1000;i+=1){
        j = i%100;
        index = Math.floor(i/100);
        this.contour[i] = 1.15*(y[index] + (j * (y[index+1] - y[index])/100));
    }
  };
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Firebase setup
////////////////////////////////////////////////////////////////////////////////////////////////

const firebaseConfig = {
  apiKey: "AIzaSyBGxKF28QL0Q1RU2261FwGZxpDnzFBeWrE",
  authDomain: "vwgames.firebaseapp.com",
  databaseURL: "https://vwgames.firebaseio.com",
  projectId: "vwgames",
  storageBucket: "vwgames.appspot.com",
  messagingSenderId: "923039659078",
  appId: "1:923039659078:web:8f0165aff7db5cb2d24647",
  measurementId: "G-6H0RZSD89B"
};

firebase.initializeApp(firebaseConfig);