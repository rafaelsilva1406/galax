import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Platform } from 'react-native';
import { Container, Row, Col, Button, Card, Modal, Badge } from 'react-bootstrap';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MenuScreenProps {
  onStartGame: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onStartGame }) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [highScore, setHighScore] = useState<number>(0);

  React.useEffect(() => {
    loadHighScore();
  }, []);

  const loadHighScore = async () => {
    try {
      const stored = await AsyncStorage.getItem('galax_high_score');
      if (stored) {
        setHighScore(parseInt(stored, 10));
      }
    } catch (error) {
      console.log('Error loading high score:', error);
    }
  };

  const clearHighScore = async () => {
    try {
      await AsyncStorage.removeItem('galax_high_score');
      setHighScore(0);
    } catch (error) {
      console.log('Error clearing high score:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'src/assets/images/space.bmp' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Container fluid style={styles.overlay}>
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col xs={12} md={8} lg={6}>
              <Card className="bg-dark text-light border-primary" style={styles.menuCard}>
                <Card.Header className="text-center bg-primary">
                  <h1 className="mb-0">🚀 GALAX 🚀</h1>
                  <p className="mb-0">Space Adventure Remastered</p>
                </Card.Header>
                
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <h5>Navigate through space and time!</h5>
                    <p className="text-muted">
                      Control your spaceship, destroy enemies, collect power-ups, 
                      and find the wormhole to escape!
                    </p>
                  </div>

                  {highScore > 0 && (
                    <div className="mb-4">
                      <Badge bg="warning" style={styles.highScoreBadge}>
                        High Score: {highScore.toLocaleString()}
                      </Badge>
                    </div>
                  )}

                  <Row className="g-3">
                    <Col xs={12}>
                      <Button
                        variant="success"
                        size="lg"
                        onClick={onStartGame}
                        style={styles.menuButton}
                      >
                        🎮 Start Game
                      </Button>
                    </Col>
                    
                    <Col xs={12} sm={6}>
                      <Button
                        variant="info"
                        onClick={() => setShowInstructions(true)}
                        style={styles.menuButton}
                      >
                        📋 Instructions
                      </Button>
                    </Col>
                    
                    <Col xs={12} sm={6}>
                      <Button
                        variant="secondary"
                        onClick={() => setShowAbout(true)}
                        style={styles.menuButton}
                      >
                        ℹ️ About
                      </Button>
                    </Col>

                    {highScore > 0 && (
                      <Col xs={12}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={clearHighScore}
                        >
                          Clear High Score
                        </Button>
                      </Col>
                    )}
                  </Row>

                  <div className="mt-4 text-muted">
                    <small>
                      {Platform.OS === 'web' 
                        ? 'Use keyboard or touch controls to play'
                        : 'Touch controls optimized for mobile'
                      }
                    </small>
                  </div>
                </Card.Body>

                <Card.Footer className="text-center text-muted">
                  <small>© 2025 Galax Remastered - Built with React Native & Expo</small>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </ImageBackground>

      {/* Instructions Modal */}
      <Modal show={showInstructions} onHide={() => setShowInstructions(false)} size="lg">
        <Modal.Header closeButton className="bg-info text-light">
          <Modal.Title>📋 How to Play Galax</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Container>
            <Row>
              <Col md={6}>
                <h5>🎯 Objective</h5>
                <ul>
                  <li>Survive as long as possible</li>
                  <li>Destroy enemies to earn points</li>
                  <li>Find the wormhole to advance levels</li>
                  <li>Collect power-ups to stay alive</li>
                </ul>

                <h5 className="mt-4">⚡ Power-ups</h5>
                <ul>
                  <li><Badge bg="danger">Health</Badge> - Restores health</li>
                  <li><Badge bg="primary">Energy</Badge> - Restores energy</li>
                  <li><Badge bg="success">Ammo</Badge> - Bonus points</li>
                </ul>
              </Col>
              <Col md={6}>
                <h5>🎮 Controls</h5>
                {Platform.OS === 'web' ? (
                  <div>
                    <p><strong>Keyboard:</strong></p>
                    <ul>
                      <li>WASD or Arrow Keys - Move</li>
                      <li>SPACE or ENTER - Fire</li>
                      <li>ESC - Pause</li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <p><strong>Touch Controls:</strong></p>
                    <ul>
                      <li>Left side - Movement pad</li>
                      <li>Right side - Fire button</li>
                      <li>Pause button - Top right</li>
                    </ul>
                  </div>
                )}

                <h5 className="mt-4">👾 Enemies</h5>
                <ul>
                  <li><Badge bg="secondary">Asteroid</Badge> - 100 pts</li>
                  <li><Badge bg="primary">Planet</Badge> - 200 pts</li>
                  <li><Badge bg="danger">Virus</Badge> - 50 pts</li>
                </ul>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="info" onClick={() => setShowInstructions(false)}>
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>

      {/* About Modal */}
      <Modal show={showAbout} onHide={() => setShowAbout(false)}>
        <Modal.Header closeButton className="bg-secondary text-light">
          <Modal.Title>ℹ️ About Galax</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <div className="text-center">
            <h4>🚀 Galax - Space Adventure Remastered</h4>
            <p className="text-muted">Version 2.0</p>
            
            <div className="mt-4">
              <p>
                Originally created in 2011 by Swirl Productions as a C++ game,
                now completely rewritten using modern web technologies.
              </p>
              
              <h6>🛠️ Built With:</h6>
              <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
                <Badge bg="primary">React Native</Badge>
                <Badge bg="success">TypeScript</Badge>
                <Badge bg="info">Expo</Badge>
                <Badge bg="warning">Bootstrap</Badge>
                <Badge bg="secondary">Three.js</Badge>
              </div>

              <div className="mt-4">
                <p><strong>Original Creator:</strong> Rafael Silva</p>
                <p><strong>Remastered:</strong> 2025</p>
              </div>

              <div className="mt-3 text-muted">
                <small>
                  Cross-platform compatible • Mobile & Web optimized
                </small>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setShowAbout(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 17, 0.8)',
  },
  menuCard: {
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  menuButton: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  highScoreBadge: {
    fontSize: '16px',
    padding: '8px 16px',
  },
});

export default MenuScreen;