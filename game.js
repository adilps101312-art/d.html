import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 35, 110);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

camera.position.set(0, 6, 11);
camera.lookAt(0, 1, -10);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// LIGHTS
scene.add(new THREE.HemisphereLight(0xffffff, 0x555566, 2));

const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(-5, 12, 8);
sun.castShadow = true;
scene.add(sun);

// MATERIALS
const mat = {
  ground: new THREE.MeshStandardMaterial({ color: 0x333943 }),
  rail: new THREE.MeshStandardMaterial({
    color: 0xc5cbd1,
    metalness: 0.8,
    roughness: 0.25
  }),
  wood: new THREE.MeshStandardMaterial({ color: 0x65452e }),
  yellow: new THREE.MeshStandardMaterial({ color: 0xffc928 }),
  red: new THREE.MeshStandardMaterial({ color: 0xd92332 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x1766d1 }),
  skin: new THREE.MeshStandardMaterial({ color: 0xffd0a0 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x182b50 })
};

function makeBox(w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  return mesh;
}

// GROUND
makeBox(12, 0.5, 160, mat.ground, 0, -0.35, -55);

// RAILS
for (const x of [-2, 0, 2]) {
  makeBox(0.09, 0.12, 160, mat.rail, x - 0.65, 0.05, -55);
  makeBox(0.09, 0.12, 160, mat.rail, x + 0.65, 0.05, -55);
}

// SLEEPERS
const sleepers = [];

for (let i = 0; i < 45; i++) {
  sleepers.push(
    makeBox(8, 0.15, 0.35, mat.wood, 0, -0.03, -i * 3)
  );
}

// BUILDINGS
const buildings = [];

for (let i = 0; i < 18; i++) {
  const height = 4 + Math.random() * 8;

  for (const x of [-9, 9]) {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(
        Math.random() * 0.15 + 0.52,
        0.45,
        0.45
      )
    });

    buildings.push(
      makeBox(4, height, 5, material, x, height / 2 - 0.2, -i * 8 - 10)
    );
  }
}

// PLAYER
const player = new THREE.Group();
scene.add(player);

const body = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 1, 0.45),
  mat.yellow
);
body.position.y = 1.15;
player.add(body);

const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.36, 20, 20),
  mat.skin
);
head.position.y = 1.95;
player.add(head);

const hair = new THREE.Mesh(
  new THREE.SphereGeometry(0.37, 16, 12, 0, Math.PI * 2, 0, 1.3),
  mat.dark
);
hair.position.y = 2.06;
player.add(hair);

for (const x of [-0.12, 0.12]) {
  const eye = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0x111111 })
  );

  eye.position.set(x, 1.98, 0.32);
  player.add(eye);
}

const legs = [];
const arms = [];

for (const x of [-0.22, 0.22]) {
  const leg = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.65, 0.25),
    mat.blue
  );

  leg.position.set(x, 0.32, 0);
  player.add(leg);
  legs.push(leg);

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.65, 0.2),
    mat.skin
  );

  arm.position.set(x * 2.5, 1.2, 0);
  player.add(arm);
  arms.push(arm);
}

player.position.set(0, 0, 3);

// ROCKET TOY HELD BY PLAYER
const rocketHeld = new THREE.Group();
rocketHeld.position.set(0.58, 1.15, 0.18);
rocketHeld.rotation.z = -0.35;
player.add(rocketHeld);

const heldRocketBody = new THREE.Mesh(
  new THREE.CylinderGeometry(0.12, 0.16, 0.62, 16),
  new THREE.MeshStandardMaterial({
    color: 0xe8f2ff,
    metalness: 0.35,
    roughness: 0.3
  })
);
rocketHeld.add(heldRocketBody);

const heldRocketNose = new THREE.Mesh(
  new THREE.ConeGeometry(0.16, 0.32, 16),
  new THREE.MeshStandardMaterial({ color: 0xe53935, metalness: 0.25 })
);
heldRocketNose.position.y = 0.47;
rocketHeld.add(heldRocketNose);

const heldRocketBand = new THREE.Mesh(
  new THREE.CylinderGeometry(0.165, 0.165, 0.12, 16),
  new THREE.MeshStandardMaterial({ color: 0x1976d2, metalness: 0.3 })
);
heldRocketBand.position.y = -0.08;
rocketHeld.add(heldRocketBand);

for (const side of [-1, 1]) {
  const fin = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.25, 0.07),
    new THREE.MeshStandardMaterial({ color: 0xe53935 })
  );
  fin.position.set(side * 0.16, -0.22, 0);
  rocketHeld.add(fin);
}

const heldRocketFlame = new THREE.Mesh(
  new THREE.ConeGeometry(0.09, 0.25, 12),
  new THREE.MeshStandardMaterial({
    color: 0xff9800,
    emissive: 0x662200
  })
);
heldRocketFlame.position.y = -0.42;
heldRocketFlame.rotation.z = Math.PI;
rocketHeld.add(heldRocketFlame);

rocketHeld.visible = false;

// GAME VARIABLES
const lanes = [-2, 0, 2];

let lane = 1;
let score = 0;
let coins = 0;
let speed = 16;
let running = false;
let jumpY = 0;
let velocityY = 0;
let sliding = false;
let slideTime = 0;
let spawnTime = 0;

const objects = [];

const scoreText = document.getElementById("score");
const coinText = document.getElementById("coins");
const giftText = document.getElementById("giftBoxes");
const rocketText = document.getElementById("rocketCount");
const rocketStatus = document.getElementById("rocketStatus");

let giftBoxes = 0;
let rocketCount = 0;
// CREATE COIN
function spawnCoin(x, z) {
  const group = new THREE.Group();

  const coin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.1, 32),
    new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x553300
    })
  );

  coin.rotation.x = Math.PI / 2;
  group.add(coin);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.035, 8, 24),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );

  ring.position.z = 0.06;
  group.add(ring);

  group.position.set(x, 1.1, z);
  group.userData.type = "coin";

  scene.add(group);
  objects.push(group);
}

// CREATE GIFT BOX
function spawnGiftBox(x, z) {
  const group = new THREE.Group();

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    new THREE.MeshStandardMaterial({
      color: 0xff35a8,
      metalness: 0.2,
      roughness: 0.35
    })
  );

  group.add(box);

  const ribbonMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.6
  });

  const ribbon1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.8, 0.78),
    ribbonMaterial
  );

  const ribbon2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 0.8, 0.16),
    ribbonMaterial
  );

  group.add(ribbon1, ribbon2);

  const bow1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.17, 0.045, 8, 16),
    ribbonMaterial
  );

  bow1.position.set(-0.12, 0.48, 0);
  bow1.rotation.y = Math.PI / 2;
  group.add(bow1);

  const bow2 = bow1.clone();
  bow2.position.x = 0.12;
  bow2.rotation.y = -Math.PI / 2;
  group.add(bow2);

  group.position.set(x, 0.85, z);
  group.userData.type = "gift";

  scene.add(group);
  objects.push(group);
}

// CREATE ROCKET TOY
function spawnRocketToy(x, z) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.2, 0.75, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.3
    })
  );

  group.add(body);

  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.2, 0.35, 16),
    new THREE.MeshStandardMaterial({ color: 0xe53935 })
  );

  nose.position.y = 0.55;
  group.add(nose);

  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(0.205, 0.205, 0.12, 16),
    new THREE.MeshStandardMaterial({ color: 0x1976d2 })
  );

  band.position.y = -0.12;
  group.add(band);

  for (const side of [-1, 1]) {
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.25, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xff3333 })
    );

    fin.position.set(side * 0.2, -0.25, 0);
    group.add(fin);
  }

  group.position.set(x, 1.1, z);
  group.userData.type = "rocket";

  scene.add(group);
  objects.push(group);
}

// CREATE OBSTACLE
function spawnObstacle(x, z) {
  const group = new THREE.Group();

  const type = Math.random();

  if (type < 0.34) {
    // RED HURDLE
    const hurdle = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1.1, 0.6),
      mat.red
    );

    hurdle.position.y = 0.65;
    group.add(hurdle);

    group.userData.type = "hurdle";

  } else if (type < 0.67) {
    // TRAIN BLOCK
    const train = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 2.4, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x1766d1 })
    );

    train.position.y = 1.2;
    group.add(train);

    const window1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.45, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0x9be8ff,
        metalness: 0.4
      })
    );

    window1.position.set(0, 1.7, 1.15);
    group.add(window1);

    group.userData.type = "train";

  } else {
    // OVERHEAD OBSTACLE
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 0.35, 0.8),
      mat.red
    );

    top.position.y = 2.1;
    group.add(top);

    const left = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 2.2, 0.8),
      mat.dark
    );

    left.position.set(-0.75, 1.1, 0);
    group.add(left);

    const right = left.clone();
    right.position.x = 0.75;
    group.add(right);

    group.userData.type = "overhead";
  }

  group.position.set(x, 0, z);

  scene.add(group);
  objects.push(group);
}

// RANDOM SPAWNING
function spawnObject() {
  const selectedLane = lanes[Math.floor(Math.random() * lanes.length)];
  const random = Math.random();

  if (random < 0.42) {
    spawnObstacle(selectedLane, -75);

  } else if (random < 0.82) {
    spawnCoin(selectedLane, -75);

  } else if (random < 0.94) {
    spawnGiftBox(selectedLane, -75);

  } else {
    spawnRocketToy(selectedLane, -75);
  }
}

// UPDATE HUD
function updateHUD() {
  if (scoreText) scoreText.textContent = score;

  if (coinText) {
    coinText.textContent = coins >= 100 ? "100 ✓" : coins;
  }

  if (giftText) giftText.textContent = giftBoxes;

  if (rocketText) rocketText.textContent = rocketCount;

  if (rocketStatus) {
    rocketStatus.textContent = rocketCount > 0
      ? "🚀 ROCKET COLLECTED! IN HAND"
      : "ROCKET NOT COLLECTED";
  }
}
// MOVE LEFT
function moveLeft() {
  if (!running) return;

  lane = Math.max(0, lane - 1);
}

// MOVE RIGHT
function moveRight() {
  if (!running) return;

  lane = Math.min(2, lane + 1);
}

// JUMP
function jump() {
  if (!running || jumpY > 0) return;

  velocityY = 10;
}

// SLIDE
function slide() {
  if (!running || sliding) return;

  sliding = true;
  slideTime = 0.7;
}

// KEYBOARD CONTROLS
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "a") {
    moveLeft();
  }

  if (event.key === "ArrowRight" || event.key === "d") {
    moveRight();
  }

  if (event.key === "ArrowUp" || event.key === " ") {
    jump();
  }

  if (event.key === "ArrowDown" || event.key === "s") {
    slide();
  }
});

// MOBILE BUTTONS
document.getElementById("leftBtn")?.addEventListener("click", moveLeft);
document.getElementById("rightBtn")?.addEventListener("click", moveRight);
document.getElementById("jumpBtn")?.addEventListener("click", jump);
document.getElementById("slideBtn")?.addEventListener("click", slide);

// START GAME
function startGame() {
  score = 0;
  coins = 0;
  giftBoxes = 0;
  rocketCount = 0;

  lane = 1;
  speed = 16;
  jumpY = 0;
  velocityY = 0;
  sliding = false;
  slideTime = 0;
  spawnTime = 0;

  // REMOVE OLD OBJECTS
  for (const object of objects) {
    scene.remove(object);
  }

  objects.length = 0;

  // RESET PLAYER
  player.position.set(0, 0, 3);
  player.rotation.set(0, 0, 0);

  rocketHeld.visible = false;

  updateHUD();

  document.getElementById("startScreen")?.classList.add("hidden");
  document.getElementById("gameOver")?.classList.add("hidden");

  running = true;
}

// GAME OVER
function gameOver() {
  if (!running) return;

  running = false;

  const finalScore = document.getElementById("finalScore");

  if (finalScore) {
    finalScore.textContent = score;
  }

  document.getElementById("gameOver")?.classList.remove("hidden");
}

// BUTTONS
document.getElementById("startBtn")?.addEventListener("click", startGame);
document.getElementById("restartBtn")?.addEventListener("click", startGame);

// COLLISION DETECTION
function checkCollisions() {
  for (let i = objects.length - 1; i >= 0; i--) {
    const object = objects[i];

    if (Math.abs(object.position.z - player.position.z) < 1.1) {
      const sameLane =
        Math.abs(object.position.x - player.position.x) < 0.9;

      if (sameLane) {
        const type = object.userData.type;

        if (type === "coin") {
          coins++;
          score += 5;

          scene.remove(object);
          objects.splice(i, 1);

          updateHUD();
          continue;
        }

        if (type === "gift") {
          giftBoxes++;
          score += 20;

          scene.remove(object);
          objects.splice(i, 1);

          updateHUD();
          continue;
        }

        if (type === "rocket") {
          rocketCount++;
          score += 25;

          rocketHeld.visible = true;

          scene.remove(object);
          objects.splice(i, 1);

          updateHUD();
          continue;
        }

        if (type === "hurdle") {
          // JUMP OVER HURDLE
          if (jumpY < 0.75) {
            gameOver();
          }
        }

        if (type === "overhead") {
          // SLIDE UNDER OVERHEAD OBSTACLE
          if (!sliding) {
            gameOver();
          }
        }

        if (type === "train") {
          // AVOID TRAIN
          gameOver();
        }
      }
    }
  }
}
// ANIMATION CLOCK
const clock = new THREE.Clock();

// GAME ANIMATION
function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);

  if (running) {
    // SCORE AND SPEED
    score += Math.floor(delta * 2);
    speed = Math.min(speed + delta * 0.15, 30);

    // PLAYER LANE MOVEMENT
    const targetX = lanes[lane];

    player.position.x +=
      (targetX - player.position.x) * Math.min(delta * 12, 1);

    // JUMP MOVEMENT
    if (jumpY > 0 || velocityY > 0) {
      velocityY -= 25 * delta;
      jumpY += velocityY * delta;

      if (jumpY < 0) {
        jumpY = 0;
        velocityY = 0;
      }
    }

    player.position.y = jumpY;

    // SLIDE MOVEMENT
    if (sliding) {
      slideTime -= delta;

      body.scale.y = 0.55;
      body.position.y = 0.75;

      if (slideTime <= 0) {
        sliding = false;
        body.scale.y = 1;
        body.position.y = 1.15;
      }
    }

    // RUNNING ANIMATION
    const runTime = clock.elapsedTime * 12;

    legs[0].rotation.x = Math.sin(runTime) * 0.65;
    legs[1].rotation.x = -Math.sin(runTime) * 0.65;

    arms[0].rotation.x = -Math.sin(runTime) * 0.5;
    arms[1].rotation.x = Math.sin(runTime) * 0.5;

    // ROCKET HAND MOVEMENT
    if (rocketHeld.visible) {
      rocketHeld.rotation.z =
        -0.35 + Math.sin(clock.elapsedTime * 5) * 0.08;
    }

    // SPAWN OBJECTS
    spawnTime += delta;

    if (spawnTime > 1.1) {
      spawnObject();
      spawnTime = 0;
    }

    // MOVE OBJECTS
    for (const object of objects) {
      object.position.z += speed * delta;

      if (
        object.userData.type === "coin" ||
        object.userData.type === "gift" ||
        object.userData.type === "rocket"
      ) {
        object.rotation.y += delta * 2;
        object.position.y += Math.sin(clock.elapsedTime * 4) * delta * 0.15;
      }
    }

    // MOVE TRACK
    for (const sleeper of sleepers) {
      sleeper.position.z += speed * delta;

      if (sleeper.position.z > 8) {
        sleeper.position.z -= 135;
      }
    }

    // MOVE BUILDINGS
    for (const building of buildings) {
      building.position.z += speed * delta * 0.7;

      if (building.position.z > 15) {
        building.position.z -= 145;
      }
    }

    // REMOVE OLD OBJECTS
    for (let i = objects.length - 1; i >= 0; i--) {
      if (objects[i].position.z > 12) {
        scene.remove(objects[i]);
        objects.splice(i, 1);
      }
    }

    // CHECK COLLISIONS
    checkCollisions();

    updateHUD();
  }

  // CAMERA FOLLOW
  camera.position.x +=
    (player.position.x * 0.25 - camera.position.x) *
    Math.min(delta * 3, 1);

  camera.lookAt(player.position.x * 0.2, 1, -8);

  renderer.render(scene, camera);
}

// WINDOW RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

// START ANIMATION
updateHUD();
animate();
