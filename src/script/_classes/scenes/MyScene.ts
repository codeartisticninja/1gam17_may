"use strict";
import Scene       = require("../lib/scenes/Scene");
import myGame      = require("../MyGame");
import Sprite      = require("../lib/scenes/actors/Sprite");

import Spinner     = require("./actors/Spinner");

/**
 * MyScene class
 */

class MyScene extends Scene {
  public game:myGame;

  constructor() {
    super();
  }

  reset() {
    super.reset();
    if (!this.spritesByName["spinner"]) {
      let sprite = new Sprite({ name: "spinner" });
      sprite.img.src = "./assets/sprites/spinner.png";
      sprite.size.set(512);
      this.addSprite(sprite);
    }
    this.addActor(new Spinner());
  }

}
export = MyScene;
