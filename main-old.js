import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getPhongFShader } from "./shader_utils";
import testRoom from "./walls/rooms/test-room";
import testHallway from "./walls/hallways/test-hallway";

const scene = new THREE.Scene();
let clock = new THREE.Clock();

testRoom(scene);
testHallway(scene);

const axesHelper = new THREE.AxesHelper(5);

// Add the helper to the scene
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(20, 30, 20);
camera.lookAt(0, 5, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enabled = true;
controls.minDistance = 10;
controls.maxDistance = 50;

animate();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  if (controls.enabled) {
    controls.update();
  }

  renderer.render(scene, camera);
}
