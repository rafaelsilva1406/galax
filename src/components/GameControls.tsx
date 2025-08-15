import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { PanGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import { Controls } from '../types/game';

const { width: screenWidth } = Dimensions.get('window');

interface GameControlsProps {
  onControlsChange: (controls: Controls) => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onControlsChange }) => {
  const [controls, setControls] = useState<Controls>({
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false,
  });

  const updateControls = useCallback((newControls: Partial<Controls>) => {
    setControls(prev => {
      const updated = { ...prev, ...newControls };
      onControlsChange(updated);
      return updated;
    });
  }, [onControlsChange]);

  // Keyboard controls for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
          case 'ArrowUp':
          case 'KeyW':
            updateControls({ up: true });
            event.preventDefault();
            break;
          case 'ArrowDown':
          case 'KeyS':
            updateControls({ down: true });
            event.preventDefault();
            break;
          case 'ArrowLeft':
          case 'KeyA':
            updateControls({ left: true });
            event.preventDefault();
            break;
          case 'ArrowRight':
          case 'KeyD':
            updateControls({ right: true });
            event.preventDefault();
            break;
          case 'Space':
          case 'Enter':
            updateControls({ fire: true });
            event.preventDefault();
            break;
        }
      };

      const handleKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
          case 'ArrowUp':
          case 'KeyW':
            updateControls({ up: false });
            break;
          case 'ArrowDown':
          case 'KeyS':
            updateControls({ down: false });
            break;
          case 'ArrowLeft':
          case 'KeyA':
            updateControls({ left: false });
            break;
          case 'ArrowRight':
          case 'KeyD':
            updateControls({ right: false });
            break;
          case 'Space':
          case 'Enter':
            updateControls({ fire: false });
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [updateControls]);

  if (Platform.OS === 'web') {
    return (
      <Container fluid className="game-controls-web">
        <Row className="justify-content-center">
          <Col xs="auto">
            <div className="text-center text-light mb-2">
              <small>
                Use WASD or Arrow Keys to move, SPACE or ENTER to fire
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Mobile controls
  const handleMovementGesture = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const { translationX, translationY } = event.nativeEvent;
      const threshold = 20;

      updateControls({
        left: translationX < -threshold,
        right: translationX > threshold,
        up: translationY < -threshold,
        down: translationY > threshold,
      });
    } else if (event.nativeEvent.state === State.END) {
      updateControls({
        left: false,
        right: false,
        up: false,
        down: false,
      });
    }
  };

  const handleFireTap = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      updateControls({ fire: true });
    } else if (event.nativeEvent.state === State.END) {
      updateControls({ fire: false });
    }
  };

  return (
    <View style={styles.mobileControls}>
      <Container fluid>
        <Row>
          <Col xs={8}>
            <PanGestureHandler onHandlerStateChange={handleMovementGesture}>
              <View style={styles.movementArea}>
                <View style={styles.movementPad}>
                  <View style={[styles.dpadButton, styles.dpadUp]}>
                    <Button 
                      variant={controls.up ? "primary" : "outline-primary"}
                      size="sm"
                    >
                      ↑
                    </Button>
                  </View>
                  <View style={styles.dpadMiddle}>
                    <Button 
                      variant={controls.left ? "primary" : "outline-primary"}
                      size="sm"
                      style={styles.dpadLeft}
                    >
                      ←
                    </Button>
                    <Button 
                      variant={controls.right ? "primary" : "outline-primary"}
                      size="sm"
                      style={styles.dpadRight}
                    >
                      →
                    </Button>
                  </View>
                  <View style={[styles.dpadButton, styles.dpadDown]}>
                    <Button 
                      variant={controls.down ? "primary" : "outline-primary"}
                      size="sm"
                    >
                      ↓
                    </Button>
                  </View>
                </View>
              </View>
            </PanGestureHandler>
          </Col>
          <Col xs={4}>
            <TapGestureHandler onHandlerStateChange={handleFireTap}>
              <View style={styles.fireButtonArea}>
                <Button 
                  variant={controls.fire ? "danger" : "outline-danger"}
                  size="lg"
                  style={styles.fireButton}
                >
                  FIRE
                </Button>
              </View>
            </TapGestureHandler>
          </Col>
        </Row>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  mobileControls: {
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 10,
  },
  movementArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movementPad: {
    width: 120,
    height: 100,
    position: 'relative',
  },
  dpadButton: {
    position: 'absolute',
    width: 40,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpadUp: {
    top: 0,
    left: 40,
  },
  dpadDown: {
    bottom: 0,
    left: 40,
  },
  dpadMiddle: {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 30,
  },
  dpadLeft: {
    width: 40,
  },
  dpadRight: {
    width: 40,
  },
  fireButtonArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fireButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameControls;