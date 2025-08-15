import { GameState, GameObject, Player, Enemy, Projectile, PowerUp, Controls, GameConfig, Position } from '../types/game';

export class GameEngine {
  private gameState: GameState;
  private config: GameConfig;
  private lastUpdate: number = 0;
  private callbacks: { [key: string]: Function[] } = {};

  constructor(config: GameConfig) {
    this.config = config;
    this.gameState = this.initializeGameState();
  }

  private initializeGameState(): GameState {
    const player: Player = {
      id: 'player',
      position: { x: 50, y: this.config.canvasHeight / 2 },
      velocity: { x: 0, y: 0 },
      size: { width: 32, height: 32 },
      active: true,
      sprite: 'triangle.png',
      health: 100,
      maxHealth: 100,
      energy: 100,
      maxEnergy: 100,
      score: 0
    };

    return {
      player,
      enemies: [],
      projectiles: [],
      powerUps: [],
      level: 1,
      scrollSpeed: 2,
      isPaused: false,
      isGameOver: false,
      currentTime: 0
    };
  }

  public update(deltaTime: number, controls: Controls): void {
    if (this.gameState.isPaused || this.gameState.isGameOver) return;

    // Cap deltaTime to prevent large jumps that cause stuttering
    const cappedDeltaTime = Math.min(deltaTime, 1/30); // Max 30 FPS minimum
    
    this.gameState.currentTime += cappedDeltaTime;
    
    this.updatePlayer(cappedDeltaTime, controls);
    this.updateProjectiles(cappedDeltaTime);
    this.updateEnemies(cappedDeltaTime);
    this.updatePowerUps(cappedDeltaTime);
    
    this.spawnEnemies();
    this.spawnPowerUps();
    
    this.checkCollisions();
    this.cleanupObjects();
    
    this.emit('stateChanged', this.gameState);
  }

  private updatePlayer(deltaTime: number, controls: Controls): void {
    const player = this.gameState.player;
    
    // Handle movement
    player.velocity.x = 0;
    player.velocity.y = 0;
    
    if (controls.up) player.velocity.y = -this.config.playerSpeed;
    if (controls.down) player.velocity.y = this.config.playerSpeed;
    if (controls.left) player.velocity.x = -this.config.playerSpeed;
    if (controls.right) player.velocity.x = this.config.playerSpeed;
    
    // Update position
    player.position.x += player.velocity.x * deltaTime;
    player.position.y += player.velocity.y * deltaTime;
    
    // Keep player within bounds
    player.position.x = Math.max(0, Math.min(this.config.canvasWidth - player.size.width, player.position.x));
    player.position.y = Math.max(0, Math.min(this.config.canvasHeight - player.size.height, player.position.y));
    
    // Handle firing
    if (controls.fire && player.energy > 10) {
      this.fireProjectile(player.position, { x: this.config.projectileSpeed, y: 0 }, 'player');
      player.energy -= 10;
    }
    
    // Regenerate energy
    if (player.energy < player.maxEnergy) {
      player.energy = Math.min(player.maxEnergy, player.energy + 30 * deltaTime);
    }
  }

  private updateProjectiles(deltaTime: number): void {
    this.gameState.projectiles.forEach(projectile => {
      projectile.position.x += projectile.velocity.x * deltaTime;
      projectile.position.y += projectile.velocity.y * deltaTime;
      
      // Deactivate projectiles that are off-screen
      if (projectile.position.x > this.config.canvasWidth || 
          projectile.position.x < -projectile.size.width ||
          projectile.position.y > this.config.canvasHeight || 
          projectile.position.y < -projectile.size.height) {
        projectile.active = false;
      }
    });
  }

  private updateEnemies(deltaTime: number): void {
    this.gameState.enemies.forEach(enemy => {
      // Move enemies from right to left
      enemy.position.x += enemy.velocity.x * deltaTime;
      enemy.position.y += enemy.velocity.y * deltaTime;
      
      // Deactivate enemies that are off-screen
      if (enemy.position.x < -enemy.size.width) {
        enemy.active = false;
      }
    });
  }

  private updatePowerUps(deltaTime: number): void {
    this.gameState.powerUps.forEach(powerUp => {
      powerUp.position.x += powerUp.velocity.x * deltaTime;
      
      if (powerUp.position.x < -powerUp.size.width) {
        powerUp.active = false;
      }
    });
  }

  private spawnEnemies(): void {
    if (Math.random() < this.config.enemySpawnRate && this.gameState.enemies.filter(e => e.active).length < this.config.maxEnemies) {
      const enemyTypes: Array<'asteroid' | 'planet' | 'virus'> = ['asteroid', 'planet', 'virus'];
      const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      
      const enemy: Enemy = {
        id: `enemy_${Date.now()}_${Math.random()}`,
        position: { 
          x: this.config.canvasWidth, 
          y: Math.random() * (this.config.canvasHeight - 64) 
        },
        velocity: { x: -this.config.scrollSpeed - Math.random() * 50, y: Math.random() * 20 - 10 },
        size: { width: 48, height: 48 },
        active: true,
        sprite: type === 'asteroid' ? 'asteroid.png' : type === 'planet' ? 'earth.png' : 'virus1.tga',
        type,
        health: type === 'asteroid' ? 50 : type === 'planet' ? 100 : 25,
        damage: type === 'asteroid' ? 20 : type === 'planet' ? 30 : 15,
        points: type === 'asteroid' ? 100 : type === 'planet' ? 200 : 50
      };
      
      this.gameState.enemies.push(enemy);
    }
  }

  private spawnPowerUps(): void {
    if (Math.random() < this.config.powerUpSpawnRate) {
      const types: Array<'health' | 'energy' | 'ammo'> = ['health', 'energy', 'ammo'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const powerUp: PowerUp = {
        id: `powerup_${Date.now()}_${Math.random()}`,
        position: { 
          x: this.config.canvasWidth, 
          y: Math.random() * (this.config.canvasHeight - 32) 
        },
        velocity: { x: -this.config.scrollSpeed, y: 0 },
        size: { width: 24, height: 24 },
        active: true,
        sprite: type === 'health' ? 'healthslice.tga' : 'energyslice.tga',
        type,
        value: type === 'health' ? 25 : type === 'energy' ? 30 : 50
      };
      
      this.gameState.powerUps.push(powerUp);
    }
  }

  private fireProjectile(position: Position, velocity: { x: number; y: number }, owner: 'player' | 'enemy'): void {
    const projectile: Projectile = {
      id: `projectile_${Date.now()}_${Math.random()}`,
      position: { ...position },
      velocity,
      size: { width: 16, height: 4 },
      active: true,
      sprite: 'pinkfire.tga',
      damage: 25,
      owner
    };
    
    this.gameState.projectiles.push(projectile);
  }

  private checkCollisions(): void {
    // Player vs Enemies
    this.gameState.enemies.filter(e => e.active).forEach(enemy => {
      if (this.checkCollision(this.gameState.player, enemy)) {
        this.gameState.player.health -= enemy.damage;
        enemy.active = false;
        
        if (this.gameState.player.health <= 0) {
          this.gameState.isGameOver = true;
          this.emit('gameOver', this.gameState.player.score);
        }
      }
    });

    // Projectiles vs Enemies
    this.gameState.projectiles.filter(p => p.active && p.owner === 'player').forEach(projectile => {
      this.gameState.enemies.filter(e => e.active).forEach(enemy => {
        if (this.checkCollision(projectile, enemy)) {
          enemy.health -= projectile.damage;
          projectile.active = false;
          
          if (enemy.health <= 0) {
            enemy.active = false;
            this.gameState.player.score += enemy.points;
          }
        }
      });
    });

    // Player vs PowerUps
    this.gameState.powerUps.filter(p => p.active).forEach(powerUp => {
      if (this.checkCollision(this.gameState.player, powerUp)) {
        powerUp.active = false;
        
        switch (powerUp.type) {
          case 'health':
            this.gameState.player.health = Math.min(this.gameState.player.maxHealth, 
              this.gameState.player.health + powerUp.value);
            break;
          case 'energy':
            this.gameState.player.energy = Math.min(this.gameState.player.maxEnergy, 
              this.gameState.player.energy + powerUp.value);
            break;
        }
      }
    });
  }

  private checkCollision(obj1: GameObject, obj2: GameObject): boolean {
    return obj1.position.x < obj2.position.x + obj2.size.width &&
           obj1.position.x + obj1.size.width > obj2.position.x &&
           obj1.position.y < obj2.position.y + obj2.size.height &&
           obj1.position.y + obj1.size.height > obj2.position.y;
  }

  private cleanupObjects(): void {
    this.gameState.enemies = this.gameState.enemies.filter(e => e.active);
    this.gameState.projectiles = this.gameState.projectiles.filter(p => p.active);
    this.gameState.powerUps = this.gameState.powerUps.filter(p => p.active);
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public pauseGame(): void {
    this.gameState.isPaused = true;
  }

  public resumeGame(): void {
    this.gameState.isPaused = false;
  }

  public resetGame(): void {
    this.gameState = this.initializeGameState();
  }

  public on(event: string, callback: Function): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  private emit(event: string, data?: any): void {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }
}