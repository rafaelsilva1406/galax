export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface GameObject {
  id: string;
  position: Position;
  velocity: Velocity;
  size: Size;
  active: boolean;
  sprite: string;
}

export interface Player extends GameObject {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  score: number;
}

export interface Enemy extends GameObject {
  type: 'asteroid' | 'planet' | 'virus';
  health: number;
  damage: number;
  points: number;
}

export interface Projectile extends GameObject {
  damage: number;
  owner: 'player' | 'enemy';
}

export interface PowerUp extends GameObject {
  type: 'health' | 'energy' | 'ammo';
  value: number;
}

export interface GameState {
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  powerUps: PowerUp[];
  level: number;
  scrollSpeed: number;
  isPaused: boolean;
  isGameOver: boolean;
  currentTime: number;
}

export interface Controls {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  fire: boolean;
}

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  playerSpeed: number;
  projectileSpeed: number;
  enemySpawnRate: number;
  powerUpSpawnRate: number;
  scrollSpeed: number;
  maxEnemies: number;
}