import { ImageSourcePropType } from 'react-native';

export interface Game {
  id: string;
  name: string;
  description: string;
  image: ImageSourcePropType;
}

export interface GameScreenParams {
  gameId: string;
  gameName: string;
  gameDescription: string;
  gameImage: ImageSourcePropType;
}

export interface ActiveOrder {
  id: string;
  gameName: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  estimatedTimeRemaining?: string;
}
