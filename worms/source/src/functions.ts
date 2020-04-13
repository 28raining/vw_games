import {firebase_writeCoords, firebase_database} from './data_management'

//detect keypresses
let x_coord=0, y_coord=0;
let new_x_coord=0, new_y_coord=0;
var game_id = 0;

export function initialise_listeners() {

    document.onkeydown = function (e) {
        new_y_coord = y_coord;
        new_x_coord = x_coord;
        // e = e || window.event;
        if (e.keyCode == 38) {
            console.log("up");
            new_y_coord = y_coord + 1;
        }
        else if (e.keyCode == 40) {
            console.log("down");
            new_y_coord = y_coord - 1;
        }
        else if (e.keyCode == 37) {
            console.log("left");
            new_x_coord = x_coord - 1;
        }
        else if (e.keyCode == 39) {
            console.log("right");
            new_x_coord = x_coord + 1;
        }
        firebase_writeCoords (game_id, new_x_coord, new_y_coord);
    }
}

var readCoords = firebase_database.ref('gameinfo/' + game_id + '/coords');  //Which data to read

readCoords.on('value', function(snapshot: any) { //executes every time the value changes
  let result  = snapshot.val();
  console.log(result);
  x_coord = result['x'];
  y_coord = result['y'];
  document.getElementById('BlackBox').style.right = String(300 - 10*x_coord) + "px";
  document.getElementById('BlackBox').style.bottom = String(300 + 10*y_coord) + "px";
});