let scene,
  camera,
  renderer,
  clock,
  mixer,
  controls,
  earth,
  earthBaseTexture,
  totem,
  totemBaseTexture,
  moveForward;

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
  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const gltfLoader = new THREE.GLTFLoader();
  const textureLoader = new THREE.TextureLoader();

  const [earthGLTF, earthTexture, totemGLTF, totemTexture] = await Promise.all([
    gltfLoader.loadAsync("hole_earth.glb"),
    textureLoader.loadAsync("base_color.jpeg"),
    gltfLoader.loadAsync("totem.glb"),
    textureLoader.loadAsync("pattern.jpg"),
  ]);

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

  earth.position.x = 0;
  earth.position.z = -30;

  scene.add(earth);

  // Totem
  totem = totemGLTF.scene;

  totemBaseTexture = totemTexture;
  totemTexture.wrapT = THREE.RepeatWrapping;
  totemTexture.wrapS = THREE.RepeatWrapping;
  totemTexture.repeat.y = 10;
  totemTexture.repeat.x = 10;

  const totemMaterial = new THREE.MeshPhysicalMaterial({
    map: totemTexture,
  });

  totem.traverse(function (object) {
    if (object.isMesh) object.material = totemMaterial;
  });

  totem.scale.set(40, 40, 40);

  totem.position.y = -30;
  totem.position.z = -50;

  totem.visible = false;

  mixer = new THREE.AnimationMixer(totem);

  totemGLTF.animations.forEach((clip) => {
    mixer.clipAction(clip).play();
    console.log(clip);
  });

  scene.add(totem);

  // Video link

  video = document.getElementById("dream-video");
  const texture = new THREE.VideoTexture(video);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshPhongMaterial({ map: texture })
  );
  mesh.position.z = -300;
  // scene.add(mesh);

  // Controls
  controls = new THREE.PointerLockControls(camera, renderer.domElement);

  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  instructions.addEventListener("click", function () {
    controls.lock();
  });

  controls.addEventListener("lock", function () {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });

  controls.addEventListener("unlock", function () {
    blocker.style.display = "block";
    instructions.style.display = "";
  });

  const onKeyDown = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  scene.add(controls.getObject());

  window.addEventListener("resize", onWindowResize, false);

  animate();
}

var t = 0;
var cameraSpeed = 5;
var animate = function () {
  requestAnimationFrame(animate);

  var delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  earthBaseTexture.offset.y += -0.00001 * t;

  totemBaseTexture.offset.y += -0.001;

  if (moveForward) t += 1;

  earth.rotation.y = lerp(0, -1.5, t / 500);
  earth.rotation.z = lerp(1.5, 0, t / 500);

  if (t > 610) {
    camera.position.x = 20 * Math.sin(0.01 * t) + 0;
    camera.position.y = 20 * Math.sin((0.01 * t) / 4) + 0;
    totem.visible = true;
    cameraSpeed = 15;
  }

  camera.position.z = -cameraSpeed * t * 0.01;

  console.log(t);

  // TODO: add portfolio videos page
  // TODO: add link to portfolio videos page (to end of scroll)
  // TODO: add sounds
  // TODO: add click effects

  renderer.render(scene, camera);
};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}
