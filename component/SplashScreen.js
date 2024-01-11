// SplashScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ParkingPal</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#E26310', // Metallic Orange
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
