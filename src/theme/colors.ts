export const colors = {
  light: {
    background: '#f0f2f5',
    text: '#333',
    subtext: '#666',
    primary: '#635BFF',
    secondary: '#4A4A4A',
    card: '#fff',
    success: {
      background: '#DFFFE2',
      text: '#317B42',
    },
    accent: '#68d6ff',
  },
  dark: {
    background: '#101b23',
    text: '#fff',
    subtext: '#94a3b8',
    primary: '#68d6ff',
    secondary: '#2a2d34',
    card: '#1e293b',
    success: {
      background: '#0d462b',
      text: '#4ade80',
    },
    accent: '#635BFF',
  },
} as const;

export type ThemeColors = typeof colors.light & typeof colors.dark;
