import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { ThemeContext } from '../theme/ThemeContext';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';
import { Ionicons } from '@expo/vector-icons';

type SettingsNavProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const Settings: React.FC = () => {
  const navigation = useNavigation<SettingsNavProp>();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isPushEnabled, setIsPushEnabled] = useState(true);
  const [isEmailEnabled, setIsEmailEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout logic
            navigation.navigate('SignIn');
          },
        },
      ],
    );
  };

  const settingsSections = [
    {
      title: 'Preferences',
      options: [
        {
          title: 'Appearance',
          icon: 'color-palette',
          action: () => toggleTheme(),
          value: isDarkMode ? 'Dark Mode' : 'Light Mode',
          type: 'select'
        },
        {
          title: 'Language',
          icon: 'language',
          action: () => console.log('Language settings'),
          value: 'English',
          type: 'select'
        }
      ]
    },
    {
      title: 'Notifications',
      options: [
        {
          title: 'Push Notifications',
          icon: 'notifications',
          type: 'switch',
          value: isPushEnabled,
          action: () => setIsPushEnabled(!isPushEnabled)
        },
        {
          title: 'Email Notifications',
          icon: 'mail',
          type: 'switch',
          value: isEmailEnabled,
          action: () => setIsEmailEnabled(!isEmailEnabled)
        }
      ]
    },
    {
      title: 'Account',
      options: [
        {
          title: 'Payment Methods',
          icon: 'card',
          action: () => console.log('Payment methods'),
          type: 'button'
        }
      ]
    },
    {
      title: 'Support',
      options: [
        {
          title: 'Help Center',
          icon: 'help-circle',
          action: () => console.log('Help center'),
          type: 'button'
        },
        {
          title: 'Contact Support',
          icon: 'headset',
          action: () => console.log('Contact support'),
          type: 'button'
        },
        {
          title: 'Report a Problem',
          icon: 'warning',
          action: () => console.log('Report problem'),
          type: 'button'
        }
      ]
    },
    {
      title: 'Legal',
      options: [
        {
          title: 'Privacy Policy',
          icon: 'shield',
          action: () => console.log('Privacy policy'),
          type: 'button'
        },
        {
          title: 'Terms of Service',
          icon: 'document-text',
          action: () => console.log('Terms of service'),
          type: 'button'
        }
      ]
    }
  ];

  const renderOption = (option: any) => {
    switch (option.type) {
      case 'switch':
        return (
          <Switch
            value={option.value}
            onValueChange={option.action}
            trackColor={{ false: '#767577', true: '#635BFF' }}
            thumbColor={option.value ? '#fff' : '#f4f3f4'}
          />
        );
      case 'select':
        return (
          <View style={styles.optionRight}>
            <Text style={[styles.optionValue, isDarkMode && styles.darkText]}>
              {option.value}
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={isDarkMode ? '#fff' : '#000'} 
            />
          </View>
        );
      default:
        return (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDarkMode ? '#fff' : '#000'} 
          />
        );
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <AppHeader gender="male" toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <ScrollView style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          Settings
        </Text>
        
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
              {section.title}
            </Text>
            {section.options.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                style={[styles.optionCard, isDarkMode && styles.darkOptionCard]}
                onPress={option.action}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionLeft}>
                    <Ionicons 
                      name={option.icon as any} 
                      size={24} 
                      color={isDarkMode ? '#fff' : '#000'} 
                    />
                    <Text style={[styles.optionTitle, isDarkMode && styles.darkText]}>
                      {option.title}
                    </Text>
                  </View>
                  {renderOption(option)}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.logoutButton, isDarkMode && styles.darkLogoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={24} color="#ff3b30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <AppFooter isDarkMode={isDarkMode} activeTab="Settings" />
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkOptionCard: {
    backgroundColor: '#1e293b',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    color: '#000',
  },
  optionValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkLogoutButton: {
    backgroundColor: '#1e293b',
  },
  logoutText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default Settings; 