"use strict";
import Game = require("./lib/Game");

import MyScene  = require("./scenes/MyScene");


/**
 * MyGame class
 */

class MyGame extends Game {
  public scriptVars={}

  constructor(container:string|HTMLElement) {
    super(container, 800, 800);
    this.frameRate = 120;
    this.addScene("main", new MyScene());
    this.joypad.enable();
    this.joypad.disable(["touch"]);
    this.startScene("main");
  }

}
export = MyGame;
