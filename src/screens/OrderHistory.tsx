// screens/Order.tsx

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList, Order } from '../types/navigation';
import { ThemeContext } from '../theme/ThemeContext';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';
import { Ionicons } from '@expo/vector-icons';
import { FadeIn, SlideIn } from '../components/common/Animations';

type OrderHistoryNavProp = StackNavigationProp<RootStackParamList, 'Order'>;

type StatusIcon = 'time-outline' | 'checkmark-circle-outline' | 'close-circle-outline';

// Mock data - replace with real API data later
const mockOrders: Order[] = [
  {
    id: '1',
    title: 'League of Legends Diamond Boost',
    status: 'Processing',
    date: '2025-06-03',
    price: 99.99,
    provider: 'ProBooster123',
    description: 'Platinum II → Diamond IV',
  },
  {
    id: '2',
    title: 'Valorant Rank Boost',
    status: 'Delivered',
    date: '2025-06-01',
    price: 79.99,
    provider: 'ValorantPro',
    description: 'Gold III → Platinum II',
  },
  {
    id: '3',
    title: 'CS:GO Boost Service',
    status: 'Cancelled',
    date: '2025-05-28',
    price: 59.99,
    provider: 'CSGOmaster',
    description: 'Silver Elite → Gold Nova',
  },
];

const OrderHistory: React.FC = () => {
  const navigation = useNavigation<OrderHistoryNavProp>();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState<'All' | Order['status']>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [slideAnim] = useState(new Animated.Value(0));

  const theme = isDarkMode ? {
    background: '#101b23',
    card: '#1e293b',
    text: '#fff',
    subtext: '#94a3b8',
    accent: '#68d6ff',
    border: '#2b3542',
  } : {
    background: '#f0f2f5',
    card: '#fff',
    text: '#000',
    subtext: '#666',
    accent: '#635BFF',
    border: '#e5e7eb',
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      Processing: { bg: isDarkMode ? '#0d462b' : '#DFFFE2', text: isDarkMode ? '#4ade80' : '#317B42' },
      Delivered: { bg: isDarkMode ? '#1e293b' : '#ECF4FF', text: isDarkMode ? '#68d6ff' : '#635BFF' },
      Cancelled: { bg: isDarkMode ? '#481a1d' : '#FFE4E4', text: isDarkMode ? '#f87171' : '#DC2626' },
    };
    return colors[status];
  };

  const getStatusIcon = (status: Order['status']): StatusIcon => {
    const icons: Record<Order['status'], StatusIcon> = {
      Processing: 'time-outline',
      Delivered: 'checkmark-circle-outline',
      Cancelled: 'close-circle-outline',
    };
    return icons[status];
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const matchesSearch = searchQuery === '' ||
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader gender="male" isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <View style={styles.content}>
        <SlideIn from="top" duration={600}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Orders</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter-outline" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="search-outline" size={20} color={theme.subtext} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search orders..."
              placeholderTextColor={theme.subtext}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Tab Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
            {['All', 'Processing', 'Delivered', 'Cancelled'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  activeTab === tab && { backgroundColor: theme.accent },
                ]}
                onPress={() => handleTabChange(tab as typeof activeTab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === tab ? '#fff' : theme.text },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SlideIn>

        {/* Orders List */}
        <ScrollView
          style={styles.ordersList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ordersListContent}
        >
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <FadeIn key={order.id} duration={400} delay={index * 100}>
                  <TouchableOpacity
                    style={[styles.orderCard, { backgroundColor: theme.card }]}
                    onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
                    activeOpacity={0.7}
                  >
                    <View style={styles.orderHeader}>
                      <Text style={[styles.orderTitle, { color: theme.text }]} numberOfLines={1}>
                        {order.title}
                      </Text>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(order.status).bg }
                      ]}>
                        <Ionicons
                          name={getStatusIcon(order.status)}
                          size={16}
                          color={getStatusColor(order.status).text}
                          style={styles.statusIcon}
                        />
                        <Text style={[styles.statusText, { color: getStatusColor(order.status).text }]}>
                          {order.status}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.orderDetails}>
                      <Text style={[styles.orderDescription, { color: theme.subtext }]}>
                        {order.description}
                      </Text>
                      <View style={styles.orderInfo}>
                        <View style={styles.infoItem}>
                          <Ionicons name="calendar-outline" size={16} color={theme.subtext} />
                          <Text style={[styles.infoText, { color: theme.subtext }]}>
                            {new Date(order.date).toLocaleDateString()}
                          </Text>
                        </View>
                        <View style={styles.infoItem}>
                          <Ionicons name="person-outline" size={16} color={theme.subtext} />
                          <Text style={[styles.infoText, { color: theme.subtext }]}>
                            {order.provider}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.price, { color: theme.accent }]}>
                        ${order.price.toFixed(2)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </FadeIn>
              ))
            ) : (
              <FadeIn duration={400}>
                <View style={styles.emptyState}>
                  <Ionicons name="document-text-outline" size={48} color={theme.subtext} />
                  <Text style={[styles.emptyStateText, { color: theme.text }]}>
                    No orders found
                  </Text>
                  <Text style={[styles.emptyStateSubtext, { color: theme.subtext }]}>
                    Try adjusting your filters or search terms
                  </Text>
                </View>
              </FadeIn>
            )}
          </Animated.View>
        </ScrollView>
      </View>

      <AppFooter isDarkMode={isDarkMode} activeTab="Order" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ordersList: {
    flex: 1,
  },
  ordersListContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    gap: 8,
  },
  orderDescription: {
    fontSize: 14,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default OrderHistory;
