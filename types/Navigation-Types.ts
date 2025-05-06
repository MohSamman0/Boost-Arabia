import { Order as OrderType } from '../screens/Order';


export type RootStackParamList = {
  Home: undefined;
  Order: undefined;
  OrderDetails: { order: OrderType };
  Profile: { userId: string };
  Boost: undefined;
  GameDetails: {
    gameId: string;
    gameName: string;
    gameDescription: string;
    gameImage: any;
  };
  // Add other routes here
};

export type BottomTabParamList = {
    Feed: undefined;
    Messages: undefined;
    Settings: undefined;
};

export type DrawerParamList = {
    Dashboard: undefined;
    Notifications: undefined;
    Account: undefined;
};

export interface Order {
    id: string;
    title: string;
    status: "Delivered" | "Processing" | "Cancelled";
    date: string;
  }
