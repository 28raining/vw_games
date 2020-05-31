
export var gameGlobals = {
    gameState : {
        can_join: true,
        numPlayers: 0,
        players:{
            1: {
                ml:false,
                mr:false,
                x:0,
                y:0,
                projectiles:{}
            }

        }
    },
    gameID : -1
}

export var localState = {
    x :40,
    y: 0,
    playerNum: 0,
    moveRight: false,
    moveLeft: false,
    weapons: [
        {
            name: "baseballbat",
            selected: false
        }
    ],
    shoot: false,
    shootDone: false,
    lastMove: 'right',
    numPlayers: 0,
    wormHeight: 30,
    yVelocity: 0,   //positive velocity is up
    xVelocity: 0,   //positive velocity is right
    weapon_pointer: -1,
    next_weapon_pointer: 0,
    health_percent : 100,
    projectile_id : 1,
    projectiles : {},
    prevHits : [],
    projectilesToAdd: []
}

export var frame_period = 30; //framePeriod determins frame rate (50=20fps)
export var distance_unit = 5; //Amplify moves by this factor. Allows user to move around map faster
export var canvas_width = 1024; 
export var canvas_height = 512; 
export var fulstrum_width = 1000; 
export var fulstrum_height = 1000; 