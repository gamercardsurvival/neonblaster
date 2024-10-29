
// Game Configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
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

// Initialize Phaser Game
const game = new Phaser.Game(config);

// Preload Assets
function preload() {
  // Images
  this.load.image('ship', 'assets/images/ship.png');
  this.load.image('enemy', 'assets/images/enemy.png');
  this.load.image('bullet', 'assets/images/bullet.png');
  this.load.image('background', 'assets/images/background.png');

  // Audio
  this.load.audio('laser', 'assets/audio/laser.mp3');
  this.load.audio('explosion', 'assets/audio/explosion.mp3');
  this.load.audio('backgroundMusic', 'assets/audio/background.mp3');
}

// Create Game Objects
function create() {
  // Background
  this.add.image(400, 300, 'background');

  // Background Music
  this.backgroundMusic = this.sound.add('backgroundMusic');
  this.backgroundMusic.play();

  // Ship
  this.ship = this.physics.add.sprite(400, 500, 'ship');
  this.ship.setCollideWorldBounds(true);

  // Enemy
  this.enemy = this.physics.add.sprite(400, 100, 'enemy');
  this.enemy.setVelocityY(200);

  // Bullets
  this.bullets = this.physics.add.group();

  // Spacebar to shoot
  this.input.keyboard.createCursorKeys();
  this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.SPACE_BAR);

  // Score
  this.score = 0;
  this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: 32, color: '#fff' });
}

// Update Game Logic
function update() {
  // Ship Movement
  if (this.input.keyboard.isDown(Phaser.Input.Keyboard.LEFT_KEY)) {
    this.ship.setVelocityX(-200);
  } else if (this.input.keyboard.isDown(Phaser.Input.Keyboard.RIGHT_KEY)) {
    this.ship.setVelocityX(200);
  } else {
    this.ship.setVelocityX(0);
  }

  // Shoot Bullet
  if (this.spacebar.isDown) {
    const bullet = this.bullets.create(this.ship.x, this.ship.y, 'bullet');
    bullet.setVelocityY(-400);
    this.sound.play('laser');
  }

  // Enemy Collision
  if (this.physics.world.collide(this.ship, this.enemy)) {
    console.log('Game Over');
    this.sound.play('explosion');
  }

  // Bullet Collision
  this.physics.collide(this.bullets, this.enemy, (bullet, enemy) => {
    bullet.destroy();
    enemy.destroy();
    this.score++;
    this.scoreText.setText('Score: ' + this.score);
  });
}