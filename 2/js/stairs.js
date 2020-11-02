//import * as THREE from './three.js';

const guiSettings = {
  stairs: {
    stairHeight: { min: 1, max: 30 },
    stairCount: { min: 1, max: 30 },
    angle: { min: -360, max: 360 },
  },
  step: {
    stepWidth: { min: 0.2, max: 4, step: 0.05 },
    stepDepth: { min: 0.2, max: 4, step: 0.05 },
    stepExtrudeDepth: { min: 1, max: 30, step: 1 },
    stepExtrudeBevelThickness: { min: 0.01, max: 1, step: 0.02 },
    stepExtrudeBevelSize: { min: 0.01, max: 1, step: 0.02 },
    stepExtrudeBevelSegments: { min: 10, max: 30, step: 1 },
    stepExtrudeCurveSegments: { min: 10, max: 30, step: 1 },
    stepExtrudeSteps: { min: 1, max: 20, step: 1 },
  },
};

const stairControls = {
  //stairs
  stairHeight: 15,
  stairCount: 15,
  angle: 0,
  //step
  stepWidth: 4,
  stepDepth: 3,
  stepExtrudeDepth: 1,
  stepExtrudeBevelThickness: 0.2,
  stepExtrudeBevelSize: 0.2,
  stepExtrudeBevelSegments: 20,
  stepExtrudeCurveSegments: 20,
  stepExtrudeSteps: 5,
  //rail

  updateStairs: () => {
    //drawScene();
  },
  getStepExtrudeSettings: () => {
    return {
      depth: 0.3,
      bevelThickness: stairControls.stepExtrudeBevelThickness,
      bevelSize: stairControls.stepExtrudeBevelSize,
      bevelSegments: stairControls.stepExtrudeBevelSegments,
      curveSegments: stairControls.stepExtrudeCurveSegments,
      steps: stairControls.stepExtrudeSteps,
      bevelEnabled: true,
    };
  },
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
const initGUIControls = () => {
  for (const [name, content] of Object.entries(guiSettings)) {
    //folders
    const folder = gui.addFolder(name);
    for (const [key, value] of Object.entries(content)) {
      if (value.max !== undefined && value.min !== undefined) {
        folder
          .add(stairControls, key)
          .min(value.min)
          .max(value.max)
          .step(value.step === undefined ? 1 : value.step)
          .onFinishChange(stairControls.updateStairs);
      }
    }
  }
};
initGUIControls();

const getStepMesh = () => {
  const extrudeSettings = stairControls.getStepExtrudeSettings();
  const stepShape = new THREE.Shape();

  stepShape.moveTo(0, 0);
  stepShape.lineTo(0, stairControls.stepDepth * 0.5);
  stepShape.lineTo(stairControls.stepWidth, stairControls.stepDepth * 0.5);
  stepShape.quadraticCurveTo(
    stairControls.stepDepth * 0.25,
    -stairControls.stepWidth * 0.25,
    0,
    0
  );

  const stepGeometry = new THREE.ExtrudeGeometry(stepShape, extrudeSettings);
  const stepMaterial = new THREE.MeshLambertMaterial({ color: 0x795c32 });
  const stepMesh = new THREE.Mesh(stepGeometry, stepMaterial);
  stepMesh.rotation.x = Math.PI * 0.5;

  return stepMesh;
};
//draw stairs
const stepObject = new THREE.Object3D();
stepObject.add(getStepMesh());
stepObject.position.x = 0;
stepObject.position.y = 0;

//camera
scene.position.x = 0;
scene.position.y = 0;
scene.add(stepObject);
camera.position.x = -10;
camera.position.y = 10;
camera.position.z = 10;
camera.lookAt(scene.position);

//lights
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-50, 50, -10);
spotLight.castShadow = true;
scene.add(spotLight);
scene.add(new THREE.AmbientLight('gray'));

//frame render
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  //stepObject.position.x += 0.01;
  stepObject.rotation.y += 0.01;
};
animate();
