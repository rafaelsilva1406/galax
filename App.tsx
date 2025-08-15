import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import 'bootstrap/dist/css/bootstrap.min.css';

import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';

export type AppScreen = 'menu' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('menu');

  const handleStartGame = () => {
    setCurrentScreen('game');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {currentScreen === 'menu' && (
        <MenuScreen onStartGame={handleStartGame} />
      )}
      
      {currentScreen === 'game' && (
        <GameScreen onBackToMenu={handleBackToMenu} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000011',
  },
});
