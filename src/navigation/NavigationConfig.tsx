// NavigationConfig.tsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/Home';
import BoostService from '../screens/BoostService';
import SignInScreen from '../screens/SignIn';
import SignInOTPScreen from '../screens/SignInOTP';
import SignUpScreen from '../screens/SignUP';
import SignUpOTPScreen from '../screens/SignUpOTP';
import OrderHistory from '../screens/OrderHistory';
import OrderDetailsScreen from '../screens/OrderDetails';
import SettingsScreen from '../screens/Settings';

// Auth stack
const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="SignIn" component={SignInScreen} />
    <AuthStack.Screen name="SignInOTP" component={SignInOTPScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="SignUpOTP" component={SignUpOTPScreen} />
  </AuthStack.Navigator>
);

// Orders stack (for OrderDetails)
const OrdersStack = createStackNavigator();
const OrdersStackScreen = () => (
  <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
    <OrdersStack.Screen name="Order" component={OrderHistory} />
    <OrdersStack.Screen name="OrderDetails" component={OrderDetailsScreen} />
  </OrdersStack.Navigator>
);

// Home stack (if you want to add details later)
const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} initialParams={{ gender: 'male' }} />
  </HomeStack.Navigator>
);

// Boost stack (if you want to add details later)
const BoostStack = createStackNavigator();
const BoostStackScreen = () => (
  <BoostStack.Navigator screenOptions={{ headerShown: false }}>
    <BoostStack.Screen name="Boost" component={BoostService} />
  </BoostStack.Navigator>
);

// Settings stack (if you want to add details later)
const SettingsStack = createStackNavigator();
const SettingsStackScreen = () => (
  <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
    <SettingsStack.Screen name="Settings" component={SettingsScreen} />
  </SettingsStack.Navigator>
);

// Main Tab Navigator
const Tab = createBottomTabNavigator();
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'HomeTab') iconName = 'home';
        else if (route.name === 'BoostTab') iconName = 'flash';
        else if (route.name === 'OrdersTab') iconName = 'document-text';
        else if (route.name === 'SettingsTab') iconName = 'settings';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#635BFF',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ title: 'Home' }} />
    <Tab.Screen name="BoostTab" component={BoostStackScreen} options={{ title: 'Boost' }} />
    <Tab.Screen name="OrdersTab" component={OrdersStackScreen} options={{ title: 'Orders' }} />
    <Tab.Screen name="SettingsTab" component={SettingsStackScreen} options={{ title: 'Settings' }} />
  </Tab.Navigator>
);

// Simple Auth Context for demo
const AuthContext = createContext({ isSignedIn: false, signIn: () => {}, signOut: () => {} });
export const useAuth = () => useContext(AuthContext);

const RootNavigator = () => {
  const [isSignedIn, setIsSignedIn] = useState(false); // TODO: Replace with real auth logic

  // Simulate auto-login for demo (remove for real app)
  useEffect(() => {
    // setIsSignedIn(true); // Uncomment to always show main app
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn: () => setIsSignedIn(true), signOut: () => setIsSignedIn(false) }}>
      <NavigationContainer>
        {isSignedIn ? <MainTabNavigator /> : <AuthStackScreen />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default RootNavigator;
