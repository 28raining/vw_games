// This import loads the firebase namespace.
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

// Write some data
export function writeCoords(x: number, y: number) {
  gameRef.update({
    x: x,
    y: y
  })
  .then(function(docRef) {
    // console.log("Document written with ID: ");
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}

// Creates a new game number
export function findNextGameID () {
  // Increment Ada's rank by 1.
  var incrementGameCount = firebase_database.ref('gameCounter/');
  incrementGameCount.transaction(function(gameCount) {
    // If users/ada/rank has never been set, currentRank will be `null`.
    return (gameCount || 0) + 1;
  }, function(error, committed, snapshot) {
    if (error) {
      console.log('(Game increment) Transaction failed abnormally!', error);
    } else if (!committed) {
      console.log('We aborted the transaction (gameCounter/ no exist?).');
    } else {
      console.log('gameCounterIncremented');
    }
    console.log("Ada's data: ", snapshot.val());
    //NOW MUST CREATE A NEW GAME
    createGame(snapshot.val());
  });
};

export function createGame (gameID) {
  firebase_database.ref('gameInfo/game_' + gameID).set(gb.gameGlobals.gameState
  , function(error) {
      if (error) {
        console.log('(Game create) Transaction failed abnormally!', error);
      } else {
        joinGame (gameID)
      }
  });
}

// Checks if a game exists
export function joinGame (gameID) {
  // var userId = firebase.auth().currentUser.uid;
  return firebase_database.ref('gameInfo/game_' + gameID).once('value').then(function(snapshot) {
    if (snapshot.val()) {
      gameRef = firebase_database.ref('gameInfo/game_' + gameID);
      //game does exist 
      gb.gameGlobals.gameID = gameID
      //subscribe to updates from this page
      gameRef.on('value', function(snapshot) {
        updateGameState(snapshot.val());
      });
      gameStarting();
    } else console.log('Game doesnt exist')
    // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // ...
  });

}

export function stateUpdate(data) {
  updateGameState(data);
}
