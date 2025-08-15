import React, { useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { Container, Modal, Button, Row, Col } from 'react-bootstrap';
import GameCanvas2D from '../components/GameCanvas2D';
import GameHUD from '../components/GameHUD';
import GameControls from '../components/GameControls';
import { GameState, Controls } from '../types/game';

interface GameScreenProps {
  onBackToMenu: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onBackToMenu }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [controls, setControls] = useState<Controls>({
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false,
  });
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  const handleGameStateChange = useCallback((newGameState: GameState) => {
    setGameState(newGameState);
  }, []);

  const handleControlsChange = useCallback((newControls: Controls) => {
    setControls(newControls);
  }, []);

  const togglePause = useCallback(() => {
    setShowPauseMenu(!showPauseMenu);
  }, [showPauseMenu]);

  const resumeGame = () => {
    setShowPauseMenu(false);
  };

  const restartGame = () => {
    setShowPauseMenu(false);
    // Game engine restart logic would be handled in GameCanvas
    window.location.reload(); // Temporary solution
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={Platform.OS !== 'web'} />
      
      {/* Game HUD */}
      {gameState && (
        <GameHUD gameState={gameState} />
      )}

      {/* Game Canvas */}
      <GameCanvas2D
        onGameStateChange={handleGameStateChange}
        controls={controls}
      />

      {/* Game Controls */}
      <GameControls onControlsChange={handleControlsChange} />

      {/* Pause Menu */}
      <Modal show={showPauseMenu} onHide={resumeGame} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Game Paused</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Container>
            <Row className="text-center">
              <Col>
                <h5>Galax - Space Adventure</h5>
                <p>Navigate through space, destroy enemies, and find the wormhole!</p>
              </Col>
            </Row>
            {gameState && (
              <Row className="mt-3">
                <Col>
                  <div className="text-center">
                    <p><strong>Current Score:</strong> {gameState.player.score.toLocaleString()}</p>
                    <p><strong>Level:</strong> {gameState.level}</p>
                    <p><strong>Health:</strong> {Math.round(gameState.player.health)}/{gameState.player.maxHealth}</p>
                  </div>
                </Col>
              </Row>
            )}
          </Container>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="success" onClick={resumeGame}>
            Resume Game
          </Button>
          <Button variant="warning" onClick={restartGame}>
            Restart Game
          </Button>
          <Button variant="danger" onClick={onBackToMenu}>
            Exit Game
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Game Over Modal */}
      {gameState?.isGameOver && (
        <Modal show={true} centered backdrop="static">
          <Modal.Header className="bg-danger text-light">
            <Modal.Title>Game Over</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light text-center">
            <h4>Mission Failed!</h4>
            <p>Your spaceship was destroyed in the depths of space.</p>
            <div className="mt-3">
              <p><strong>Final Score:</strong> {gameState.player.score.toLocaleString()}</p>
              <p><strong>Level Reached:</strong> {gameState.level}</p>
              <p><strong>Time Survived:</strong> {Math.floor(gameState.currentTime)}s</p>
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button variant="primary" onClick={restartGame}>
              Try Again
            </Button>
            <Button variant="secondary" onClick={onBackToMenu}>
              Back to Menu
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Floating pause button for mobile */}
      {Platform.OS !== 'web' && (
        <View style={styles.pauseButton}>
          <Button
            variant="outline-light"
            size="sm"
            onClick={togglePause}
          >
            ⏸️
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000011',
  },
  pauseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1000,
  },
});

export default GameScreen;