// components/PopularGamesSection.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { ErrorBoundary } from './ErrorBoundary';
import { Skeleton } from './Skeleton';
// import { SlideInView } from './Animations';
import { colors } from '../src/theme/colors';

export interface Game {
  id: string;
  name: string;
  description: string;
  image: any;
}

interface Props {
  games: Game[];
  onGamePress: (game: Game) => void;
  isDarkMode: boolean;
  isLoading?: boolean;
}

const GameSkeleton: React.FC = () => {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.8;

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Skeleton width="100%" height={160} borderRadius={12} />
      <View style={styles.info}>
        <Skeleton width={150} height={20} style={{ marginBottom: 8 }} />
        <Skeleton width={200} height={16} />
      </View>
    </View>
  );
};

const PopularGamesSection: React.FC<Props> = ({
  games,
  onGamePress,
  isDarkMode,
  isLoading = false,
}) => {
  const theme = isDarkMode ? colors.dark : colors.light;
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.8;

  const renderContent = () => {
    if (isLoading) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {[1, 2].map((key) => (
            <GameSkeleton key={key} />
          ))}
        </ScrollView>
      );
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {games.map((game, index) => (
          <TouchableOpacity
            key={game.id}
            style={[styles.card, { width: cardWidth }]}
            onPress={() => onGamePress(game)}
            activeOpacity={0.8}
          >
            <Image source={game.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={[styles.name, { color: theme.text }]}>
                {game.name}
              </Text>
              <Text style={[styles.desc, { color: theme.subtext }]}>
                {game.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Popular Games
        </Text>
        {renderContent()}
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollContent: {
    paddingRight: 16,
  },
  card: {
    marginLeft: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  desc: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
});

export default PopularGamesSection;