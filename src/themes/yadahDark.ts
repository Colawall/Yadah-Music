/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { YadahTheme } from './types';

export const yadahDark: YadahTheme = {
  id: 'yadah-dark',
  name: 'Yadah Dark',
  mode: 'dark',
  colors: {
    backdrop: '#0B0E14',
    background: '#11151F',
    surface: '#171D2A',
    surfaceAlt: '#1F2738',
    surfaceActive: '#283247',
    textPrimary: '#F2F5F8',
    textSecondary: '#9AA4B8',
    textTertiary: '#647087',
    icon: '#F2F5F8',
    iconMuted: '#647087',
    primary: '#F2F5F8',
    onPrimary: '#11151F',
    secondaryButton: '#283247',
    onSecondaryButton: '#F2F5F8',
    miniPlayerBg: '#0B0E14',
    onMiniPlayer: '#F2F5F8',
    navBg: '#171D2A',
    navActive: '#F2F5F8',
    navInactive: '#647087',
    divider: 'rgba(255, 255, 255, 0.08)',
    waveformPlayed: '#F2F5F8',
    waveformUnplayed: '#384256',
    danger: '#FF5A5F',
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
    shadowSoft: '0 8px 24px -4px rgba(0, 0, 0, 0.35)',
    shadowArtwork: '0 20px 40px -8px rgba(0, 0, 0, 0.55)',
    glass: false,
    blurIntensity: '12px',
  },
  behavior: {
    nowPlayingBackground: 'solid',
  },
};
