"use strict";
import Actor = require("../../lib/scenes/actors/Actor");

/**
 * Spinner class
 */

class Spinner extends Actor {

  constructor() {
    super();
    document.addEventListener("mousedown", this.spin.bind(this));
    document.addEventListener("touchstart", this.spin.bind(this));
  }

  update() {
    if (!this._inited) {
      this.sprite = this.scene.spritesByName["spinner"];
      this.size.copyFrom(this.sprite.size);
      this.frame = 1;
      this.setAnchor(this.size.x/2, this.size.y/2);
      this.position.set(this.scene.game.canvas.width/2,this.scene.game.canvas.height/2);
      this.angularMomentum = .999;
      for (let i=0;i<2;i++) {
        var actor = new Actor();
        actor.type = i==0?"cap":"blur";
        actor.sprite = this.sprite;
        actor.frame = i==0?2:0;
        actor.position = this.position;
        actor.offset = this.offset;
        actor.size = this.size;
        this.scene.addActor(actor);
        if (actor.type === "blur") {
          this.scene.bringActorToBack(actor);
        }
      }
      this._inited = true;
    }
    let lastActor:Actor;
    for(let actor of this.scene.actorsByType["blur"]) {
      if (lastActor) {
        lastActor.rotation = actor.rotation;
        lastActor.opacity = actor.opacity *.5;
      }
      lastActor = actor;
    }
    var joy = this.scene.game.joypad;
    if (joy.delta.fire > 0) {
      this.spin();
    }
    super.update();
    lastActor.rotation = this.rotation;
    lastActor.opacity = this.opacity *.75;
  }

  spin() {
    this.angularVelocity += .1;
  }

  /*
    _privates
  */
  private _inited=false;

}
export = Spinner;
