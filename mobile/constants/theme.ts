export const colors = {
  // 页面背景渐变
  bgTop: '#FFE4EC',
  bgBottom: '#FFF5F8',

  // 主色
  primary: '#FF9AA2',
  primaryDark: '#FF7E8A',
  primaryLight: '#FFB7C0',

  // 按钮渐变（次要按钮 / 小胶囊）
  buttonGradientStart: '#FFE8F0',
  buttonGradientEnd: '#FFD4E0',

  // 主按钮渐变
  primaryGradientStart: '#FF9AA2',
  primaryGradientEnd: '#FF8FAB',

  // 边框
  border: '#FFC8DD',
  borderLight: '#FFE8F0',

  // 卡片
  card: '#FFFFFF',
  cardBorder: '#FFD6E4',

  // 文字
  textPrimary: '#4A3F47',
  textSecondary: '#8E7A85',
  textMuted: '#B8A8B0',
  textPlaceholder: '#C9B8C0',
  textOnPrimary: '#FFFFFF',

  // 强调色 / 图标
  accent: '#FF8FAB',

  // 分割线
  divider: '#F5E6EC',

  white: '#FFFFFF',
  disabled: '#F0E4E8',
} as const;

export const gradients = {
  screen: [colors.bgTop, colors.bgBottom] as const,
  primaryButton: [colors.primaryGradientStart, colors.primaryGradientEnd] as const,
  secondaryButton: [colors.buttonGradientStart, colors.buttonGradientEnd] as const,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const theme = {
  colors,
  gradients,
  radius,
  spacing,
} as const;

/** Expo 模板兼容：light / dark 语义色 */
export const Colors = {
  light: {
    text: colors.textPrimary,
    background: colors.bgTop,
    tint: colors.primary,
    icon: colors.textSecondary,
    tabIconDefault: colors.textMuted,
    tabIconSelected: colors.primary,
  },
  dark: {
    text: '#F5E6EC',
    background: '#2A2226',
    tint: colors.primaryLight,
    icon: '#C9B8C0',
    tabIconDefault: '#9B8A93',
    tabIconSelected: colors.primaryLight,
  },
} as const;

export type ThemeColors = keyof typeof colors;
export type ThemeColorName = keyof typeof Colors.light & keyof typeof Colors.dark;
