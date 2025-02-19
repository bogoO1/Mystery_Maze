import * as THREE from "three";

// Function should also accept shader, material parameters, and geometry types
export function createWall(lowerCorner, upperCorner) {
  const pos = new THREE.Vector3()
    .addVectors(lowerCorner, upperCorner)
    .divideScalar(2);

  const size = upperCorner.sub(lowerCorner);

  const wallGeometry = new THREE.BoxGeometry(
    Math.abs(size.x),
    Math.abs(size.y),
    Math.abs(size.z)
  );
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xffaaaa });

  const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

  wallMesh.position.copy(pos);

  return wallMesh;
}

export function buildRoom(scene, room) {
  room.forEach((wall) => scene.add(createWall(wall[0], wall[1])));
}
