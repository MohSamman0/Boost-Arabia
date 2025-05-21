// screens/Home.tsx

import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/Navigation-Types';
import { Ionicons } from '@expo/vector-icons';

import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';
import PopularGamesSection, { Game as PopularGame } from '../components/PopularGamesSection';
import { ThemeContext } from '../src/ThemeContext';
import { colors } from '../src/theme/colors';
import type { GameScreenParams, ActiveOrder } from '../types/Game';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { FadeIn, SlideIn } from '../components/Animations';

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

const Home: React.FC<{ gender: 'male' | 'female' }> = ({ gender }) => {
  const navigation = useNavigation<HomeNavProp>();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isGamesLoading, setIsGamesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>({
    id: '1',
    gameName: 'Valorant Rank Boost',
    status: 'in_progress',
    estimatedTimeRemaining: '2h',
  });

  useEffect(() => {
    // Simulate games loading
    const timer = setTimeout(() => {
      setIsGamesLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: Implement refresh logic here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

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
    if (activeOrder) {
      navigation.navigate('Order');
    }
  };

  const theme = isDarkMode ? colors.dark : colors.light;

  return (
    <ErrorBoundary>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <MainHeader gender={gender} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <SlideIn from="top" duration={600}>
            <Text style={[styles.welcomeText, { color: theme.text }]}>
              Welcome back, Alex!
            </Text>
            <Text style={[styles.subtext, { color: theme.subtext }]}>
              Ready to boost your gaming experience?
            </Text>
          </SlideIn>

          {/* Active Order Card */}
          <ErrorBoundary>
            {isLoading ? (
              <FadeIn duration={400}>
                <View style={[styles.activeOrderContainer, { backgroundColor: theme.card }]}>
                  <ActivityIndicator color={theme.primary} />
                </View>
              </FadeIn>
            ) : activeOrder ? (
              <SlideIn from="right" duration={500} delay={300}>
                <TouchableOpacity
                  style={[styles.activeOrderContainer, { backgroundColor: theme.card }]}
                  onPress={handleActiveOrderPress}
                  activeOpacity={0.8}
                >
                  <View style={styles.activeOrderHeader}>
                    <Text style={[styles.activeOrderTitle, { color: theme.text }]}>
                      Active Order
                    </Text>
                    <Text style={[styles.viewDetails, { color: theme.primary }]}>
                      View Details
                    </Text>
                  </View>
                  <View style={styles.orderCard}>
                    <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#1e293b' : '#EDEAFF' }]}>
                      <Ionicons
                        name="trophy"
                        size={20}
                        color={theme.primary}
                      />
                    </View>
                    <View style={styles.orderTextContainer}>
                      <Text style={[styles.orderTitle, { color: theme.text }]}>
                        {activeOrder.gameName}
                      </Text>
                      <View style={styles.statusContainer}>
                        <View style={[styles.statusBadge, { backgroundColor: theme.success.background }]}>
                          <Text style={[styles.statusText, { color: theme.success.text }]}>
                            In Progress
                          </Text>
                        </View>
                        {activeOrder.estimatedTimeRemaining && (
                          <Text style={[styles.estimatedTime, { color: theme.subtext }]}>
                            Est. {activeOrder.estimatedTimeRemaining} remaining
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </SlideIn>
            ) : (
              <FadeIn duration={400} delay={300}>
                <View style={[styles.activeOrderContainer, { backgroundColor: theme.card }]}>
                  <Text style={[styles.noOrderText, { color: theme.subtext }]}>
                    No active orders
                  </Text>
                </View>
              </FadeIn>
            )}
          </ErrorBoundary>

          {/* Action Buttons */}
          <ErrorBoundary>
            <SlideIn from="left" duration={500} delay={600}>
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={[styles.startBoostButton, { backgroundColor: theme.primary }]}
                  onPress={() => navigation.navigate('Boost')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="rocket" size={24} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.actionButtonText}>Start a Boost</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.orderHistoryButton, { backgroundColor: theme.secondary }]}
                  onPress={() => navigation.navigate('Order')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="reload" size={24} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.actionButtonText}>Order History</Text>
                </TouchableOpacity>
              </View>
            </SlideIn>
          </ErrorBoundary>

          {/* Popular Games */}
          <ErrorBoundary>
            <SlideIn from="bottom" duration={500} delay={900}>
              <PopularGamesSection
                games={popularGames}
                onGamePress={handleGamePress}
                isDarkMode={isDarkMode}
                isLoading={isGamesLoading}
              />
            </SlideIn>
          </ErrorBoundary>
        </ScrollView>

        <Footer isDarkMode={isDarkMode} activeTab="Home" />
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 16,
  },
  welcomeText: {
    fontSize: Platform.OS === 'ios' ? 26 : 24,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    marginBottom: 12,
  },
  activeOrderContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: 100,
    justifyContent: 'center',
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
  activeOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  activeOrderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewDetails: {
    fontWeight: 'bold',
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
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
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  estimatedTime: {
    fontSize: 14,
    marginLeft: 8,
  },
  noOrderText: {
    textAlign: 'center',
    fontSize: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  startBoostButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  orderHistoryButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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