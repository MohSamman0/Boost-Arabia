import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../utils/config'; // Updated import path

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignUp = async () => {
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
      const response = await axios.post(`${BASE_URL}/api/auth/send-otp-signup`, { email });
      if (response.data.success) {
        Alert.alert('OTP Sent', response.data.message || 'A verification code has been sent to your email.');
        navigation.navigate('SignUpOTP', { email });
      } else {
        setErrorMessage(response.data.message || 'Failed to send OTP.');
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            <Image
              source={require('../assets/background.png')}
              style={styles.backgroundImage}
            />
            <View style={styles.overlay} />

            <Image
              source={require('../assets/icon.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Enter your email to create an account</Text>

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

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.footer}>
              Already have an account?{' '}
              <Text style={styles.signInLink} onPress={() => navigation.navigate('SignIn')}>
                Sign In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  logo: {
    width: 80,
    height: 80,
    top: -60,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    top: -30,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '85%',
    height: 50,
    backgroundColor: '#262b31',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#ffffff',
    marginBottom: 30,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  signUpButton: {
    width: '85%',
    height: 50,
    backgroundColor: '#FFA500',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    color: '#8b929a',
    marginTop: 20,
    fontSize: 14,
  },
  signInLink: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
