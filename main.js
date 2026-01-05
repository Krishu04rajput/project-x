import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 10, 80);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 🔦 LIGHTS
scene.add(new THREE.AmbientLight(0x404040, 0.6));

const moon = new THREE.DirectionalLight(0x99bbff, 0.8);
moon.position.set(5, 15, 5);
scene.add(moon);

// 🌍 GROUND
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(300, 300),
  new THREE.MeshStandardMaterial({ color: 0x0d0d0d })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// 📦 LOADER
const loader = new GLTFLoader();

// ===== ASSETS =====

// 🚗 ABANDONED CAR
loader.load(
  "https://drive.google.com/uc?export=download&id=1lfeR5Kvy6W8hrkCPrXSJxic5wi7_8pRr",
  g => {
    const car = g.scene;
    car.position.set(8, 0, -12);
    car.scale.set(1.2, 1.2, 1.2);
    scene.add(car);
  }
);

// 🧟 BOSS
let boss;
loader.load(
  "https://drive.google.com/uc?export=download&id=1mhqqAdJe69ZKpJ6A5HVzCQZOboYP1hP7",
  g => {
    boss = g.scene;
    boss.position.set(0, 0, -30);
    boss.scale.set(1.6, 1.6, 1.6);
    scene.add(boss);
  }
);

// 🪑 BLOODY CHAIR (ENV STORY)
loader.load(
  "https://drive.google.com/uc?export=download&id=1rbQkUzzYflaVjpC-1m6IalQXz_ICEqIp",
  g => {
    const chair = g.scene;
    chair.position.set(-6, 0, -8);
    scene.add(chair);
  }
);

// 🚪 DOOR (PUZZLE)
loader.load(
  "https://drive.google.com/uc?export=download&id=1-PNoDQeNULzriAlXYy6sf7hasfxz8At0",
  g => {
    const door = g.scene;
    door.position.set(0, 0, -5);
    scene.add(door);
  }
);

// 💡 LAMP
loader.load(
  "https://drive.google.com/uc?export=download&id=1zIlHrCaIA_xitzNJBDZyzNLbqva9cvH-",
  g => {
    const lamp = g.scene;
    lamp.position.set(3, 0, -6);
    scene.add(lamp);
  }
);

// 🎥 GAME LOOP
function animate() {
  requestAnimationFrame(animate);

  // Simple boss idle movement (for now)
  if (boss) {
    boss.rotation.y += 0.003;
  }

  renderer.render(scene, camera);
}

animate();
