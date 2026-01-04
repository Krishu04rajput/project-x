// ================= SETUP =================
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 10, 60);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 1.7, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

// ================= LIGHT =================
scene.add(new THREE.AmbientLight(0x404040, 0.5));
const moon = new THREE.DirectionalLight(0xffffff, 0.4);
moon.position.set(10, 20, 10);
scene.add(moon);

// ================= FLOOR =================
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// ================= WALLS =================
const wallMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
for (let i = -30; i <= 30; i += 10) {
  const wall = new THREE.Mesh(new THREE.BoxGeometry(3, 5, 20), wallMat);
  wall.position.set(i, 2.5, -25);
  scene.add(wall);
}

// ================= FLASHLIGHT =================
const flashlight = new THREE.SpotLight(0xffffff, 4, 30, Math.PI / 6, 0.5);
camera.add(flashlight);
const flashlightTarget = new THREE.Object3D();
flashlightTarget.position.set(0, 0, -1);
camera.add(flashlightTarget);
flashlight.target = flashlightTarget;
scene.add(camera);

let flashlightOn = true;

// ================= CONTROLS =================
const keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

document.body.addEventListener("click", () => document.body.requestPointerLock());

let yaw = 0, pitch = 0;
document.addEventListener("mousemove", e => {
  if (document.pointerLockElement === document.body) {
    yaw -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
    camera.rotation.set(pitch, yaw, 0);
  }
});

// ================= SANITY =================
let sanity = 100;
const sanityUI = document.getElementById("sanity");

function updateSanity() {
  sanity -= flashlightOn ? 0.01 : 0.05;
  sanity = Math.max(0, sanity);
  sanityUI.textContent = "SANITY: " + Math.floor(sanity);

  if (sanity < 40) camera.rotation.z = Math.sin(Date.now() * 0.002) * 0.02;
}

// ================= MONSTER =================
const monster = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 3, 1.5),
  new THREE.MeshStandardMaterial({ color: 0x550000 })
);
monster.position.set(0, 1.5, -40);
scene.add(monster);

function monsterAI() {
  const distance = monster.position.distanceTo(camera.position);
  if (sanity < 60 && distance > 3) {
    monster.position.lerp(camera.position, 0.002);
  }
  if (distance < 2) endGame();
}

// ================= DOOR =================
const door = new THREE.Mesh(
  new THREE.BoxGeometry(2, 4, 0.3),
  new THREE.MeshStandardMaterial({ color: 0x663300 })
);
door.position.set(5, 2, -10);
scene.add(door);

let doorOpen = false;

// ================= STORY NOTE =================
const note = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 1),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
note.position.set(-5, 2, -10);
scene.add(note);

// ================= INTERACT =================
document.addEventListener("keydown", e => {
  if (e.key === "e") {
    if (camera.position.distanceTo(door.position) < 3) {
      door.rotation.y = Math.PI / 2;
      doorOpen = true;
    }
    if (camera.position.distanceTo(note.position) < 3) {
      alert("NOTE: You were never alone.");
      sanity -= 20;
    }
  }
  if (e.key === "f") {
    flashlightOn = !flashlightOn;
    flashlight.visible = flashlightOn;
  }
});

// ================= ENDING =================
function endGame() {
  alert("THE DARKNESS TOOK YOU.");
  location.reload();
}

// ================= LOOP =================
function animate() {
  requestAnimationFrame(animate);

  const speed = 0.1;
  if (keys.w) camera.translateZ(-speed);
  if (keys.s) camera.translateZ(speed);
  if (keys.a) camera.translateX(-speed);
  if (keys.d) camera.translateX(speed);

  updateSanity();
  monsterAI();

  renderer.render(scene, camera);
}
animate();

// ================= RESIZE =================
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
