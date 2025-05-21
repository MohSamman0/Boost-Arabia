// screens/Order.tsx

import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { ThemeContext } from '../theme/ThemeContext';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';
import { Ionicons } from '@expo/vector-icons';

type OrderHistoryNavProp = StackNavigationProp<RootStackParamList, 'Order'>;

const OrderHistory: React.FC = () => {
  const navigation = useNavigation<OrderHistoryNavProp>();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <AppHeader gender="male" toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          Coming Soon
        </Text>
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
          Order History feature is under development
        </Text>
        <TouchableOpacity 
          style={[styles.backButton, isDarkMode && styles.darkBackButton]} 
          onPress={() => navigation.navigate('Home', { gender: 'male' })}
        >
          <Ionicons name="arrow-back" size={20} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={[styles.backButtonText, isDarkMode && styles.darkText]}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>

      <AppFooter isDarkMode={isDarkMode} activeTab="Order" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  darkContainer: {
    backgroundColor: '#101b23',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkBackButton: {
    backgroundColor: '#1e293b',
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default OrderHistory;
