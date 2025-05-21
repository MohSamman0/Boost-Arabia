// src/components/AddOnSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddOnSelectorProps {
  selectedService: 'Rank Boost' | 'Account Leveling' | null;
  priorityAddOn: boolean;
  duoAddOn: boolean;
  onTogglePriority: (value: boolean) => void;
  onToggleDuo: (value: boolean) => void;
  isDarkMode?: boolean;
}

const AddOnSelector: React.FC<AddOnSelectorProps> = ({
  selectedService,
  priorityAddOn,
  duoAddOn,
  onTogglePriority,
  onToggleDuo,
  isDarkMode,
}) => {
  if (!selectedService) return null; // Don't show add-ons until service is selected
  
  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Optional Add-ons</Text>

      {/* Priority Add-on */}
      <View style={styles.addOnRow}>
        <View style={styles.addOnLabelRow}>
          <Ionicons
            name="flash"
            size={20}
            color={isDarkMode ? '#8daef0' : '#635BFF'}
            style={styles.addOnIcon}
          />
          <Text style={[styles.addOnTitle, isDarkMode && styles.darkText]}>
            {selectedService === 'Rank Boost' ? 'Priority Boost' : 'Priority Leveling'}
          </Text>
          <View style={[styles.priceBadge, isDarkMode && styles.darkPriceBadge]}>
            <Text style={styles.priceBadgeText}>+ $10</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Priority Option',
                selectedService === 'Rank Boost'
                  ? 'Priority Boost expedites your rank boosting for faster results.'
                  : 'Priority Leveling expedites your leveling process for quicker completion.'
              )
            }
          >
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#635BFF"
              style={styles.infoIcon}
            />
          </TouchableOpacity>
        </View>

        <Switch
          value={priorityAddOn}
          onValueChange={onTogglePriority}
          thumbColor="#635BFF"
          trackColor={{ false: '#ccc', true: isDarkMode ? '#8daef0' : '#b3d4fc' }}
        />
      </View>

      {/* Duo Add-on */}
      <View style={styles.addOnRow}>
        <View style={styles.addOnLabelRow}>
          <Ionicons
            name="people"
            size={20}
            color={isDarkMode ? '#8daef0' : '#635BFF'}
            style={styles.addOnIcon}
          />
          <Text style={[styles.addOnTitle, isDarkMode && styles.darkText]}>
            {selectedService === 'Rank Boost' ? 'Duo Queue Boost' : 'Duo Leveling'}
          </Text>
          <View style={[styles.priceBadge, isDarkMode && styles.darkPriceBadge]}>
            <Text style={styles.priceBadgeText}>+ $5</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Duo Option',
                selectedService === 'Rank Boost'
                  ? 'Duo Queue Boost provides an additional booster to help improve your rank.'
                  : 'Duo Leveling provides an extra booster to level up your account faster.'
              )
            }
          >
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#635BFF"
              style={styles.infoIcon}
            />
          </TouchableOpacity>
        </View>

        <Switch
          value={duoAddOn}
          onValueChange={onToggleDuo}
          thumbColor="#635BFF"
          trackColor={{ false: '#ccc', true: isDarkMode ? '#8daef0' : '#b3d4fc' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Light Mode
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  addOnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  addOnLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addOnIcon: {
    marginRight: 8,
  },
  addOnTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  priceBadge: {
    marginLeft: 6,
    backgroundColor: '#EDEAFF',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priceBadgeText: {
    fontSize: 12,
    color: '#635BFF',
    fontWeight: 'bold',
  },
  infoIcon: {
    marginLeft: 8,
  },

  // Dark Mode
  darkContainer: {
    backgroundColor: '#1e293b',
  },
  darkText: {
    color: '#fff',
  },
  darkPriceBadge: {
    backgroundColor: '#2b3542',
  },
});

export default AddOnSelector;
