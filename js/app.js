import * as THREE from "three";
import images from "./images";

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

let targetX = 0;
let targetY = 0;

const textureOne = new THREE.TextureLoader().load(images.imageOne);
const textureTwo = new THREE.TextureLoader().load(images.imageTwo);

class Canvas {
  constructor() {}
}

new Canvas();
