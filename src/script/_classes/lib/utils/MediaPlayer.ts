"use strict";
import Tween = require("./Tween");

/**
 * MediaPlayer class
 * 
 * @date 18-may-2017
 */

class MediaPlayer {
  public players:HTMLAudioElement[]=[];

  get enabled() {
    return this._enabled;
  }
  set enabled(val:boolean) {
    this._enabled = val;
    if (val) {
      this.players[0].play();
    } else {
      this.players[0].pause();
    }
  }
  get volume() {
    return this._volume;
  }
  set volume(val:number) {
    this._volume = val;
    this.players[0].volume = val;
  }

  constructor(url?:string) {
    this._unlockPlayers = this._unlockPlayers.bind(this);
    this.players.push(new Audio());
    if (this.enabled) {
      document.body.addEventListener("touchstart", this._unlockPlayers);
      if (url) this.play(url);
    }
  }

  play(url:string, loop=false, fadeDuration=1024) {
    var player:HTMLAudioElement;
    if (!this.enabled) return false;
    this.pause(fadeDuration);
    this.players.push(this.players.shift());
    player = this.players[0];
    player.src = url;
    player.volume = this.volume;
    player.loop = loop;
    player.play();
  }

  pause(fadeDuration=1024) {
    var player:HTMLAudioElement;
    player = this.players[0];
    new Tween(player, { volume: 0 }, fadeDuration);
    setTimeout(()=>{
      player.pause();
    }, fadeDuration);
  }

  applyVolume() {
    this.players[0].volume = this.volume;
  }

  /*
    _privates
  */
  private _enabled=true;
  private _volume=1;

  private _unlockPlayers() {
    var player:HTMLAudioElement;
    for (player of this.players) {
      player.play();
    }
    document.body.removeEventListener("touchstart", this._unlockPlayers);
  }

}
export = MediaPlayer;
