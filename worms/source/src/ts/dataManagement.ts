// This import loads the firebase namespace.
require('firebase')
import * as firebase from 'firebase';
import {updateGameState} from './gameState';
import * as gb from './gameGlobals';
import {gameStarting} from './userInput';


// Set the configuration for your app
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

// Get a reference to the database service
export var firebase_database = firebase.database();
var gameRef;
var playerRef;

// Write some data
export function writeCoords(x: number, y: number) {
  gb.localState.x = x;
  gb.localState.y = y;
  return playerRef.set({
      x: x,
      y: y,
      ml: gb.localState.moveLeft,
      mr: gb.localState.moveRight
  })
}

// Creates a new game number
export function findNextGameID () {
  // Increment Ada's rank by 1.
  var incrementGameCount = firebase_database.ref('gameCounter/');
  return incrementGameCount.transaction(function(gameCount) {
    // If users/ada/rank has never been set, currentRank will be `null`.
    return (gameCount || 0) + 1;
  });
};

// Gets a new player number. Uses transaction in case 2 players go at once
function getPlayerNumber (gameID : Number) {
  console.log("Getting player number from " + gameID)
  // Increment Ada's rank by 1.
  var incrementPlayerNumber = firebase_database.ref("gameInfo/game_" + gameID + "/numPlayers");
  //uses transaction to increment and read game number.
  return incrementPlayerNumber.transaction(function(gameCount) {
    return (gameCount || 0) + 1;
  });
}


export function createGame (gameID) {
  return firebase_database.ref('gameInfo/game_' + gameID).set(gb.gameGlobals.gameState);
}

// Checks if a game exists
export function joinGame (gameID) {
  // var userId = firebase.auth().currentUser.uid;
  return firebase_database.ref('gameInfo/game_' + gameID).once('value').then(function(snapshot) {
    //After reading the game state, check it exists
    if (snapshot.val()) {
      gameRef = firebase_database.ref('gameInfo/game_' + gameID);
      //game does exist. Get a player number, subscribe to updates, and start the game
      gb.gameGlobals.gameID = gameID
      getPlayerNumber(gameID).then(function(tx_result) {
          console.log("Received player number, numPlayers: ", tx_result.snapshot.val());
          playerRef = firebase_database.ref('gameInfo/game_' + gameID + '/players/' + tx_result.snapshot.val());
          gb.localState.playerNum = tx_result.snapshot.val();
          //write some initial data to this record, then continue
          writeCoords(0,0).then(function() {
            //subscribe to updates from this page
            gameRef.on('value', function(snapshot) {
              updateGameState(snapshot.val());
            });
            gameStarting();
          });
      }).catch(function(error) {
          console.log('(Increase player number) Transaction failed abnormally!', error);
      }) ;
    } else console.log('Game ID doesnt exist')
    // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // ...
  });

}

