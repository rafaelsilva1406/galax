import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { GameEngine } from '../game/GameEngine';
import { GameState, Controls, GameConfig, GameObject } from '../types/game';
import { IconRenderer } from '../utils/iconRenderer';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GameCanvas2DProps {
  onGameStateChange: (gameState: GameState) => void;
  controls: Controls;
}

const GameCanvas2D: React.FC<GameCanvas2DProps> = ({ onGameStateChange, controls }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const config: GameConfig = {
      canvasWidth: Math.min(screenWidth, 800),
      canvasHeight: Math.min(screenHeight - 200, 600),
      playerSpeed: 200, // Increased for more responsive movement
      projectileSpeed: 400, // Increased for faster projectiles
      enemySpawnRate: 0.015, // Slightly reduced for better performance
      powerUpSpawnRate: 0.008, // Slightly reduced
      scrollSpeed: 120, // Increased for more dynamic gameplay
      maxEnemies: 8 // Reduced for better performance
    };

    gameEngineRef.current = new GameEngine(config);
    
    gameEngineRef.current.on('stateChanged', onGameStateChange);
    gameEngineRef.current.on('gameOver', (score: number) => {
      console.log('Game Over! Score:', score);
    });

    // Initialize high-resolution timer
    lastTimeRef.current = performance.now();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      gameEngineRef.current = null;
    };
  }, [onGameStateChange]);

  const drawGameObject = (ctx: CanvasRenderingContext2D, obj: GameObject, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(obj.position.x, obj.position.y, obj.size.width, obj.size.height);
    
    // Add a border for better visibility
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(obj.position.x, obj.position.y, obj.size.width, obj.size.height);
  };

  const render = useCallback((gameState: GameState) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Optimize canvas rendering
    ctx.imageSmoothingEnabled = false; // Disable antialiasing for better performance

    // Clear canvas with space background
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars background (cached pattern)
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 30; i++) { // Reduced star count for performance
      const x = (i * 37 + gameState.currentTime * 10) % canvas.width; // Scrolling stars
      const y = (i * 23) % canvas.height;
      ctx.fillRect(x, y, 1, 1);
    }

    // Draw player as rocket icon
    const p = gameState.player;
    IconRenderer.drawBootstrapIcon(
      ctx, 
      'rocket', 
      p.position.x, 
      p.position.y, 
      p.size.width, 
      p.size.height,
      '#00ff00'
    );

    // Draw projectiles as simple bright rectangles (bullets)
    ctx.fillStyle = '#ffff00';
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 1;
    gameState.projectiles.forEach(projectile => {
      ctx.fillRect(projectile.position.x, projectile.position.y, projectile.size.width, projectile.size.height);
      ctx.strokeRect(projectile.position.x, projectile.position.y, projectile.size.width, projectile.size.height);
    });

    // Draw enemies with Bootstrap icons
    gameState.enemies.forEach(enemy => {
      let iconType: 'asteroid' | 'planet' | 'virus' = 'asteroid';
      let color = '#888888';
      
      if (enemy.type === 'planet') {
        iconType = 'planet';
        color = '#4444ff';
      } else if (enemy.type === 'virus') {
        iconType = 'virus';
        color = '#ff4444';
      } else {
        iconType = 'asteroid';
        color = '#888888';
      }
      
      IconRenderer.drawBootstrapIcon(
        ctx,
        iconType,
        enemy.position.x,
        enemy.position.y,
        enemy.size.width,
        enemy.size.height,
        color
      );
    });

    // Draw power-ups with Bootstrap icons
    gameState.powerUps.forEach(powerUp => {
      let iconType: 'health' | 'energy' | 'ammo' = 'ammo';
      let color = '#ffff44';
      
      if (powerUp.type === 'health') {
        iconType = 'health';
        color = '#ff4444';
      } else if (powerUp.type === 'energy') {
        iconType = 'energy';
        color = '#4444ff';
      } else {
        iconType = 'ammo';
        color = '#ffff44';
      }
      
      IconRenderer.drawBootstrapIcon(
        ctx,
        iconType,
        powerUp.position.x,
        powerUp.position.y,
        powerUp.size.width,
        powerUp.size.height,
        color
      );
    });

    // Draw UI text with better performance
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.fillText(`FPS: ${Math.round(1000 / Math.max(1, performance.now() - lastTimeRef.current))}`, 10, 20);
    ctx.fillText(`Objects: ${gameState.enemies.length + gameState.projectiles.length + gameState.powerUps.length}`, 10, 40);
    ctx.fillText(`Score: ${gameState.player.score}`, 10, 60);
  }, []);

  const gameLoop = useCallback(() => {
    if (!gameEngineRef.current) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const currentTime = performance.now(); // Use performance.now() for higher precision
    const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 1/30); // Cap at 30 FPS minimum
    
    if (deltaTime > 1/120) { // Only update if enough time has passed (120 FPS cap)
      lastTimeRef.current = currentTime;
      
      gameEngineRef.current.update(deltaTime, controls);
      const gameState = gameEngineRef.current.getGameState();
      render(gameState);
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [controls, render]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop]);

  const canvasWidth = Math.min(screenWidth, 800);
  const canvasHeight = Math.min(screenHeight - 200, 600);

  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.container}>
        <canvas
          ref={canvasRef as any}
          width={canvasWidth}
          height={canvasHeight}
          style={webStyles.canvas}
        />
      </div>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        {/* For React Native, we'd need a different rendering approach */}
      </View>
    </View>
  );
};

const webStyles = {
  container: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: '#000011',
    flex: 1,
  },
  canvas: {
    border: '2px solid #333',
    borderRadius: '8px',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000011',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 400,
    height: 300,
    backgroundColor: '#000011',
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 8,
  },
});

export default GameCanvas2D;