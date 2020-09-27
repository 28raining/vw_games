import * as gameState from './gameState.mjs'
import * as renderer from './renderer.mjs'

var myWorker = new Worker ('worker.js');

myWorker.onerror = function (msg, file, lineno) {
  console.log ("oh shit, webworker error");
  console.log(msg);
  console.log(file);
  console.log(lineno);
}

myWorker.onmessage = function(e) {
  // console.log('Message received from worker, ' + e.data);
  if (e.data[0] == "gameJoined") {
    gameState.publicState.gameID = e.data[1];
    gameState.publicState.playerNum = e.data[2];
    document.getElementById('gameID').innerHTML = gameState.publicState.gameID;
    document.getElementById('gameCanvas').focus();

    renderer.startGame();

  } else if (e.data[0] == "newData") {
    gameState.publicState.gameState = e.data[1];
    //apply god effects to the user data
    for (const [key, val] of Object.entries(gameState.publicState.gameState.players)) {
      val.Vx += gameState.publicState.gameState.god[key].dx;
      val.Vy += gameState.publicState.gameState.god[key].dy;
    }
    //Only generates a next frame when Worker says so. Worker is prompted by request animation Framse
    renderer.genNextFrame();
  }
}

export function createNewGame() {
  console.log("trying to create new game");
  myWorker.postMessage(['createGame',gameState.privateState]);
}

export function joinGame(gameID) {
  console.log("Joining game "+ gameID);
  myWorker.postMessage(['joinGame',gameID, gameState.privateState]);
}

export function reqData() {
  myWorker.postMessage(['reqData',gameState.privateState]);
  //reset some button presses
  gameState.privateState.toggleWeapon = false;
  gameState.privateState.shoot = false;
}