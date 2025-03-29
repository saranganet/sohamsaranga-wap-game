const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

let towers = [];
let enemies = [];
let bullets = [];

const towerRadius = 50;
const enemySpeed = 1;
const towerCost = 20;
let score = 100; 

class Tower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.range = towerRadius;
    this.attackCooldown = 0;
  }

  draw() {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.fill();
  }

  shoot() {
    if (this.attackCooldown <= 0) {
      let target = enemies.find(e => Math.hypot(e.x - this.x, e.y - this.y) < this.range);
      if (target) {
        bullets.push(new Bullet(this.x, this.y, target));
        this.attackCooldown = 60; 
      }
    }
    this.attackCooldown--;
  }
}

class Bullet {
  constructor(x, y, target) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.speed = 3;
  }

  move() {
    let angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Enemy {
  constructor() {
    this.x = 0;
    this.y = Math.random() * canvas.height;
    this.speed = enemySpeed;
  }

  move() {
    this.x += this.speed;
  }

  draw() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x, this.y, 20, 20);
  }
}

function spawnEnemies() {
  if (Math.random() < 0.02) {
    enemies.push(new Enemy());
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  towers.forEach(tower => {
    tower.shoot();
    tower.draw();
  });

  bullets.forEach(bullet => {
    bullet.move();
    bullet.draw();
  });

  enemies.forEach(enemy => {
    enemy.move();
    enemy.draw();
  });

  bullets.forEach((bullet, index) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < 10) {
        enemies.splice(enemyIndex, 1);
        bullets.splice(index, 1);
        score += 10;
      }
    });
  });

  enemies.forEach(enemy => {
    if (enemy.x > canvas.width) {
      alert('Game Over!');
      resetGame();
    }
  });

  spawnEnemies();
  requestAnimationFrame(update);
}

canvas.addEventListener('click', (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  if (score >= towerCost) {
    towers.push(new Tower(x, y));
    score -= towerCost;
  }
});

function resetGame() {
  towers = [];
  enemies = [];
  bullets = [];
  score = 100;
  update();
}

update();
