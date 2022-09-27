let scene,
  camera,
  renderer,
  controls,
  raycaster,
  mouse,
  earth,
  earthBaseTexture,
  totem,
  totemBaseTexture,
  text,
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

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  const gltfLoader = new THREE.GLTFLoader();
  const textureLoader = new THREE.TextureLoader();
  const fontLoader = new THREE.FontLoader();

  const [earthGLTF, earthTexture, totemGLTF, totemTexture, font] =
    await Promise.all([
      gltfLoader.loadAsync("hole_earth.glb"),
      textureLoader.loadAsync("base_color.jpeg"),
      gltfLoader.loadAsync("totem.glb"),
      textureLoader.loadAsync("pattern.jpg"),
      fontLoader.loadAsync("helvetiker_regular.typeface.json"),
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

  scene.add(totem);

  // Video link
  const textGeometry = new THREE.TextGeometry("Click me!", {
    font: font,
    size: 30,
    height: 5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: 1.5,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  text = new THREE.Mesh(
    textGeometry,
    new THREE.MeshPhongMaterial({ color: 0xbbbbbb })
  );
  text.position.z = -340;
  text.position.y = -20;
  text.position.x = -92;
  text.visible = false;
  scene.add(text);

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

  renderer.domElement.addEventListener("click", onClick, false);
  window.addEventListener("mousemove", onPointerMove, false);

  animate();
}

function onClick() {
  event.preventDefault();

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObject(scene, true);

  if (intersects.length > 0 && intersects[0].object === text) {
    window.location.href = "/videos.html";
  }
}

function onPointerMove() {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function hoverLink() {
  text.material.color.set(0xbbbbbb);
  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObject(scene, true);

  if (intersects.length > 0 && intersects[0].object === text) {
    text.material.color.set(0x00ffff);
  }
}

var t = 1840;
var cameraSpeed = 5;
function animate() {
  requestAnimationFrame(animate);

  earthBaseTexture.offset.y += -0.00001 * t;

  totemBaseTexture.offset.y += -0.001;

  if (moveForward) t += 1;

  earth.rotation.y = lerp(0, -1.5, t / 500);
  earth.rotation.z = lerp(1.5, 0, t / 500);

  if (t > 600) {
    camera.position.x = 20 * Math.sin(0.01 * t) + 0;
    camera.position.y = 20 * Math.sin((0.01 * t) / 4) + 0;
    totem.visible = true;
    text.visible = true;
    cameraSpeed = 15;
  }

  camera.position.z = -cameraSpeed * t * 0.01;

  console.log(t);

  if (t > 1830) {
    hoverLink();
  }

  // TODO: add sounds:
  // suck sound louder till 600
  // suck sound at 600
  // ear ringing from 600
  // don't stop now, keep going from 1200
  // click it, click the link from 1840

  // TODO: add click effects

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}
