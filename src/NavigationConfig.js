// NavigationConfig.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import BoostScreen from '../screens/Boost'; // New Boost screen added
import SignInScreen from '../screens/SignIn';
import SignInOTPScreen from '../screens/SignInOTP';
import SignUpScreen from '../screens/SignUP';
import SignUpOTPScreen from '../screens/SignUpOTP';
import OrderScreen from '../screens/Order';
import ProfileScreen from '../screens/Profile';
import OrderDetailsScreen from '../screens/OrderDetails';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Authentication Screens */}
        <Stack.Screen 
          name="SignIn" 
          component={SignInScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SignInOTP" 
          component={SignInOTPScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SignUpOTP" 
          component={SignUpOTPScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* Main Screens */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}  
        />
        <Stack.Screen 
          name="Boost" 
          component={BoostScreen} 
          options={{ headerShown: false }}  
        />
        <Stack.Screen 
          name="Order" 
          component={OrderScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
