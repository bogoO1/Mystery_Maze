import * as THREE from "three";
import { buildHallway, buildAudioHallway } from "./hallways/hallway-utils";

// Add Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light

//ground implementation
const groundGeometry = new THREE.PlaneGeometry(100, 100); // Adjust size as needed

// Load the granite tile texture
const loader = new THREE.TextureLoader();
const graniteTexture = loader.load("textures/granite_tile.png"); // Make sure to use the correct path where the texture is stored
graniteTexture.wrapS = graniteTexture.wrapT = THREE.RepeatWrapping;
graniteTexture.repeat.set(10, 10); // Adjust based on the size of your geometry and the scale of the texture

let groundMaterial = new THREE.MeshPhongMaterial({
  map: graniteTexture, // Use the loaded granite texture
  shininess: 60, // Adjust this value for the desired glossiness of the ceramic-like surface
  specular: new THREE.Color("grey"), // Specular highlights to add reflective properties typical of polished granite
  side: THREE.DoubleSide, // Render both sides of the plane
});

//groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to lay flat
ground.position.y = -1; // Adjust height to align with the camera's y

//wall objects
const wallTexture = loader.load("textures/seaworn_sandstone_brick.png");
wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(100, 10);

const wallMaterial = new THREE.MeshPhongMaterial({
  map: wallTexture,
  shininess: 10, // Reduced shininess for a matte look
  specular: new THREE.Color(0x222222),
});
const wall1Geometry = new THREE.BoxGeometry(100, 10, 0.5);

const wallFront = new THREE.Mesh(wall1Geometry, wallMaterial); //front
wallFront.position.set(0, 4, -50); // Adjust position accordingly

const wallBack = new THREE.Mesh(wall1Geometry, wallMaterial); //back
wallBack.position.set(0, 4, 50);

const wallLeft = new THREE.Mesh(wall1Geometry, wallMaterial); //back
wallLeft.rotation.y = Math.PI / 2;
wallLeft.position.set(-50, 4, 0);

const wallRight = new THREE.Mesh(wall1Geometry, wallMaterial); //back
wallRight.rotation.y = Math.PI / 2;
wallRight.position.set(50, 4, 0);

export function addWalls(scene, camera) {
  scene.add(ambientLight);
  scene.add(ground);
  scene.add(wallFront);
  scene.add(wallBack);
  scene.add(wallLeft);
  scene.add(wallRight);
  const hallway = buildAudioHallway(
    scene,
    camera,
    new THREE.Vector3(-5, -1, 0),
    new THREE.Vector3(0, 0, -10),
    4,
    4,
    1
  );
}
