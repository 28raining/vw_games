
export var gameGlobals = {
    gameState : {
        players: [
            {        
                x: 0,
                y: 0,
            }
        ],
        can_join: true
    },
    gameID : -1
}

export var localState = {
    playerNum: 0,
    moveRight: false,
    moveLeft: false,
    lastMove: 'right'
}