/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { YadahTheme } from './types';

export const yadahLight: YadahTheme = {
  id: 'yadah-light',
  name: 'Yadah Light',
  mode: 'light',
  colors: {
    backdrop: '#EEF1F6',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F6F8FB',
    surfaceActive: '#F1F3F6',
    textPrimary: '#171C26',
    textSecondary: '#6C7689',
    textTertiary: '#A4AAB7',
    icon: '#171C26',
    iconMuted: '#A4AAB7',
    primary: '#171C26',
    onPrimary: '#FFFFFF',
    secondaryButton: '#F1F3F6',
    onSecondaryButton: '#171C26',
    miniPlayerBg: '#171C26',
    onMiniPlayer: '#FFFFFF',
    navBg: '#FFFFFF',
    navActive: '#171C26',
    navInactive: '#A4AAB7',
    divider: 'rgba(23, 28, 38, 0.08)',
    waveformPlayed: '#171C26',
    waveformUnplayed: '#A4AAB7',
    danger: '#E53935',
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    sizes: {
      xs: '11px',
      sm: '13px',
      base: '15px',
      lg: '17px',
      xl: '20px',
      title: '24px',
      hero: '28px',
    },
  },
  shape: {
    radiusArtwork: '24px',
    radiusCard: '24px',
    radiusButton: '16px',
    radiusPill: '9999px',
  },
  effects: {
    shadowSoft: '0 8px 24px -4px rgba(23, 28, 38, 0.06)',
    shadowArtwork: '0 20px 40px -8px rgba(23, 28, 38, 0.16)',
    glass: false,
    blurIntensity: '12px',
  },
  behavior: {
    nowPlayingBackground: 'solid',
  },
};
