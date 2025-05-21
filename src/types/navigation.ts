import { Order as OrderType } from '../screens/Order';


export type RootStackParamList = {
  Home: { gender: 'male' | 'female' };
  Order: undefined;
  OrderDetails: { order: OrderType };
  Boost: undefined;
  SignIn: undefined;
  SignInOTP: undefined;
  SignUp: undefined;
  Settings: undefined;
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
};

export interface Order {
    id: string;
    title: string;
    status: "Delivered" | "Processing" | "Cancelled";
    date: string;
}
