import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  TextInput,
  ActivityIndicator,
  Alert,
  Animated
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';
import { ThemeContext } from '../theme/ThemeContext';
import GameSelector, { Game } from '../components/forms/GameSelector';
import ServiceSelector from '../components/forms/ServiceSelector';
import RankSelector from '../components/forms/RankSelector';
import AddOnSelector from '../components/forms/AddOnSelector';
import PricingSummary from '../components/forms/PricingSummary';
import RegionModal from '../components/forms/RegionModal';
import PlatformModal from '../components/forms/PlatformModal';
// Updated StepProgressBar that now supports final-step completion
import StepProgressBar from '../components/common/StepProgressBar';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { FadeIn, SlideIn } from '../components/common/Animations';

const rankConfigs: { [key: string]: { ranks: any[]; subTiers: string[] } } = {
  Valorant: {
    ranks: [
      { id: 'iron', label: 'Iron', icon: require('../assets/rank_icons/iron.png'), hasDivisions: true },
      { id: 'bronze', label: 'Bronze', icon: require('../assets/rank_icons/bronze.png'), hasDivisions: true },
      { id: 'silver', label: 'Silver', icon: require('../assets/rank_icons/silver.png'), hasDivisions: true },
      { id: 'gold', label: 'Gold', icon: require('../assets/rank_icons/gold.png'), hasDivisions: true },
      { id: 'platinum', label: 'Platinum', icon: require('../assets/rank_icons/platinum.png'), hasDivisions: true },
      { id: 'diamond', label: 'Diamond', icon: require('../assets/rank_icons/diamond.png'), hasDivisions: true },
      { id: 'ascendant', label: 'Ascendant', icon: require('../assets/rank_icons/ascendant.png'), hasDivisions: true },
      { id: 'immortal', label: 'Immortal', icon: require('../assets/rank_icons/immortal.png'), hasDivisions: false, isRRCounter: true },
    ],
    subTiers: ['I', 'II', 'III'],
  },
  'League of Legends': {
    ranks: [
      { id: 'iron', label: 'Iron', icon: require('../assets/rank_icons/lol_iron.png'), hasDivisions: true },
      { id: 'bronze', label: 'Bronze', icon: require('../assets/rank_icons/lol_bronze.png'), hasDivisions: true },
      { id: 'silver', label: 'Silver', icon: require('../assets/rank_icons/lol_silver.png'), hasDivisions: true },
      { id: 'gold', label: 'Gold', icon: require('../assets/rank_icons/lol_gold.png'), hasDivisions: true },
      { id: 'platinum', label: 'Platinum', icon: require('../assets/rank_icons/lol_platinum.png'), hasDivisions: true },
      { id: 'diamond', label: 'Diamond', icon: require('../assets/rank_icons/lol_diamond.png'), hasDivisions: true },
      { id: 'master', label: 'Master', icon: require('../assets/rank_icons/lol_master.png'), hasDivisions: false },
      { id: 'grandmaster', label: 'Grandmaster', icon: require('../assets/rank_icons/lol_grandmaster.png'), hasDivisions: false },
      { id: 'challenger', label: 'Challenger', icon: require('../assets/rank_icons/lol_challenger.png'), hasDivisions: false },
    ],
    subTiers: ['IV', 'III', 'II', 'I'],
  },
  // For CS2, we update pricing even if the assets remain similar to CS:GO.
  'CS2': {
    ranks: [
      { id: 'silver', label: 'Silver', icon: require('../assets/rank_icons/silver.png'), hasDivisions: true },
      { id: 'gold', label: 'Gold', icon: require('../assets/rank_icons/gold.png'), hasDivisions: true },
      { id: 'platinum', label: 'Platinum', icon: require('../assets/rank_icons/platinum.png'), hasDivisions: true },
      { id: 'diamond', label: 'Diamond', icon: require('../assets/rank_icons/diamond.png'), hasDivisions: true },
    ],
    subTiers: ['I', 'II', 'III'],
  },
};

// Update the games data so that CS2 is used (or rename CS:GO to CS2)
const gamesData: Game[] = [
  { id: '1', name: 'Valorant', icon: require('../assets/valorant.webp') },
  { id: '2', name: 'League of Legends', icon: require('../assets/lol.jpg') },
  { id: '3', name: 'CS2', icon: require('../assets/csgo.webp') }, // Using existing asset for simplicity
];

/**
 * Functions to determine pricing based on the selected game,
 * reflecting market conditions in 2025.
 */
const getRankBoostBaseCost = (selectedGame: Game | null) => {
  if (!selectedGame) return 45; // Default to Valorant pricing
  const name = selectedGame.name.toLowerCase();
  if (name.includes('valorant')) return 45;
  if (name.includes('league')) return 55;
  if (name.includes('cs')) return 65;
  return 45;
};

const getLevelingCostPerLevel = (selectedGame: Game | null) => {
  if (!selectedGame) return 2.5;
  const name = selectedGame.name.toLowerCase();
  if (name.includes('valorant')) return 2.5;
  if (name.includes('league')) return 3.0;
  if (name.includes('cs')) return 3.5;
  return 2.5;
};

const Boost: React.FC = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const scrollViewRef = useRef<ScrollView>(null);

  // Layout positions for auto-scrolling
  const [serviceSectionY, setServiceSectionY] = useState(0);
  const [rankSectionY, setRankSectionY] = useState(0);

  // Service selection state
  const [selectedService, setSelectedService] = useState<'Rank Boost' | 'Account Leveling' | null>(null);
  const [didUserPickService, setDidUserPickService] = useState(false);

  // Game selection
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState(gamesData);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Rank Boost states
  const [currentRank, setCurrentRank] = useState('');
  const [currentSubTier, setCurrentSubTier] = useState('');
  const [currentRR, setCurrentRR] = useState(19);
  const [desiredRank, setDesiredRank] = useState('');
  const [desiredSubTier, setDesiredSubTier] = useState('');
  const [desiredRR, setDesiredRR] = useState(19);

  // Account Leveling states
  const [currentLevel, setCurrentLevel] = useState('');
  const [desiredLevel, setDesiredLevel] = useState('');

  // Add-ons (same pricing as before)
  const [priorityAddOn, setPriorityAddOn] = useState(false);
  const [duoAddOn, setDuoAddOn] = useState(false);

  // Modals
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [region, setRegion] = useState('North-America');
  const [platform, setPlatform] = useState('Pc');

  // Inline error / success message
  const [errorMessage, setErrorMessage] = useState('');

  const priceAnim = useRef(new Animated.Value(1)).current;
  const prevPrice = useRef(0);

  // Handle search with simulated loading
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setIsSearching(true);
    setTimeout(() => {
      if (!text.trim()) {
        setFilteredGames(gamesData);
      } else {
        const lower = text.toLowerCase();
        setFilteredGames(gamesData.filter((g) => g.name.toLowerCase().includes(lower)));
      }
      setIsSearching(false);
    }, 300);
  };

  // Reset rank/level state when a new game is selected
  useEffect(() => {
    if (!selectedGame) return;
    const currentGameName = selectedGame.name;
    const gameRankConfig = rankConfigs[currentGameName] || rankConfigs['Valorant'];
    setCurrentRank('');
    setDesiredRank('');
    setCurrentSubTier(gameRankConfig.subTiers[0] || '');
    setDesiredSubTier(gameRankConfig.subTiers[0] || '');
    setCurrentRR(19);
    setDesiredRR(19);
  }, [selectedGame]);

  // Determine pricing based on the selected game:
  const rankBoostBaseCost = getRankBoostBaseCost(selectedGame);
  const levelingCostPerLevel = getLevelingCostPerLevel(selectedGame);
  const addOnCost = (priorityAddOn ? 10 : 0) + (duoAddOn ? 5 : 0);

  let estimatedPrice = 0;
  if (selectedService === 'Rank Boost') {
    estimatedPrice = rankBoostBaseCost + addOnCost;
  } else {
    const curr = parseInt(currentLevel, 10) || 0;
    const des = parseInt(desiredLevel, 10) || 0;
    const levelDiff = des - curr;
    estimatedPrice = levelDiff > 0 ? levelDiff * levelingCostPerLevel + addOnCost : 0;
  }

  const breakdown: {
    baseCost?: number;
    levelDifference?: number;
    costPerLevel?: number;
    addOnCost: number;
    total: number;
  } = { addOnCost, total: estimatedPrice };

  if (selectedService === 'Rank Boost') {
    breakdown.baseCost = rankBoostBaseCost;
  } else {
    const curr = parseInt(currentLevel, 10) || 0;
    const des = parseInt(desiredLevel, 10) || 0;
    const levelDiff = des - curr;
    breakdown.levelDifference = levelDiff;
    breakdown.costPerLevel = levelingCostPerLevel;
  }

  // Auto-scroll handlers for section transitions
  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: serviceSectionY, animated: true });
    }
  };

  const handleSelectService = (service: 'Rank Boost' | 'Account Leveling') => {
    setSelectedService(service);
    setDidUserPickService(true);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: rankSectionY, animated: true });
    }
  };

  // Rank selection
  const handleSelectCurrentRank = (rankId: string) => {
    setCurrentRank(rankId);
  };
  const handleSelectDesiredRank = (rankId: string) => {
    setDesiredRank(rankId);
  };

  // Continue button validation
  const handleContinue = () => {
    let error = '';
    if (!selectedGame) {
      error = 'Please select a game first.';
    } else if (!didUserPickService) {
      error = 'Please select a service.';
    } else if (selectedService === 'Rank Boost') {
      if (!currentRank || !desiredRank) {
        error = 'Please select both current and desired rank.';
      }
    } else {
      const curr = parseInt(currentLevel, 10) || 0;
      const des = parseInt(desiredLevel, 10) || 0;
      if (!currentLevel || !desiredLevel) {
        error = 'Please enter your current and desired levels.';
      } else if (des <= curr) {
        error = 'Desired level must be higher than current level.';
      }
    }
    if (error) {
      setErrorMessage(error);
      return;
    }
    setErrorMessage('Success! Proceeding to checkout...');
    // Navigation to checkout can be implemented here.
  };

  // RR increment/decrement functions
  const decrementCurrentRR = () => {
    if (currentRR > 0) setCurrentRR(currentRR - 1);
  };
  const incrementCurrentRR = () => {
    setCurrentRR(currentRR + 1);
  };
  const decrementDesiredRR = () => {
    if (desiredRR > 0) setDesiredRR(desiredRR - 1);
  };
  const incrementDesiredRR = () => {
    setDesiredRR(desiredRR + 1);
  };

  // ---- PROGRESS LOGIC ----
  const step1Completed = Boolean(selectedGame);
  const step2Completed = didUserPickService && selectedService !== null;
  let step3Completed = false;
  if (step2Completed) {
    if (selectedService === 'Rank Boost') {
      step3Completed = Boolean(currentRank && desiredRank);
    } else {
      const curr = parseInt(currentLevel, 10) || 0;
      const des = parseInt(desiredLevel, 10) || 0;
      step3Completed = des > curr;
    }
  }
  let currentStep = 1;
  if (step1Completed && !step2Completed) {
    currentStep = 2;
  } else if (step1Completed && step2Completed) {
    currentStep = 3;
  }
  const finalStepDone = step3Completed;

  // Price animation effect
  useEffect(() => {
    if (prevPrice.current !== estimatedPrice) {
      Animated.sequence([
        Animated.timing(priceAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(priceAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      prevPrice.current = estimatedPrice;
    }
  }, [estimatedPrice]);

  // Level input validation with haptic feedback
  const handleLevelChange = (value: string, setter: (value: string) => void) => {
    const numValue = parseInt(value, 10);
    if (value === '' || (numValue >= 0 && numValue <= 999)) {
      setter(value);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Handle invalid rank selection
  const handleInvalidRankSelection = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setErrorMessage('Desired rank must be higher than current rank');
  };

  // Show help tooltip for rank selection
  const showRankHelp = () => {
    Alert.alert(
      'Rank Selection Guide',
      'Select your current rank first, then choose a higher desired rank. The difference between ranks affects the final price.',
      [{ text: 'Got it', style: 'default' }]
    );
  };

  // Removed validation logic for current and desired levels
  const validateAndSetLevel = (value: string, isDesired: boolean) => {
    const setter = isDesired ? setDesiredLevel : setCurrentLevel;
    setter(value);
    setErrorMessage('');
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <AppHeader gender="male" toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

      <StepProgressBar
        currentStep={currentStep}
        totalSteps={3}
        labels={["Select Game", "Choose Service", "Set Rank/Level"]}
        isFinalStepComplete={finalStepDone}
      />

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Game Selection */}
        <View style={{ marginBottom: 16 }}>
          <GameSelector
            filteredGames={filteredGames}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            selectedGame={selectedGame}
            onSelectGame={handleSelectGame}
            isDarkMode={isDarkMode}
            isLoading={isSearching}
            searchPlaceholder="Search games (e.g., Valorant)"
            titleFontSize={20}
            titleFontWeight="700"
          />
        </View>

        {/* Section 2: Service Selector */}
        <View style={{ marginVertical: 16 }} onLayout={(event) => setServiceSectionY(event.nativeEvent.layout.y)}>
          <ServiceSelector
            selectedService={selectedService}
            onSelectService={handleSelectService}
            isDarkMode={isDarkMode}
            titleFontSize={20}
            titleFontWeight="700"
          />
        </View>

        {/* Section 3: Rank / Level Selection */}
        <View onLayout={(event) => setRankSectionY(event.nativeEvent.layout.y)}>
          {selectedService === 'Rank Boost' ? (
            <View>
              <TouchableOpacity 
                onPress={showRankHelp}
                style={styles.helpButton}
                accessibilityLabel="Show rank selection help"
                accessibilityRole="button"
              >
                <Ionicons name="help-circle-outline" size={24} color={isDarkMode ? '#68d6ff' : '#635BFF'} />
                <Text style={[styles.helpText, isDarkMode && styles.darkText]}>How to select ranks</Text>
              </TouchableOpacity>
              
              <RankSelector
                cardTitle="Current Rank"
                cardSubtitle="Select your current rank and division"
                ranks={rankConfigs[selectedGame?.name || 'Valorant'].ranks}
                subTiers={rankConfigs[selectedGame?.name || 'Valorant'].subTiers}
                selectedRank={currentRank}
                onSelectRank={handleSelectCurrentRank}
                selectedSubTier={currentSubTier}
                onSelectSubTier={setCurrentSubTier}
                rrValue={currentRR}
                onIncrementRR={incrementCurrentRR}
                onDecrementRR={decrementCurrentRR}
                rrLabel="Current RR"
                isDarkMode={isDarkMode}
                enhancedFeedback={true}
                selectedOutlineColor={isDarkMode ? "#68d6ff" : "#FFA500"}
                onSetRR={(val) => setCurrentRR(val)}
                onInvalidSelection={handleInvalidRankSelection}
                accessibilityLabel="Current rank selector"
                accessibilityHint="Select your current rank and division"
              />

              <RankSelector
                cardTitle="Desired Rank"
                cardSubtitle="Choose your target rank and division"
                ranks={rankConfigs[selectedGame?.name || 'Valorant'].ranks}
                subTiers={rankConfigs[selectedGame?.name || 'Valorant'].subTiers}
                selectedRank={desiredRank}
                onSelectRank={handleSelectDesiredRank}
                selectedSubTier={desiredSubTier}
                onSelectSubTier={setDesiredSubTier}
                rrValue={desiredRR}
                onIncrementRR={incrementDesiredRR}
                onDecrementRR={decrementDesiredRR}
                rrLabel="Desired RR"
                isDarkMode={isDarkMode}
                enhancedFeedback={true}
                selectedOutlineColor={isDarkMode ? "#68d6ff" : "#FFA500"}
                onSetRR={(val) => setDesiredRR(val)}
                onInvalidSelection={handleInvalidRankSelection}
                accessibilityLabel="Desired rank selector"
                accessibilityHint="Select your target rank and division"
              />
            </View>
          ) : (
            <View style={[styles.card, isDarkMode && styles.darkCard]}>
              <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>
                Current & Desired Levels
              </Text>
              <View style={styles.levelRow}>
                <View style={[styles.levelInputContainer, isDarkMode && styles.darkDropdown]}>
                  <Text style={[styles.dropdownText, isDarkMode && styles.darkText]}>
                    Current Level
                  </Text>
                  <TextInput
                    style={[styles.levelInput, isDarkMode && styles.darkText]}
                    keyboardType="number-pad"
                    placeholder="e.g., 20"
                    placeholderTextColor={isDarkMode ? '#aaa' : '#000'}
                    value={currentLevel}
                    onChangeText={(value) => validateAndSetLevel(value, false)}
                    maxLength={3}
                    accessibilityLabel="Current level input"
                    accessibilityHint="Enter your current level between 0 and 999"
                  />
                </View>
                <View style={[styles.levelInputContainer, isDarkMode && styles.darkDropdown]}>
                  <Text style={[styles.dropdownText, isDarkMode && styles.darkText]}>
                    Desired Level
                  </Text>
                  <TextInput
                    style={[styles.levelInput, isDarkMode && styles.darkText]}
                    keyboardType="number-pad"
                    placeholder="e.g., 30"
                    placeholderTextColor={isDarkMode ? '#aaa' : '#000'}
                    value={desiredLevel}
                    onChangeText={(value) => validateAndSetLevel(value, true)}
                    maxLength={3}
                    accessibilityLabel="Desired level input"
                    accessibilityHint="Enter your desired level between 0 and 999"
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Section 4: Add-ons & Pricing */}
        <View>
          <AddOnSelector
            selectedService={selectedService}
            priorityAddOn={priorityAddOn}
            duoAddOn={duoAddOn}
            onTogglePriority={setPriorityAddOn}
            onToggleDuo={setDuoAddOn}
            isDarkMode={isDarkMode}
          />

          <Animated.View style={{ transform: [{ scale: priceAnim }] }}>
            <PricingSummary
              estimatedPrice={estimatedPrice}
              breakdown={breakdown}
              isDarkMode={isDarkMode}
            />
          </Animated.View>

          <TouchableOpacity 
            style={[
              styles.ctaButton,
              !step3Completed && styles.disabledButton
            ]} 
            onPress={handleContinue}
            disabled={!step3Completed}
            accessibilityRole="button"
            accessibilityState={{ disabled: !step3Completed }}
            accessibilityLabel={step3Completed ? 'Continue to checkout' : 'Complete all steps to continue'}
          >
            <Text style={[
              styles.ctaButtonText,
              !step3Completed && styles.disabledButtonText
            ]}>
              {step3Completed ? 'Continue to Checkout' : 'Complete all steps to continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <RegionModal
        visible={showRegionModal}
        currentRegion={region}
        onSelectRegion={(r: string) => setRegion(r)}
        onClose={() => setShowRegionModal(false)}
        isDarkMode={isDarkMode}
      />

      <PlatformModal
        visible={showPlatformModal}
        currentPlatform={platform}
        onSelectPlatform={(p: string) => setPlatform(p)}
        onClose={() => setShowPlatformModal(false)}
        isDarkMode={isDarkMode}
      />

      <AppFooter isDarkMode={isDarkMode} activeTab="Boost" />
    </View>
  );
};

export default Boost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  darkContainer: {
    backgroundColor: '#101b23',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  darkCard: {
    backgroundColor: '#1e293b',
  },
  cardTitle: {
    fontSize: 20, // Increased font size for better readability
    fontWeight: 'bold', // Made the title bold
    color: '#000',
    marginBottom: 12, // Added spacing below the title
  },
  darkText: {
    color: '#fff',
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  levelInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
  },
  darkDropdown: {
    backgroundColor: '#2b3542',
    borderColor: '#2b3542',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  levelInput: {
    fontSize: 16,
    marginTop: 4,
    color: '#000',
  },
  ctaButton: {
    backgroundColor: '#635BFF', // Solid background color for enabled state
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#D3D3D3', // Light gray background for disabled state
    shadowOpacity: 0.1,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#fff',
    backgroundColor: '#FF4D4D', // Added background color for better visibility
    textAlign: 'center',
    marginVertical: 12,
    fontSize: 16,
    padding: 8, // Added padding for better spacing
    borderRadius: 8, // Rounded corners for a cleaner look
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 12,
  },
  helpText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#635BFF',
  },
  successText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#A9A9A9', // Gray text for disabled state
  },
});
