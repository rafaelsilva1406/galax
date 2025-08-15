# 🛠️ Development Guide

This guide covers everything you need to know for developing the Galax game.

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │    Business     │    │      Data       │
│                 │    │                 │    │                 │
│  React Native   │◄──►│   Game Engine   │◄──►│  AsyncStorage   │
│   Components    │    │     Logic       │    │   Local State   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        ▲                       ▲                       ▲
        │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI/Controls   │    │   Game Loop     │    │    Assets       │
│                 │    │                 │    │                 │
│  Touch/Keyboard │    │  Physics/       │    │ Images/Sounds/  │
│    Bootstrap    │    │  Collision      │    │   Sprites       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Hierarchy

```
App
├── MenuScreen
│   ├── MainMenu
│   ├── InstructionsModal
│   └── AboutModal
└── GameScreen
    ├── GameHUD
    ├── GameCanvas (Three.js)
    ├── GameControls
    └── PauseModal/GameOverModal
```

### Game Engine Structure

```
GameEngine
├── State Management
├── Physics System
├── Collision Detection
├── Object Pools
├── Event System
└── Update Loop
```

## 🎮 Game Systems

### 1. Game State Management

The game state is centralized in `GameEngine.ts`:

```typescript
interface GameState {
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
```

#### State Updates
- **Immutable**: State is never mutated directly
- **Event-driven**: Changes trigger events for components
- **Predictable**: All updates go through the game engine

### 2. Physics System

#### Movement
```typescript
// Update position based on velocity
object.position.x += object.velocity.x * deltaTime;
object.position.y += object.velocity.y * deltaTime;
```

#### Collision Detection
```typescript
// AABB (Axis-Aligned Bounding Box) collision
function checkCollision(obj1: GameObject, obj2: GameObject): boolean {
  return obj1.position.x < obj2.position.x + obj2.size.width &&
         obj1.position.x + obj1.size.width > obj2.position.x &&
         obj1.position.y < obj2.position.y + obj2.size.height &&
         obj1.position.y + obj1.size.height > obj2.position.y;
}
```

### 3. Rendering System

#### Three.js Integration
```typescript
// Game objects are rendered as 3D meshes
<mesh position={[object.position.x, -object.position.y, 0]}>
  <boxGeometry args={[object.size.width, object.size.height, 1]} />
  <meshBasicMaterial color={object.color} />
</mesh>
```

#### Performance Optimizations
- **Object Culling**: Only render visible objects
- **Instancing**: Reuse geometries for similar objects
- **LOD**: Level of detail for distant objects

## 🔧 Development Setup

### Environment Configuration

#### 1. Node.js Version Management
```bash
# Use Node Version Manager (recommended)
nvm install 18
nvm use 18
```

#### 2. Package Installation
```bash
# Install dependencies (required flag for React 19 compatibility)
npm install --legacy-peer-deps
```

#### 3. Environment Variables
Create `.env` file:
```bash
# Development
NODE_ENV=development
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_ANALYTICS_ENABLED=false

# Production
NODE_ENV=production
EXPO_PUBLIC_API_URL=https://api.galaxgame.com
EXPO_PUBLIC_ANALYTICS_ENABLED=true
```

### IDE Configuration

#### VS Code Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "expo.vscode-expo-tools"
  ]
}
```

#### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## 🎨 Styling Guidelines

### Bootstrap Integration

#### Component Structure
```typescript
// Use Bootstrap classes with React Bootstrap components
import { Container, Row, Col, Button } from 'react-bootstrap';

const GameHUD = () => (
  <Container fluid className="game-hud">
    <Row>
      <Col xs={12} md={6}>
        <Button variant="primary" size="lg">
          Action
        </Button>
      </Col>
    </Row>
  </Container>
);
```

#### Responsive Design
```typescript
// Use responsive props
<Col xs={12} sm={6} md={4} lg={3}>
  Content
</Col>

// Or responsive utilities
<div className="d-none d-md-block">
  Desktop only content
</div>
```

#### Custom Styling
```typescript
// StyleSheet for React Native compatibility
const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    backgroundColor: '#000011',
  },
  hudOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
});
```

### Design Tokens

#### Colors
```typescript
const colors = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  
  // Game specific
  spaceBackground: '#000011',
  playerShip: '#00ff00',
  enemyAsteroid: '#888888',
  enemyPlanet: '#4444ff',
  enemyVirus: '#ff4444',
  projectile: '#ffff00',
  healthPowerUp: '#ff0000',
  energyPowerUp: '#0000ff',
};
```

#### Typography
```typescript
const typography = {
  fontFamily: {
    primary: 'system-ui, -apple-system, sans-serif',
    monospace: 'Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
};
```

## 🧪 Testing Strategy

### Unit Testing with Jest

#### Test Structure
```typescript
describe('GameEngine', () => {
  let gameEngine: GameEngine;
  
  beforeEach(() => {
    gameEngine = new GameEngine(mockConfig);
  });
  
  describe('player movement', () => {
    it('should move player up when up control is active', () => {
      const initialY = gameEngine.getGameState().player.position.y;
      const controls: Controls = { up: true, down: false, left: false, right: false, fire: false };
      
      gameEngine.update(0.1, controls);
      
      const newY = gameEngine.getGameState().player.position.y;
      expect(newY).toBeLessThan(initialY);
    });
  });
});
```

#### Testing Best Practices
- **Arrange-Act-Assert** pattern
- **Isolated tests**: Each test is independent
- **Mock external dependencies**: Use Jest mocks
- **Test edge cases**: Boundary conditions and error states

### E2E Testing with Playwright

#### Test Structure
```typescript
test('should start the game', async ({ page }) => {
  await page.goto('/');
  
  // Click start game button
  await page.locator('text=🎮 Start Game').click();
  
  // Wait for game to load
  await page.waitForTimeout(2000);
  
  // Verify game elements are present
  await expect(page.locator('text=Health')).toBeVisible();
});
```

#### Testing Strategies
- **Critical user paths**: Menu → Game → Gameplay
- **Cross-browser testing**: Chrome, Firefox, Safari, Edge
- **Mobile testing**: Touch interactions and responsive design
- **Performance testing**: Load times and frame rates

## 🚀 Performance Optimization

### Rendering Performance

#### Component Optimization
```typescript
// Use React.memo for expensive components
const GameHUD = React.memo(({ gameState }: GameHUDProps) => {
  // Component logic
}, (prevProps, nextProps) => {
  // Custom comparison for gameState
  return prevProps.gameState.player.health === nextProps.gameState.player.health &&
         prevProps.gameState.player.energy === nextProps.gameState.player.energy;
});

// Use useMemo for expensive calculations
const enemyCount = useMemo(() => {
  return gameState.enemies.filter(enemy => enemy.active).length;
}, [gameState.enemies]);
```

#### Game Loop Optimization
```typescript
// Efficient update loop
class GameEngine {
  private lastUpdate = 0;
  private targetFPS = 60;
  private targetFrameTime = 1000 / this.targetFPS;
  
  update(currentTime: number) {
    const deltaTime = currentTime - this.lastUpdate;
    
    if (deltaTime >= this.targetFrameTime) {
      this.updateGame(deltaTime / 1000); // Convert to seconds
      this.lastUpdate = currentTime;
    }
  }
}
```

### Memory Management

#### Object Pooling
```typescript
class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;
  
  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }
  
  get(): T {
    return this.pool.pop() || this.createFn();
  }
  
  release(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// Usage
const projectilePool = new ObjectPool(
  () => createProjectile(),
  (projectile) => resetProjectile(projectile),
  50
);
```

#### Garbage Collection Optimization
```typescript
// Avoid creating objects in update loops
class GameEngine {
  private tempVector = { x: 0, y: 0 }; // Reuse temp objects
  
  update() {
    // Instead of: const direction = { x: 1, y: 0 };
    this.tempVector.x = 1;
    this.tempVector.y = 0;
    // Use this.tempVector
  }
}
```

## 🔍 Debugging

### Development Tools

#### React Native Debugger
```bash
# Install React Native Debugger
npm install -g react-native-debugger

# Enable debugging
npm start -- --reset-cache
```

#### Expo Tools
```bash
# Open developer menu in Expo Go
# Shake device or Cmd+D (iOS) / Cmd+M (Android)

# Enable remote debugging
# Developer menu → Debug Remote JS

# Enable performance monitor
# Developer menu → Enable Performance Monitor
```

### Game-Specific Debugging

#### Debug Overlays
```typescript
const DebugOverlay = ({ gameState }: { gameState: GameState }) => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="debug-overlay">
      <div>FPS: {gameState.fps}</div>
      <div>Objects: {gameState.totalObjects}</div>
      <div>Player: ({gameState.player.position.x}, {gameState.player.position.y})</div>
    </div>
  );
};
```

#### Console Logging
```typescript
class GameEngine {
  private debug = process.env.NODE_ENV === 'development';
  
  private log(message: string, data?: any) {
    if (this.debug) {
      console.log(`[GameEngine] ${message}`, data);
    }
  }
  
  spawnEnemy() {
    const enemy = this.createEnemy();
    this.log('Enemy spawned', { id: enemy.id, type: enemy.type });
  }
}
```

## 📱 Platform-Specific Development

### Web Platform

#### Service Workers
```typescript
// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => console.log('SW registered'))
    .catch(error => console.log('SW registration failed'));
}
```

#### Web-Specific Features
```typescript
// Keyboard controls
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'Space':
        event.preventDefault(); // Prevent page scroll
        setControls(prev => ({ ...prev, fire: true }));
        break;
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Mobile Platform

#### Touch Controls
```typescript
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';

const MobileControls = () => {
  const handlePan = (event: any) => {
    const { translationX, translationY } = event.nativeEvent;
    // Update movement based on pan gesture
  };
  
  return (
    <PanGestureHandler onGestureEvent={handlePan}>
      <View style={styles.controlArea}>
        {/* Touch control UI */}
      </View>
    </PanGestureHandler>
  );
};
```

#### Device Orientation
```typescript
import { Dimensions } from 'react-native';

const useOrientation = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', setDimensions);
    return () => subscription?.remove();
  }, []);
  
  return {
    isLandscape: dimensions.width > dimensions.height,
    dimensions
  };
};
```

## 🔄 State Management

### Game State Flow

```
User Input → Controls → Game Engine → State Update → Component Re-render
                                  ↓
                              Event Emission → Side Effects (Audio, Storage)
```

### Event System
```typescript
class EventEmitter {
  private listeners: { [event: string]: Function[] } = {};
  
  on(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  emit(event: string, data?: any): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}
```

### Persistent Storage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

class GameStorage {
  static async saveHighScore(score: number): Promise<void> {
    try {
      await AsyncStorage.setItem('galax_high_score', score.toString());
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  }
  
  static async getHighScore(): Promise<number> {
    try {
      const score = await AsyncStorage.getItem('galax_high_score');
      return score ? parseInt(score, 10) : 0;
    } catch (error) {
      console.error('Failed to load high score:', error);
      return 0;
    }
  }
}
```

## 🤝 Contributing Guidelines

### Code Style

#### TypeScript Guidelines
- Use **strict mode**: All types must be explicit
- **Interfaces over types**: For object shapes
- **Enums for constants**: When values are known at compile time
- **Generic constraints**: Use extends for generic bounds

#### Component Guidelines
```typescript
// Good: Functional component with TypeScript
interface Props {
  gameState: GameState;
  onGameStateChange: (state: GameState) => void;
}

const GameComponent: React.FC<Props> = ({ gameState, onGameStateChange }) => {
  // Component logic
};

// Good: Custom hook
const useGameEngine = (config: GameConfig) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  // Hook logic
  return { gameState, actions };
};
```

### Git Workflow

#### Branch Naming
- **Feature**: `feature/add-power-up-system`
- **Bug fix**: `fix/collision-detection-bug`
- **Hotfix**: `hotfix/critical-crash-fix`
- **Documentation**: `docs/update-deployment-guide`

#### Commit Messages
```
type(scope): brief description

Detailed description of the change.

Closes #123
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

#### Pull Request Guidelines
1. **Clear title** and description
2. **Link related issues**
3. **Add screenshots** for UI changes
4. **Include test coverage**
5. **Update documentation** if needed

---

*For more information, see the [main README](../README.md) and [deployment guide](DEPLOYMENT.md).*