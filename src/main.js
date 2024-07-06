import startGame from "kaplay";

const k = startGame({
  width: 1024,
  height: 576,
  scale: 1.5,
  letterbox: true,
});
let gameOver = false;
loadSprite("bean", "sprites/playerdown.png", {
  sliceX: 6,
  sliceY: 9,
  anims: {
    movedown: {
      from: 0,
      to: 5,
      loop: true,
      speed: 10,
    },
    idle: {
      from: 6,
      to: 8,
      loop: true,
      speed: 10,
    },
    moveup: {
      from: 9,
      to: 14,
      loop: true,
      speed: 10,
    },
    moveright: {
      from: 15,
      to: 20,
      loop: true,
      speed: 10,
    },
    moveleft: {
      from: 21,
      to: 26,
      loop: true,
      speed: 10,
    },
    topleft: {
      from: 27,
      to: 32,
      loop: true,
      speed: 10,
    },
    topright: {
      from: 33,
      to: 38,
      loop: true,
      speed: 10,
    },
    bottomleft: {
      from: 39,
      to: 44,
      loop: true,
      speed: 10,
    },
    bottomright: {
      from: 45,
      to: 50,
      loop: true,
      speed: 10,
    },

    //In spritesheet from 0 - 5 its movedown, from 6-8 its idle
  },
});

loadSprite("fondo", "sprites/map.png");
loadSprite("banana", "sprites/banana.png");

loadSprite("death", "sprites/death.png");
loadSprite("enemy1", "sprites/enemy.png", {
  sliceX: 6,
  sliceY: 6,
  anims: {
    idle: {
      from: 0,
      to: 3,
      loop: true,
      speed: 10,
    },
    movedown: {
      from: 4,
      to: 11,
      loop: true,
      speed: 10,
    },
    moveleft: {
      from: 12,
      to: 19,
      loop: true,
      speed: 10,
    },
    moveright: {
      from: 20,
      to: 27,
      loop: true,
      speed: 10,
    },
    moveup: {
      from: 28,
      to: 35,
      loop: true,
      speed: 10,
    },
  },
});
loadSprite("enemy2", "sprites/enemy2.png", {
  sliceX: 6,
  sliceY: 6,
  anims: {
    idle: {
      from: 0,
      to: 3,
      loop: true,
      speed: 10,
    },
    movedown: {
      from: 4,
      to: 11,
      loop: true,
      speed: 10,
    },
    moveleft: {
      from: 12,
      to: 19,
      loop: true,
      speed: 10,
    },
    moveright: {
      from: 20,
      to: 27,
      loop: true,
      speed: 10,
    },
    moveup: {
      from: 28,
      to: 35,
      loop: true,
      speed: 10,
    },
  },
});
loadSprite("enemy3", "sprites/enemy3.png", {
  sliceX: 6,
  sliceY: 6,
  anims: {
    idle: {
      from: 0,
      to: 3,
      loop: true,
      speed: 10,
    },
    movedown: {
      from: 4,
      to: 11,
      loop: true,
      speed: 10,
    },
    moveleft: {
      from: 12,
      to: 19,
      loop: true,
      speed: 10,
    },
    moveright: {
      from: 20,
      to: 27,
      loop: true,
      speed: 10,
    },
    moveup: {
      from: 28,
      to: 35,
      loop: true,
      speed: 10,
    },
  },
});
loadSprite("enemy4", "sprites/enemy4.png", {
  sliceX: 6,
  sliceY: 6,
  anims: {
    idle: {
      from: 0,
      to: 3,
      loop: true,
      speed: 10,
    },
    movedown: {
      from: 4,
      to: 11,
      loop: true,
      speed: 10,
    },
    moveleft: {
      from: 12,
      to: 19,
      loop: true,
      speed: 10,
    },
    moveright: {
      from: 20,
      to: 27,
      loop: true,
      speed: 10,
    },
    moveup: {
      from: 28,
      to: 35,
      loop: true,
      speed: 10,
    },
  },
});
if (gameOver === false) {
  add([sprite("fondo", { width: width(), height: height() })]);
}

const SPEED = 160;
let score = 0;
let enemySpawnInterval = 3; // Initial spawn interval in seconds
let spawnIntervalHandle;

// Player setup
const player = add([
  sprite("bean", {
    anim: "idle",
  }),
  pos(center()),
  rotate(0),
  scale(0.4),
  area(), // Add hitbox to player
  "player",
]);
// Score label setup
const scoreLabel = add([
  text(`Score: ${score}`, { size: 24 }),
  pos(width() - 150, 20),

  {
    value: score,
    update() {
      this.text = `Score: ${this.value}`;
    },
  },
]);
// Function to spawn a banana that moves towards the initial cursor position and gets destroyed offscreen
function spawnBanana(playerPos) {
  const targetPos = mousePos();
  const direction = targetPos.sub(playerPos).unit();

  const banana = add([
    sprite("banana"),
    scale(0.2),
    pos(playerPos),
    area(),
    rotate(0), // Add hitbox to banana
    {
      update() {
        this.move(direction.scale(400));
        this.angle += 1;
        if (
          this.pos.x < 0 ||
          this.pos.x > width() ||
          this.pos.y < 0 ||
          this.pos.y > height()
        ) {
          destroy(this);
        }
      },
    },
    "banana",
  ]);
}

// Function to spawn an enemy that moves towards the player
// Get the screen width and height
const screenWidth = width();
const screenHeight = height();

// Define enemy types
const enemyTypes = [
  { sprite: "enemy1" },
  { sprite: "enemy2" },
  { sprite: "enemy3" },
  { sprite: "enemy4" },
];

// Function to get a random enemy type
function getRandomEnemyType() {
  return enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
}

// Function to generate a random position along the screen's border
function getRandomBorderPosition() {
  const side = Math.floor(Math.random() * 4);
  switch (side) {
    case 0: // Top
      return vec2(rand(0, screenWidth), -10);
    case 1: // Bottom
      return vec2(rand(0, screenWidth), screenHeight + 10);
    case 2: // Left
      return vec2(-10, rand(0, screenHeight));
    case 3: // Right
      return vec2(screenWidth + 10, rand(0, screenHeight));
    default:
      return vec2(rand(0, screenWidth), -10);
  }
}

// Function to spawn an enemy
function spawnEnemy() {
  const spawnPos = getRandomBorderPosition();
  const enemyType = getRandomEnemyType();
  const enemy = add([
    sprite(enemyType.sprite),
    scale(0.5),
    pos(spawnPos),
    area(), // Add hitbox to enemy
    {
      update() {
        const direction = player.pos.sub(this.pos).unit();
        this.move(direction.scale(300));

        if (Math.abs(direction.x) > Math.abs(direction.y)) {
          if (direction.x > 0) {
            if (enemy.curAnim() !== "moveright") {
              enemy.play("moveright");
            }
          } else {
            if (enemy.curAnim() !== "moveleft") {
              enemy.play("moveleft");
            }
          }
        } else {
          if (direction.y > 0) {
            if (enemy.curAnim() !== "movedown") {
              enemy.play("movedown");
            }
          } else {
            if (enemy.curAnim() !== "moveup") {
              enemy.play("moveup");
            }
          }
        }
        if (this.isColliding(player)) {
          destroy(player);
          console.log("Player died!");
          add([sprite("death", { width: width(), height: height() })]);
          showDeathMenu();
        }

        get("banana").forEach((banana) => {
          if (this.isColliding(banana)) {
            destroy(this);
            destroy(banana);
            console.log("Enemy hit by banana!");
            score += 1;
            scoreLabel.value = score;
            if (score % 5 === 0) {
              enemySpawnInterval = Math.max(1, enemySpawnInterval - 1);
              updateEnemySpawning();
            }
          }
        });
      },
    },
    "enemy",
  ]);
}

// Function to handle the death men
function showDeathMenu() {
  add([
    text("Game Over", { size: 48 }),
    color(255, 255, 255),
    pos(center().x, center().y - 48),
  ]);
  add([
    text(`Score: ${score}`, { size: 24 }),
    color(255, 255, 255),
    pos(center().x, center().y),
  ]);
  add([
    text("Click to Restart", { size: 24 }),
    color(255, 255, 255),
    pos(center().x, center().y + 48),
  ]);
  onClick(() => location.reload());
}

// Function to update enemy spawning rate
function updateEnemySpawning() {
  clearInterval(spawnIntervalHandle);
  spawnIntervalHandle = setInterval(() => {
    if (player.exists()) {
      spawnEnemy(player);
    }
  }, enemySpawnInterval * 1000);
}

// Start initial enemy spawning
updateEnemySpawning();

// Handle player movement
function updatePlayerAnimation() {
  // Check if all W, A, S, D keys are pressed
  if (isKeyDown("w") && isKeyDown("a") && isKeyDown("s") && isKeyDown("d")) {
    if (player.curAnim() !== "idle") {
      player.play("idle");
    }
  } else if (isKeyDown("w") && isKeyDown("d")) {
    if (player.curAnim() !== "topright") {
      player.play("topright");
    }
  } else if (isKeyDown("w") && isKeyDown("a")) {
    if (player.curAnim() !== "topleft") {
      player.play("topleft");
    }
  } else if (isKeyDown("s") && isKeyDown("d")) {
    if (player.curAnim() !== "bottomright") {
      player.play("bottomright");
    }
  } else if (isKeyDown("s") && isKeyDown("a")) {
    if (player.curAnim() !== "bottomleft") {
      player.play("bottomleft");
    }
  } else if (isKeyDown("w")) {
    if (isKeyDown("s")) {
      if (player.curAnim() !== "idle") {
        player.play("idle");
      }
    } else if (player.curAnim() !== "moveup") {
      player.play("moveup");
    }
  } else if (isKeyDown("a")) {
    if (isKeyDown("d")) {
      if (player.curAnim() !== "idle") {
        player.play("idle");
      }
    } else if (player.curAnim() !== "moveleft") {
      player.play("moveleft");
    }
  } else if (isKeyDown("s")) {
    if (player.curAnim() !== "movedown") {
      player.play("movedown");
    }
  } else if (isKeyDown("d")) {
    if (player.curAnim() !== "moveright") {
      player.play("moveright");
    }
  } else {
    player.play("idle");
  }
}

onKeyDown("a", () => {
  if (player.pos.x > 0) {
    player.move(-SPEED, 0);
    updatePlayerAnimation();
  }
});
onKeyDown("d", () => {
  if (player.pos.x < 1500 - player.width) {
    player.move(SPEED, 0);
    updatePlayerAnimation();
  }
});
onKeyDown("w", () => {
  if (player.pos.y > 0) {
    player.move(0, -SPEED);
    updatePlayerAnimation();
  }
});
onKeyDown("s", () => {
  if (player.pos.y < 1024 - player.height) {
    player.move(0, SPEED);
    updatePlayerAnimation();
  }
});

// Ensure that releasing keys also updates the animation
["w", "a", "s", "d"].forEach((key) => {
  onKeyRelease(key, () => {
    updatePlayerAnimation();
  });
});
// Spawn a banana on mouse click
onClick(() => {
  spawnBanana(player.pos);
});
spawnEnemy();
