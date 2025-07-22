// DEPRECATED: This component is no longer used. The app now uses a native tab navigator (createBottomTabNavigator) for the main app sections.
// Footer.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Define the navigation type
type FooterRoutes = {
  Home: undefined;
  Boost: undefined;
  Order: undefined;
  Settings: undefined;
};

interface FooterProps {
  isDarkMode?: boolean;
  activeTab?: string; // "Home", "Boost", "Orders", "Settings"
}

const Footer: React.FC<FooterProps> = ({ isDarkMode, activeTab }) => {
  const navigation = useNavigation<NavigationProp<FooterRoutes>>();
  const activeColor = isDarkMode ? '#68d6ff' : '#635BFF';
  const iconSize = 28; // consistent icon size

  const handleNavigation = (route: keyof FooterRoutes) => {
    try {
      navigation.navigate(route);
    } catch (error) {
      console.error(`Navigation error to ${route}:`, error);
    }
  };

  const tabStyles = (tabName: string) => {
    const isActive = activeTab === tabName;
    return {
      iconColor: isActive ? activeColor : isDarkMode ? '#fff' : '#000',
      textColor: isActive ? activeColor : isDarkMode ? '#fff' : '#000',
      textWeight: isActive ? '700' as TextStyle['fontWeight'] : '400' as TextStyle['fontWeight'],
      // A subtle highlight background if active
      highlightStyle: isActive ? {
        backgroundColor: isDarkMode ? '#2b3542' : '#ece9ff',
        borderRadius: 20,
        padding: 8,
      } : {},
    };
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Home Tab */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handleNavigation('Home')}
      >
        <View style={tabStyles('Home').highlightStyle}>
          <Ionicons name="home" size={iconSize} color={tabStyles('Home').iconColor} />
        </View>
        <Text
          style={[
            styles.tabText,
            { color: tabStyles('Home').textColor, fontWeight: tabStyles('Home').textWeight },
            isDarkMode && styles.darkTabText,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Boost Tab */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handleNavigation('Boost')}
      >
        <View style={tabStyles('Boost').highlightStyle}>
          <Ionicons name="flash" size={iconSize} color={tabStyles('Boost').iconColor} />
        </View>
        <Text
          style={[
            styles.tabText,
            { color: tabStyles('Boost').textColor, fontWeight: tabStyles('Boost').textWeight },
            isDarkMode && styles.darkTabText,
          ]}
        >
          Boost
        </Text>
      </TouchableOpacity>

      {/* Orders Tab */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handleNavigation('Order')}
      >
        <View style={tabStyles('Order').highlightStyle}>
          <Ionicons name="document-text" size={iconSize} color={tabStyles('Order').iconColor} />
        </View>
        <Text
          style={[
            styles.tabText,
            { color: tabStyles('Order').textColor, fontWeight: tabStyles('Order').textWeight },
            isDarkMode && styles.darkTabText,
          ]}
        >
          Orders
        </Text>
      </TouchableOpacity>

      {/* Settings Tab */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handleNavigation('Settings')}
      >
        <View style={tabStyles('Settings').highlightStyle}>
          <Ionicons name="settings" size={iconSize} color={tabStyles('Settings').iconColor} />
        </View>
        <Text
          style={[
            styles.tabText,
            { color: tabStyles('Settings').textColor, fontWeight: tabStyles('Settings').textWeight },
            isDarkMode && styles.darkTabText,
          ]}
        >
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  darkContainer: {
    backgroundColor: '#101b23',
    borderTopColor: '#1e293b',
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
  darkTabText: {
    color: '#fff',
  },
});