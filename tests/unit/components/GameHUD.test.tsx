import React from 'react';
import { render } from '@testing-library/react-native';
import GameHUD from '../../../src/components/GameHUD';
import { GameState } from '../../../src/types/game';

const mockGameState: GameState = {
  player: {
    id: 'player',
    position: { x: 50, y: 300 },
    velocity: { x: 0, y: 0 },
    size: { width: 32, height: 32 },
    active: true,
    sprite: 'triangle.png',
    health: 75,
    maxHealth: 100,
    energy: 60,
    maxEnergy: 100,
    score: 1500
  },
  enemies: [
    {
      id: 'enemy1',
      position: { x: 400, y: 200 },
      velocity: { x: -50, y: 0 },
      size: { width: 48, height: 48 },
      active: true,
      sprite: 'asteroid.png',
      type: 'asteroid',
      health: 50,
      damage: 20,
      points: 100
    }
  ],
  projectiles: [
    {
      id: 'projectile1',
      position: { x: 100, y: 300 },
      velocity: { x: 300, y: 0 },
      size: { width: 16, height: 4 },
      active: true,
      sprite: 'pinkfire.tga',
      damage: 25,
      owner: 'player'
    }
  ],
  powerUps: [],
  level: 3,
  scrollSpeed: 120,
  isPaused: false,
  isGameOver: false,
  currentTime: 45.5
};

describe('GameHUD', () => {
  it('should render all HUD elements correctly', () => {
    const { getByText } = render(<GameHUD gameState={mockGameState} />);

    // Check labels
    expect(getByText('Health')).toBeDefined();
    expect(getByText('Energy')).toBeDefined();
    expect(getByText('Score')).toBeDefined();
    expect(getByText('Level')).toBeDefined();

    // Check values
    expect(getByText('75/100')).toBeDefined();
    expect(getByText('60/100')).toBeDefined();
    expect(getByText('1,500')).toBeDefined();
    expect(getByText('3')).toBeDefined();
  });

  it('should display correct game status when playing', () => {
    const { getByText } = render(<GameHUD gameState={mockGameState} />);
    expect(getByText('PLAYING')).toBeDefined();
  });

  it('should display paused status when game is paused', () => {
    const pausedState = { ...mockGameState, isPaused: true };
    const { getByText } = render(<GameHUD gameState={pausedState} />);
    expect(getByText('PAUSED')).toBeDefined();
  });

  it('should display game over status when game is over', () => {
    const gameOverState = { ...mockGameState, isGameOver: true };
    const { getByText } = render(<GameHUD gameState={gameOverState} />);
    expect(getByText('GAME OVER')).toBeDefined();
  });

  it('should display enemy and projectile counts', () => {
    const { getByText } = render(<GameHUD gameState={mockGameState} />);
    expect(getByText('Enemies: 1')).toBeDefined();
    expect(getByText('Projectiles: 1')).toBeDefined();
  });

  it('should display formatted time', () => {
    const { getByText } = render(<GameHUD gameState={mockGameState} />);
    expect(getByText('Time: 45s')).toBeDefined();
  });

  it('should handle zero score correctly', () => {
    const zeroScoreState = { 
      ...mockGameState, 
      player: { ...mockGameState.player, score: 0 }
    };
    const { getByText } = render(<GameHUD gameState={zeroScoreState} />);
    expect(getByText('0')).toBeDefined();
  });

  it('should handle high scores with proper formatting', () => {
    const highScoreState = { 
      ...mockGameState, 
      player: { ...mockGameState.player, score: 1234567 }
    };
    const { getByText } = render(<GameHUD gameState={highScoreState} />);
    expect(getByText('1,234,567')).toBeDefined();
  });

  it('should handle maximum health and energy correctly', () => {
    const maxState = { 
      ...mockGameState, 
      player: { 
        ...mockGameState.player, 
        health: 100, 
        energy: 100 
      }
    };
    const { getByText } = render(<GameHUD gameState={maxState} />);
    expect(getByText('100/100')).toBeDefined();
  });

  it('should handle minimum health and energy correctly', () => {
    const minState = { 
      ...mockGameState, 
      player: { 
        ...mockGameState.player, 
        health: 0, 
        energy: 0 
      }
    };
    const { getByText } = render(<GameHUD gameState={minState} />);
    expect(getByText('0/100')).toBeDefined();
  });

  it('should count only active enemies and projectiles', () => {
    const stateWithInactive = {
      ...mockGameState,
      enemies: [
        ...mockGameState.enemies,
        {
          id: 'enemy2',
          position: { x: 500, y: 100 },
          velocity: { x: -50, y: 0 },
          size: { width: 48, height: 48 },
          active: false, // Inactive enemy
          sprite: 'planet.png',
          type: 'planet' as const,
          health: 100,
          damage: 30,
          points: 200
        }
      ],
      projectiles: [
        ...mockGameState.projectiles,
        {
          id: 'projectile2',
          position: { x: 200, y: 300 },
          velocity: { x: 300, y: 0 },
          size: { width: 16, height: 4 },
          active: false, // Inactive projectile
          sprite: 'pinkfire.tga',
          damage: 25,
          owner: 'player' as const
        }
      ]
    };

    const { getByText } = render(<GameHUD gameState={stateWithInactive} />);
    expect(getByText('Enemies: 1')).toBeDefined(); // Should still show 1 (only active)
    expect(getByText('Projectiles: 1')).toBeDefined(); // Should still show 1 (only active)
  });
});