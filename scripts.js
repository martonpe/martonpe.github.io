var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// const dirLight = new THREE.DirectionalLight(0xffffff);
// dirLight.position.set(-3, 10, -10);
// dirLight.castShadow = true;
// dirLight.shadow.camera.top = 2;
// dirLight.shadow.camera.bottom = -2;
// dirLight.shadow.camera.left = -2;
// dirLight.shadow.camera.right = 2;
// dirLight.shadow.camera.near = 0.1;
// dirLight.shadow.camera.far = 40;
// scene.add(dirLight);

var column, earth;
const loader = new THREE.GLTFLoader();

loader.load("column.glb", function (gltf) {
  column = gltf.scene;

  column.scale.set(10, 10, 10);

  column.position.x = 5;
  column.position.y = -1.5;
  column.position.z = 1;

  scene.add(column);
});

var earthBaseTexture, earthNormalTexture, earthMaterial;
const textureLoader = new THREE.TextureLoader();
textureLoader.load("base_color.jpeg", function (baseTexture) {
  earthBaseTexture = baseTexture;
  earthBaseTexture.wrapT = THREE.RepeatWrapping;
  earthBaseTexture.repeat.y = 1;

  earthMaterial = new THREE.MeshPhongMaterial({
    map: baseTexture,
  });
});

loader.load("hole_earth.glb", function (gltf) {
  earth = gltf.scene;

  earth.traverse(function (object) {
    if (object.isMesh) object.material = earthMaterial;
  });

  earth.scale.set(0.5, 0.5, 0.5);

  earth.rotation.y = -1;
  earth.position.x = -2;

  scene.add(earth);
});

camera.position.z = 5;

var t = 0;

var animate = function () {
  requestAnimationFrame(animate);

  column.rotation.y += 0.01;

  // earth.rotation.y += 0.001;
  earthBaseTexture.offset.y += -0.002;

  t += 0.01;

  // camera.position.x = 10 * Math.cos(t) + 0;
  // camera.position.z = 10 * Math.sin(t) + 0;
  // camera.position.y = 2 * Math.sin(t / 4) + 0;
  // camera.rotation.y = -t + 1;

  // TODO: add head model
  // TODO: scroll to move camera and show other model
  // TODO: add speed up and sound on earth click
  // TODO: add sounds and eye pop to head model
  // TODO: add portfolio videos (to end of scroll)
  // TODO: add link to portfolio

  renderer.render(scene, camera);
};

animate();
