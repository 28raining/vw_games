//detect keypresses
var x_coord, y_coord;
var game_id = 0;

document.onkeydown = function (e) {
    new_y_coord = y_coord;
    new_x_coord = x_coord;
    e = e || window.event;
    if (e.keyCode == '38') {
        console.log("up");
        new_y_coord = y_coord + 1;
    }
    else if (e.keyCode == '40') {
        console.log("down");
        new_y_coord = y_coord - 1;
    }
    else if (e.keyCode == '37') {
        console.log("left");
        new_x_coord = x_coord - 1;
    }
    else if (e.keyCode == '39') {
        console.log("right");
        new_x_coord = x_coord + 1;
    }
    firebase_writeCoords (game_id, new_x_coord, new_y_coord);
}

var readCoords = firebase.database().ref('gameinfo/' + game_id + '/coords');  //Which data to read
readCoords.on('value', function(snapshot) { //executes every time the value changes
  result  = snapshot.val();
  console.log(result);
  x_coord = result['x'];
  y_coord = result['y'];
  document.getElementById('BlackBox').style.right = 300 - 10*x_coord;
  document.getElementById('BlackBox').style.bottom = 300 + 10*y_coord;
});