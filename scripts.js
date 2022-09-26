let scene, camera, renderer, earth, column, earthBaseTexture;

init().catch(function (err) {
  console.error(err);
});

async function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const gltfLoader = new THREE.GLTFLoader();
  const textureLoader = new THREE.TextureLoader();

  const [columnGLTF, earthGLTF, earthTexture] = await Promise.all([
    gltfLoader.loadAsync("column.glb"),
    gltfLoader.loadAsync("hole_earth.glb"),
    textureLoader.loadAsync("base_color.jpeg"),
  ]);

  // Column
  column = columnGLTF.scene;

  column.scale.set(10, 10, 10);

  column.position.x = 5;
  column.position.y = -1.5;
  column.position.z = 1;

  scene.add(column);

  // Earth material
  earthTexture.wrapT = THREE.RepeatWrapping;
  earthTexture.repeat.y = 1;

  earthBaseTexture = earthTexture;

  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthBaseTexture,
  });

  // Earth
  earth = earthGLTF.scene;

  earth.traverse(function (object) {
    if (object.isMesh) object.material = earthMaterial;
  });

  earth.scale.set(0.5, 0.5, 0.5);

  earth.rotation.y = -1;
  earth.position.x = -2;

  scene.add(earth);

  // Camera
  camera.position.z = 5;

  animate();
}

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
