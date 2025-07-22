// App.tsx
import React, { useContext } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import RootNavigator from './src/navigation/NavigationConfig';
import { ThemeProvider, ThemeContext } from './src/theme/ThemeContext';

// A helper component to use the context inside App.tsx
const AppContent = () => {
  // Get the theme state from the context
  const { isDarkMode } = useContext(ThemeContext);

  // Set colors based on the theme
  const backgroundColor = isDarkMode ? '#101b23' : 'white';
  const statusBarStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <RootNavigator />
    </SafeAreaView>
  );
};

// Wrap the entire app with ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
