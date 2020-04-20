import * as db from './dataManagement'
import {gameGlobals, localState} from './gameGlobals'
import {myContour, myWorm} from './renderer'

export function createGame(newGameID : number){
    console.log("should do something!");
}

export function updateGameState (state) {
    gameGlobals.gameState=state;
    // movebox(gameGlobals.gameState.x, gameGlobals.gameState.y);
}

//Writes to the database, which is then read back and used to update the display.
//This could update at any rate, but we'll use the frame rate to be optimal.
//Because firestore uses local cache, the write->update time is v small.
// some reference to here https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Paddle_and_keyboard_controls
export function generateNextState (overide=false) {
    let next_x = gameGlobals.gameState.x;
    let update_db = false;
    if (localState.moveLeft && ~localState.moveRight) {
        update_db = true;
        next_x = gameGlobals.gameState.x - 1;
        localState.lastMove = 'left';
    } else if (localState.moveRight && ~localState.moveLeft) {
        update_db = true;
        next_x = gameGlobals.gameState.x + 1;
        localState.lastMove = 'right';
    }
    next_x = Math.max(5, next_x); 
    next_x = Math.min(800, next_x); 
    let next_y = myContour.contour[next_x] - myWorm.height;
    if(update_db || overide) db.writeCoords(next_x, next_y);
}


