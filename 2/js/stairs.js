//import * as THREE from './three.js';

const guiSettings = {
  stairs: {
    stairHeight: { min: 1, max: 30 },
    stairCount: { min: 2, max: 30 },
    angle: { min: -360, max: 360 },
  },
  step: {
    stepWidth: { min: 1, max: 20, step: 1 },
    stepDepth: { min: 1, max: 10, step: 0.05 },
    extrudeBevelThickness: { min: 0, max: 0.5, step: 0.05 },
    extrudeBevelSize: { min: 0, max: 1.5, step: 0.05 },
  },
  rail: {
    railRadius: { min: 0, max: 1, step: 0.05 },
    railHeight: { min: 1, max: 13, step: 1 },
  },
};

const controls = {
  //rails
  angle: 247,
  stairHeight: 18,
  stairCount: 15,
  //step
  extrudeAmount: 0,
  extrudeBevelThickness: 0.25,
  extrudeBevelSize: 0.5,
  extrudeBevelSegments: 25,
  extrudeCurveSegments: 20,
  extrudeSteps: 4,
  stepWidth: 8,
  stepDepth: 3.5,
  //rail
  railRadius: 0.7,
  railHeight: 4,
  //calculated
  stepDistance: 1,
  stepThickness: 1,
  stairRotation: 0,
  updateControls: () => {
    controls.stairRotation = math.degToRad(
      controls.angle / (controls.stairCount - 1)
    );
    const stepSizePartition =
      (controls.stairHeight / controls.stairCount) * 0.5;
    controls.stepDistance = stepSizePartition;
    controls.stepThickness = stepSizePartition;

    controls.updateStairs();
  },
  updateStairs: () => {
    stage.start();
  },
  getStepExtrudeSettings: () => {
    return {
      depth: (controls.stepThickness - controls.extrudeBevelThickness) * 0.5,
      bevelThickness: controls.extrudeBevelThickness,
      bevelSize: controls.extrudeBevelSize,
      bevelSegments: controls.extrudeBevelSegments,
      curveSegments: controls.extrudeCurveSegments,
      steps: controls.extrudeSteps,
      bevelEnabled: true,
    };
  },
};

const math = {
  degToRad: (deg) => (Math.PI / 180) * deg,
};

const stage = {
  scene: new THREE.Scene(),
  renderer: new THREE.WebGLRenderer(),
  camera: new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  ),
  stairObject: null,
  railObject: null,

  init: () => {
    stage.renderer.shadow;
    stage.renderer.setSize(window.innerWidth, window.innerHeight);
    stage.renderer.shadowMapEnabled = true;
    document.body.appendChild(stage.renderer.domElement);
    stage.scene.position.x = 0;
    stage.scene.position.y = 0;
    stage.camera.position.x = -30;
    stage.camera.position.y = 40;
    stage.camera.position.z = 30;
    stage.camera.lookAt(stage.scene.position);
    stage.scene.add(stairBuilder.getBasicBottomPlane());
    stage.light();
  },

  light: () => {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-50, 50, -10);
    spotLight.castShadow = true;
    stage.scene.add(spotLight);
    stage.scene.add(new THREE.AmbientLight('gray'));
  },

  resetStairs: () => {
    if (stage.stairObject !== null) {
      stage.scene.remove(stage.stairObject);
      stage.stairObject = null;
    }
    if (stage.railObject !== null) {
      stage.scene.remove(stage.railObject);
      stage.railObject = null;
    }
  },

  start: () => {
    stage.resetStairs();
    stage.stairObject = stairBuilder.buildStairs();
    stage.scene.add(stage.stairObject);
  },

  render: () => {
    stage.renderer.render(stage.scene, stage.camera);
  },

  update: () => {
    stage.stairObject.rotation.y += 0.01;
  },
};

//draw controls
const gui = new dat.GUI();
const initGUIControls = () => {
  for (const [name, content] of Object.entries(guiSettings)) {
    //folders
    const folder = gui.addFolder(name);
    for (const [key, value] of Object.entries(content)) {
      if (value.max !== undefined && value.min !== undefined) {
        folder
          .add(controls, key)
          .min(value.min)
          .max(value.max)
          .step(value.step === undefined ? 1 : value.step)
          .onFinishChange(controls.updateControls);
      }
    }
  }
};
initGUIControls();

const stairBuilder = {
  stepMaterial: new THREE.MeshLambertMaterial({ color: 0x795c32 }),
  railMaterial: new THREE.MeshPhongMaterial({ color: 0x57595d }),
  planeMaterial: new THREE.MeshBasicMaterial({ color: 'orange' }),

  getStepMesh: (i) => {
    const extrudeSettings = controls.getStepExtrudeSettings();
    const stepShape = new THREE.Shape();

    stepShape.moveTo(0, -controls.stepDepth * 0.5);
    stepShape.lineTo(-controls.stepWidth * 0.5, -controls.stepDepth * 0.5);
    stepShape.lineTo(-controls.stepWidth * 0.5, controls.stepDepth * 0.5);
    stepShape.quadraticCurveTo(
      1,
      1,
      controls.stepWidth * 0.5,
      -controls.stepDepth * 0.5
    );
    stepShape.lineTo(0, -controls.stepDepth * 0.5);
    const stepGeometry = new THREE.ExtrudeGeometry(stepShape, extrudeSettings);
    const stepMesh = new THREE.Mesh(stepGeometry, stairBuilder.stepMaterial);

    stepMesh.rotation.z = Math.PI * 0.5;
    stepMesh.castShadow = true;

    if (i % 2 == 0) {
      stepMesh.position.y =
        controls.stepDistance + controls.stepThickness * 0.5;
      stepMesh.rotation.x = Math.PI * 0.5;
    } else {
      stepMesh.position.y = controls.stepDistance;
      stepMesh.rotation.x = -Math.PI * 0.5;
    }

    return stepMesh;
  },

  getStepSupportGeometries: () => {
    const bottom = new THREE.CylinderGeometry(
      controls.railRadius,
      controls.railRadius,
      controls.stepDistance,
      30
    );

    const top = new THREE.CylinderGeometry(
      controls.railRadius,
      controls.railRadius,
      controls.stepThickness + controls.railRadius,
      30
    );

    const points = stairBuilder.getRailColumnPoints();
    const rail = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      10,
      controls.railRadius * 0.25,
      10,
      false
    );

    return { bottom, top, rail };
  },

  getStepSupportMeshes: () => {
    const geometries = stairBuilder.getStepSupportGeometries();

    const bottom = new THREE.Mesh(geometries.bottom, stairBuilder.railMaterial);
    bottom.castShadow = true;
    bottom.position.y = controls.stepDistance * 0.5;

    const top = new THREE.Mesh(geometries.top, stairBuilder.railMaterial);
    top.castShadow = true;
    top.position.x = controls.stepDepth * 0.5 + controls.railRadius;
    top.position.y =
      controls.stepDistance -
      controls.railRadius * 0.5 +
      (controls.stepThickness + controls.railRadius) * 0.5 -
      controls.railRadius * 0.5;

    const rail = new THREE.Mesh(geometries.rail, stairBuilder.railMaterial);

    return [bottom, top, rail];
  },

  getRailColumnPoints: () => {
    return [
      new THREE.Vector3(
        0,
        controls.stepDistance - controls.railRadius,
        -controls.stepWidth * 0.5 + 4
      ),
      new THREE.Vector3(
        0,
        controls.stepDistance - controls.railRadius * 0.25,
        -controls.stepWidth * 0.5 + 1
      ),
      new THREE.Vector3(
        0,
        controls.stepDistance - controls.railRadius * 0.25,
        -controls.stepWidth * 0.5
      ),
      new THREE.Vector3(
        0,
        controls.stepDistance - controls.railRadius * 0.25,
        -controls.stepWidth * 0.5 - controls.railRadius * 0.25 * 2
      ),
      new THREE.Vector3(
        0,
        controls.stepDistance + 1 - controls.railRadius * 0.25,
        -controls.stepWidth * 0.5 - controls.railRadius * 0.25 * 4
      ),
      new THREE.Vector3(
        0,
        controls.stepDistance + controls.railHeight,
        -controls.stepWidth * 0.5 - controls.railRadius * 0.25 * 4
      ),
    ];
  },

  getBasicBottomPlane: () => {
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;

    return plane;
  },

  getPlaneMesh: (isBottom) => {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(controls.stepDepth * 3, controls.stepDepth * 3),
      stairBuilder.planeMaterial
    );
    const y = isBottom
      ? 0
      : 0.01 +
        (controls.stepThickness + controls.railRadius) * 0.5 +
        controls.stepDistance -
        controls.railRadius * 0.5 +
        (controls.stepThickness + controls.railRadius) * 0.5 -
        controls.railRadius * 0.5;

    let x = controls.stepDepth * 2 + controls.railRadius;
    if (isBottom) {
      x = -x + controls.stepDepth * 0.15;
    }
    plane.position.x = x;
    plane.position.y = y;
    plane.rotation.x = -0.5 * Math.PI;

    return plane;
  },

  getNextStep: (x, z, i) => {
    const stepMesh = stairBuilder.getStepMesh(i);
    const step = (lastStep = new THREE.Object3D());
    const support = stairBuilder.getStepSupportMeshes();
    step.add(stepMesh);
    support.forEach((s) => step.add(s));

    step.position.x = x;
    step.position.z = z;
    step.position.y = i * (controls.stepThickness + controls.stepDistance);
    step.rotation.y = controls.stairRotation * i;

    return step;
  },

  getRailHandleVector: (x, z, i) => {
    const railX =
      x +
      (controls.stepWidth * 0.5 + controls.railRadius * 0.25 * 4) *
        Math.sin(-1 * controls.stairRotation * i);
    const railY =
      i * (controls.stepThickness + controls.stepDistance) +
      controls.railHeight +
      controls.stepDistance;
    const railZ =
      z +
      -1 *
        (controls.stepWidth * 0.5 + controls.railRadius * 0.25 * 4) *
        Math.cos(-controls.stairRotation * i);

    return new THREE.Vector3(railX, railY, railZ);
  },

  getNextCoords: (x, z, i) => {
    x +=
      (controls.stepDepth * 0.5 + controls.railRadius) *
      Math.cos(-controls.stairRotation * i);
    z +=
      (controls.stepDepth * 0.5 + controls.railRadius) *
      Math.sin(-controls.stairRotation * i);
    return { x, z };
  },

  getRailHandleMesh: (handleVectors) => {
    const handleGeometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(handleVectors),
      100,
      controls.railRadius * 0.25,
      30,
      false
    );
    const handleMesh = new THREE.Mesh(
      handleGeometry,
      stairBuilder.railMaterial
    );

    return handleMesh;
  },

  buildStairs: () => {
    const stairObject = new THREE.Object3D();
    const steps = [];
    let x = 0;
    let z = 0;
    const handleVectors = [stairBuilder.getRailHandleVector(-0.25, -0.25, 0)];
    for (let i = 0; i < controls.stairCount; i++) {
      const step = stairBuilder.getNextStep(x, z, i);
      steps.push(step);
      const railVector = stairBuilder.getRailHandleVector(x, z, i);
      handleVectors.push(railVector);
      stairObject.add(step);
      ({ x, z } = stairBuilder.getNextCoords(x, z, i));
    }
    //add last one
    handleVectors.push(
      stairBuilder.getRailHandleVector(x, z, controls.stairCount)
    );

    const first = steps[0];
    const last = steps[steps.length - 1];

    const secondPlane = stairBuilder.getPlaneMesh();
    //const firstPlane = stairBuilder.getPlaneMesh(true);
    last.add(secondPlane);
    //first.add(firstPlane);

    const handleMesh = stairBuilder.getRailHandleMesh(handleVectors);
    stairObject.add(handleMesh);

    return stairObject;
  },
};

stage.init();
controls.updateControls();

//frame render
const animate = () => {
  requestAnimationFrame(animate);
  stage.render();
  stage.update();
};
animate();
