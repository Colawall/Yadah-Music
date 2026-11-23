/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useMemo } from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import { formatDuration, generateWaveform, triggerHaptic } from '../../utils/waveform';

interface WaveformScrubberProps {
  trackId: string;
  durationMs: number;
  progressMs: number;
  onSeek: (ms: number) => void;
  playedColor?: string;
  unplayedColor?: string;
  textColor?: string;
}

export const WaveformScrubber: React.FC<WaveformScrubberProps> = ({
  trackId,
  durationMs,
  progressMs,
  onSeek,
  playedColor,
  unplayedColor,
  textColor,
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgressRatio, setDragProgressRatio] = useState<number | null>(null);

  const bars = useMemo(() => generateWaveform(trackId, 48), [trackId]);

  const currentRatio = isDragging && dragProgressRatio !== null
    ? dragProgressRatio
    : Math.min(1, Math.max(0, durationMs > 0 ? progressMs / durationMs : 0));

  const playedBarColor = playedColor || theme.colors.waveformPlayed;
  const unplayedBarColor = unplayedColor || theme.colors.waveformUnplayed;
  const timeTextColor = textColor || theme.colors.textSecondary;

  const calculateRatioFromEvent = (clientX: number): number => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    triggerHaptic(12);
    const ratio = calculateRatioFromEvent(e.clientX);
    setDragProgressRatio(ratio);
    onSeek(Math.round(ratio * durationMs));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const ratio = calculateRatioFromEvent(e.clientX);
    setDragProgressRatio(ratio);
    onSeek(Math.round(ratio * durationMs));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const ratio = calculateRatioFromEvent(e.clientX);
    setDragProgressRatio(null);
    onSeek(Math.round(ratio * durationMs));
    triggerHaptic(15);
  };

  const displayProgressMs = isDragging && dragProgressRatio !== null
    ? Math.round(dragProgressRatio * durationMs)
    : progressMs;

  return (
    <div className="w-full flex flex-col gap-2 select-none py-1">
      {/* Waveform Bars Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          setIsDragging(false);
          setDragProgressRatio(null);
        }}
        className="w-full h-14 flex items-center justify-between gap-[3px] cursor-pointer touch-none py-1 px-0.5 group"
        role="slider"
        aria-label="Audio scrubber"
        aria-valuemin={0}
        aria-valuemax={durationMs}
        aria-valuenow={displayProgressMs}
      >
        {bars.map((amplitude, index) => {
          const barRatio = index / (bars.length - 1);
          const isPlayed = barRatio <= currentRatio;
          const barHeightPct = Math.max(18, Math.round(amplitude * 100));

          return (
            <div
              key={index}
              className="flex-1 min-w-[2px] max-w-[5px] h-full flex items-center justify-center transition-transform duration-100 group-hover:scale-y-105"
            >
              <div
                className="w-full rounded-full transition-colors duration-75"
                style={{
                  height: `${barHeightPct}%`,
                  backgroundColor: isPlayed ? playedBarColor : unplayedBarColor,
                  opacity: isPlayed ? 1 : 0.65,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Time indicators */}
      <div
        className="flex items-center justify-between text-xs font-mono tabular-nums px-0.5"
        style={{
          color: timeTextColor,
          fontFamily: theme.typography.fontFamily,
          fontWeight: theme.typography.weights.medium,
        }}
      >
        <span>{formatDuration(displayProgressMs)}</span>
        <span>{formatDuration(durationMs)}</span>
      </div>
    </div>
  );
};
