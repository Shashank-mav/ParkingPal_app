import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';

import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        setUser({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          // Add more fields here 
        });
      } else {
        // No user is signed in.
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permission to access media library denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        const auth = getAuth();
        updateProfile(auth.currentUser, { photoURL: result.uri })
          .then(() => {
            setUser((prevUser) => ({ ...prevUser, photoURL: result.uri }));
          })
          .catch((error) => {
            console.error('Error updating profile photo:', error);
          });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // Dummy data for now
  const menuItems = [
    { id: '1', title: 'Add Vehicle', icon: 'car' },
    { id: '2', title: 'Settings', icon: 'cogs' },
    { id: '3', title: 'Notifications', icon: 'bell' },
    { id: '4', title: 'Get Help', icon: 'question-circle' },
  ];

  // Render each item inn flatlist
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem}>
      <Icon name={item.icon} size={20} color="black" style={styles.menuItemIcon} />
      <Text style={styles.menuItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={pickImage} style={styles.editIconContainer}>
          <Icon name="pencil" size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.nameSection}>
          <Text style={styles.userName}>Shashank Bhadouriya</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        <Image source={{ uri: user?.photoURL }} style={styles.profilePhoto} />
      </View>

      {/* Below Section */}
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    position: 'relative',
  },
  nameSection: {
    margin: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  flatList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemIcon: {
    marginRight: 10,
  },
  editIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'tomato',
    padding: 5,
    borderRadius: 15,
    zIndex: 1,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default ProfileScreen;
