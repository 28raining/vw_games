

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

class Projectile {
  constructor(strength, scatter, pos_x, pos_y, speed, direction) {
    this.strength = strength;
    this.scatter = scatter;
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.speed = speed;
    this.direction = direction;
  }
}

class Canvas {
  constructor(len_x, len_y, zoom_lvl) {
    this.len_x = len_x;
    this.len_y = len_y;
    this.zoom_lvl = zoom_lvl;
  }
}
