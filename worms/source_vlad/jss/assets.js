

var canvas = {
  length_x:1000,
  length_y:1000,
  zoom_lvl:1
};

var projectile = {
  strength:1, //explosion factor
  scatter:1, //radial pattern of explosion
  pos_x:0, //relative to worm
  pos_y:0, //relative to worm
  speed:0, //normalised to 1
  direction:0 //in degrees
};


class Worm {
  constructor(type, pos_x, pos_y, life, speed) {
    this.type = type;
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.life = life;
    this.speed = speed;
  }
}
