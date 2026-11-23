/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  backdrop: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  surfaceActive: string; // selected row
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  icon: string;
  iconMuted: string;
  primary: string;
  onPrimary: string;
  secondaryButton: string;
  onSecondaryButton: string;
  miniPlayerBg: string;
  onMiniPlayer: string;
  navBg: string;
  navActive: string;
  navInactive: string;
  divider: string;
  waveformPlayed: string;
  waveformUnplayed: string;
  danger: string;
}

export interface ThemeTypography {
  fontFamily: string;
  weights: {
    regular: string | number;
    medium: string | number;
    semibold: string | number;
    bold: string | number;
  };
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    title: string;
    hero: string;
  };
}

export interface ThemeShape {
  radiusArtwork: string;
  radiusCard: string;
  radiusButton: string;
  radiusPill: string;
}

export interface ThemeEffects {
  shadowSoft: string;
  shadowArtwork: string;
  glass: boolean;
  blurIntensity: string;
}

export interface ThemeBehavior {
  nowPlayingBackground: 'solid' | 'artwork-tint';
}

export interface YadahTheme {
  id: string;
  name: string;
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  shape: ThemeShape;
  effects: ThemeEffects;
  behavior: ThemeBehavior;
}
