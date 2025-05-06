import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Animated,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Game {
  id: string;
  name: string;
  icon: any;
}

interface GameSelectorProps {
  filteredGames: Game[];
  searchQuery: string;
  onSearch: (text: string) => void;
  selectedGame: Game | null;
  onSelectGame: (game: Game) => void;
  isDarkMode?: boolean;
  searchPlaceholder?: string;
  titleFontSize?: number;
  titleFontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  isLoading?: boolean;
}

const GameSelector: React.FC<GameSelectorProps> = ({
  filteredGames,
  searchQuery,
  onSearch,
  selectedGame,
  onSelectGame,
  isDarkMode,
  searchPlaceholder = "Search games...",
  titleFontSize = 16,
  titleFontWeight = "700",
  isLoading = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = new Animated.Value(isFocused ? 1 : 0);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = isFocused ? '#635BFF' : '#ccc';

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text
        style={[
          styles.title,
          { fontSize: titleFontSize, fontWeight: titleFontWeight },
          isDarkMode && styles.darkText,
        ]}
        accessibilityRole="header"
      >
        Select a Game
      </Text>

      <Animated.View style={[styles.searchContainer, { borderColor }, isDarkMode && styles.darkSearchContainer]}>
        <Ionicons name="search" size={20} color={isDarkMode ? '#888' : '#888'} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkText]}
          placeholder={searchPlaceholder}
          placeholderTextColor={isDarkMode ? '#888' : '#888'}
          value={searchQuery}
          onChangeText={onSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel="Game search input"
        />
        {isLoading && (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="small" color={isDarkMode ? '#fff' : '#635BFF'} />
          </View>
        )}
      </Animated.View>

      {filteredGames.length === 0 && !isLoading ? (
        <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>No games found</Text>
      ) : (
        <FlatList
          horizontal
          data={filteredGames}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => {
            const isSelected = selectedGame?.id === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.gameCard,
                  isDarkMode && styles.darkGameCard,
                  isSelected && styles.gameCardSelected,
                ]}
                onPress={() => onSelectGame(item)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${item.name} game`}
              >
                <Image source={item.icon} style={styles.gameCardImage} />
                <View style={[styles.gameCardFooter, isDarkMode && styles.darkGameCardFooter]}>
                  <Text style={[styles.gameName, isDarkMode && styles.darkText]}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 12,
    borderWidth: 1,
  },
  darkSearchContainer: {
    backgroundColor: '#2b3542',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  spinnerContainer: {
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#000',
  },
  gameCard: {
    width: 120,
    height: 140,
    borderRadius: 10,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  gameCardSelected: {
    borderWidth: 2,
    borderColor: '#635BFF',
  },
  darkGameCard: {
    backgroundColor: '#2b3542',
  },
  gameCardImage: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
  },
  gameCardFooter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkGameCardFooter: {
    backgroundColor: '#2b3542',
  },
  gameName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});

export default GameSelector;