// This import loads the firebase namespace.
import * as firebase from 'firebase';

// Set the configuration for your app
var config = {
  apiKey: "AIzaSyBGxKF28QL0Q1RU2261FwGZxpDnzFBeWrE",
  authDomain: "vwgames.firebaseapp.com",
  databaseURL: "https://vwgames.firebaseio.com",
  storageBucket: "bucket.appspot.com"
};
firebase.initializeApp(config);

// Get a reference to the database service
export var firebase_database = firebase.database();

// Write some data
export function firebase_writeCoords(game_id: number, x: number, y: number) {
  firebase_database.ref('gameinfo/' + game_id + '/coords').set({
    x: x,
    y: y
  });
}



