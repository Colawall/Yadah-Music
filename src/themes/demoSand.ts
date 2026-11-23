/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { YadahTheme } from './types';

/**
 * Demo Sand theme - clearly marked as a placeholder demo theme to prove the theme
 * system and test 'artwork-tint' nowPlayingBackground behavior.
 */
export const demoSand: YadahTheme = {
  id: 'demo-sand',
  name: 'Demo Sand (Placeholder)',
  mode: 'light',
  colors: {
    backdrop: '#F5EFEB',
    background: '#FAF7F2',
    surface: '#FFFFFF',
    surfaceAlt: '#F0EAE1',
    surfaceActive: '#E8DFD3',
    textPrimary: '#2C241E',
    textSecondary: '#786C60',
    textTertiary: '#A89B8E',
    icon: '#2C241E',
    iconMuted: '#A89B8E',
    primary: '#D47A46',
    onPrimary: '#FFFFFF',
    secondaryButton: '#E8DFD3',
    onSecondaryButton: '#2C241E',
    miniPlayerBg: '#2C241E',
    onMiniPlayer: '#FAF7F2',
    navBg: '#FAF7F2',
    navActive: '#D47A46',
    navInactive: '#A89B8E',
    divider: 'rgba(44, 36, 30, 0.08)',
    waveformPlayed: '#D47A46',
    waveformUnplayed: '#D2C6B8',
    danger: '#D9453B',
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
    shadowSoft: '0 8px 24px -4px rgba(44, 36, 30, 0.07)',
    shadowArtwork: '0 20px 40px -8px rgba(44, 36, 30, 0.18)',
    glass: false,
    blurIntensity: '12px',
  },
  behavior: {
    nowPlayingBackground: 'artwork-tint',
  },
};
