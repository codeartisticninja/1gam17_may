/// <reference path="../../../_d.ts/node.d.ts"/>
"use strict";
import Game        = require("../Game");
import Actor       = require("./actors/Actor");
import Sprite      = require("./actors/Sprite");
import Vector2     = require("../utils/Vector2");
import http        = require("http");

import Text        = require("./actors/Text");

/**
 * Scene class
 * 
 * @date 07-jun-2017
 */

class Scene {
  public game:Game;
  public actorTypes:Object = {};
  public actors:Actor[];
  public actorsByType:Object;
  public actorsByName:Object = {};
  public spritesByFirstGid:Sprite[]=[];
  public spritesByName:Object = {};
  public gravity:Vector2 = new Vector2();
  public mapData:any;

  constructor(public mapUrl?:string) {
    this.actorTypes["Text"] = Text;
  }

  reset() {
    var _t = this;
    this.actors = [];
    this.actorsByType = {};
    if (this.mapUrl) {
      http.get(this.mapUrl, function(res){
        var data = "";
        res.on("data", function(chunk:string){ data += chunk; });
        res.on("end", function() {
          _t.mapData = JSON.parse(data.trim());
          _t.loadMap();
        });
      });
    }
  }

  enter() {
  }
  exit() {
  }

  loadMap() {
    var mapFolder = this.mapUrl.substr(0, this.mapUrl.lastIndexOf("/")+1);
    for (var tileset of this.mapData.tilesets) {
      this.addSprite(new Sprite(tileset, mapFolder));
    }
    for (var layer of this.mapData.layers) {
      switch (layer.type) {
        case "objectgroup":
          for (var obj of layer.objects) {
            if (this.actorTypes[obj.type]) {
              this.addActor(new this.actorTypes[obj.type](obj));
            } else {
              this.addActor(new Actor(obj));
            }
          }
          break;
      }
    }
  }

  update() {
    for (var actor of this.actors) {
      actor.update();
    }
  }

  render() {
    if (!this.game) return false;
    var g = this.game.ctx;
    for (var actor of this.actors) {
      g.save();
      g.translate(actor.position.x, actor.position.y);
      g.rotate(actor.rotation);
      g.scale(actor.scale.x, actor.scale.y);
      g.globalAlpha = actor.opacity;
      actor.render();
      g.restore();
    }
  }

  addActor(actor:Actor, ...toGroup:Array<Actor>[]) {
    toGroup.push(this.actors);
    toGroup.push(this.actorsByType[actor.type] = this.actorsByType[actor.type] || []);
    for (var group of toGroup) {
      var i = group.indexOf(actor);
      if (i === -1) {
        group.push(actor);
      }
    }
    this.actorsByName[actor.name] = actor;
    actor.scene = this;
    return actor;
  }

  removeActor(actor:Actor, ...fromGroup:Array<Actor>[]) {
    setTimeout(()=>{
      fromGroup.push(this.actors);
      fromGroup.push(this.actorsByType[actor.type]);
      for (var group of fromGroup) {
        var i = group.indexOf(actor);
        if (i !== -1) {
          group.splice(i,1);
        }
      }
      this.actorsByName[actor.name] = null;
      actor.scene = null;
    });
    return actor;
  }

  bringActorToFront(actor:Actor, ...fromGroup:Array<Actor>[]) {
    setTimeout(()=>{
      fromGroup.push(this.actors);
      fromGroup.push(this.actorsByType[actor.type]);
      for (var group of fromGroup) {
        var i = group.indexOf(actor);
        if (i !== -1) {
          group.splice(i,1);
          group.push(actor);
        }
      }
    });
  }

  bringActorToBack(actor:Actor, ...fromGroup:Array<Actor>[]) {
    setTimeout(()=>{
      fromGroup.push(this.actors);
      fromGroup.push(this.actorsByType[actor.type]);
      for (var group of fromGroup) {
        var i = group.indexOf(actor);
        if (i !== -1) {
          group.splice(i,1);
          group.unshift(actor);
        }
      }
    });
  }

  addSprite(sprite:Sprite) {
    this.spritesByFirstGid[sprite.firstGid] = sprite;
    this.spritesByName[sprite.name] = sprite;
    sprite.ctx = this.game.ctx;
  }
  getSpriteByGid(gid:number) {
    while (gid > -1 && !this.spritesByFirstGid[gid]) {
      gid--;
    }
    return this.spritesByFirstGid[gid];
  }
  getSpriteByName(name:string) {
    return this.spritesByName[name];
  }

  onOverlap(a:Actor|Array<Actor>, b:Actor|Array<Actor>, resolver:Function, context:Object=this) {
    if (a instanceof Actor) a = [ a ];
    if (b instanceof Actor) b = [ b ];
    for (var actorA of a) {
      for (var actorB of b) {
        if (actorA !== actorB && actorA.overlapsWith(actorB)) {
          resolver.call(context, actorA, actorB);
        }
      }
    }
  }


  /*
    _privates
  */

}
export = Scene;
