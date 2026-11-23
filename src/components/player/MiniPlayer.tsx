/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { useTheme } from '../../themes/ThemeProvider';
import { triggerHaptic } from '../../utils/waveform';

export const MiniPlayer: React.FC = () => {
  const { theme } = useTheme();
  const { currentTrack, isPlaying, togglePlay, openNowPlaying, isLiked, toggleLike, progressMs } =
    usePlayerStore();

  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const progressRatio = currentTrack.durationMs > 0 ? progressMs / currentTrack.durationMs : 0;

  const handleMiniPlayerClick = (e: React.MouseEvent) => {
    // If user clicked directly on like or play buttons, don't open now playing
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    triggerHaptic(15);
    openNowPlaying();
  };

  return (
    <div
      onClick={handleMiniPlayerClick}
      className="w-full px-3 cursor-pointer select-none relative z-30 transition-transform active:scale-[0.99]"
      style={{
        marginBottom: '-6px', // Overlaps top edge of bottom nav as specified in requirements
      }}
    >
      <div
        className="w-full h-15 rounded-2xl flex items-center justify-between px-3 relative overflow-hidden shadow-lg transition-all"
        style={{
          backgroundColor: theme.colors.miniPlayerBg,
          color: theme.colors.onMiniPlayer,
          borderRadius: theme.shape.radiusCard,
          boxShadow: theme.effects.shadowSoft,
        }}
      >
        {/* Subtle mini progress indicator line at bottom */}
        <div
          className="absolute bottom-0 left-0 h-[2.5px] bg-white/20 w-full"
        >
          <div
            className="h-full bg-white/70 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progressRatio * 100))}%` }}
          />
        </div>

        {/* Left: Thumbnail & Title/Artist */}
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
          {/* Small artwork thumbnail */}
          <div
            className="w-10 h-10 overflow-hidden shrink-0 relative shadow-sm"
            style={{
              borderRadius: '12px',
            }}
          >
            <img
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Title & Artist */}
          <div className="flex flex-col min-w-0 flex-1">
            <span
              className="text-xs truncate font-semibold leading-tight"
              style={{
                color: theme.colors.onMiniPlayer,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              {currentTrack.title}
            </span>
            <span
              className="text-[11px] truncate opacity-75 mt-0.5"
              style={{
                color: theme.colors.onMiniPlayer,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              {currentTrack.artists.join(', ')}
            </span>
          </div>
        </div>

        {/* Right: Heart & White Rounded-Square Play/Pause button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic(12);
              toggleLike(currentTrack.id);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-transform active:scale-90"
            style={{
              color: liked ? theme.colors.danger : theme.colors.onMiniPlayer,
              opacity: liked ? 1 : 0.75,
            }}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart size={18} fill={liked ? theme.colors.danger : 'none'} />
          </button>

          {/* White rounded-square play/pause button as specified in prompt */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic(15);
              togglePlay();
            }}
            className="w-9 h-9 flex items-center justify-center transition-transform active:scale-90 shadow-sm"
            style={{
              backgroundColor: theme.colors.onMiniPlayer,
              color: theme.colors.miniPlayerBg,
              borderRadius: '12px',
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={17} fill="currentColor" />
            ) : (
              <Play size={17} fill="currentColor" className="ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
