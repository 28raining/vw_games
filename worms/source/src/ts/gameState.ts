import * as db from './dataManagement'
import * as gb from './gameGlobals'
import {myContour, myWorm} from './renderer'

export function createGame(newGameID : number){
    console.log("should do something!");
}

export function updateGameState (state) {
    gb.gameGlobals.gameState=state;
    // movebox(gameGlobals.gameState.x, gameGlobals.gameState.y);
}

//Writes to the database, which is then read back and used to update the display.
//This could update at any rate, but we'll use the frame rate to be optimal.
//Because firestore uses local cache, the write->update time is v small.
// some reference to here https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Paddle_and_keyboard_controls
export function generateNextState (overide=false) {
    // console.log(gameGlobals);
    let thisPlayerNum = gb.localState.playerNum;
    let next_x = gb.localState.x;
    let update_db = false;
    if (gb.localState.moveLeft && ~gb.localState.moveRight) {
        update_db = true;
        next_x = next_x - 1*gb.distance_unit;
        gb.localState.lastMove = 'left';
    } else if (gb.localState.moveRight && ~gb.localState.moveLeft) {
        update_db = true;
        next_x = next_x + 1*gb.distance_unit;
        gb.localState.lastMove = 'right';
    }
    next_x = Math.max(5, next_x); 
    next_x = Math.min(800, next_x); 
    if (gb.localState.upVelocity != 0) update_db=true;
    let next_y = gravity(next_x);
    if(update_db || overide) db.writeCoords(next_x, next_y);
}

//Gravity pulls the worm to the bottom of the map
function gravity(next_x) {
    //Gravity a = 9.8m/s

    //Want the objects on the screen to be affected by gravity just like an obj in real life
    //for this we need to map pixels to mm. Actually a css pixel is roughly 26mm. But some screens have more dpi
    //1xcss_pixel = 26e-3 / devicePixelRatio. 
    let meter_to_pixel = 1.0 / (26e-3 / window.devicePixelRatio);

    let new_velocity = gb.localState.upVelocity - (9.8 * gb.frame_period * 1e-3); //frame period unit is ms
    let next_y = gb.localState.y - (meter_to_pixel * ((gb.localState.upVelocity + new_velocity) * gb.frame_period * 1e-3 / 2.0));
    gb.localState.upVelocity = new_velocity;
    if (next_y > (myContour.contour[next_x] - gb.localState.wormHeight)) {
        gb.localState.upVelocity = 0;
    }
    return Math.min(next_y, myContour.contour[next_x] - gb.localState.wormHeight);
}


