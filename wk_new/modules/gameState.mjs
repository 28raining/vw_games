import * as db from './database.mjs'
// import * as renderer from './renderer.mjs'

export var publicState = {
    gameState : {
        can_join: true,
        numPlayers: 0,
        players:{}
    },
    gameID : -1
};

export var privateState = {
    playerNum: 0,
    moveRight: false,
    moveLeft: false,
    toggleWeapon: false,
    weapons: [
        {
            name: "baseballbat"
        }
    ],
    shoot: false,
    shootDone: false,
    lastMove: 'right',
    numPlayers: 0,
    wormHeight: 30,
    upVelocity: 0,   //positive velocity is up
    weapon_pointer: -1,
    next_weapon_pointer: 0,
    health_percent : 100,
    frame_period: 30, //framePeriod determins frame rate (50=20fps)
    distance_unit: 5, //Amplify moves by this factor. Allows user to move around map faster
    canvas_width: 1024, 
    canvas_height: 512, 
    fulstrum_width: 1000, 
    fulstrum_height: 1000,
    devicePixelRatio: window.devicePixelRatio
};

//Writes to the database, which is then read back and used to update the display.
//This could update at any rate, but we'll use the frame rate to be optimal.
//Because firestore uses privateState cache, the write->update time is v small.
// some reference to here https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Paddle_and_keyboard_controls




