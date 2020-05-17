
export var gameGlobals = {
    gameState : {
        can_join: true,
        numPlayers: 0,
        players:{}
    },
    gameID : -1
}

export var localState = {
    x :2,
    y: 0,
    playerNum: 0,
    moveRight: false,
    moveLeft: false,
    lastMove: 'right',
    numPlayers: 0,
    wormHeight: 30,
    upVelocity: 0   //positive velocity is up
}

export var frame_period = 30; //framePeriod determins frame rate (50=20fps)
export var distance_unit = 5; //Amplify moves by this factor. Allows user to move around map faster
export var canvas_width = 1024; 
export var canvas_height = 512; 
export var fulstrum_width = 1000; 
export var fulstrum_height = 1000; 