export interface Service {
    id: number;
    title: string;
    subtitle?: string; // Optional for main services
    description?: string; // Optional for featured services
    image: any; // You can use a stricter type like ImageSourcePropType if preferred
  }
  