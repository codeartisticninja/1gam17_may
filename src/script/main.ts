"use strict";
import MyGame  = require("./_classes/MyGame");

/**
 * main.ts
 * Main script
 */
var game: MyGame;

function init() {
  game = window["game"] = new MyGame("#game");
}

if (location.search === "?nojs") {
  let tags = document.getElementsByTagName("noscript");
  for (let i = 0; i < tags.length; i++) {
    let tag = document.createElement("span");
    tag.classList.add("noscript");
    tag.innerHTML = tags[i].innerHTML;
    tags[i].parentElement.insertBefore(tag, tags[i]);
  }
} else {
  addEventListener("DOMContentLoaded", init);
}
