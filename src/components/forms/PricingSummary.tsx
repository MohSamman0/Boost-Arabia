import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PricingSummaryProps {
  estimatedPrice: number;
  breakdown: {
    baseCost?: number;
    levelDifference?: number;
    costPerLevel?: number;
    addOnCost: number;
    total: number;
  };
  isDarkMode?: boolean;
}

const PricingSummary: React.FC<PricingSummaryProps> = ({ 
  estimatedPrice, 
  breakdown, 
  isDarkMode 
}) => {
  const showBreakdown = () => {
    Alert.alert(
      'Price Breakdown',
      `${breakdown.baseCost ? `Base Service: $${breakdown.baseCost.toFixed(2)}\n` : ''}${
        breakdown.levelDifference !== undefined ? 
        `Level Progress: ${breakdown.levelDifference} levels × $${breakdown.costPerLevel?.toFixed(2)}\n` : ''
      }${
        breakdown.addOnCost > 0 ? `Add-ons: $${breakdown.addOnCost.toFixed(2)}\n` : ''
      }\nTotal: $${breakdown.total.toFixed(2)}`,
      [{ text: 'Got it', style: 'default' }]
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.priceSection}>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, isDarkMode && styles.darkText]}>
            Estimated Total:
          </Text>
          <Text style={[styles.priceText, isDarkMode && styles.darkText]}>
            ${estimatedPrice.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={showBreakdown}
          style={styles.breakdownButton}
          accessibilityLabel="View price breakdown"
          accessibilityHint="Shows a detailed breakdown of your order costs"
        >
          <Text style={[styles.breakdownText, isDarkMode && styles.darkText]}>
            View Breakdown
          </Text>
          <Ionicons 
            name="information-circle-outline" 
            size={20} 
            color={isDarkMode ? '#fff' : '#635BFF'} 
          />
        </TouchableOpacity>
      </View>
      {breakdown.addOnCost > 0 && (
        <Text style={[styles.addOnNote, isDarkMode && styles.darkSubText]}>
          Includes selected add-ons
        </Text>
      )}
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
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#aaa',
  },
  breakdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 91, 255, 0.1)',
  },
  breakdownText: {
    marginRight: 4,
    color: '#635BFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addOnNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default PricingSummary;
