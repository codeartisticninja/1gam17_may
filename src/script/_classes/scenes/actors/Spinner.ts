"use strict";
import Actor = require("../../lib/scenes/actors/Actor");

/**
 * Spinner class
 */

class Spinner extends Actor {

  constructor(obj:Object) {
    super(obj);
  }

  update() {
    if (!this._inited) {
      this.setAnchor(this.size.x/2, this.size.y/2);
      this.position.set(this.scene.game.canvas.width/2,this.scene.game.canvas.height/2);
      this.angularMomentum = .999;
      for (let i=0;i<64;i++) {
        let actor = new Actor();
        actor.type = "blur";
        actor["_gid"] = this["_gid"];
        actor.position = this.position;
        actor.offset = this.offset;
        actor.size = this.size;
        this.scene.addActor(actor);
      }
      this._inited = true;
    }
    let lastActor:Actor;
    for(let actor of this.scene.actorsByType["blur"]) {
      if (lastActor) {
        lastActor.rotation = actor.rotation;
        lastActor.opacity = actor.opacity *.75;
      }
      lastActor = actor;
    }
    var joy = this.scene.game.joypad;
    if (joy.delta.fire > 0) {
      this.angularVelocity += .1;
    }
    super.update();
    lastActor.rotation = this.rotation;
    lastActor.opacity = this.opacity *.75;
  }

  /*
    _privates
  */
  private _inited=false;

}
export = Spinner;
