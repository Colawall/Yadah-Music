/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../../themes/ThemeProvider';

interface EqualizerBarsProps {
  isPlaying: boolean;
  color?: string;
  size?: number;
}

export const EqualizerBars: React.FC<EqualizerBarsProps> = ({ isPlaying, color, size = 16 }) => {
  const { theme } = useTheme();
  const barColor = color || theme.colors.primary;

  return (
    <div
      className="flex items-end justify-center gap-[2px]"
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-label="Playing audio indicator"
    >
      <span
        className={`w-[2.5px] rounded-full ${isPlaying ? 'animate-[bounce_0.8s_ease-in-out_infinite]' : ''}`}
        style={{
          backgroundColor: barColor,
          height: isPlaying ? '80%' : '35%',
          animationDelay: '0ms',
        }}
      />
      <span
        className={`w-[2.5px] rounded-full ${isPlaying ? 'animate-[bounce_0.6s_ease-in-out_infinite]' : ''}`}
        style={{
          backgroundColor: barColor,
          height: isPlaying ? '100%' : '65%',
          animationDelay: '150ms',
        }}
      />
      <span
        className={`w-[2.5px] rounded-full ${isPlaying ? 'animate-[bounce_0.9s_ease-in-out_infinite]' : ''}`}
        style={{
          backgroundColor: barColor,
          height: isPlaying ? '55%' : '40%',
          animationDelay: '300ms',
        }}
      />
      <span
        className={`w-[2.5px] rounded-full ${isPlaying ? 'animate-[bounce_0.7s_ease-in-out_infinite]' : ''}`}
        style={{
          backgroundColor: barColor,
          height: isPlaying ? '90%' : '50%',
          animationDelay: '100ms',
        }}
      />
    </div>
  );
};
