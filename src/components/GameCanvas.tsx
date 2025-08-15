import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import { GameEngine } from '../game/GameEngine';
import { GameState, Controls, GameConfig } from '../types/game';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GameCanvasProps {
  onGameStateChange: (gameState: GameState) => void;
  controls: Controls;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onGameStateChange, controls }) => {
  const gameEngineRef = useRef<GameEngine | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const config: GameConfig = {
      canvasWidth: screenWidth,
      canvasHeight: screenHeight - 200, // Leave space for UI
      playerSpeed: 150,
      projectileSpeed: 300,
      enemySpawnRate: 0.02,
      powerUpSpawnRate: 0.01,
      scrollSpeed: 100,
      maxEnemies: 10
    };

    gameEngineRef.current = new GameEngine(config);
    
    gameEngineRef.current.on('stateChanged', onGameStateChange);
    gameEngineRef.current.on('gameOver', (score: number) => {
      console.log('Game Over! Score:', score);
    });

    return () => {
      gameEngineRef.current = null;
    };
  }, [onGameStateChange]);

  const GameLoop: React.FC = () => {
    useFrame(() => {
      if (!gameEngineRef.current) return;

      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = currentTime;

      gameEngineRef.current.update(deltaTime, controls);
    });

    return null;
  };

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <GameLoop />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <GameRenderer gameEngine={gameEngineRef.current} />
      </Canvas>
    </View>
  );
};

interface GameRendererProps {
  gameEngine: GameEngine | null;
}

const GameRenderer: React.FC<GameRendererProps> = ({ gameEngine }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    if (gameEngine) {
      gameEngine.on('stateChanged', setGameState);
    }
  }, [gameEngine]);

  if (!gameState) return null;

  return (
    <group>
      {/* Background */}
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[screenWidth, screenHeight - 200]} />
        <meshBasicMaterial color="#000011" />
      </mesh>

      {/* Player */}
      <mesh position={[gameState.player.position.x, -gameState.player.position.y, 0]}>
        <boxGeometry args={[gameState.player.size.width, gameState.player.size.height, 1]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>

      {/* Enemies */}
      {gameState.enemies.map((enemy) => (
        <mesh 
          key={enemy.id} 
          position={[enemy.position.x, -enemy.position.y, 0]}
        >
          <boxGeometry args={[enemy.size.width, enemy.size.height, 1]} />
          <meshBasicMaterial color={
            enemy.type === 'asteroid' ? '#888888' : 
            enemy.type === 'planet' ? '#4444ff' : '#ff4444'
          } />
        </mesh>
      ))}

      {/* Projectiles */}
      {gameState.projectiles.map((projectile) => (
        <mesh 
          key={projectile.id} 
          position={[projectile.position.x, -projectile.position.y, 0]}
        >
          <boxGeometry args={[projectile.size.width, projectile.size.height, 1]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      ))}

      {/* Power-ups */}
      {gameState.powerUps.map((powerUp) => (
        <mesh 
          key={powerUp.id} 
          position={[powerUp.position.x, -powerUp.position.y, 0]}
        >
          <boxGeometry args={[powerUp.size.width, powerUp.size.height, 1]} />
          <meshBasicMaterial color={
            powerUp.type === 'health' ? '#ff0000' : '#0000ff'
          } />
        </mesh>
      ))}
    </group>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000011',
  },
  canvas: {
    flex: 1,
  },
});

export default GameCanvas;