"use strict";


/**
 * Tween class
 * 
 * @date 18-may-2017
 */

class Tween {
  constructor(public object:Object, public endProps:Object, public duration:number, autostart=true) {
    this.update = this.update.bind(this);
    if (autostart) this.start();
  }

  start() {
    this._startTime = Date.now();
    for (var key in this.endProps) {
      this._startProps[key] = this.object[key];
    }
    this.update();
  }

  update() {
    cancelAnimationFrame(this._updateTO);
    var progress = Math.min(1, (Date.now() - this._startTime) / this.duration);
    for (var key in this.endProps) {
      this.object[key] = this._startProps[key] + progress * (this.endProps[key] - this._startProps[key]);
    }
    if (progress < 1) this._updateTO = requestAnimationFrame(this.update);
  }

  stop() {
    cancelAnimationFrame(this._updateTO);
  }

  /*
    _privates
  */
  private _startProps:Object;
  private _startTime:number;
  private _updateTO:any;

}
export = Tween;
