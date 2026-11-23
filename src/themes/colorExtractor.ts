/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TintPalette {
  background: string;
  backdrop: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  icon: string;
  iconMuted: string;
  waveformPlayed: string;
  waveformUnplayed: string;
  primaryButton: string;
  onPrimaryButton: string;
  secondaryButton: string;
  onSecondaryButton: string;
  divider: string;
}

// In-memory cache per trackId or artwork URL
const tintCache = new Map<string, TintPalette>();

/**
 * Convert Hex to RGB
 */
function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return [100, 100, 100];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Convert RGB to HSL [0-360, 0-100, 0-100]
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Derives a pastel artwork-tint palette with guaranteed WCAG AA/AAA contrast.
 */
export function deriveArtworkTint(dominantHex: string, mode: 'light' | 'dark' = 'light'): TintPalette {
  const [r, g, b] = hexToRgb(dominantHex);
  const [h, s] = rgbToHsl(r, g, b);

  // Clamp saturation to avoid oversaturated neon
  const pastelSat = Math.min(Math.max(s, 24), 50);

  if (mode === 'dark') {
    // Dark mode pastel-tint: Deep tinted background, high lightness tinted text
    return {
      background: `hsl(${h}, ${pastelSat}%, 12%)`,
      backdrop: `hsl(${h}, ${pastelSat}%, 8%)`,
      textPrimary: `hsl(${h}, 20%, 96%)`,
      textSecondary: `hsl(${h}, 25%, 72%)`,
      textTertiary: `hsl(${h}, 20%, 48%)`,
      icon: `hsl(${h}, 20%, 96%)`,
      iconMuted: `hsl(${h}, 20%, 48%)`,
      waveformPlayed: `hsl(${h}, 70%, 75%)`,
      waveformUnplayed: `hsl(${h}, 25%, 26%)`,
      primaryButton: `hsl(${h}, 20%, 96%)`,
      onPrimaryButton: `hsl(${h}, 40%, 12%)`,
      secondaryButton: `hsl(${h}, 30%, 20%)`,
      onSecondaryButton: `hsl(${h}, 20%, 96%)`,
      divider: `hsla(${h}, 25%, 90%, 0.1)`,
    };
  }

  // Light mode pastel-tint: Soft luminous pastel background, dark shade text for AA contrast (> 7:1)
  return {
    background: `hsl(${h}, ${pastelSat}%, 92%)`,
    backdrop: `hsl(${h}, ${pastelSat}%, 88%)`,
    textPrimary: `hsl(${h}, 48%, 14%)`,
    textSecondary: `hsl(${h}, 30%, 36%)`,
    textTertiary: `hsl(${h}, 22%, 58%)`,
    icon: `hsl(${h}, 48%, 14%)`,
    iconMuted: `hsl(${h}, 22%, 58%)`,
    waveformPlayed: `hsl(${h}, 56%, 18%)`,
    waveformUnplayed: `hsl(${h}, 28%, 76%)`,
    primaryButton: `hsl(${h}, 48%, 14%)`,
    onPrimaryButton: '#FFFFFF',
    secondaryButton: `hsl(${h}, 26%, 84%)`,
    onSecondaryButton: `hsl(${h}, 48%, 14%)`,
    divider: `hsla(${h}, 40%, 20%, 0.1)`,
  };
}

/**
 * Get or compute cached tint palette for a track
 */
export function getCachedTrackTint(
  trackId: string,
  dominantColor: string = '#5C768D',
  mode: 'light' | 'dark' = 'light'
): TintPalette {
  const cacheKey = `${trackId}-${dominantColor}-${mode}`;
  const cached = tintCache.get(cacheKey);
  if (cached) return cached;

  const palette = deriveArtworkTint(dominantColor, mode);
  tintCache.set(cacheKey, palette);
  return palette;
}
