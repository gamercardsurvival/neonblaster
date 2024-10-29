
// Configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// Create the game
const game = new Phaser.Game(config);

// Preload assets
function preload() {
}

// Create game objects
function create() {
  // Background
  this.add.rectangle(400, 300, 800, 600, 0x000000);

  // Ship
  this.ship = this.add.rectangle(400, 500, 50, 50, 0x00FFFF);
  this.ship.setOrigin(0.5, 0.5); // Center the ship

  // Enemies
  this.enemies = this.add.group();
  const enemy = this.enemies.create(400, 100, undefined); // Create an enemy at a visible position
  enemy.body.setVelocityY(100);

  // Bullets
  this.bullets = this.add.group();
  const bullet = this.bullets.create(400, 500, undefined); // Create a bullet at the ship's position
  bullet.body.setVelocityY(-400);

  // Score
  this.score = 0;
  this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: 32, color: '#ffffff' });

  // Input
  this.cursors = this.input.keyboard.createCursorKeys();
}

// Update game logic
function update(time, delta) {
  // Ship movement
  if (this.cursors.left.isDown) {
    this.ship.x -= 5;
  } else if (this.cursors.right.isDown) {
    this.ship.x += 5;
  }

  // Shoot bullet
  if (this.cursors.space.isDown) {
    const bullet = this.bullets.get();
    if (bullet) {
      bullet
        .setVelocityY(-400)
        .setPosition(this.ship.x, this.ship.y)
        .setActive(true)
        .setVisible(true);
    }
  }

  // Enemy spawn
  if (Math.random() < 0.1) {
    const enemy = this.enemies.create(Math.random() * 800, 0);
    enemy.body.setVelocityY(100);
  }

  // Collision detection
  this.physics.collide(this.ship, this.enemies, (ship, enemy) => {
    // Game over logic
    this.scene.pause();
    this.add.text(400, 300, 'Game Over', { fontSize: 64, color: '#ffffff' });
  });

  this.physics.collide(this.bullets, this.enemies, (bullet, enemy) => {
    // Increase score
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);

    // Destroy bullet and enemy
    bullet.destroy();
    enemy.destroy();
  });
}
