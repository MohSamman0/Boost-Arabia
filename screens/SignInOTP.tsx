import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import BASE_URL from '../helpers/config';

const SignInOTP: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const cleanValue = value.replace(/[^0-9]/g, '');

    if (cleanValue === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanValue.substring(0, 1);
    setOtp(newOtp);

    if (index < 5 && cleanValue !== '') {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleResend = async () => {
    if (canResend) {
      setIsLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/api/auth/resend-otp-signin`, { email });
        setIsLoading(false);
        if (response.data.success) {
          setTimer(30);
          setCanResend(false);
          Alert.alert('OTP Resent', 'A new OTP has been sent to your email.');
        } else {
          Alert.alert('Error', 'Failed to resend OTP.');
        }
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Error', 'Failed to resend OTP. Please try again later.');
      }
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      setIsLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/api/auth/verify-otp-signin`, { 
          email, 
          otp: otpValue 
        });
        setIsLoading(false);
        if (response.data.success) {
          navigation.navigate('Home');
        } else {
          setErrorMessage('Invalid OTP. Please try again.');
        }
      } catch (error) {
        setIsLoading(false);
        setErrorMessage('Failed to verify OTP. Please try again later.');
      }
    } else {
      setErrorMessage('Please enter all 6 digits of your OTP.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Your Email</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../assets/mail_outgoing.png')}
            style={{ width: 80, height: 80 }}
          />
        </View>

        <Text style={styles.description}>
          We've sent a verification code to
        </Text>
        <Text style={styles.email}>{email}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              selectTextOnFocus={true}
            />
          ))}
        </View>

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity 
          style={[
            styles.verifyButton,
            otp.join('').length === 6 && styles.verifyButtonActive
          ]}
          onPress={handleVerify}
          disabled={otp.join('').length !== 6 || isLoading}
        >
          <Text style={styles.verifyButtonText}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity 
            onPress={handleResend}
            disabled={!canResend}
          >
            <Text style={[
              styles.resendButtonText,
              !canResend && styles.resendButtonTextDisabled
            ]}>
              Resend Code {!canResend && `(${timer}s)`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('TermsOfService')}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            Privacy Policy
          </Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101b23',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  description: {
    color: '#68d6ff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 24,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#68d6ff',
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: '#1e293b',
  },
  verifyButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#333',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  verifyButtonActive: {
    backgroundColor: '#68d6ff',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  resendContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  resendText: {
    color: '#cccccc',
    fontSize: 16,
    marginBottom: 10,
  },
  resendButtonText: {
    color: '#68d6ff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButtonTextDisabled: {
    color: '#808080',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#101b23',
  },
  footerText: {
    color: '#cccccc',
    fontSize: 14,
    textAlign: 'center',
  },
  linkText: {
    color: '#68d6ff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignInOTP;
