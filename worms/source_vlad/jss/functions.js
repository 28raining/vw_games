//if worms exist in savestate, position, re-generate if gamesave not existant
function do_player(int_x,int_y){
  player = new Worm("", int_x, int_y, 100, 1);
  return player;
}

//if canvas exists in savestate re-build, load new one otherwise
function do_canvas(w_x, w_y){
}

//generate game save array in order to be able to rebuild a canvas with features
//to be loaded to server once move is finished
//contains also opponent move data
//equivalent to new game
function do_savestate(){
  if(savestate!=""){

  }else{
    do_canvas(1000,1000);
    var player1 = do_player(Math.floor(Math.random() * 1001),Math.floor(Math.random() * 1001));
  }
}





function generate_projectile_trajectory(int_x,int_y,strength){
}

function canvas_resize(){
}



function checkKeycode(event) {
    // handling Internet Explorer stupidity with window.event
    // @see http://stackoverflow.com/a/3985882/517705
    var keyDownEvent = event || window.event,
        keycode = keyDownEvent.key || keyDownEvent.keyCode || keyDownEvent.code;

		if (keycode === 'ArrowRight' || keycode === 'Right' || keycode === '39'){
			console.log("right");
		}
		if (keycode === 'ArrowLeft' || keycode === 'Left' || keycode === '37'){
			console.log("left");
		}
    if (keycode === 'ArrowUp' || keycode === 'Up' || keycode === '38'){
      console.log("up");
    }
    if (keycode === 'ArrowDown' || keycode === 'Down' || keycode === '40'){
      console.log("down");
    }
    if (keycode === 'a' || keycode === 'a' || keycode === '65'){
      console.log("aim");
    }
    if (keycode === 'Space' || keycode === ' ' || keycode === '32'){
      console.log("jump");
    }
    //return false; <-cancels all other typed in keys -> contact form error
}
document.onkeydown = checkKeycode;
