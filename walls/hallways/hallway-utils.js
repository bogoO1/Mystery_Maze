import * as THREE from "three";
import { createWall, createAudioWall } from "../wall-utils";

export function buildHallway(
  scene,
  startPoint,
  direction,
  width,
  height,
  thickness = 1
) {
  // build a hallway that must be facing perfectly vertical and in the x,-x,z,or -z direction
  // start point is assumed to be the bottom left corner of the inside of the hallway
  // stat and end point are the inside bounds, the walls are assumed to be 1 unit thick.

  const depth = direction.length;

  const up = new THREE.Vector3(0, 1, 0).multiplyScalar(height);
  const rightVec = new THREE.Vector3()
    .crossVectors(direction, up)
    .normalize()
    .multiplyScalar(width);

  const rightWidthVector = new THREE.Vector3()
    .copy(rightVec)
    .multiplyScalar(0.5);
  const upHeightVector = new THREE.Vector3().copy(up).multiplyScalar(0.5);
  const leftWidthVector = new THREE.Vector3()
    .copy(rightWidthVector)
    .multiplyScalar(-1);
  const downHeightVector = new THREE.Vector3()
    .copy(upHeightVector)
    .multiplyScalar(-1);

  console.log("r: ", rightWidthVector);

  const center = new THREE.Vector3()
    .addVectors(startPoint, rightWidthVector)
    .add(upHeightVector);

  console.log("center ", center);
  console.log("right ", rightWidthVector);
  console.log("up ", upHeightVector);

  const hallway = [
    [
      // Left wall
      new THREE.Vector3()
        .addVectors(center, leftWidthVector)
        .add(downHeightVector),
      new THREE.Vector3()
        .addVectors(
          center,
          new THREE.Vector3().addVectors(
            leftWidthVector,
            new THREE.Vector3()
              .copy(leftWidthVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(
          new THREE.Vector3().addVectors(
            upHeightVector,
            new THREE.Vector3()
              .copy(upHeightVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(direction),
    ],
    [
      // Right wall
      new THREE.Vector3()
        .addVectors(center, rightWidthVector)
        .add(downHeightVector),
      new THREE.Vector3()
        .addVectors(
          center,
          new THREE.Vector3().addVectors(
            rightWidthVector,
            new THREE.Vector3()
              .copy(rightWidthVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(
          new THREE.Vector3().addVectors(
            upHeightVector,
            new THREE.Vector3()
              .copy(upHeightVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(direction),
    ],
    [
      // Top wall
      new THREE.Vector3()
        .addVectors(center, rightWidthVector)
        .add(upHeightVector),
      new THREE.Vector3()
        .addVectors(
          center,
          new THREE.Vector3().addVectors(
            leftWidthVector,
            new THREE.Vector3().copy(leftWidthVector).normalize()
          )
        )
        .add(
          new THREE.Vector3().addVectors(
            upHeightVector,
            new THREE.Vector3()
              .copy(upHeightVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(direction),
    ],
    [
      // Bottom wall
      new THREE.Vector3()
        .addVectors(
          center,
          new THREE.Vector3().addVectors(
            rightWidthVector,
            new THREE.Vector3()
              .copy(rightWidthVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(downHeightVector),
      new THREE.Vector3()
        .addVectors(
          center,
          new THREE.Vector3().addVectors(
            leftWidthVector,
            new THREE.Vector3()
              .copy(leftWidthVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(
          new THREE.Vector3().addVectors(
            downHeightVector,
            new THREE.Vector3()
              .copy(downHeightVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(direction),
    ],
  ];

  return buildRoomHelper(scene, hallway);
}

export function buildAudioHallway(
  scene,
  camera,
  startPoint,
  direction,
  width,
  height,
  thickness = 1
) {
  // build a hallway that must be facing perfectly vertical and in the x,-x,z,or -z direction
  // start point is assumed to be the bottom left corner of the inside of the hallway
  // stat and end point are the inside bounds, the walls are assumed to be 1 unit thick.

  const depth = direction.length;

  const up = new THREE.Vector3(0, 1, 0).multiplyScalar(height);
  const rightVec = new THREE.Vector3()
    .crossVectors(direction, up)
    .normalize()
    .multiplyScalar(width);

  const rightWidthVector = new THREE.Vector3()
    .copy(rightVec)
    .multiplyScalar(0.5);
  const upHeightVector = new THREE.Vector3().copy(up).multiplyScalar(0.5);
  const leftWidthVector = new THREE.Vector3()
    .copy(rightWidthVector)
    .multiplyScalar(-1);
  const downHeightVector = new THREE.Vector3()
    .copy(upHeightVector)
    .multiplyScalar(-1);

  console.log("r: ", rightWidthVector);

  const center = new THREE.Vector3()
    .addVectors(startPoint, rightWidthVector)
    .add(upHeightVector);

  console.log("center ", center);
  console.log("right ", rightWidthVector);
  console.log("up ", upHeightVector);

  const hallway = [
    [
      // Left wall
      new THREE.Vector3()
        .addVectors(center, leftWidthVector)
        .add(downHeightVector),
      new THREE.Vector3()
        .addVectors(
          center,
          new THREE.Vector3().addVectors(
            leftWidthVector,
            new THREE.Vector3()
              .copy(leftWidthVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(
          new THREE.Vector3().addVectors(
            upHeightVector,
            new THREE.Vector3()
              .copy(upHeightVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(direction),
    ],
    [
      // Right wall
      new THREE.Vector3()
        .addVectors(center, rightWidthVector)
        .add(downHeightVector),
      new THREE.Vector3()
        .addVectors(
          center,
          new THREE.Vector3().addVectors(
            rightWidthVector,
            new THREE.Vector3()
              .copy(rightWidthVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(
          new THREE.Vector3().addVectors(
            upHeightVector,
            new THREE.Vector3()
              .copy(upHeightVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(direction),
    ],
    [
      // Top wall
      new THREE.Vector3()
        .addVectors(center, rightWidthVector)
        .add(upHeightVector),
      new THREE.Vector3()
        .addVectors(
          center,
          new THREE.Vector3().addVectors(
            leftWidthVector,
            new THREE.Vector3().copy(leftWidthVector).normalize()
          )
        )
        .add(
          new THREE.Vector3().addVectors(
            upHeightVector,
            new THREE.Vector3()
              .copy(upHeightVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(direction),
    ],
    [
      // Bottom wall
      new THREE.Vector3()
        .addVectors(
          center,
          new THREE.Vector3().addVectors(
            rightWidthVector,
            new THREE.Vector3()
              .copy(rightWidthVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(downHeightVector),
      new THREE.Vector3()
        .addVectors(
          center,
          new THREE.Vector3().addVectors(
            leftWidthVector,
            new THREE.Vector3()
              .copy(leftWidthVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(
          new THREE.Vector3().addVectors(
            downHeightVector,
            new THREE.Vector3()
              .copy(downHeightVector)
              .normalize()
              .multiplyScalar(thickness)
          )
        )
        .add(direction),
    ],
  ];

  return buildAudioRoomHelper(scene, camera, hallway);
}

function buildAudioRoomHelper(scene, camera, room) {
  room.forEach((wall) => createAudioWall(wall[0], wall[1], camera, scene));
  room.forEach((wall) =>
    scene.add(createWall(wall[0], wall[1], camera, scene))
  );
}
function buildRoomHelper(scene, room) {
  room.forEach((wall) => scene.add(createWall(wall[0], wall[1])));
  room.forEach((wall) => scene.add(createWall(wall[0], wall[1])));
}

// build a room facing any direction, implement if needed
export function buildSlantedRoom(center, size, up) {}
