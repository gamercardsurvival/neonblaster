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
  this.load.image('background', 'assets/images/background.png');
  this.load.image('ship', 'assets/images/ship.png');
  this.load.image('enemy', 'assets/images/enemy.png');
  this.load.image('bullet', 'assets/images/bullet.png');
}

// Create game objects
function create() {
  // Background
  this.add.image(400, 300, 'background');
  
  // Ship
  this.ship = this.physics.add.image(400, 500, 'ship');
  this.ship.setCollideWorldBounds(true);
  
  // Enemies
  this.enemies = this.physics.add.group();
  
  // Bullets
  this.bullets = this.physics.add.group();
  
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
    this.ship.setVelocityX(-200);
  } else if (this.cursors.right.isDown) {
    this.ship.setVelocityX(200);
  } else {
    this.ship.setVelocityX(0);
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
    const enemy = this.enemies.get();
    if (enemy) {
      enemy
        .setVelocityY(100)
        .setPosition(Math.random() * 800, 0)
        .setActive(true)
        .setVisible(true);
    }
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
