// screens/OrderDetails.tsx

import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList, Order } from '../types/navigation';
import { ThemeContext } from '../theme/ThemeContext';
import AppHeader from '../components/layout/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import { FadeIn, SlideIn } from '../components/common/Animations';

type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;
type OrderDetailsNavProp = StackNavigationProp<RootStackParamList, 'OrderDetails'>;

// Mock data - replace with API call
const mockOrders: Record<string, Order & { 
  statusHistory: Array<{ 
    status: Order['status']; 
    date: string; 
    note?: string;
  }>;
  gameDetails: {
    game: string;
    server: string;
    account: string;
  };
  providerDetails: {
    name: string;
    rating: number;
    completedOrders: number;
    joinedDate: string;
  };
}> = {
  '1': {
    id: '1',
    title: 'League of Legends Diamond Boost',
    status: 'Processing',
    date: '2025-06-03',
    price: 99.99,
    provider: 'ProBooster123',
    description: 'Platinum II → Diamond IV',
    statusHistory: [
      { status: 'Processing', date: '2025-06-03 14:30:00', note: 'Booster has started working on your order' },
      { status: 'Processing', date: '2025-06-03 14:00:00', note: 'Order assigned to booster' },
      { status: 'Processing', date: '2025-06-03 13:45:00', note: 'Payment confirmed' },
    ],
    gameDetails: {
      game: 'League of Legends',
      server: 'NA',
      account: 'Account credentials exchanged securely',
    },
    providerDetails: {
      name: 'ProBooster123',
      rating: 4.9,
      completedOrders: 342,
      joinedDate: '2024-01-15',
    },
  },
  '2': {
    id: '2',
    title: 'Valorant Rank Boost',
    status: 'Delivered',
    date: '2025-06-01',
    price: 79.99,
    provider: 'ValorantPro',
    description: 'Gold III → Platinum II',
    statusHistory: [
      { status: 'Delivered', date: '2025-06-02 15:20:00', note: 'Order completed successfully' },
      { status: 'Processing', date: '2025-06-01 18:45:00', note: 'Reached Platinum I' },
      { status: 'Processing', date: '2025-06-01 14:30:00', note: 'Booster has started working' },
      { status: 'Processing', date: '2025-06-01 14:00:00', note: 'Order confirmed' },
    ],
    gameDetails: {
      game: 'Valorant',
      server: 'NA',
      account: 'Account credentials exchanged securely',
    },
    providerDetails: {
      name: 'ValorantPro',
      rating: 4.8,
      completedOrders: 156,
      joinedDate: '2024-03-20',
    },
  },
};

const OrderDetails: React.FC = () => {
  const route = useRoute<OrderDetailsRouteProp>();
  const navigation = useNavigation<OrderDetailsNavProp>();
  const { isDarkMode } = useContext(ThemeContext);
  
  const theme = isDarkMode ? {
    background: '#101b23',
    card: '#1e293b',
    text: '#fff',
    subtext: '#94a3b8',
    accent: '#68d6ff',
    border: '#2b3542',
    divider: '#2b3542',
  } : {
    background: '#f0f2f5',
    card: '#fff',
    text: '#000',
    subtext: '#666',
    accent: '#635BFF',
    border: '#e5e7eb',
    divider: '#e5e7eb',
  };

  const order = mockOrders[route.params.orderId];
  
  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <AppHeader gender="male" isDarkMode={isDarkMode} toggleTheme={() => {}} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>Order not found</Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      Processing: { bg: isDarkMode ? '#0d462b' : '#DFFFE2', text: isDarkMode ? '#4ade80' : '#317B42' },
      Delivered: { bg: isDarkMode ? '#1e293b' : '#ECF4FF', text: isDarkMode ? '#68d6ff' : '#635BFF' },
      Cancelled: { bg: isDarkMode ? '#481a1d' : '#FFE4E4', text: isDarkMode ? '#f87171' : '#DC2626' },
    };
    return colors[status];
  };

  const renderStatusBadge = (status: Order['status']) => (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status).bg }]}>
      <Text style={[styles.statusText, { color: getStatusColor(status).text }]}>
        {status}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader gender="male" isDarkMode={isDarkMode} toggleTheme={() => {}} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SlideIn from="top" duration={500}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
              Order Details
            </Text>
          </View>
        </SlideIn>

        <FadeIn duration={400} delay={200}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.orderHeader}>
              <Text style={[styles.orderTitle, { color: theme.text }]}>
                {order.title}
              </Text>
              {renderStatusBadge(order.status)}
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            
            <View style={styles.orderInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color={theme.subtext} />
                <Text style={[styles.infoText, { color: theme.subtext }]}>
                  Ordered on {new Date(order.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="game-controller-outline" size={20} color={theme.subtext} />
                <Text style={[styles.infoText, { color: theme.subtext }]}>
                  {order.gameDetails.game} • {order.gameDetails.server}
                </Text>
              </View>
              <Text style={[styles.price, { color: theme.accent }]}>
                ${order.price.toFixed(2)}
              </Text>
            </View>
          </View>
        </FadeIn>

        <FadeIn duration={400} delay={300}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Status History
            </Text>
            {order.statusHistory.map((status, index) => (
              <View key={index} style={styles.statusHistoryItem}>
                <View style={styles.statusTimeline}>
                  <View style={[styles.timelineDot, { borderColor: theme.accent }]} />
                  {index !== order.statusHistory.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: theme.border }]} />
                  )}
                </View>
                <View style={styles.statusContent}>
                  <Text style={[styles.statusDate, { color: theme.subtext }]}>
                    {new Date(status.date).toLocaleString()}
                  </Text>
                  <Text style={[styles.statusNote, { color: theme.text }]}>
                    {status.note}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </FadeIn>

        <FadeIn duration={400} delay={400}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Provider Information
            </Text>
            <View style={styles.providerInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={20} color={theme.subtext} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                  {order.providerDetails.name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="star-outline" size={20} color={theme.subtext} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                  {order.providerDetails.rating} Rating
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="checkmark-circle-outline" size={20} color={theme.subtext} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                  {order.providerDetails.completedOrders} Orders Completed
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={20} color={theme.subtext} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                  Member since {new Date(order.providerDetails.joinedDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        </FadeIn>

        {order.status === 'Processing' && (
          <FadeIn duration={400} delay={500}>
            <TouchableOpacity 
              style={[styles.contactButton, { backgroundColor: theme.accent }]}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#fff" />
              <Text style={styles.contactButtonText}>
                Contact Provider
              </Text>
            </TouchableOpacity>
          </FadeIn>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  orderInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statusHistoryItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusTimeline: {
    alignItems: 'center',
    width: 20,
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  statusContent: {
    flex: 1,
  },
  statusDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  statusNote: {
    fontSize: 14,
  },
  providerInfo: {
    gap: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OrderDetails;
