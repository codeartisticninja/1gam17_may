"use strict";
import Scene       = require("../lib/scenes/Scene");
import myGame      = require("../MyGame");
import Script      = require("../lib/utils/Script");

import MyActor     = require("./actors/MyActor");

/**
 * MyScene class
 */

class MyScene extends Scene {
  public game:myGame;
  public script = new Script();

  constructor() {
    super("assets/maps/test.json");
    this.actorTypes["MyActor"] = MyActor;
  }

  reset() {
    super.reset();
    this.script.variables = this.game.scriptVars;
    this.script.commands["say"] = (attr:Object, body:string) => {
      console.log(body);
      setTimeout(()=>{
        this.script.continue();
      }, 1024);
    };
    this.script.load("./assets/story/test.xml", ()=>{
      this.script.continue();
    });
    // this.addActor(new MyActor());
  }

}
export = MyScene;