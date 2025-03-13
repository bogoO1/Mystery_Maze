// gradientSphere.js
import * as THREE from 'three';

async function loadShader(url) {
  const response = await fetch(url);
  return response.text();
}

export async function createGradientSphere(scene, renderer, position = { x: 0, y: 0, z: -20 }) {
  const vertexShader = await loadShader("shaders/gradient.vert");
  const fragmentShader = await loadShader("shaders/gradient.frag");

  const canvas = renderer.domElement;
  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      renderWidth: { value: canvas.width },
      renderHeight: { value: canvas.height },
    },
  });

  const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
  const gradientSphere = new THREE.Mesh(sphereGeometry, shaderMaterial);
  gradientSphere.position.set(position.x, position.y, position.z);
  scene.add(gradientSphere);
}


