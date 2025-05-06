import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MainHeader: React.FC<{ gender: 'male' | 'female'; toggleTheme: () => void; isDarkMode: boolean }> = ({ gender, toggleTheme, isDarkMode }) => {
  const avatarSource = gender === 'male' 
    ? require('../assets/avatar_male.png') 
    : require('../assets/avatar_male.png'); // Correct avatar image based on gender

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Logo with Icon */}
      <View style={styles.logoContainer}>
        <Ionicons name="rocket" size={24} color="#007AFF" />
        <Text style={[styles.logoText, isDarkMode && styles.darkLogoText]} accessibilityRole="header">Boost Arabia</Text>
      </View>

      {/* Theme Toggle and Profile */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={toggleTheme} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Toggle theme">
          <Ionicons 
            name={isDarkMode ? "moon" : "sunny"} 
            size={24} 
            color={isDarkMode ? "#fff" : "#000"} 
          />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Profile">
          <Image source={avatarSource} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  darkContainer: {
    backgroundColor: '#101b23',
    borderBottomColor: '#1e293b',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  darkLogoText: {
    color: '#fff',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    resizeMode: 'cover',
  },
});

export default MainHeader;
