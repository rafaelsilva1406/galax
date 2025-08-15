import '@testing-library/react-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(() => (component: any) => component),
    Directions: {},
  };
});

// Mock Expo modules
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock Three.js / React Three Fiber
jest.mock('@react-three/fiber/native', () => ({
  Canvas: ({ children }: any) => children,
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({})),
}));

// Mock Bootstrap components for React Native
jest.mock('react-bootstrap', () => ({
  Container: ({ children }: any) => children,
  Row: ({ children }: any) => children,
  Col: ({ children }: any) => children,
  Button: ({ children, onClick }: any) => ({
    ...children,
    props: { ...children?.props, onPress: onClick }
  }),
  Modal: ({ children, show }: any) => show ? children : null,
  ProgressBar: () => 'ProgressBar',
  Badge: ({ children }: any) => children,
  Card: ({ children }: any) => children,
}));

// Global test utilities
global.requestAnimationFrame = (cb: FrameRequestCallback) => {
  setTimeout(cb, 0);
  return 0;
};

global.cancelAnimationFrame = () => {};

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
  
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('componentWillReceiveProps has been renamed')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});