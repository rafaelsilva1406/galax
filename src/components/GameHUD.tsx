import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Row, Col, ProgressBar, Badge } from 'react-bootstrap';
import { GameState } from '../types/game';

interface GameHUDProps {
  gameState: GameState;
}

const GameHUD: React.FC<GameHUDProps> = ({ gameState }) => {
  const healthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
  const energyPercent = (gameState.player.energy / gameState.player.maxEnergy) * 100;

  const getHealthColor = (percent: number): string => {
    if (percent > 60) return 'success';
    if (percent > 30) return 'warning';
    return 'danger';
  };

  const getEnergyColor = (percent: number): string => {
    if (percent > 50) return 'info';
    if (percent > 25) return 'warning';
    return 'danger';
  };

  return (
    <View style={styles.hudContainer}>
      <Container fluid>
        <Row className="align-items-center">
          {/* Health Bar */}
          <Col xs={12} sm={3}>
            <div className="mb-2">
              <Text style={styles.hudLabel}>Health</Text>
              <ProgressBar 
                now={healthPercent} 
                variant={getHealthColor(healthPercent)}
                style={{ height: '20px' }}
              />
              <Text style={styles.hudValue}>
                {Math.round(gameState.player.health)}/{gameState.player.maxHealth}
              </Text>
            </div>
          </Col>

          {/* Energy Bar */}
          <Col xs={12} sm={3}>
            <div className="mb-2">
              <Text style={styles.hudLabel}>Energy</Text>
              <ProgressBar 
                now={energyPercent} 
                variant={getEnergyColor(energyPercent)}
                style={{ height: '20px' }}
              />
              <Text style={styles.hudValue}>
                {Math.round(gameState.player.energy)}/{gameState.player.maxEnergy}
              </Text>
            </div>
          </Col>

          {/* Score */}
          <Col xs={6} sm={2}>
            <div className="text-center">
              <Text style={styles.hudLabel}>Score</Text>
              <Badge bg="primary">
                {gameState.player.score.toLocaleString()}
              </Badge>
            </div>
          </Col>

          {/* Level */}
          <Col xs={6} sm={2}>
            <div className="text-center">
              <Text style={styles.hudLabel}>Level</Text>
              <Badge bg="secondary">
                {gameState.level}
              </Badge>
            </div>
          </Col>

          {/* Game Status */}
          <Col xs={12} sm={2}>
            <div className="text-center">
              {gameState.isPaused && (
                <Badge bg="warning" style={styles.statusBadge}>
                  PAUSED
                </Badge>
              )}
              {gameState.isGameOver && (
                <Badge bg="danger" style={styles.statusBadge}>
                  GAME OVER
                </Badge>
              )}
              {!gameState.isPaused && !gameState.isGameOver && (
                <Badge bg="success" style={styles.statusBadge}>
                  PLAYING
                </Badge>
              )}
            </div>
          </Col>
        </Row>

        {/* Enemy Counter */}
        <Row className="mt-2">
          <Col xs={12} sm={6}>
            <div className="d-flex align-items-center">
              <Text style={styles.enemyCounter}>
                Enemies: {gameState.enemies.filter(e => e.active).length}
              </Text>
              <Text style={styles.projectileCounter} className="ms-3">
                Projectiles: {gameState.projectiles.filter(p => p.active).length}
              </Text>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div className="text-end">
              <Text style={styles.timeCounter}>
                Time: {Math.floor(gameState.currentTime)}s
              </Text>
            </div>
          </Col>
        </Row>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  hudContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  hudLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  hudValue: {
    color: '#ffffff',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  scoreBadge: {
    fontSize: 14,
    padding: '8px 12px',
  },
  levelBadge: {
    fontSize: 14,
    padding: '8px 12px',
  },
  statusBadge: {
    fontSize: 12,
    padding: '6px 10px',
  },
  enemyCounter: {
    color: '#ff6666',
    fontSize: 10,
    fontWeight: 'bold',
  },
  projectileCounter: {
    color: '#66ff66',
    fontSize: 10,
    fontWeight: 'bold',
  },
  timeCounter: {
    color: '#6666ff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default GameHUD;