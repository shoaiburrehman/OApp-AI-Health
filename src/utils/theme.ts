export const colors = {
  // Backgrounds
  background: '#F7F9FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EFF3F7',

  // Brand - calm teal
  primary: '#2C8C7E',
  primaryLight: '#E6F4F2',
  primaryDark: '#1E6B5F',

  // Text
  textPrimary: '#1A2332',
  textSecondary: '#5A6B7E',
  textMuted: '#9AAABB',
  textOnPrimary: '#FFFFFF',

  // States
  error: '#D94F4F',
  errorLight: '#FDEAEA',
  warning: '#E88C30',
  warningLight: '#FEF3E2',

  // Borders
  border: '#E2EAF0',
  borderLight: '#F0F5F8',

  // Severity scale colours
  severity1: '#4CAF88',
  severity2: '#8BC34A',
  severity3: '#FFC107',
  severity4: '#FF9800',
  severity5: '#F44336',
} as const;

export const typography = {
  fontSizeXS: 11,
  fontSizeSM: 13,
  fontSizeMD: 15,
  fontSizeLG: 17,
  fontSizeXL: 22,

  fontWeightNormal: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemibold: '600' as const,
  fontWeightBold: '700' as const,

  lineHeightNormal: 1.5,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  round: 999,
} as const;
