import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ServiceSelectorProps {
  selectedService: 'Rank Boost' | 'Account Leveling' | null;
  onSelectService: (service: 'Rank Boost' | 'Account Leveling') => void;
  isDarkMode?: boolean;
  titleFontSize?: number;
  titleFontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedService,
  onSelectService,
  isDarkMode,
  titleFontSize = 16,
  titleFontWeight = '700',
}) => {
  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text
        style={[
          styles.title,
          { fontSize: titleFontSize, fontWeight: titleFontWeight },
          isDarkMode && styles.darkText,
        ]}
      >
        Select Service
      </Text>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          accessibilityLabel="Select Rank Boost Service"
          style={[
            styles.tab,
            selectedService === 'Rank Boost' && styles.activeTab,
            isDarkMode && styles.darkTab,
            !selectedService && styles.unselectedTab,
          ]}
          onPress={() => onSelectService('Rank Boost')}
        >
          <Text
            style={[
              styles.tabText,
              isDarkMode && styles.darkTabText,
              selectedService === 'Rank Boost' && styles.activeTabText,
            ]}
          >
            Rank Boost
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Select Account Leveling Service"
          style={[
            styles.tab,
            selectedService === 'Account Leveling' && styles.activeTab,
            isDarkMode && styles.darkTab,
            !selectedService && styles.unselectedTab,
          ]}
          onPress={() => onSelectService('Account Leveling')}
        >
          <Text
            style={[
              styles.tabText,
              isDarkMode && styles.darkTabText,
              selectedService === 'Account Leveling' && styles.activeTabText,
            ]}
          >
            Account Leveling
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  darkContainer: {
    backgroundColor: '#1e293b',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    color: '#000',
  },
  activeTab: {
    backgroundColor: '#635BFF',
    borderColor: '#635BFF',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  darkTab: {
    borderColor: '#333',
  },
  darkTabText: {
    color: '#fff',
  },
  unselectedTab: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
  },
});

export default ServiceSelector;