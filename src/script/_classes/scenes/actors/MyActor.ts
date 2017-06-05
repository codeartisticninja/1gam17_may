"use strict";
import Actor = require("../../lib/scenes/actors/Actor");

/**
 * MyActor class
 */

class MyActor extends Actor {

  constructor(obj:Object) {
    super(obj);
    this.addAnimation("walk", [0,1,2,3], 0);
    this.playAnimation("walk");
    this.setAnchor(this.size.x/2, this.size.y/2);
    this.angularFriction = .01;
  }

  update() {
    var joy = this.scene.game.joypad;
    this.velocity.copyFrom(joy.dir).multiplyXY(8);
    this.animationFrame += joy.dir.magnitude;
    if (joy.dir.x < 0) {
      this.scale.x = -1;
    }
    if (joy.dir.x > 0) {
      this.scale.x = 1;
    }
    if (joy.fire) {
      this.angularVelocity = .1;
    }
    super.update();
  }

}
export = MyActor;
