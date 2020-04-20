import * as db from './dataManagement'
import {gameGlobals, localState} from './gameGlobals'
import {startGame} from './renderer'
import {generateNextState} from './gameState'

//detect keypresses
export function initialise_listeners() {

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    document.getElementById("CreateNewGame").addEventListener("click", create_new_game);
    document.getElementById("joinGameReq").addEventListener("click", function() { join_game(-1); } );
}

function join_game(gameID : Number) {
    if (gameID < 0) {
        gameID = Number((<HTMLInputElement>document.getElementById("enterGameID")).value);
    }
    console.log("trying to join game " + gameID);
    db.joinGame(gameID);
}

export function gameStarting(){
    startGame();
    //update the state once. State will (probably) remain untouched until there is some user input
    generateNextState(true);
}

function create_new_game() {
    console.log("trying to create new game");
    db.findNextGameID();    //will join and start the game after finding ID
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        localState.moveRight = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        localState.moveLeft = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        localState.moveRight = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        localState.moveLeft = false;
    }
}


// var readCoords = firebase_database.ref('gameinfo/' + game_id + '/coords');  //Which data to read

// readCoords.on('value', function(snapshot: any) { //executes every time the value changes
//   let result  = snapshot.val();
//   console.log(result);
//   x_coord = result['x'];
//   y_coord = result['y'];
//   document.getElementById('BlackBox').style.right = String(300 - 10*x_coord) + "px";
//   document.getElementById('BlackBox').style.bottom = String(300 + 10*y_coord) + "px";
// });