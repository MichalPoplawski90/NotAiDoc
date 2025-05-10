import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E3F7F', // Granatowy - główny kolor
    secondary: '#4A6FA5', // Niebieski - kolor uzupełniający
    accent: '#D0A650', // Złoty - kolor akcentujący
    surface: '#FFFFFF',
    background: '#F5F7FA',
    text: '#333333',
    error: '#B72E3E',
    success: '#3FB950',
    warning: '#F7B955',
    info: '#58A6FF',
    disabled: '#C2C7D0',
    placeholder: '#9EA7B8',
    backdrop: 'rgba(0, 0, 0, 0.4)',
    notification: '#FF3B30',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  animation: {
    scale: 1.0,
  },
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  headline1: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headline2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headline3: {
    fontSize: 20,
    fontWeight: '500',
  },
  subtitle1: {
    fontSize: 18,
    fontWeight: '500',
  },
  subtitle2: {
    fontSize: 16,
    fontWeight: '500',
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  button: {
    fontSize: 16,
    fontWeight: '500',
  },
}; 