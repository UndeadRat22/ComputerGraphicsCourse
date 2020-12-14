$(function () {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor('gray', 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.x = -40;
  camera.position.y = 40;
  camera.position.z = 40;

  function getCylinderPoints(height, radius, pointCount) {
    const points = [];

    for (let i = 0; i < pointCount; i++) {
      const phi = Math.random() * 2 * Math.PI;
      const r = Math.sqrt(radius * radius * Math.random());

      const x = r * Math.cos(phi);
      const y = Math.random() * height - height / 2;
      const z = r * Math.sin(phi);

      points.push(new THREE.Vector3(x, y, z));
    }

    return points;
  }

  function createPoints(points) {
    const pointSpheres = new THREE.Object3D();
    const material = new THREE.MeshBasicMaterial({ color: 'red' });
    points.forEach(function (point) {
      const geometry = new THREE.SphereGeometry(0.2);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position = point;
      pointSpheres.add(mesh);
    });

    return pointSpheres;
  }

  function createCylinderMesh(points) {
    const convexGeometry = new THREE.ConvexGeometry(points);
    const meshMaterial = new THREE.MeshBasicMaterial();
    meshMaterial.map = texture;

    const wireFrameMat = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 'green',
    });

    const mesh = THREE.SceneUtils.createMultiMaterialObject(convexGeometry, [
      meshMaterial,
      wireFrameMat,
    ]);
    generateWrapper(mesh);
    return mesh;
  }

  function generateWrapper(mesh) {
    geometry = mesh.children[0].geometry;

    geometry.faceVertexUvs[0].forEach((uvFace, faceIdx) => {
      const face = geometry.faces[faceIdx];
      const vertexIndex = [face.a, face.b, face.c];
      const phis = [];
      const uvs = [];

      vertexIndex.forEach((idx, i) => {
        const vertex = geometry.vertices[idx];
        const uv = uvFace[i];
        uvs.push(uv);
        const phi = Math.atan2(vertex.z, vertex.x);
        if (vertex.x < 0) phis.push(phi);

        //u
        uvFace[i].x = (phi + Math.PI) / (2 * Math.PI);
        //v
        uvFace[i].y = (vertex.y + controls.height / 2) / controls.height;
      });

      if (phis.length == 3) {
        const posCount = phis.filter((phi) => phi >= 0).length;

        if (posCount == 2) {
          phis.forEach((phi, i) => {
            if (phi < 0) {
              uvs[i].x += 1;
            }
          });
        } else if (posCount == 1) {
          phis.forEach((phi, i) => {
            if (phi > 0) {
              uvs[i].x -= 1;
            }
          });
        }
      }
    });
  }
  function loadWTextureWithWrapping() {
    const texture = THREE.ImageUtils.loadTexture('texture.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    return texture;
  }

  function drawCylinder() {
    points = getCylinderPoints(
      controls.height,
      controls.radius,
      controls.pointCount
    );
    renderedPoints = createPoints(points);
    cylinderMesh = createCylinderMesh(points);
  }

  var controls = new (function () {
    this.pointCount = 500;
    this.height = 30;
    this.radius = 10;
  })();
  const gui = new dat.GUI();

  const folder = gui.addFolder('Controls');
  {
    folder
      .add(controls, 'pointCount', 100, 2000)
      .step(50)
      .name('Point Count')
      .onChange(function () {
        drawCylinder();
      });
    folder
      .add(controls, 'radius', 5, 20)
      .step(1)
      .name('Radius')
      .onChange(function () {
        drawCylinder();
      });
    folder
      .add(controls, 'height', 10, 50)
      .step(1)
      .name('Height')
      .onChange(function () {
        drawCylinder();
      });
  }
  const texture = loadWTextureWithWrapping();

  drawCylinder();

  $('#WebGL-output').append(renderer.domElement);
  const trackballControls = new THREE.TrackballControls(
    camera,
    renderer.domElement
  );

  const objs = new THREE.Object3D();
  scene.add(objs);

  (function render() {
    objs.remove(...objs.children);
    objs.add(renderedPoints);
    objs.add(cylinderMesh);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
    trackballControls.update();
  })();
});
