// This import loads the firebase namespace.
import * as firebase from 'firebase';


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
export var firebase_database = firebase.firestore();



// Write some data
export function firebase_writeCoords(game_id: number, x: number, y: number) {
  firebase_database.collection("gameinfo").doc(String(game_id)).set({
    x: x,
    y: y
  })
  .then(function(docRef) {
    console.log("Document written with ID: ");
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });

// export function firebase_writeCoords(game_id: number, x: number, y: number) {
//   firebase_database.ref('gameinfo/' + game_id + '/coords').set({
//     x: x,
//     y: y
//   });
}

// export function firebase_createGame() : int {
//   const increment = firebase.firestore.FieldValue.increment(1);
//   return counter;
// }



