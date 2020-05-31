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
export function generateNextState () {
    //adds a new player
    if (gb.gameGlobals.gameState.numPlayers > gb.localState.numPlayers) renderer.add_player();
    gb.localState.numPlayers = gb.gameGlobals.gameState.numPlayers;

    let update = movePlayer() || updateProjectiles(); 
    // detectHit(gb.localState.x,gb.localState.y);   // search through projectiles in the game and detect if got hit.

    if(update) db.writeCoords();

}

// if key is pressed, user moves
function movePlayer() {
    // console.log(gameGlobals);
    //use gameGlobals here instead of local vars?? FIXME
    let next_x = gb.localState.x;
    // let next_x = gb.gameGlobals.gameState.players[gb.localState.playerNum].x;

    let gravResult = gravity(next_x);
    let update_db = gravResult.update;

    if ((prev_move_left != gb.localState.moveLeft) || (prev_move_right != gb.localState.moveRight)) update_db = true;


    //Worm can move when jumping or when on the ground
    //first calculate a new velocity, then move the worm
    var new_velocity = gb.localState.xVelocity;
    if (gb.localState.moveLeft && ~gb.localState.moveRight) {
        if (new_velocity > -1) {
            new_velocity = new_velocity - 1;
            new_velocity = Math.max(-1, new_velocity);
        }
    } else if (gb.localState.moveRight && ~gb.localState.moveLeft) {
        if (new_velocity < 1) {
            new_velocity = new_velocity + 1;
            new_velocity = Math.min(1, new_velocity);
        }
    } else if (~gb.localState.moveRight && ~gb.localState.moveLeft) {
        if (new_velocity > 0) new_velocity = Math.floor(new_velocity - 0.5);
        if (new_velocity < 0) new_velocity = Math.ceil(new_velocity + 0.5);
    }

    //then calculate new loaction
    if (new_velocity != 0) {
        update_db = true;
        next_x = Math.round(next_x + new_velocity*gb.distance_unit);
    }

    //CAN THESE STATEMENTS BE REMOVED?? //FIXME
    if (gb.localState.moveLeft && ~gb.localState.moveRight) {
        // next_x = next_x - 1*gb.distance_unit;
        gb.localState.lastMove = 'left';
    } else if (gb.localState.moveRight && ~gb.localState.moveLeft) {
        // update_db = true;
        // next_x = next_x + 1*gb.distance_unit;
        gb.localState.lastMove = 'right';
    }

    //Limit X to withing the map
    next_x = Math.max(1, next_x); 
    next_x = Math.min(200, next_x); 

    prev_move_left = gb.localState.moveLeft;
    prev_move_right = gb.localState.moveRight;
    gb.localState.x = next_x;
    gb.localState.y = gravResult.next_y;
    gb.localState.xVelocity = new_velocity;
    console.log(update_db, new_velocity);
    return update_db;
}

function detectHit(x,y) {
    for (let [key, player] of Object.entries(gb.gameGlobals.gameState.players)) {
        if (Number(key) != gb.localState.playerNum) {
            if(player.hasOwnProperty('projectiles')) {
                for (let [key, projectile] of Object.entries(player.projectiles)) {
                    if (!gb.localState.prevHits.includes(key)) {
                        gb.localState.prevHits.push(key);
                        console.log("Theres a new projectile!")
                        if ((x > (projectile as any).zone_x_min) && (x < (projectile as any).zone_x_max)) {
                            console.log("I'm hit!")
                            gb.localState.yVelocity=.1;
                            gb.localState.xVelocity=.1;
                        }
                    }
                }
            }
        }
    }
}

//checks if the user shot anything
function updateProjectiles() {
    let update = false;
    var element_glob;
    while (element_glob = gb.localState.projectilesToAdd.pop())
    {
        var element = element_glob;
        console.log(element);
        update = true;
        gb.localState.projectiles[element] = {
            zone_x_min: gb.localState.x - 50,
            zone_x_max: gb.localState.x + 50
        };

        //schedule a timeout to remove this projectile
        setTimeout( function() {
            delete gb.localState.projectiles[element];
            console.log("Projectile removed: " + element);
        }, 5000);
    };
    return update;
}

//Gravity pulls the worm to the bottom of the map
function gravity(next_x) {
    let next_y = renderer.myContour.contour[next_x] - gb.localState.wormHeight;
    let update = false;
    // console.log(next_x,next_y);
    //Gravity a = 9.8m/s

    let onGround = (gb.localState.yVelocity == 0) && (gb.localState.y == next_y);

    if (!onGround) {
        update=true;
        //if below ground... use default next_y, otherwise, fall to the ground.
        if ((gb.localState.y < next_y) || (gb.localState.yVelocity != 0)) {
            //Want the objects on the screen to be affected by gravity just like an obj in real life
            //for this we need to map pixels to mm. Actually a css pixel is roughly 26mm. But some screens have more dpi
            //1xcss_pixel = 26e-3 / devicePixelRatio. 
            // 1m = 1/ (26e-3 / dpr) pixels
            let gravity = 0.5;
            let pixels_per_meter = window.devicePixelRatio/264.6e-6;
            let scene_unit_per_pixels = gb.fulstrum_height / gb.canvas_height;
            let meter_to_pixel = scene_unit_per_pixels * pixels_per_meter; //~150

            let new_velocity = gb.localState.yVelocity - (gravity * gb.frame_period * 1e-3); //frame period unit is ms
            next_y = gb.localState.y - (meter_to_pixel * ((gb.localState.yVelocity + new_velocity) * gb.frame_period * 1e-3 / 2.0));
            gb.localState.yVelocity = new_velocity;
            if (next_y > (renderer.myContour.contour[next_x] - gb.localState.wormHeight)) {
                gb.localState.yVelocity = 0;
                next_y = renderer.myContour.contour[next_x] - gb.localState.wormHeight
            }
        }
    }
    return {next_y: next_y, onGround: onGround, update: update};
}


