import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../utils/config'; // Updated import path

const IconFA: React.FC<{ name: string; size: number; color: string; style?: any }> = ({
  name,
  size,
  color,
  style,
}) => {
  const Icon = FontAwesome as any;
  return <Icon name={name} size={size} color={color} style={style} />;
};

const IconMCI: React.FC<{ name: string; size: number; color: string; style?: any }> = ({
  name,
  size,
  color,
  style,
}) => {
  const Icon = MaterialCommunityIcons as any;
  return <Icon name={name} size={size} color={color} style={style} />;
};

const SignInScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleGetCode = async () => {
    if (!email.trim()) {
      setErrorMessage('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/send-otp-signin`, { email });
      if (response.data.success) {
        navigation.navigate('SignInOTP', { email });
      } else {
        setErrorMessage(response.data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      setErrorMessage(
        axios.isAxiosError(error) && error.response
          ? error.response.data?.message || 'Failed to send OTP. Please try again.'
          : 'Failed to send OTP. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <Image source={require('../assets/background.png')} style={styles.backgroundImage} />
            <View style={styles.overlay} />

            <Image source={require('../assets/icon.png')} style={styles.logo} />
            <Text style={styles.appName}>BOOST ARABIA</Text>

            <Text style={styles.title}>Log in</Text>
            <Text style={styles.subtitle}>Please sign in to your existing account</Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#8b929a"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMessage) setErrorMessage('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            <TouchableOpacity
              style={styles.getCodeButton}
              onPress={handleGetCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.getCodeText}>Get Code</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OR LOGIN WITH</Text>
              <View style={styles.line} />
            </View>

            <Text style={styles.footer}>
              Don't have an account?{' '}
              <Text style={styles.signUpLink} onPress={handleSignUp}>
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)' },
  logo: { width: 80, height: 80, marginBottom: 10 },
  appName: { color: '#FFA500', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: '#8b929a', fontSize: 14, marginBottom: 20 },
  input: {
    width: '85%',
    height: 50,
    backgroundColor: '#262b31',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#ffffff',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  getCodeButton: {
    width: '85%',
    height: 50,
    backgroundColor: '#FFA500',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  getCodeText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#8b929a',
  },
  dividerText: {
    color: '#8b929a',
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    height: 50,
    backgroundColor: '#1a1f24',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  socialText: {
    color: '#ffffff',
    fontSize: 16,
  },
  footer: {
    color: '#8b929a',
    marginTop: 20,
    fontSize: 14,
  },
  signUpLink: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
});

export default SignInScreen;
