import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Rank {
  id: string;
  label: string;
  icon: any;
  hasDivisions: boolean;
  isRRCounter?: boolean;
}

interface RankCardProps {
  cardTitle: string;
  cardSubtitle: string;
  ranks: Rank[];
  subTiers: string[];
  selectedRank: string;
  onSelectRank: (rankId: string) => void;
  selectedSubTier?: string;
  onSelectSubTier?: (tier: string) => void;
  rrValue?: number;
  onIncrementRR?: () => void;
  onDecrementRR?: () => void;
  onSetRR?: (value: number) => void;  // <-- new prop for manual typing
  rrLabel?: string;
  isDarkMode?: boolean;
  enhancedFeedback?: boolean;
  selectedOutlineColor?: string;
  onInvalidSelection?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  isDesiredRank?: boolean;
  currentRankIndex?: number;
}

const RankCard: React.FC<RankCardProps> = ({
  cardTitle,
  cardSubtitle,
  ranks,
  subTiers,
  selectedRank,
  onSelectRank,
  selectedSubTier,
  onSelectSubTier,
  rrValue,
  onIncrementRR,
  onDecrementRR,
  onSetRR,
  rrLabel,
  isDarkMode,
  enhancedFeedback = false,
  selectedOutlineColor = isDarkMode ? "#68d6ff" : "#FFA500",
  onInvalidSelection,
  accessibilityLabel,
  accessibilityHint,
  isDesiredRank,
  currentRankIndex,
}) => {
  const selectedRankConfig = ranks.find(r => r.id === selectedRank);

  const handleRankSelect = (rankId: string) => {
    const selectedIndex = ranks.findIndex(r => r.id === rankId);
    if (isDesiredRank && currentRankIndex !== undefined && selectedIndex <= currentRankIndex) {
      onInvalidSelection?.();
      return;
    }
    onSelectRank(rankId);
  };

  return (
    <View 
      style={[styles.container, isDarkMode && styles.darkContainer]}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <View style={styles.header}>
        <Image
          source={selectedRankConfig?.icon || require('../assets/rank_icons/default_shield.png')}
          style={[styles.headerIconImage, isDarkMode && styles.darkHeaderIconImage]}
        />
        <View>
          <Text style={[styles.title, isDarkMode && styles.darkText]}>{cardTitle}</Text>
          <Text style={[styles.subtitle, isDarkMode && styles.darkSubText]}>{cardSubtitle}</Text>
        </View>
      </View>

      <View style={styles.rankIconsRow}>
        {ranks.map((rank, index) => {
          const isSelected = selectedRank === rank.id;
          const isDisabled = isDesiredRank && currentRankIndex !== undefined && index <= currentRankIndex;
          
          return (
            <TouchableOpacity
              key={rank.id}
              style={[
                styles.rankIconButton,
                isDarkMode && styles.darkRankIconButton,
                isSelected &&
                  (enhancedFeedback
                    ? {
                        borderColor: selectedOutlineColor,
                        borderWidth: 3,
                        backgroundColor: isDarkMode ? '#2b3542' : '#fff2e0',
                      }
                    : isDarkMode
                    ? styles.rankIconButtonSelectedDark
                    : styles.rankIconButtonSelected),
                isDisabled && styles.disabledRankButton
              ]}
              onPress={() => handleRankSelect(rank.id)}
              disabled={isDisabled}
              accessibilityLabel={`${rank.label} rank`}
              accessibilityState={{ 
                disabled: isDisabled,
                selected: isSelected
              }}
            >
              <Image 
                source={rank.icon} 
                style={[
                  styles.rankIconImage,
                  isDisabled && styles.disabledRankImage
                ]} 
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedRankConfig && selectedRankConfig.isRRCounter && (
        <View style={styles.rrRow}>
          <TouchableOpacity style={styles.rrControl} onPress={onDecrementRR}>
            <Ionicons
              name="remove-circle"
              size={24}
              color={isDarkMode ? '#68d6ff' : '#FFA500'}
            />
          </TouchableOpacity>
          <TextInput
            style={[styles.rrInput, isDarkMode && styles.darkText]}
            value={rrValue?.toString() || ''}
            keyboardType="number-pad"
            onChangeText={(val) => {
              if (onSetRR) {
                const numeric = parseInt(val, 10);
                if (!isNaN(numeric)) {
                  onSetRR(numeric);
                } else {
                  onSetRR(0);
                }
              }
            }}
          />
          <TouchableOpacity style={styles.rrControl} onPress={onIncrementRR}>
            <Ionicons
              name="add-circle"
              size={24}
              color={isDarkMode ? '#68d6ff' : '#FFA500'}
            />
          </TouchableOpacity>
          <Text style={[styles.rrLabel, isDarkMode && styles.darkSubText]}>{rrLabel}</Text>
        </View>
      )}

      {selectedRankConfig && selectedRankConfig.hasDivisions && (
        <View style={styles.subTierRow}>
          {subTiers.map(tier => {
            const isTierSelected = selectedSubTier === tier;
            return (
              <TouchableOpacity
                key={tier}
                style={[
                  styles.subTierButton,
                  isDarkMode && styles.darkSubTierButton,
                  isTierSelected &&
                    (isDarkMode
                      ? styles.subTierButtonSelectedDark
                      : styles.subTierButtonSelected),
                ]}
                onPress={() => onSelectSubTier && onSelectSubTier(tier)}
              >
                <Text
                  style={[
                    styles.subTierText,
                    isDarkMode && styles.darkText,
                    isTierSelected && styles.subTierTextSelected,
                  ]}
                >
                  {tier}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIconImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginRight: 8,
  },
  darkHeaderIconImage: {},
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  rankIconsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  rankIconButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  rankIconButtonSelected: {
    borderColor: '#FFA500',
    backgroundColor: '#fff2e0',
  },
  darkRankIconButton: {
    backgroundColor: '#2b3542',
    borderColor: '#2b3542',
  },
  rankIconButtonSelectedDark: {
    borderColor: '#68d6ff',
    backgroundColor: '#2b3542',
  },
  rankIconImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  rrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  rrControl: {
    marginRight: 8,
  },
  rrInput: {
    width: 60,
    fontSize: 16,
    textAlign: 'center',
    padding: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: '#000',
  },
  rrLabel: {
    fontSize: 14,
    marginLeft: 4,
    color: '#666',
  },
  subTierRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  subTierButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#f0f2f5',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  subTierButtonSelected: {
    borderColor: '#FFA500',
    backgroundColor: '#fff2e0',
  },
  subTierButtonSelectedDark: {
    borderColor: '#68d6ff',
    backgroundColor: '#2b3542',
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#ccc',
  },
  darkSubTierButton: {
    backgroundColor: '#2b3542',
    borderColor: '#2b3542',
  },
  subTierText: {
    fontSize: 14,
    color: '#000',
  },
  subTierTextSelected: {
    fontWeight: '700',
  },
  disabledRankButton: {
    opacity: 0.5,
    borderColor: '#ccc',
  },
  disabledRankImage: {
    opacity: 0.7,
  },
});

export default RankCard;
