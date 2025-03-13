// audioReactiveSphere.js
import * as THREE from 'three';

class AudioReactiveSphere {
  constructor(scene, audioContext, position = { x: 0, y: 0, z: -20 }) {
    this.scene = scene;
    this.audioContext = audioContext;
    this.sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.sphere = new THREE.Mesh(this.sphereGeometry, this.material);
    this.sphere.position.set(position.x, position.y, position.z);
    this.scene.add(this.sphere);
    this.setupMicrophone();
  }

  setPosition(x, y, z) {
    this.sphere.position.set(x, y, z);
  }
  
  async setupMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const microphone = this.audioContext.createMediaStreamSource(stream);
      const analyser = this.audioContext.createAnalyser();
      microphone.connect(analyser);
      analyser.fftSize = 256;
      this.dataArray = new Uint8Array(analyser.frequencyBinCount);
      this.analyser = analyser;
      this.update();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  }

  getVolume() {
    this.analyser.getByteFrequencyData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    return sum / this.dataArray.length;
  }

  getColorBasedOnVolume(volume) {
    const hue = (volume / 255) * 720; // Extend the hue range
    return new THREE.Color(`hsl(${hue % 360}, 100%, 50%)`);
  }

  update() {
    requestAnimationFrame(this.update.bind(this));
    const volume = this.getVolume();
    const targetScale = Math.max(1, volume / 50);
    this.sphere.scale.x +=
      (targetScale - this.sphere.scale.x) * 0.7;
    this.sphere.scale.y +=
      (targetScale - this.sphere.scale.y) * 0.7;
    this.sphere.scale.z +=
      (targetScale - this.sphere.scale.z) * 0.7;
    const targetColor = this.getColorBasedOnVolume(volume);
    this.sphere.material.color.lerp(targetColor, 0.2);
  }
}

export default AudioReactiveSphere;
