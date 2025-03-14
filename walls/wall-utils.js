import * as THREE from "three";
import AudioWall from "../mic_effect/audio_wall";

export function createWall(lowerCorner, upperCorner) {
  // TODO: add support for angled walls in func.
  const pos = new THREE.Vector3()
    .addVectors(lowerCorner, upperCorner)
    .divideScalar(2);

  const size = upperCorner.sub(lowerCorner);

  const wallGeometry = new THREE.BoxGeometry(
    Math.abs(size.x),
    Math.abs(size.y),
    Math.abs(size.z)
  );
  const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xffaaaa });

  const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

  wallMesh.position.copy(pos);

  return wallMesh;
}

export function createAudioWall(lowerCorner, upperCorner, camera, scene) {
  // TODO: add support for angled walls in func.
  const pos = new THREE.Vector3()
    .addVectors(lowerCorner, upperCorner)
    .divideScalar(2);

  const size = upperCorner.sub(lowerCorner);

  // Create two vectors in the plane
  let normal = new THREE.Vector3(1, 0, 0);

  if (size.x === 0) {
    normal = new THREE.Vector3(1, 0, 0);
  } else if (size.z === 0) {
    normal = new THREE.Vector3(0, 0, 1);
  }
  console.log(normal);

  const look = new THREE.Vector3().addVectors(pos, normal);
  const lookNeg = pos.addScaledVector(normal, -1);
  // Calculate the normal vector using the cross product
  const wall1 = new AudioWall(
    camera,
    scene,
    pos,
    look,
    8,
    Math.random() * 8 + 1
  );
  const wall2 = new AudioWall(
    camera,
    scene,
    pos,
    lookNeg,
    8,
    Math.random() * 8 + 1
  );
}
