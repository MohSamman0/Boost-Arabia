// NavigationConfig.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import BoostService from '../screens/BoostService';
import SignInScreen from '../screens/SignIn';
import SignInOTPScreen from '../screens/SignInOTP';
import SignUpScreen from '../screens/SignUP';
import SignUpOTPScreen from '../screens/SignUpOTP';
import OrderHistory from '../screens/OrderHistory';
import ProfileScreen from '../screens/Profile';
import OrderDetailsScreen from '../screens/OrderDetails';

export type RootStackParamList = {
  Home: { gender: 'male' | 'female' };
  Boost: undefined;
  SignIn: undefined;
  SignInOTP: undefined;
  SignUp: undefined;
  SignUpOTP: undefined;
  Order: undefined;
  Profile: undefined;
  OrderDetails: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const MyStack = () => {
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
          initialParams={{ gender: 'male' }}
          options={{ headerShown: false }}  
        />
        <Stack.Screen 
          name="Boost" 
          component={BoostService} 
          options={{ headerShown: false }}  
        />
        <Stack.Screen 
          name="Order" 
          component={OrderHistory} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="OrderDetails" 
          component={OrderDetailsScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
