$(function () {
  let renderer;
  let scene;
  let camera1;
  let camera2;
  let camera3;
  let camObject;
  let camObject2;

  scene = new THREE.Scene();

  camera1 = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera1.position.x = 40;
  camera1.position.y = 40;
  camera1.position.z = 40;
  camera1.lookAt(new THREE.Vector3(0, 8, 0));

  camera2 = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera2.position.x = 2;
  camera2.position.y = 3;
  camera2.position.z = 16;
  camera2.lookAt(new THREE.Vector3(2, 3, 4));

  camera3 = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera3.position.x = 0;
  camera3.position.y = 12;
  camera3.position.z = 0;
  camera3.lookAt(new THREE.Vector3(0, 8, 0));

  const direction = new THREE.Vector3();
  direction.subVectors(camera2.position, new THREE.Vector3(2, 3, 4));
  const scale =
    Math.tan((camera2.fov * (Math.PI / 180)) / 2) * direction.length();

  //Renderer, lights
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor('#87ceeb', 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;
  const spotLight = new THREE.SpotLight();
  spotLight.position.set(0, 20, 15);
  spotLight.castShadow = true;
  const ambientLight = new THREE.AmbientLight('#505050');
  scene.add(spotLight);
  scene.add(ambientLight);

  document.body.appendChild(renderer.domElement);

  const cameraObject1 = new THREE.Object3D();
  const cameraObject2 = new THREE.Object3D();
  const cam1Axes = new THREE.AxisHelper(60);
  const cam2Axes = new THREE.AxisHelper(60);
  cameraObject1.add(cam1Axes);
  cameraObject1.rotation.y = Math.PI;
  cameraObject2.add(cam2Axes);
  cameraObject2.rotation.y = Math.PI;
  camObject = new THREE.Object3D();
  camObject.add(cameraObject1);
  camObject.scale.set(0.1, 0.1, 0.1);
  camObject.position.y = 12;
  scene.add(camObject);
  camObject2 = new THREE.Object3D();
  camObject2.add(cameraObject2);
  camObject2.scale.set(0.1, 0.1, 0.1);
  camObject2.position.x = 2;
  camObject2.position.y = 3;
  camObject2.position.z = 16;
  camObject2.rotation.y = Math.PI;
  scene.add(camObject2);

  createBoard();
  const moving = createQueen();
  const stationary = createQueen();
  stationary.name = 'static';
  moving.name = 'moving';
  stationary.position.x = 2;
  stationary.position.z = 4;
  scene.add(moving);
  scene.add(stationary);

  const controls = new (function () {
    this.activeCamera = camera1;
    this.cam1 = function () {
      this.activeCamera = camera1;
    };
    this.cam2 = function () {
      this.activeCamera = camera2;
    };
    this.cam3 = function () {
      this.activeCamera = camera3;
    };
    this.showMoving = function () {
      const movingQueen = scene.getObjectByName('moving');
      movingQueen.traverse(function (o) {
        o.visible = !o.visible;
      });
    };
    this.showStatic = function () {
      const staticQueen = scene.getObjectByName('static');
      staticQueen.traverse(function (o) {
        o.visible = !o.visible;
      });
    };
    this.FOV = 45;
    this.DollyZoomAmount = 20;
  })();

  var gui = new dat.GUI();
  gui.add(controls, 'cam1');
  gui.add(controls, 'cam2');
  gui.add(controls, 'cam3');
  gui.add(controls, 'showMoving');
  gui.add(controls, 'showStatic');
  gui.add(controls, 'FOV', 0, 180);
  gui.add(controls, 'DollyZoomAmount', 6, 30);

  render();

  function createQueen() {
    points = [
      new THREE.Vector3(0, 20.8, 0),
      new THREE.Vector3(1.5, 19.8, 0),
      new THREE.Vector3(1.5, 17.8, 0),
      new THREE.Vector3(1, 18.6, 0),
      new THREE.Vector3(5, 17.8, 0),
      new THREE.Vector3(3.2, 13.1, 0),
      new THREE.Vector3(3.2, 12.8, 0),
      new THREE.Vector3(3.5, 12.4, 0),
      new THREE.Vector3(3.6, 12.3, 0),
      new THREE.Vector3(3.6, 12.1, 0),
      new THREE.Vector3(3.5, 12, 0),
      new THREE.Vector3(3.8, 11.6, 0),
      new THREE.Vector3(4, 11.4, 0),
      new THREE.Vector3(4, 11.1, 0),
      new THREE.Vector3(3.8, 10.9, 0),
      new THREE.Vector3(4.2, -1.2, 0),
      new THREE.Vector3(7.6, -9.2, 0),
      new THREE.Vector3(7.7, -9.2, 0),
      new THREE.Vector3(7.6, -10.2, 0),
      new THREE.Vector3(8.1, -11.4, 0),
      new THREE.Vector3(8.8, -12.6, 0),
      new THREE.Vector3(9, -13.8, 0),
      new THREE.Vector3(7.8, -15, 0),
      new THREE.Vector3(7.8, -16.2, 0),
      new THREE.Vector3(7.7, -17.4, 0),
      new THREE.Vector3(0, -17.4, 0),
    ];

    const queenGeometry = new THREE.LatheGeometry(points, 20, 0, 2 * Math.PI);
    const queenMaterial = new THREE.MeshPhongMaterial({
      color: 0x202020,
      side: THREE.BackSide,
    });
    const queenMesh = new THREE.Mesh(queenGeometry, queenMaterial);
    queenMesh.castShadow = true;
    queenMesh.scale.x = 0.1;
    queenMesh.scale.y = 0.1;
    queenMesh.scale.z = 0.1;
    queenMesh.position.y = 1.75;

    return queenMesh;
  }

  var step = 0;
  function update() {
    camera1.fov = controls.FOV;
    camera1.aspect = window.innerWidth / window.innerHeight;
    camera1.updateProjectionMatrix();
    const movingQueen = scene.getObjectByName('moving');
    camera3.lookAt(movingQueen.position);
    renderer.render(scene, controls.activeCamera);
    camObject.lookAt(movingQueen.position);
    step += 0.01;
    movingQueen.position.x = 10 * Math.cos(step);
    camera3.position.z = 0.5 * Math.sin(step);
    camObject.position.z = 0.5 * Math.sin(step);
    if (movingQueen.position.x > 0) {
      camObject.rotation.z += Math.PI;
    }
    camObject2.position.z = controls.DollyZoomAmount;
    camera2.position.z = controls.DollyZoomAmount;
    const direction = new THREE.Vector3();
    direction.subVectors(camera2.position, new THREE.Vector3(2, 3, 4));
    camera2.fov = (180 / Math.PI) * 2 * Math.atan(scale / direction.length());
    camera2.updateProjectionMatrix();
  }

  function render() {
    update();
    requestAnimationFrame(render);
  }

  function createBoard() {
    const board = new THREE.Object3D();
    const boardSettings = {
      size: 4,
      geometry: new THREE.BoxGeometry(4, 4, 4),
      black: new THREE.MeshLambertMaterial({ color: 'black' }),
      white: new THREE.MeshLambertMaterial({
        color: 'white',
      }),
      offsetX: -10,
      offsetY: -2,
      offsetZ: -12,
    };

    let white = true;
    for (i = 0; i < 8; i++) {
      for (j = 0; j < 8; j++) {
        let block = white
          ? new THREE.Mesh(boardSettings.geometry, boardSettings.black)
          : new THREE.Mesh(boardSettings.geometry, boardSettings.white);
        white = !white;
        block.receiveShadow = true;
        block.castShadow = true;
        block.rotation.x = Math.PI;
        block.position.x = j * boardSettings.size;
        block.position.y = 0;
        block.position.z = i * boardSettings.size;
        board.add(block);
      }
      white = !white;
    }
    board.position.y = boardSettings.offsetY;
    board.position.x = boardSettings.offsetX;
    board.position.z = boardSettings.offsetZ;
    scene.add(board);
  }
});
