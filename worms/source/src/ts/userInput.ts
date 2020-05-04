import * as db from './dataManagement'
import * as gb from './gameGlobals'
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

export function gameStarting() {
    //Create some player information for me
    document.getElementById('gameID').innerHTML = "Your game ID is: <strong>"+ gb.gameGlobals.gameID +"</strong>";
    document.getElementById('gameCanvas').focus();
    startGame();
    //update the state once. State will (probably) remain untouched until there is some user input
    // generateNextState(true);

}

function create_new_game() {
    console.log("trying to create new game");
    //finds next available gameID
    db.findNextGameID().then(function(docref) {
        let gameID = docref.snapshot.val();
        console.log("Got new game ID: ", gameID);
        //If succesfully got a new ID, then createGame with that ID
        db.createGame(gameID).then(function(gameDocRef){
            //If succesfully created a game state in the DB, join this game
            db.joinGame (gameID)
        }).catch(function(error) {
            console.log('(Game create) Transaction failed abnormally!', error);
        })
    }).catch(function(error) {
        console.log('(Game increment) Transaction failed abnormally!', error);
    })
}



function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        gb.localState.moveRight = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        gb.localState.moveLeft = true;
    }
    else if(e.key == " " || e.key == "Spacebar") {
        console.log('jump!')
        gb.localState.upVelocity = 3; //unit m/s. Will literally move this speed on the screen
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        gb.localState.moveRight = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        gb.localState.moveLeft = false;
    }
    else if(e.key == " " || e.key == "Spacebar") {
        event.preventDefault();
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