import 'dotenv/config';

export default {
  expo: {
    plugins: [],
    scheme: 'boostarabia',
    owner: '0decoy',
    extra: {
      useProxy: true,
      EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
      EXPO_PUBLIC_ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT,
      eas: {
        projectId: 'b4bfa9be-4f07-4cd3-b15e-8e73dc93241e',
      },
    },
    web: {
      config: {
        headers: {
          'Content-Security-Policy': "default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content: https://ssl.gstatic.com",
        },
      },
      favicon: './assets/icon.png',
    },
    name: 'BoostArabia',
    slug: 'BoostArabia',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#101b23',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.0decoy.BoostArabia',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.x0decoy.BoostArabia',
    },
  },
}; 