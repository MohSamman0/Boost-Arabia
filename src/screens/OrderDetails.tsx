// screens/OrderDetails.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation-Types';

type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;

const OrderDetails: React.FC = () => {
  const { order } = useRoute<OrderDetailsRouteProp>().params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Order Details</Text>

      <Text style={styles.label}>Order ID: {order.id}</Text>
      <Text style={styles.label}>Title: {order.title}</Text>
      <Text style={styles.label}>
        Date: {new Date(order.date).toLocaleString()}
      </Text>
      <Text style={styles.label}>Provider: {order.providerName}</Text>
      <Text style={styles.label}>Description: {order.description}</Text>
      <Text style={styles.label}>Price: ${order.price.toFixed(2)}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  item: {
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

export default OrderDetails;
