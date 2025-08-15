# 🚀 Galax - Space Adventure Remastered

A modern cross-platform recreation of the classic 2011 C++ space shooter game, now built with React Native, Expo, and TypeScript for web and mobile platforms.

![Galax Game Screenshot](docs/images/galax-screenshot.png)

## 🎮 Game Overview

**Galax** is a 2D side-scrolling space shooter where players control a spaceship navigating through space and time. Destroy enemies, collect power-ups, and survive as long as possible while searching for the wormhole that will take you home.

### Features

- 🌌 **Cross-platform**: Runs on web browsers and mobile devices
- 🎯 **Classic Gameplay**: Faithful recreation of the original game mechanics
- 🎨 **Modern UI**: Bootstrap-styled interface with responsive design
- 🎮 **Adaptive Controls**: Touch controls for mobile, keyboard for desktop
- ⚡ **Performance Optimized**: 60fps gameplay with efficient collision detection
- 🏆 **Score System**: High score tracking with persistent storage
- 🔊 **Audio**: Original sound effects and background music
- 📱 **PWA Ready**: Installable as a Progressive Web App

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **Styling**: Bootstrap 5 + React Bootstrap
- **Graphics**: Three.js / React Three Fiber
- **Testing**: Jest (unit) + Playwright (E2E)
- **CI/CD**: GitHub Actions
- **Infrastructure**: Docker + Terraform
- **Deployment**: Azure App Service + Expo

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd galax/galax-game
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start development server**
   ```bash
   # For web development
   npm run web
   
   # For mobile development (requires Expo CLI)
   npm start
   ```

4. **Access the game**
   - **Web**: Open http://localhost:19006
   - **Mobile**: Scan QR code with Expo Go app

## 🧪 Testing

### Unit Tests
```bash
# Run all unit tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### End-to-End Tests
```bash
# Run E2E tests (headless)
npm run test:e2e

# Run with browser UI
npm run test:e2e:headed
```

## 🐳 Docker Development

### Local Development
```bash
# Start development environment
npm run docker:dev

# Build production image
npm run docker:build

# Run production container
npm run docker:run
```

### Docker Compose
```bash
# Development
docker-compose up galax-dev

# Production
docker-compose up galax-prod
```

## 🌍 Deployment

### Azure Deployment

1. **Setup Azure credentials**
   ```bash
   # Login to Azure CLI
   az login
   
   # Create service principal for GitHub Actions
   az ad sp create-for-rbac --name "galax-game-deploy" --role contributor \
     --scopes /subscriptions/{subscription-id} --sdk-auth
   ```

2. **Configure GitHub Secrets**
   - `AZURE_CREDENTIALS`: Output from service principal creation
   - `EXPO_TOKEN`: Expo access token
   - `NETLIFY_AUTH_TOKEN`: For PR previews
   - `NETLIFY_SITE_ID`: For PR previews

3. **Deploy with Terraform**
   ```bash
   cd infrastructure
   terraform init
   terraform plan
   terraform apply
   ```

### Manual Deployment

#### Web Build
```bash
npm run build:web
# Deploy web-build/ directory to your web server
```

#### Expo Deployment
```bash
# Install Expo CLI
npm install -g @expo/cli

# Login to Expo
expo login

# Publish update
expo publish
```

## 🎮 How to Play

### Controls

**Desktop (Web)**:
- **Movement**: WASD keys or Arrow keys
- **Fire**: Spacebar or Enter
- **Pause**: ESC key

**Mobile**:
- **Movement**: Left side touch pad (directional buttons)
- **Fire**: Right side fire button
- **Pause**: Tap pause button (top right)

### Gameplay

1. **Objective**: Survive as long as possible and achieve the highest score
2. **Enemies**: Destroy asteroids, planets, and viruses for points
3. **Power-ups**: Collect health and energy boosts
4. **Scoring**: Different enemies give different point values
5. **Health**: Avoid collisions to maintain your health
6. **Energy**: Required for firing weapons (regenerates over time)

### Scoring System

- **Asteroids**: 100 points
- **Planets**: 200 points  
- **Viruses**: 50 points
- **Survival Bonus**: Points increase over time

## 🏗️ Project Structure

```
galax-game/
├── src/
│   ├── components/          # React components
│   │   ├── GameCanvas.tsx   # Main game rendering
│   │   ├── GameControls.tsx # Input handling
│   │   └── GameHUD.tsx      # UI overlay
│   ├── screens/             # Screen components
│   │   ├── MenuScreen.tsx   # Main menu
│   │   └── GameScreen.tsx   # Game screen
│   ├── game/                # Game logic
│   │   └── GameEngine.ts    # Core game engine
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Utility functions
│   └── assets/              # Game assets
│       ├── images/          # Sprites and textures
│       └── sounds/          # Audio files
├── tests/
│   ├── unit/               # Jest unit tests
│   └── e2e/                # Playwright E2E tests
├── infrastructure/         # Terraform configs
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Docker setup
└── Dockerfile             # Container definition
```

## 🔧 Development

### Code Style

- **ESLint**: Automated linting
- **TypeScript**: Strict type checking
- **Prettier**: Code formatting

```bash
npm run lint          # Check code style
npm run lint:fix      # Fix auto-fixable issues
npm run type-check    # TypeScript validation
```

### Game Architecture

The game follows a modular architecture:

1. **GameEngine**: Core game logic and state management
2. **Components**: React components for rendering and UI
3. **Types**: TypeScript interfaces for type safety
4. **Utils**: Reusable utility functions

### Adding New Features

1. **Create types** in `src/types/`
2. **Implement logic** in `src/game/`
3. **Add components** in `src/components/`
4. **Write tests** in `tests/`
5. **Update documentation**

## 📊 Performance

### Optimization Features

- **Object Pooling**: Efficient memory management
- **Collision Detection**: Optimized AABB collision system
- **Render Optimization**: Only render visible objects
- **Asset Loading**: Lazy loading of game assets
- **Bundle Splitting**: Code splitting for web builds

### Performance Targets

- **60 FPS** gameplay on modern devices
- **< 3s** initial load time
- **< 100MB** total bundle size
- **90%+** Lighthouse performance score

## 🐛 Troubleshooting

### Common Issues

1. **Dependencies conflicts**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Build failures**
   ```bash
   # Clear caches
   npm start -- --clear-cache
   expo r -c
   ```

3. **Docker issues**
   ```bash
   # Reset Docker environment
   docker-compose down
   docker system prune -f
   ```

4. **TypeScript errors**
   ```bash
   npm run type-check
   ```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Write tests for new features
- Follow TypeScript strict mode
- Use conventional commit messages
- Update documentation for API changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Game**: Created by Rafael Silva in 2011
- **Sprites**: Original artwork and public domain assets

## 📧 Support

- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)
- **Email**: [rafaelsilva1406@gmail.com](mailto:rafaelsilva1406@gmail.com)

---

Built with ❤️ using React Native, Expo, and TypeScript

*"Navigate through space and time - find your way home!"*