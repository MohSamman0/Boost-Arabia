export interface Order {
  id: string;
  title: string;
  status: "Delivered" | "Processing" | "Cancelled";
  date: string;
  price: number;
  provider: string;
  description: string;
}

export type RootStackParamList = {
  Home: { gender: 'male' | 'female' };
  Order: undefined;
  OrderDetails: { orderId: string };
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
