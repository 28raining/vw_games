import * as db from './database.mjs'
import * as gb from './gameState.mjs'
import * as renderer from './renderer.mjs'

//detect keypresses
export function initialiseListeners() {

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    document.getElementById("createNewGame").addEventListener("click", db.createNewGame);
    document.getElementById("joinGameReq").addEventListener("click", join_game);
}

function join_game() {
    // if (gameID < 0) {
       var gameID = Number((document.getElementById("inputGameID")).value);
    // }
    console.log("trying to join game " + gameID);
    db.joinGame(gameID);
}


function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        gb.privateState.moveRight = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        gb.privateState.moveLeft = true;
    }
    else if(e.key == " " || e.key == "Spacebar") {
        // console.log('jump!')
        gb.privateState.jump = true; //unit m/s. Will literally move this speed on the screen
    } 
    else if (e.key == "f") {
        gb.privateState.toggleWeapon = true;
        // if(gb.privateState.weapon_pointer >= 0) gb.privateState.weapons[gb.privateState.weapon_pointer].selected = false;
        // if(gb.privateState.next_weapon_pointer >= 0) gb.privateState.weapons[gb.privateState.next_weapon_pointer].selected = true;
        // gb.privateState.weapon_pointer = gb.privateState.next_weapon_pointer;
    }
    else if (e.key == "Enter") {
        event.preventDefault();
        gb.privateState.shoot = true;
        gb.privateState.shootDone = false;
    }
    else if (e.key == "p" || e.key == "p") {
      db.postMessage([5,6]);
      console.log('Message posted to worker');
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        gb.privateState.moveRight = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        gb.privateState.moveLeft = false;
    }
    else if(e.key == " " || e.key == "Spacebar") {
        event.preventDefault();
        gb.privateState.jump = false;
    }
    // else if (e.key == "f") {

    //     // gb.privateState.next_weapon_pointer = gb.privateState.next_weapon_pointer + 1;
    //     // if (gb.privateState.next_weapon_pointer > (gb.privateState.weapons.length-1)) gb.privateState.next_weapon_pointer = -1;
    // }
    else if (e.key == "Enter") {
        event.preventDefault();
        gb.privateState.shootDone = false;
    }
}