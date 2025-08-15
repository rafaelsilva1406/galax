import { GameEngine } from '../../src/game/GameEngine';
import { GameConfig, Controls } from '../../src/types/game';

describe('GameEngine', () => {
  let gameEngine: GameEngine;
  let config: GameConfig;

  beforeEach(() => {
    config = {
      canvasWidth: 800,
      canvasHeight: 600,
      playerSpeed: 150,
      projectileSpeed: 300,
      enemySpawnRate: 0.02,
      powerUpSpawnRate: 0.01,
      scrollSpeed: 100,
      maxEnemies: 10
    };
    
    gameEngine = new GameEngine(config);
  });

  describe('initialization', () => {
    it('should initialize with correct default game state', () => {
      const gameState = gameEngine.getGameState();
      
      expect(gameState.player).toBeDefined();
      expect(gameState.player.health).toBe(100);
      expect(gameState.player.maxHealth).toBe(100);
      expect(gameState.player.energy).toBe(100);
      expect(gameState.player.maxEnergy).toBe(100);
      expect(gameState.player.score).toBe(0);
      expect(gameState.enemies).toEqual([]);
      expect(gameState.projectiles).toEqual([]);
      expect(gameState.powerUps).toEqual([]);
      expect(gameState.level).toBe(1);
      expect(gameState.isPaused).toBe(false);
      expect(gameState.isGameOver).toBe(false);
    });

    it('should place player at initial position', () => {
      const gameState = gameEngine.getGameState();
      
      expect(gameState.player.position.x).toBe(50);
      expect(gameState.player.position.y).toBe(config.canvasHeight / 2);
    });
  });

  describe('player movement', () => {
    it('should move player up when up control is active', () => {
      const initialY = gameEngine.getGameState().player.position.y;
      const controls: Controls = { up: true, down: false, left: false, right: false, fire: false };
      
      gameEngine.update(0.1, controls); // 100ms
      
      const newY = gameEngine.getGameState().player.position.y;
      expect(newY).toBeLessThan(initialY);
    });

    it('should move player down when down control is active', () => {
      const initialY = gameEngine.getGameState().player.position.y;
      const controls: Controls = { up: false, down: true, left: false, right: false, fire: false };
      
      gameEngine.update(0.1, controls);
      
      const newY = gameEngine.getGameState().player.position.y;
      expect(newY).toBeGreaterThan(initialY);
    });

    it('should move player left when left control is active', () => {
      const initialX = gameEngine.getGameState().player.position.x;
      const controls: Controls = { up: false, down: false, left: true, right: false, fire: false };
      
      gameEngine.update(0.1, controls);
      
      const newX = gameEngine.getGameState().player.position.x;
      expect(newX).toBeLessThan(initialX);
    });

    it('should move player right when right control is active', () => {
      const initialX = gameEngine.getGameState().player.position.x;
      const controls: Controls = { up: false, down: false, left: false, right: true, fire: false };
      
      gameEngine.update(0.1, controls);
      
      const newX = gameEngine.getGameState().player.position.x;
      expect(newX).toBeGreaterThan(initialX);
    });

    it('should keep player within canvas bounds', () => {
      const controls: Controls = { up: false, down: false, left: true, right: false, fire: false };
      
      // Move player far left
      for (let i = 0; i < 100; i++) {
        gameEngine.update(0.1, controls);
      }
      
      const gameState = gameEngine.getGameState();
      expect(gameState.player.position.x).toBeGreaterThanOrEqual(0);
      expect(gameState.player.position.x).toBeLessThanOrEqual(config.canvasWidth - gameState.player.size.width);
    });
  });

  describe('projectile system', () => {
    it('should create projectile when fire control is active and player has energy', () => {
      const controls: Controls = { up: false, down: false, left: false, right: false, fire: true };
      
      gameEngine.update(0.1, controls);
      
      const gameState = gameEngine.getGameState();
      expect(gameState.projectiles.length).toBe(1);
      expect(gameState.player.energy).toBeLessThan(100);
    });

    it('should not create projectile when player has insufficient energy', () => {
      const gameState = gameEngine.getGameState();
      gameState.player.energy = 5; // Below firing threshold
      
      const controls: Controls = { up: false, down: false, left: false, right: false, fire: true };
      gameEngine.update(0.1, controls);
      
      expect(gameState.projectiles.length).toBe(0);
    });

    it('should move projectiles forward', () => {
      const controls: Controls = { up: false, down: false, left: false, right: false, fire: true };
      
      gameEngine.update(0.1, controls); // Create projectile
      
      const gameState = gameEngine.getGameState();
      const initialX = gameState.projectiles[0].position.x;
      
      gameEngine.update(0.1, { up: false, down: false, left: false, right: false, fire: false });
      
      const newX = gameState.projectiles[0].position.x;
      expect(newX).toBeGreaterThan(initialX);
    });

    it('should remove projectiles when they go off-screen', () => {
      const controls: Controls = { up: false, down: false, left: false, right: false, fire: true };
      
      gameEngine.update(0.1, controls); // Create projectile
      
      // Move projectile far off-screen
      const gameState = gameEngine.getGameState();
      gameState.projectiles[0].position.x = config.canvasWidth + 100;
      
      gameEngine.update(0.1, { up: false, down: false, left: false, right: false, fire: false });
      
      expect(gameState.projectiles.length).toBe(0);
    });
  });

  describe('energy system', () => {
    it('should regenerate energy over time', () => {
      const gameState = gameEngine.getGameState();
      gameState.player.energy = 50;
      
      const controls: Controls = { up: false, down: false, left: false, right: false, fire: false };
      gameEngine.update(1.0, controls); // 1 second
      
      expect(gameState.player.energy).toBeGreaterThan(50);
    });

    it('should not regenerate energy above maximum', () => {
      const gameState = gameEngine.getGameState();
      gameState.player.energy = 100;
      
      const controls: Controls = { up: false, down: false, left: false, right: false, fire: false };
      gameEngine.update(1.0, controls);
      
      expect(gameState.player.energy).toBe(100);
    });
  });

  describe('pause and reset functionality', () => {
    it('should pause the game', () => {
      gameEngine.pauseGame();
      const gameState = gameEngine.getGameState();
      expect(gameState.isPaused).toBe(true);
    });

    it('should resume the game', () => {
      gameEngine.pauseGame();
      gameEngine.resumeGame();
      const gameState = gameEngine.getGameState();
      expect(gameState.isPaused).toBe(false);
    });

    it('should not update game state when paused', () => {
      const controls: Controls = { up: true, down: false, left: false, right: false, fire: false };
      const initialY = gameEngine.getGameState().player.position.y;
      
      gameEngine.pauseGame();
      gameEngine.update(0.1, controls);
      
      const newY = gameEngine.getGameState().player.position.y;
      expect(newY).toBe(initialY);
    });

    it('should reset game state', () => {
      // Modify game state
      const gameState = gameEngine.getGameState();
      gameState.player.health = 50;
      gameState.player.score = 1000;
      gameState.level = 5;
      
      gameEngine.resetGame();
      
      const resetState = gameEngine.getGameState();
      expect(resetState.player.health).toBe(100);
      expect(resetState.player.score).toBe(0);
      expect(resetState.level).toBe(1);
    });
  });

  describe('event system', () => {
    it('should emit stateChanged events', () => {
      const callback = jest.fn();
      gameEngine.on('stateChanged', callback);
      
      const controls: Controls = { up: false, down: false, left: false, right: false, fire: false };
      gameEngine.update(0.1, controls);
      
      expect(callback).toHaveBeenCalled();
    });

    it('should emit gameOver events when player health reaches zero', () => {
      const callback = jest.fn();
      gameEngine.on('gameOver', callback);
      
      const gameState = gameEngine.getGameState();
      gameState.player.health = 0;
      
      const controls: Controls = { up: false, down: false, left: false, right: false, fire: false };
      gameEngine.update(0.1, controls);
      
      expect(gameState.isGameOver).toBe(true);
    });
  });
});