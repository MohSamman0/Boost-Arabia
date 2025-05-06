// screens/Home.tsx

import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/Navigation-Types';
import { Ionicons } from '@expo/vector-icons';

import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';
import PopularGamesSection, { Game as PopularGame } from '../components/PopularGamesSection';
import { ThemeContext } from '../src/ThemeContext';

type HomeNavProp = StackNavigationProp<RootStackParamList, 'Home'>;

const popularGames: PopularGame[] = [
  {
    id: '1',
    name: 'Professional LoL Boosting',
    description: 'Get your desired rank with our professional boosters.',
    image: require('../assets/lol.jpg'),
  },
  {
    id: '2',
    name: 'Valorant Rank Boost',
    description: 'Climb the ranks with top-tier boosters.',
    image: require('../assets/valorant.webp'),
  },
  {
    id: '3',
    name: 'CS:GO Prime Boosting',
    description: 'Reach the top ranks with ease.',
    image: require('../assets/csgo.webp'),
  },
];

type GameScreenParams = {
  gameId: string;
  gameName: string;
  gameDescription: string;
  gameImage: any;
};

const Home: React.FC<{ gender: 'male' | 'female' }> = ({ gender }) => {
  const navigation = useNavigation<HomeNavProp>();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const handleGamePress = (game: PopularGame) => {
    navigation.navigate(
      'GameDetails',
      {
        gameId: game.id,
        gameName: game.name,
        gameDescription: game.description,
        gameImage: game.image,
      } as GameScreenParams
    );
  };

  const handleActiveOrderPress = () => {
    navigation.navigate('Order');
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <MainHeader gender={gender} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>
          Welcome back, Alex!
        </Text>
        <Text style={[styles.subtext, isDarkMode && styles.darkText]}>
          Ready to boost your gaming experience?
        </Text>

        {/* Active Order Card */}
        <TouchableOpacity
          style={[styles.activeOrderContainer, isDarkMode && styles.darkActiveOrderContainer]}
          onPress={handleActiveOrderPress}
          activeOpacity={0.8}
        >
          <View style={styles.activeOrderHeader}>
            <Text style={[styles.activeOrderTitle, isDarkMode && styles.darkText]}>
              Active Order
            </Text>
            <Text style={[styles.viewDetails, isDarkMode && styles.darkViewDetails]}>
              View Details
            </Text>
          </View>
          <View style={styles.orderCard}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="trophy"
                size={20}
                color={isDarkMode ? '#68d6ff' : '#635BFF'}
              />
            </View>
            <View style={styles.orderTextContainer}>
              <Text style={[styles.orderTitle, isDarkMode && styles.darkText]}>
                Valorant Rank Boost
              </Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>In Progress</Text>
                </View>
                <Text style={[styles.estimatedTime, isDarkMode && styles.darkText]}>
                  Est. 2h remaining
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.startBoostButton, isDarkMode && styles.darkStartBoostButton]}
            onPress={() => navigation.navigate('Boost')}
            activeOpacity={0.8}
          >
            <Ionicons name="rocket" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.actionButtonText}>Start a Boost</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.orderHistoryButton, isDarkMode && styles.darkOrderHistoryButton]}
            onPress={() => navigation.navigate('Order')}
            activeOpacity={0.8}
          >
            <Ionicons name="reload" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.actionButtonText}>Order History</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Games */}
        <PopularGamesSection
          games={popularGames}
          onGamePress={handleGamePress}
          isDarkMode={isDarkMode}
        />
      </ScrollView>

      <Footer isDarkMode={isDarkMode} activeTab="Home" />
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
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 16,
  },
  welcomeText: {
    fontSize: Platform.OS === 'ios' ? 26 : 24,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#333',
    marginBottom: 8,
  },
  darkText: {
    color: '#fff',
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  activeOrderContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  darkActiveOrderContainer: {
    backgroundColor: '#1e293b',
    ...Platform.select({
      ios: { shadowOpacity: 0.2 },
      android: { elevation: 4 },
    }),
  },
  activeOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  activeOrderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewDetails: {
    color: '#635BFF',
    fontWeight: 'bold',
  },
  darkViewDetails: {
    color: '#68d6ff',
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EDEAFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  orderTextContainer: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusBadge: {
    backgroundColor: '#DFFFE2',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    color: '#317B42',
    fontSize: 14,
    fontWeight: 'bold',
  },
  estimatedTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  startBoostButton: {
    flex: 1,
    backgroundColor: '#635BFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  darkStartBoostButton: {
    backgroundColor: '#68d6ff',
  },
  orderHistoryButton: {
    flex: 1,
    backgroundColor: '#4A4A4A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  darkOrderHistoryButton: {
    backgroundColor: '#2a2d34',
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;