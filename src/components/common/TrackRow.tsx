/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MoreHorizontal, Heart } from 'lucide-react';
import { Track } from '../../types/music';
import { useTheme } from '../../themes/ThemeProvider';
import { usePlayerStore } from '../../store/playerStore';
import { EqualizerBars } from './EqualizerBars';
import { formatDuration, triggerHaptic } from '../../utils/waveform';

interface TrackRowProps {
  track: Track;
  index: number;
  onPlay: (track: Track) => void;
  onOpenMenu?: (track: Track) => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({ track, index, onPlay, onOpenMenu }) => {
  const { theme } = useTheme();
  const { currentTrack, isPlaying, isLiked, toggleLike } = usePlayerStore();

  const isCurrent = currentTrack?.id === track.id;
  const liked = isLiked(track.id);

  const handleRowClick = () => {
    triggerHaptic(10);
    onPlay(track);
  };

  const formattedIndex = (index + 1).toString().padStart(2, '0');

  return (
    <div
      onClick={handleRowClick}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 active:scale-[0.99] group min-h-[52px]"
      style={{
        backgroundColor: isCurrent ? theme.colors.surfaceActive : 'transparent',
      }}
    >
      {/* Left: Number or Equalizer + Title/Artist */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Index / Equalizer */}
        <div className="w-6 flex items-center justify-center shrink-0">
          {isCurrent ? (
            <EqualizerBars isPlaying={isPlaying} color={theme.colors.primary} size={14} />
          ) : (
            <span
              className="text-xs font-mono tabular-nums"
              style={{
                color: theme.colors.textTertiary,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              {formattedIndex}
            </span>
          )}
        </div>

        {/* Artwork Thumbnail (compact) */}
        <div
          className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative"
          style={{ backgroundColor: theme.colors.surfaceAlt }}
        >
          <img
            src={track.artworkUrl}
            alt={track.title}
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Title & Artist */}
        <div className="flex flex-col min-w-0 flex-1 pr-2">
          <span
            className="text-sm truncate"
            style={{
              color: isCurrent ? theme.colors.primary : theme.colors.textPrimary,
              fontWeight: isCurrent ? theme.typography.weights.semibold : theme.typography.weights.medium,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            {track.title}
          </span>
          <span
            className="text-xs truncate mt-0.5"
            style={{
              color: theme.colors.textSecondary,
              fontWeight: theme.typography.weights.regular,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            {track.artists.join(', ')}
          </span>
        </div>
      </div>

      {/* Right: Like, Duration, More Menu */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Like Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic(12);
            toggleLike(track.id);
          }}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-transform active:scale-90"
          style={{
            color: liked ? theme.colors.danger : theme.colors.iconMuted,
          }}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <Heart size={16} fill={liked ? theme.colors.danger : 'none'} />
        </button>

        {/* Duration */}
        <span
          className="text-xs font-mono tabular-nums w-11 text-right"
          style={{
            color: theme.colors.textTertiary,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          {formatDuration(track.durationMs)}
        </span>

        {/* Options Menu Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic(10);
            onOpenMenu?.(track);
          }}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors active:scale-90"
          style={{ color: theme.colors.iconMuted }}
          aria-label="More options"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};
