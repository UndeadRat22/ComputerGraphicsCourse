//import * as THREE from './three.js';

const guiSettings = {
  stairHeight: { min: 1, max: 30 },
  stairCount: { min: 1, max: 30 },
  angle: { min: -360, max: 360 },
};

const stairControls = {
  stairHeight: 15,
  stairCount: 15,
  angle: 0,
  updateStairs: () => {},
};

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//draw controls

const gui = new dat.GUI();
const initGui = () => {
  for (const [key, value] of Object.entries(guiSettings)) {
    if (value.max !== undefined && value.min !== undefined) {
      gui
        .add(stairControls, key)
        .min(value.min)
        .max(value.max)
        .step(value.step === undefined ? 1 : value.step)
        .onFinishChange(stairControls.updateStairs);
    }
  }
};
initGui();

//draw stairs

//show stairs

//frame render
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
