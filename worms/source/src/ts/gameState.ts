import * as db from './dataManagement'
import * as gb from './gameGlobals'
import * as renderer from './three'

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
let prev_move_left = false;
let prev_move_right = false;
export function generateNextState (overide=false) {
    //adds a new player
    if (gb.gameGlobals.gameState.numPlayers > gb.localState.numPlayers) renderer.add_player();
    gb.localState.numPlayers = gb.gameGlobals.gameState.numPlayers;

    // console.log(gameGlobals);
    let thisPlayerNum = gb.localState.playerNum;
    let next_x = gb.localState.x;
    let update_db = false;
    if ((prev_move_left != gb.localState.moveLeft) || (prev_move_right != gb.localState.moveRight)) update_db = true;
    if (gb.localState.moveLeft && ~gb.localState.moveRight) {
        update_db = true;
        next_x = next_x - 1*gb.distance_unit;
        gb.localState.lastMove = 'left';
    } else if (gb.localState.moveRight && ~gb.localState.moveLeft) {
        update_db = true;
        next_x = next_x + 1*gb.distance_unit;
        gb.localState.lastMove = 'right';
    }
    next_x = Math.max(1, next_x); 
    next_x = Math.min(200, next_x); 
    if (gb.localState.upVelocity != 0) update_db=true;
    let next_y = gravity(next_x);
    prev_move_left = gb.localState.moveLeft;
    prev_move_right = gb.localState.moveRight;
    if(update_db || overide) db.writeCoords(next_x, next_y);
}

//Gravity pulls the worm to the bottom of the map
function gravity(next_x) {
    //Gravity a = 9.8m/s

    //Want the objects on the screen to be affected by gravity just like an obj in real life
    //for this we need to map pixels to mm. Actually a css pixel is roughly 26mm. But some screens have more dpi
    //1xcss_pixel = 26e-3 / devicePixelRatio. 
    let meter_to_pixel = (gb.fulstrum_height / gb.canvas_height) / (26e-3 / window.devicePixelRatio);

    let new_velocity = gb.localState.upVelocity - (9.8 * gb.frame_period * 1e-3); //frame period unit is ms
    let next_y = gb.localState.y - (meter_to_pixel * ((gb.localState.upVelocity + new_velocity) * gb.frame_period * 1e-3 / 2.0));
    gb.localState.upVelocity = new_velocity;
    if (next_y > (renderer.myContour.contour[next_x] - gb.localState.wormHeight)) {
        gb.localState.upVelocity = 0;
    }
    return Math.min(next_y, renderer.myContour.contour[next_x] - gb.localState.wormHeight);
}


