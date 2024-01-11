import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';  // Import createNativeStackNavigator
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from './firebaseConfig';  // Import the app instance from firebaseConfig
import Ionicons from 'react-native-vector-icons/Ionicons';

import ExploreScreen from './component/ExploreScreen';
import SavedScreen from './component/SavedScreen';
import ReservationScreen from './component/Reservation';
import InboxScreen from './component/Inbox';
import ProfileScreen from './component/ProfileScreen';
import SignInScreen from './component/auth/SignInScreen';
import SignUpScreen from './component/auth/SignUpScreen';

const auth = getAuth(app);
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();  // Create a native stack navigator

const App = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Listen for changes in authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [auth, initializing]);

  // Show loading while initializing
  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? (
        // If user is authenticated, show the tab navigator
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Explore') {
                iconName = focused ? 'ios-search' : 'ios-search-outline';
              } else if (route.name === 'Saved') {
                iconName = focused ? 'ios-heart' : 'ios-heart-outline';
              } else if (route.name === 'Reservation') {
                iconName = focused ? 'ios-calendar' : 'ios-calendar-outline';
              } else if (route.name === 'Inbox') {
                iconName = focused ? 'ios-mail' : 'ios-mail-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'ios-person' : 'ios-person-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          {/* Tab screens */}
          <Tab.Screen name="Explore" component={ExploreScreen} />
          <Tab.Screen name="Saved" component={SavedScreen} />
          <Tab.Screen name="Reservation" component={ReservationScreen} />
          <Tab.Screen name="Inbox" component={InboxScreen} />
          <Tab.Screen
           name="Profile"
           component={ProfileScreen}
           initialParams={user} 
          />

        </Tab.Navigator>
      ) : (
        // If user is not authenticated, show authentication screens using stack navigator
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
