import * as db from './dataManagement'
import * as gb from './gameGlobals'
import * as renderer from './three'

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
    renderer.startGame();
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
        // console.log('jump!')
        gb.localState.yVelocity = .1; //unit m/s. Will literally move this speed on the screen
    } 
    else if (e.key == "f") {
        if(gb.localState.weapon_pointer >= 0) gb.localState.weapons[gb.localState.weapon_pointer].selected = false;
        if(gb.localState.next_weapon_pointer >= 0) gb.localState.weapons[gb.localState.next_weapon_pointer].selected = true;
        gb.localState.weapon_pointer = gb.localState.next_weapon_pointer;
    }
    else if (e.key == "Enter") {
        //check if pressed, button not held down
        if (gb.localState.shoot == false) {
            gb.localState.projectilesToAdd.push(gb.localState.projectile_id);
            gb.localState.projectile_id ++;
        }
        gb.localState.shoot = true;
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
    else if (e.key == "f") {
        gb.localState.next_weapon_pointer = gb.localState.next_weapon_pointer + 1;
        if (gb.localState.next_weapon_pointer > (gb.localState.weapons.length-1)) gb.localState.next_weapon_pointer = -1;
    }
    else if (e.key == "Enter") {
        event.preventDefault();
        gb.localState.shoot = false;
        gb.localState.shootDone = false;
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