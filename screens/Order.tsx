// screens/Order.tsx

import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/Navigation-Types';
import Footer from '../components/Footer';

export interface Order {
  id: string;
  title: string;
  status: 'Delivered' | 'Processing' | 'Cancelled';
  date: string;
  price: number;
  providerName: string;
  description: string;
}

const ordersData: Order[] = [
  { id: '1', title: 'Valorant #001', status: 'Delivered', date: '2025-01-12T10:00:00Z', price: 49.99, providerName: 'Coach Alex', description: 'Boosted from Silver to Gold' },
  { id: '2', title: 'Overwatch #002', status: 'Processing', date: '2025-01-13T12:00:00Z', price: 39.99, providerName: 'Coach John', description: 'Skill coaching for 3 hours' },
  { id: '3', title: 'Call Of Duty #002', status: 'Cancelled', date: '2025-01-13T12:00:00Z', price: 39.99, providerName: 'Coach John', description: 'Skill coaching for 3 hours' },
];

type StatusFilter = 'All' | 'Delivered' | 'Processing' | 'Cancelled';
type OrderNavProp = StackNavigationProp<RootStackParamList, 'Order'>;

const OrderScreen: React.FC = () => {
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<OrderNavProp>();

  const handleFilterPress = useCallback((status: StatusFilter) => {
    setStatusFilter(status);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim]);

  const filteredOrders = useMemo(() => {
    return ordersData.filter(order => {
      const matchesText =
        order.title.toLowerCase().includes(filterText.toLowerCase()) ||
        order.status.toLowerCase().includes(filterText.toLowerCase());
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [filterText, statusFilter]);

  const renderOrderItem = useCallback(({ item }: { item: Order }) => {
    const iconName =
      item.status === 'Delivered' ? 'checkmark-circle' :
      item.status === 'Processing' ? 'time' : 'close-circle';
    const iconColor =
      item.status === 'Delivered' ? '#4caf50' :
      item.status === 'Processing' ? '#ffc107' : '#f44336';
    return (
      <TouchableOpacity
        style={[styles.orderItem, getBorderStyle(item.status)]}
        onPress={() => navigation.navigate('OrderDetails', { order: item })}
      >
        <View style={styles.orderDetails}>
          <Text style={styles.orderTitle}>{item.title}</Text>
          <Text style={styles.orderDate}>{new Date(item.date).toLocaleString()}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Ionicons name={iconName} size={22} color={iconColor} />
          <Text style={[styles.orderStatus, getStatusStyle(item.status)]}>{item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.header}>Orders</Text>
        <View style={styles.headerSeparator} />

        <View style={styles.filterContainer}>
          {(['All', 'Processing', 'Delivered', 'Cancelled'] as StatusFilter[]).map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                { backgroundColor: statusFilter === status ? getStatusColor(status) : '#2c384a' }
              ]}
              onPress={() => handleFilterPress(status)}
            >
              <Text style={{ color: statusFilter === status ? '#fff' : '#d1d5db', fontWeight: 'bold' }}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#b0b9c1" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders"
            placeholderTextColor="#b0b9c1"
            value={filterText}
            onChangeText={setFilterText}
          />
          {!!filterText && (
            <TouchableOpacity onPress={() => setFilterText('')}>
              <Ionicons name="close" size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>

        {filteredOrders.length > 0 ? (
          <Animated.FlatList
            data={filteredOrders}
            keyExtractor={item => item.id}
            renderItem={renderOrderItem}
            contentContainerStyle={styles.listContainer}
            style={{ opacity: fadeAnim }}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="folder-open" size={64} color="#68d6ff" />
            <Text style={styles.emptyStateText}>No orders found.</Text>
          </View>
        )}
      </KeyboardAvoidingView>

      <Footer activeTab="Order" />
    </SafeAreaView>
  );
};

const getBorderStyle = (status: Order['status']) => ({
  borderLeftWidth: 5,
  borderLeftColor:
    status === 'Delivered' ? '#4caf50' :
    status === 'Processing' ? '#ffc107' : '#f44336',
});

const getStatusStyle = (status: Order['status']) => ({
  backgroundColor:
    status === 'Delivered' ? '#4caf50' :
    status === 'Processing' ? '#ffc107' : '#f44336',
  color: '#ffffff',
  paddingVertical: 4,
  paddingHorizontal: 8,
  borderRadius: 8,
});

const getStatusColor = (status: StatusFilter) =>
  status === 'Delivered' ? '#4caf50' :
  status === 'Processing' ? '#ffc107' :
  status === 'Cancelled' ? '#f44336' : '#4a90e2';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101b23',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#68d6ff',
    textAlign: 'center',
    marginVertical: 16,
  },
  headerSeparator: {
    height: 2,
    backgroundColor: '#68d6ff',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 18,
    paddingVertical: 8,
  },
  listContainer: {
    paddingBottom: 16,
    gap: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  orderDetails: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  orderDate: {
    fontSize: 16,
    color: '#a1a9b8',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default OrderScreen;
