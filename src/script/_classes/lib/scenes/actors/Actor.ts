"use strict";
import Scene   = require("../Scene");
import Vector2 = require("../../utils/Vector2");
import Sprite  = require("./Sprite");


/**
 * Actor class
 * 
 * @date 06-jun-2017
 */

interface Animation {
  frames:number[];
  speed:number;
}

class Actor {
  public scene:Scene;
  public name:string;
  public type:string;
  public sprite:Sprite;
  public frame:number=-1;
  public position:Vector2 = new Vector2();
  public scale:Vector2 = new Vector2(1);
  public offset:Vector2 = new Vector2();
  public size:Vector2 = new Vector2(32);
  public rotation:number=0;
  public opacity:number=1;
  
  public velocity:Vector2 = new Vector2();
  public gravity:Vector2;
  public momentum:number=1;
  public friction:number=0;
  public angularVelocity:number=0;
  public angularMomentum:number=1;
  public angularFriction:number=0;

  public animations = {};
  public animation:Animation;
  public animationFrame:number;
  public nextAnimation:Animation;

  constructor(obj?:any) {
    if (obj) {
      this.name = obj.name;
      this.type = obj.type;
      this._gid = obj.gid;
      this.position.x = obj.x || 0;
      this.position.y = (obj.y - (obj.gid==null?0:obj.height)) || this.position.x;
      this.size.x = obj.width || 32;
      this.size.y = obj.height || this.size.x;
      setTimeout(()=>{
        this._setProperties(obj);
      });
    }
  }

  get left() {
    return this.position.x + this.offset.x * this.scale.x;
  }
  get top() {
    return this.position.y + this.offset.y * this.scale.y;
  }
  get right() {
    return this.position.x + (this.offset.x + this.size.x) * this.scale.x;
  }
  get bottom() {
    return this.position.y + (this.offset.y + this.size.y) * this.scale.y;
  }

  update() {
    if (this.animation) {
      this.animationFrame += this.animation.speed;
      if (Math.floor(this.animationFrame) >= this.animation.frames.length
          || this.animationFrame < 0) {
        if (this.nextAnimation) {
          this.animation = this.nextAnimation;
          this.nextAnimation = null;
          this.animationFrame = 0;
        } else {
          if (this.animationFrame < 0) {
            this.animationFrame += this.animation.frames.length;
          } else {
            this.animationFrame -= this.animation.frames.length;
          }
        }
      }
      this.frame = this.animation.frames[Math.floor(this.animationFrame)];
    }
    if (this.momentum) {
      this.velocity.add(this.gravity || this.scene.gravity);
      if (this.friction) {
        let mag = this.velocity.magnitude;
        if (mag > this.friction) {
          this.velocity.magnitude = mag - this.friction;
        } else {
          this.velocity.set(0);
        }
      }
      this.velocity.multiplyXY(this.momentum);
      this.position.add(this.velocity);
    }
    if (this.angularMomentum) {
      if (this.angularFriction) {
        if (this.angularVelocity > this.angularFriction) {
          this.angularVelocity -= this.angularFriction;
        } else {
          this.angularVelocity = 0;
        }
      }
      this.angularVelocity *= this.angularMomentum;
      this.rotation += this.angularVelocity;
    }
  }

  render() {
    if (!this.sprite && this._gid != null) {
      this.sprite = this.scene.getSpriteByGid(this._gid);
      if (this.frame < 0) {
        this.frame = this._gid - this.sprite.firstGid;
      }
    }
    if (this.sprite)
      this.sprite.draw(this.frame, 0, this.offset, this.size);
  }

  overlapsWith(actor:Actor) {
    return this._overlap2D(this.top, this.left, this.bottom, this.right,
      actor.top, actor.left, actor.bottom, actor.right);
  }

  setAnchor(x:number, y=x) {
    this.position.add(this.offset);
    this.offset.set(-x,-y);
    this.position.subtract(this.offset);
  }

  addAnimation(name:string, frames:number[], speed=1) {
    var anim:Animation = {
      frames: frames,
      speed: speed
    }
    this.animations[name] = anim;
  }
  playAnimation(name:string, queue=false) {
    if (queue) {
      this.nextAnimation  = this.animations[name];
    } else {
      if (this.animation != this.animations[name]) {
        this.animation      = this.animations[name];
        this.animationFrame = -this.animation.speed;
      }
    }
  }
  stopAnimation() {
    this.animation = null;
  }

  /*
    _privates
  */
  private _gid:number;

  private _overlap1D(a1:number, a2:number, b1:number, b2:number) {
    return Math.max(a1, a2) > Math.min(b1, b2) &&
      Math.min(a1, a2) < Math.max(b1, b2);
  }

  private _overlap2D(ax1:number, ay1:number, ax2:number, ay2:number,
      bx1:number, by1:number, bx2:number, by2:number) {
    return this._overlap1D(ax1, ax2, bx1, bx2) &&
      this._overlap1D(ay1, ay2, by1, by2);
  }

  private _lazyJSON(json:string) {
    try {
      return JSON.parse(json);
    } catch (err) {
      return json;
    }
  }

  private _setProperties(obj:any) {
    if (obj.properties) {
      for (var key in obj.properties) {
        var val = this._lazyJSON(obj.properties[key]);
        if (typeof this[key] === "function") {
          if (!(val instanceof Array)) val = [val];
          this[key].apply(this, val);
        } else if (this[key] instanceof Vector2) {
          if (val instanceof Array) {
            this[key].set.apply(this[key], val);
          } else {
            this[key].copyFrom(val);
          }
        } else {
          this[key] = val;
        }
      }
    }
  }

}
export = Actor;
