import * as THREE from "three";

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import images from "./images";

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

let targetX = 0;
let targetY = 0;

const textureOne = new THREE.TextureLoader().load(images.imageOne);
const textureTwo = new THREE.TextureLoader().load(images.imageTwo);

class Canvas {
  constructor() {
    this.container = document.querySelector("main");
    this.links = [...document.querySelectorAll("span")];
    this.uniforms = {
      uTexture: { value: textureOne },
      uAlpha: { value: 0.0 },
      uOffset: { value: new THREE.Vector2(0.0, 0.0) },
    };

    this.links.forEach((link, id) => {
      link.addEventListener("mouseenter", () => {
        switch (id) {
          case 0:
            this.uniforms.uTexture.value = textureOne;
            break;
          case 1:
            this.uniforms.uTexture.value = textureTwo;
            break;
        }
      });
    });

    this.scene = new THREE.Scene();
    this.perspective = 1000;
    this.sizes = new THREE.Vector2(0, 0);
    this.offset = new THREE.Vector2(0, 0);
    this.setupCamera();
    this.createMesh();
    this.render();

    this.onMousemove();
    this.addEventListeners(document.querySelector("span"));
  }

  onMousemove() {
    window.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });
  }

  addEventListeners(el) {
    el.addEventListener("mouseenter", () => {
      this.linksHover = true;
    });
    el.addEventListener("mouseleave", () => {
      this.linksHover = false;
    });
  }

  get viewport() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspectRatio = width / height;

    return {
      width,
      height,
      aspectRatio,
    };
  }

  setupCamera() {
    window.addEventListener("resize", this.onWindowResize.bind(this));

    let fov =
      (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
      Math.PI;
    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.viewport.aspectRatio,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, this.perspective);

    this.renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
  }

  onWindowResize() {
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.fov =
      (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
      Math.PI;
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.camera.updateProjectionMatrix();
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 20, 20);
    //this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.sizes.set(650, 850);
    this.mesh.scale.set(this.sizes.x, this.sizes.y);
    this.mesh.position.set(this.offset.x, this.offset.y);

    this.scene.add(this.mesh);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.uniforms.uOffset.value.set(
      (targetX - this.offset.x) * 0.0005,
      -(targetY - this.offset.y) * 0.0005
    );
    this.mesh.position.set(
      this.offset.x - window.innerWidth / 2,
      -this.offset.y + window.innerHeight / 2
    );

    this.linksHover
      ? (this.uniforms.uAlpha.value = lerp(
          this.uniforms.uAlpha.value,
          1.0,
          0.1
        ))
      : (this.uniforms.uAlpha.value = lerp(
          this.uniforms.uAlpha.value,
          0.0,
          0.1
        ));

    requestAnimationFrame(this.render.bind(this));
    this.offset.x = lerp(this.offset.x, targetX, 0.1);
    this.offset.y = lerp(this.offset.y, targetY, 0.1);
  }
}

new Canvas();
