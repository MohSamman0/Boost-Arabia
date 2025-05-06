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
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import BASE_URL from '../helpers/config'; // Import the base URL

const IconFA: React.FC<{ name: string; size: number; color: string; style?: any }> = ({ name, size, color, style }) => {
  const Icon = FontAwesome as any;
  return <Icon name={name} size={size} color={color} style={style} />;
};

const IconMCI: React.FC<{ name: string; size: number; color: string; style?: any }> = ({ name, size, color, style }) => {
  const Icon = MaterialCommunityIcons as any;
  return <Icon name={name} size={size} color={color} style={style} />;
};

WebBrowser.maybeCompleteAuthSession();

const SignInScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '662908961146-i4ct0bg1piuq9mmtjbeuvuh5icrbnela.apps.googleusercontent.com',
    iosClientId: '662908961146-grh6hu2on9i1v75vj3g6gf7fcpmg619t.apps.googleusercontent.com',
    androidClientId: '662908961146-jrp68srgknc21m7ulejlodjiscvs9dtc.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri(),
  });

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

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
      // Updated endpoint to match the backend
      const response = await axios.post(`${BASE_URL}/api/auth/send-otp-signin`, { email });
      if (response.data.success) {
        navigation.navigate('SignInOTP', { email });
      } else {
        setErrorMessage(response.data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data?.message || 'Failed to send OTP. Please try again.');
      } else {
        setErrorMessage('Failed to send OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();
      if (result.type === 'success' && result.authentication?.idToken) {
        const response = await axios.post(`${BASE_URL}/api/auth/google-signin`, {
          token: result.authentication.idToken,
        });

        if (response.data.success) {
          Alert.alert('Success', 'Google Sign-In successful!');
        } else {
          Alert.alert('Error', response.data.message || 'Sign-In failed');
        }
      } else {
        Alert.alert('Error', 'Google Sign-In was cancelled or failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong during Google Sign-In');
    }
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple Login', 'Apple login is not implemented yet.');
  };

  const handleDiscordLogin = () => {
    Alert.alert('Discord Login', 'Discord login is not implemented yet.');
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
              {isLoading ? <ActivityIndicator color="#000000" /> : <Text style={styles.getCodeText}>Get Code</Text>}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OR LOGIN WITH</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
              <IconFA name="apple" size={20} color="#ffffff" style={styles.icon} />
              <Text style={styles.socialText}>Login via Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
              <IconFA name="google" size={20} color="#ffffff" style={styles.icon} />
              <Text style={styles.socialText}>Login via Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={handleDiscordLogin}>
              <IconMCI name="discord" size={20} color="#ffffff" style={styles.icon} />
              <Text style={styles.socialText}>Login via Discord</Text>
            </TouchableOpacity>

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
    marginBottom: 10,
  },
  appName: {
    color: '#FFA500',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#8b929a',
    fontSize: 14,
    marginBottom: 20,
  },
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
