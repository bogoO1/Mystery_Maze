import * as THREE from "three";
import { CameraCollision } from "./collision.js";
import { WalkingSound } from "./walking_sound.js";
/*
 * create a character to be able to test and have him move
 * will be implemented later based on our setup style
 * as of now we should most likely create the controls
 * and make the layout of our board
 * then implement the player
 */

/*
 * getting the camera and scene from main.js
 * set a basic run time for the player to move
 * storing the movement direction and keys
 */

// Mouse movement tracking for look controls
document.body.requestPointerLock =
  document.body.requestPointerLock || document.body.mozRequestPointerLock;
document.addEventListener("click", () => document.body.requestPointerLock());

const moveSpeed = 5; // Movement speed
const lookSpeed = 0.002; // Mouse sensitivity
let yaw = 0,
  pitch = 0; // Camera rotation angles
// Collision Detection System
let collisionSystem;

const collision_override = true;

function updateCameraPosition(deltaTime, camera, keys, walkingSound) {
  const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)); // XZ only (Fixed Direction)
  const right = new THREE.Vector3(forward.z, 0, -forward.x); // Right vector perpendicular to forward and up

  const velocity = moveSpeed * deltaTime;
  let nextPosition = camera.position.clone();

  if (keys["forward"]) nextPosition.addScaledVector(forward, velocity);
  if (keys["backward"]) nextPosition.addScaledVector(forward, -velocity);
  if (keys["left"]) nextPosition.addScaledVector(right, velocity);
  if (keys["right"]) nextPosition.addScaledVector(right, -velocity);

  nextPosition.y = 0; // Keep Y locked

  // Check collision BEFORE moving
  const collision = collisionSystem.willCollide(nextPosition, camera);
  if (!collision.colliding || collision_override) {
    if (
      nextPosition.x == camera.position.x &&
      nextPosition.z == camera.position.z
    ) {
      walkingSound.stop();
    } else {
      walkingSound.play();
    }
    camera.position.copy(nextPosition);
  } else {
    // Slide along the collision surface
    let slideDirection = nextPosition.clone().sub(camera.position).normalize();
    slideDirection = slideDirection.projectOnPlane(collision.normal);

    // Apply slide movement
    const slideAmount = velocity * 0.5;
    const slidePosition = camera.position
      .clone()
      .addScaledVector(slideDirection, slideAmount);

    // Final check if sliding is possible
    if (
      !collisionSystem.willCollide(slidePosition, camera).colliding ||
      collision_override
    ) {
      camera.position.copy(slidePosition);
      walkingSound.play();
    } else if (collision.pushOutVector) {
      // If still colliding, push player out
      camera.position.add(collision.pushOutVector);
      walkingSound.play();
    } else {
      walkingSound.stop();
    }
  }
}
// Use quaternions for rotation to prevent gimbal lock
function updateCameraRotation(camera) {
  const quaternion = new THREE.Quaternion();

  // Rotate around X for pitch (up/down)
  const pitchQuat = new THREE.Quaternion();
  pitchQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch);

  // Rotate around Y for yaw (left/right)
  const yawQuat = new THREE.Quaternion();
  yawQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

  // Apply yaw first, then pitch
  quaternion.multiplyQuaternions(yawQuat, pitchQuat);
  camera.quaternion.copy(quaternion);
}

export class PlayerController {
  //initialzing a class with a camera and a scene
  constructor(camera, scene) {
    collisionSystem = new CameraCollision(scene);
    this.camera = camera;
    this.scene = scene;

    //movement controls
    this.moveSpeed = 0.1;
    this.mouseSensitivity = 0.002;

    // W, A, S, D keys and are switched to true when they are pressed
    this.movement = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };

    this.walkingSound = new WalkingSound(camera);

    //rotation of an object in 3D space using three angles
    this.euler = new THREE.Euler(0, 0, 0, "YXZ");

    // possible collision detection in a 3D field
    this.boundingBox = new THREE.Box3();

    // vector that defines the size of the players collision box
    // width of 1, height of 2, depth of 1
    this.playerDimensions = new THREE.Vector3(1, 2, 1);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    //this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);

    this.initializeControls();
  }

  // handles keyboard and mouse input
  initializeControls() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("mousemove", this.handleMouseMove);
    //document.addEventListener("mousedown", this.onDocumentMouseDown);

    // pointer lock on click, test for necessity
    document.addEventListener("click", function () {
      document.body.requestPointerLock();
    });
  }

  // handler designed to respond to keyboard
  // event parameter explains the object with what key was pressed
  handleKeyDown(event) {
    switch (event.code) {
      case "KeyW":
        this.movement.forward = true;
        break;
      case "KeyS":
        this.movement.backward = true;
        break;
      case "KeyA":
        this.movement.left = true;
        break;
      case "KeyD":
        this.movement.right = true;
        break;
    }
  }

  // handles when the keys are not pressed
  handleKeyUp(event) {
    switch (event.code) {
      case "KeyW":
        this.movement.forward = false;
        break;
      case "KeyS":
        this.movement.backward = false;
        break;
      case "KeyA":
        this.movement.left = false;
        break;
      case "KeyD":
        this.movement.right = false;
        break;
    }
  }

  // handles mouse movement for camera control
  handleMouseMove(event) {
    if (document.pointerLockElement === document.body) {
      yaw -= event.movementX * lookSpeed; // Rotate left/right
      pitch -= event.movementY * lookSpeed; // Rotate up/down
      pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch)); // Clamp pitch (-90° to 90°)
    }
  }

  // Update method to handle player movement
  update(deltaTime) {
    // Only update movement when pointer is locked
    if (document.pointerLockElement === document.body) {
      updateCameraPosition(
        deltaTime,
        this.camera,
        this.movement,
        this.walkingSound
      );
      updateCameraRotation(this.camera);
    } else {
      this.walkingSound.stop();
    }
  }

  // Check for collisions
  checkCollisions(nextPosition) {
    // Update bounding box at the next position
    this.boundingBox.setFromCenterAndSize(nextPosition, this.playerDimensions);

    // Check collisions with walls
    const walls = this.scene.children.filter((child) => child.userData.isWall);

    for (const wall of walls) {
      const wallBox = new THREE.Box3().setFromObject(wall);
      if (this.boundingBox.intersectsBox(wallBox)) {
        return true; // Collision detected
      }
    }

    return false; // No collision
  }

  dispose() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("mousemove", this.handleMouseMove);
  }
}
