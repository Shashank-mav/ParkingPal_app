// ExploreScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SearchBar } from 'react-native-elements';
import * as Location from 'expo-location';
import axios from 'axios';

const ExploreScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [region, setRegion] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      console.log('Checking location permissions...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission status:', status);

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      console.log('Requesting current position...');
      const location = await Location.getCurrentPositionAsync({});
      console.log('Location:', location);

      const initialRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setRegion(initialRegion);
      setCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Error getting location');
    }
  };

  const handleSearch = async () => {
    try {
      const encodedAddress = encodeURIComponent(searchText);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyBtuF5D6shUEBkjCNCFvS5uiX5akHjYHIo`
      );

      console.log('Geocoding response:', response.data);

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        const location = result.geometry.location;

        console.log('Location found:', location);

        setRegion({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        setCoordinates({
          latitude: location.lat,
          longitude: location.lng,
        });

        setErrorMsg(null); // Clear any previous error message
      } else {
        setErrorMsg('Location not found');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setErrorMsg('Error searching location');
    }
  };



  let displayText = 'Waiting for location...';
  if (errorMsg) {
    displayText = errorMsg;
  } else if (coordinates) {
    displayText = `Coordinates: ${coordinates.latitude}, ${coordinates.longitude}`;
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search location..."
        onChangeText={(text) => setSearchText(text)}
        onSubmitEditing={handleSearch}
        value={searchText}
      />
      <MapView style={styles.map} region={region}>
        {region && <Marker coordinate={region} title="Current Location" />}
      </MapView>
      <Button title="Get My Location" onPress={() => getLocation()} />
      <Text>{displayText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  map: {
    flex: 1,
  },
});

export default ExploreScreen;
