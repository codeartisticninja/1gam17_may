"use strict";
import Actor = require("./Actor");

/**
 * Text class
 * 
 * @date 21-may-2017
 */

class Text extends Actor {
  public fontSize:number=20;
  public lineHeight:number=0;
  public fontStyle:string="";
  public fontFamily:string="sans-serif";
  public textBaseline:string="top";
  public textAlign:string="start";
  public color:string="#000";
  public outline:string;

  constructor(obj?:any) {
    super(obj);
  }

  set text(txt:string) {
    this._text = txt;
    this._lines = null;
  }
  get text() {
    return this._text;
  }

  render() {
    var g = this.scene.game.ctx;
    g.font = this.fontStyle + " " + this.fontSize + "px " + this.fontFamily;
    g.textBaseline = this.textBaseline;
    g.textAlign    = this.textAlign;
    if (!this._lines) this._wrap();
    if (this.outline) {
      g.strokeStyle = this.outline;
      var y = 0;
      for (var txt of this._lines) {
        g.strokeText(txt, 0, y);
        y += this.fontSize + this.lineHeight;
      }
    }
    if (this.color) {
      g.fillStyle = this.color;
      var y = 0;
      for (var txt of this._lines) {
        g.fillText(txt, 0, y);
        y += this.fontSize + this.lineHeight;
      }
    }
  }

  /*
    _privates
  */
  private _text:string="";
  private _lines:string[];

  private _wrap() {
    var g = this.scene.game.ctx, i = 0, y = 0;
    this._lines = this._text.split("\n");
    while (i < this._lines.length && y < this.size.y) {
      while (g.measureText(this._lines[i]).width > this.size.x) {
        this._lines[i+1] = this._lines[i+1] || "";
        this._lines[i+1] = this._lines[i].substr(this._lines[i].lastIndexOf(" ")).trim() + " " + this._lines[i+1];
        this._lines[i] = this._lines[i].substr(0, this._lines[i].lastIndexOf(" ")).trim();
      }
      i++;
      y += this.fontSize + this.lineHeight;
    }
  }

}
export = Text;
