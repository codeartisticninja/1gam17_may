"use strict";
import StorageFile = require("./utils/StorageFile");
import MediaPlayer = require("./utils/MediaPlayer");
import Sound       = require("./utils/Sound");
import Scene       = require("./scenes/Scene");
import joypad      = require("./utils/webJoypad");

if (!Element.prototype.requestFullscreen) {
    Element.prototype.requestFullscreen = 
        Element.prototype["webkitRequestFullscreen"] || 
        Element.prototype["mozRequestFullScreen"] ||
        Element.prototype["msRequestFullscreen"];
}

/**
 * BaseGameApp class
 * 
 * @date 07-jun-2017
 */

class Game {
  public container:HTMLElement;
  public canvas:HTMLCanvasElement;
  public ctx:CanvasRenderingContext2D;
  public saveFile = new StorageFile("save.json");
  public prefs = new StorageFile("/prefs.json");
  public mediaChannels = {
    "sfx":      new MediaPlayer(),
    "music":    new MediaPlayer(),
    "ambiance": new MediaPlayer()
  };
  public joypad = joypad;
  public scenes = {};
  public scene:Scene;

  get frameRate() {
    return 1000/this._frameInterval;
  }
  set frameRate(val:number) {
    this._frameInterval = 1000/val;
  }

  constructor(container:string|HTMLElement, width=800, height=450) {
    if (typeof container === "string") {
      this.container = <HTMLElement>document.querySelector(container);
    } else {
      this.container = container;
    }
    this._initCanvas(width, height);
    this._initAudio();
    this._initFS();
  }

  update() {
    this.joypad.update();
    if (this.scene) this.scene.update();
  }

  render() {
    if (this.scene) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.scene.render();
    } 
  }

  goFullscreen() {
    this.container.requestFullscreen();
  }

  applySoundPrefs() {
    for (var channel in this.mediaChannels) {
      this.mediaChannels[channel].enabled = this.prefs.get(channel+".enabled");
      this.mediaChannels[channel].volume  = this.prefs.get(channel+".volume");
    }
    Sound.enabled = this.prefs.get("sfx.enabled");
    Sound.volume  = this.prefs.get("sfx.volume");
  }

  addScene(sceneName:string, scene:Scene) {
    this.removeScene(sceneName);
    this.scenes[sceneName] = scene;
    scene.game = this;
    scene.reset();
  }
  removeScene(sceneName:string) {
    if (this.scene === this.scenes[sceneName]) this.startScene("main");
    if (this.scenes[sceneName]) {
      this.scenes[sceneName].game = null;
      this.scenes[sceneName] = null;
    }
  }
  startScene(sceneName:string) {
    if (this.scene) this.scene.exit();
    this.scene = this.scenes[sceneName];
    if (this.scene) this.scene.enter();
  }

  pause() {
    cancelAnimationFrame(this._tickTO);
  }
  resume() {
    this._tick();
  }

  /*
    _privates
  */
  private _canvas:HTMLCanvasElement;
  private _ctx:CanvasRenderingContext2D;
  private _tickTO:any;
  private _frameInterval:number=1000/30;
  private _nextFrameTime:number=0;
  private _cursorTO:any;
  private _addedMusicEvents=false;

  private _initCanvas(width:number, height:number) {
    this._tick = this._tick.bind(this);
    this.prefs.set("fullscreen", true, true);
    this.container.innerHTML = "";
    this._canvas = document.createElement("canvas");
    this._canvas.width = width;
    this._canvas.height = height;
    this._ctx = this._canvas.getContext("2d");
    this.container.appendChild(this._canvas);
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this._tick();
  }
  private _initAudio() {
    var vol = 2;
    for (var channel in this.mediaChannels) {
      this.prefs.set(channel+".enabled", true, true);
      this.prefs.set(channel+".volume", vol/=2, true);
      this.prefs.onSet(channel, this.applySoundPrefs.bind(this));
    }
    this.applySoundPrefs();
  }

  private _tick(t:number=0) {
    cancelAnimationFrame(this._tickTO);
    var updates = 0;
    if (this._nextFrameTime < t-50) this._nextFrameTime = t;
    while(this._nextFrameTime <= t) {
      this.update();
      this._nextFrameTime += this._frameInterval;
      updates++;
    }
    if (updates) {
      this.render();
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      this._ctx.drawImage(this.canvas, 0, 0);
    } 
    this._tickTO = requestAnimationFrame(this._tick);
  }


  private _initFS() {
    this.joypad.UIparent = this.container;
    var btn = document.createElement("button");
    btn.classList.add("fs");
    btn.setAttribute("title", "Full screen");
    btn.textContent = "Full screen";
    btn.addEventListener("click", this.goFullscreen.bind(this));
    this.container.appendChild(btn);
    btn.focus();

    this._hideCursor = this._hideCursor.bind(this);
    this.container.addEventListener("mousemove", this._wakeCursor.bind(this));
  }

  private _wakeCursor() {
    clearTimeout(this._cursorTO);
    this.container.style.cursor = "auto";
    this._cursorTO = setTimeout(this._hideCursor, 500);
  }

  private _hideCursor() {
    this.container.style.cursor = "none";
  }
}
export = Game;
