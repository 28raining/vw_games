  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "AIzaSyBGxKF28QL0Q1RU2261FwGZxpDnzFBeWrE",
    authDomain: "vwgames.firebaseapp.com",
    databaseURL: "https://vwgames.firebaseio.com",
    storageBucket: "bucket.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();

  // Write some data
  function firebase_writeCoords(game_id, x, y) {
    firebase.database().ref('gameinfo/' + game_id + '/coords').set({
      x: x,
      y: y
    });
  }
  
  
