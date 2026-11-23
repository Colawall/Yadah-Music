/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Deterministically generates pseudo-waveform bar heights (0.15 to 1.0) seeded by trackId.
 */
export function generateWaveform(trackId: string, barCount: number = 46): number[] {
  let hash = 0;
  for (let i = 0; i < trackId.length; i++) {
    hash = (hash << 5) - hash + trackId.charCodeAt(i);
    hash |= 0;
  }

  const bars: number[] = [];
  let prev = 0.45;

  for (let i = 0; i < barCount; i++) {
    // Pseudo random generator using xorshift with seed
    hash ^= hash << 13;
    hash ^= hash >> 17;
    hash ^= hash << 5;
    const rand = Math.abs(hash % 1000) / 1000;

    // Organic smoothing with neighboring bars + sine curve musical rhythm
    const musicalEnvelope = Math.sin((i / barCount) * Math.PI) * 0.35 + 0.3;
    const value = Math.max(0.18, Math.min(0.96, prev * 0.45 + rand * 0.4 + musicalEnvelope));
    bars.push(value);
    prev = value;
  }

  return bars;
}

/**
 * Formats milliseconds into M:SS or MM:SS
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Safe haptic feedback using web Vibration API if supported
 */
export function triggerHaptic(duration: number = 10): void {
  try {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  } catch {
    // Silently ignore if unsupported
  }
}
