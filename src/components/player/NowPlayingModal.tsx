/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  ListMusic,
  Heart,
  MoreHorizontal,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Repeat1,
  Share2,
  Disc,
  Plus,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayerStore } from '../../store/playerStore';
import { useTheme } from '../../themes/ThemeProvider';
import { getCachedTrackTint } from '../../themes/colorExtractor';
import { WaveformScrubber } from '../common/WaveformScrubber';
import { triggerHaptic } from '../../utils/waveform';

export const NowPlayingModal: React.FC = () => {
  const { theme } = useTheme();
  const {
    currentTrack,
    isPlaying,
    progressMs,
    shuffle,
    repeatMode,
    isNowPlayingOpen,
    closeNowPlaying,
    togglePlay,
    next,
    previous,
    seek,
    toggleShuffle,
    cycleRepeat,
    toggleLike,
    isLiked,
    openQueue,
    reducedMotion,
  } = usePlayerStore();

  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  if (!isNowPlayingOpen || !currentTrack) return null;

  const liked = isLiked(currentTrack.id);

  // Determine dynamic colors based on theme.behavior.nowPlayingBackground
  const isTinted = theme.behavior.nowPlayingBackground === 'artwork-tint';
  const tint = isTinted
    ? getCachedTrackTint(currentTrack.id, currentTrack.artworkDominantColor, theme.mode)
    : null;

  const activeColors = {
    background: tint ? tint.background : theme.colors.background,
    textPrimary: tint ? tint.textPrimary : theme.colors.textPrimary,
    textSecondary: tint ? tint.textSecondary : theme.colors.textSecondary,
    textTertiary: tint ? tint.textTertiary : theme.colors.textTertiary,
    icon: tint ? tint.icon : theme.colors.icon,
    iconMuted: tint ? tint.iconMuted : theme.colors.iconMuted,
    waveformPlayed: tint ? tint.waveformPlayed : theme.colors.waveformPlayed,
    waveformUnplayed: tint ? tint.waveformUnplayed : theme.colors.waveformUnplayed,
    playButtonBg: tint ? tint.primaryButton : theme.colors.primary,
    playButtonText: tint ? tint.onPrimaryButton : theme.colors.onPrimary,
    divider: tint ? tint.divider : theme.colors.divider,
  };

  const handleShare = () => {
    triggerHaptic(15);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { y: '100%' }}
        animate={reducedMotion ? { opacity: 1 } : { y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none"
        style={{
          backgroundColor: activeColors.background,
          color: activeColors.textPrimary,
          fontFamily: theme.typography.fontFamily,
        }}
      >
        {/* Header: Chevron-down, 'Now Playing' title, queue icon */}
        <div className="w-full flex items-center justify-between px-5 pt-8 pb-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(12);
              closeNowPlaying();
            }}
            className="w-11 h-11 flex items-center justify-center rounded-full transition-transform active:scale-90"
            style={{ color: activeColors.icon }}
            aria-label="Dismiss Now Playing"
          >
            <ChevronDown size={28} />
          </button>

          <div className="flex flex-col items-center">
            {isTinted && (
              <span
                className="text-[10px] tracking-wider uppercase font-semibold opacity-70 mb-0.5"
                style={{ color: activeColors.textSecondary }}
              >
                Artwork Tint
              </span>
            )}
            <h2
              className="text-sm font-semibold tracking-tight"
              style={{
                color: activeColors.textPrimary,
                fontWeight: theme.typography.weights.semibold,
              }}
            >
              Now Playing
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(12);
              openQueue();
            }}
            className="w-11 h-11 flex items-center justify-center rounded-full transition-transform active:scale-90"
            style={{ color: activeColors.icon }}
            aria-label="Open Queue"
          >
            <ListMusic size={24} />
          </button>
        </div>

        {/* Center Section: Large Rounded Artwork + Title & Info */}
        <div className="flex-1 flex flex-col items-center justify-center px-7 py-2 min-h-0">
          {/* Large Rounded Artwork with Soft Shadow */}
          <div
            className="w-full max-w-[320px] aspect-square overflow-hidden relative transition-all duration-300"
            style={{
              borderRadius: theme.shape.radiusArtwork,
              boxShadow: theme.effects.shadowArtwork,
              backgroundColor: theme.colors.surfaceAlt,
            }}
          >
            <img
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Under artwork: Heart on left, '...' on right, Bold centered title, Artist beneath */}
          <div className="w-full max-w-[340px] mt-6 flex items-center justify-between px-1">
            {/* Heart on left */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(14);
                toggleLike(currentTrack.id);
              }}
              className="w-11 h-11 flex items-center justify-center rounded-full transition-transform active:scale-90 shrink-0"
              style={{
                color: liked ? theme.colors.danger : activeColors.iconMuted,
              }}
              aria-label={liked ? 'Unlike track' : 'Like track'}
            >
              <Heart size={24} fill={liked ? theme.colors.danger : 'none'} />
            </button>

            {/* Bold centered title, artist beneath in secondary text */}
            <div className="flex-1 flex flex-col items-center text-center px-2 min-w-0">
              <h1
                className="text-xl leading-tight truncate w-full"
                style={{
                  color: activeColors.textPrimary,
                  fontWeight: theme.typography.weights.bold,
                  fontSize: theme.typography.sizes.title,
                }}
              >
                {currentTrack.title}
              </h1>
              <span
                className="text-sm truncate w-full mt-1"
                style={{
                  color: activeColors.textSecondary,
                  fontWeight: theme.typography.weights.regular,
                }}
              >
                {currentTrack.artists.join(', ')}
              </span>
            </div>

            {/* '...' pill on right */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(12);
                setShowMenuSheet(true);
              }}
              className="w-11 h-11 flex items-center justify-center rounded-full transition-transform active:scale-90 shrink-0"
              style={{ color: activeColors.iconMuted }}
              aria-label="More options"
            >
              <MoreHorizontal size={24} />
            </button>
          </div>
        </div>

        {/* Lower Section: Waveform Scrubber & Controls Row */}
        <div className="w-full px-7 pb-10 pt-2 shrink-0 max-w-[420px] mx-auto">
          {/* Waveform scrubber seeded from track ID */}
          <WaveformScrubber
            trackId={currentTrack.id}
            durationMs={currentTrack.durationMs}
            progressMs={progressMs}
            onSeek={seek}
            playedColor={activeColors.waveformPlayed}
            unplayedColor={activeColors.waveformUnplayed}
            textColor={activeColors.textSecondary}
          />

          {/* Controls Row: Shuffle, Previous, Large Dark Circular Play/Pause, Next, Repeat */}
          <div className="w-full flex items-center justify-between mt-6 px-2">
            {/* Shuffle */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(12);
                toggleShuffle();
              }}
              className="w-11 h-11 flex items-center justify-center rounded-full transition-transform active:scale-90"
              style={{
                color: shuffle ? activeColors.playButtonBg : activeColors.iconMuted,
              }}
              aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
            >
              <Shuffle size={20} strokeWidth={shuffle ? 2.5 : 1.8} />
            </button>

            {/* Previous */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(14);
                previous();
              }}
              className="w-11 h-11 flex items-center justify-center rounded-full transition-transform active:scale-90"
              style={{ color: activeColors.icon }}
              aria-label="Previous track"
            >
              <SkipBack size={26} fill="currentColor" />
            </button>

            {/* Large dark circular play/pause button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(18);
                togglePlay();
              }}
              className="w-17 h-17 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
              style={{
                backgroundColor: activeColors.playButtonBg,
                color: activeColors.playButtonText,
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} fill="currentColor" className="ml-1" />
              )}
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(14);
                next();
              }}
              className="w-11 h-11 flex items-center justify-center rounded-full transition-transform active:scale-90"
              style={{ color: activeColors.icon }}
              aria-label="Next track"
            >
              <SkipForward size={26} fill="currentColor" />
            </button>

            {/* Repeat */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(12);
                cycleRepeat();
              }}
              className="w-11 h-11 flex items-center justify-center rounded-full transition-transform active:scale-90"
              style={{
                color: repeatMode !== 'off' ? activeColors.playButtonBg : activeColors.iconMuted,
              }}
              aria-label={`Repeat mode: ${repeatMode}`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 size={21} strokeWidth={2.4} />
              ) : (
                <Repeat size={21} strokeWidth={repeatMode === 'all' ? 2.4 : 1.8} />
              )}
            </button>
          </div>
        </div>

        {/* Context Action Sheet */}
        <AnimatePresence>
          {showMenuSheet && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm flex items-end justify-center"
              onClick={() => setShowMenuSheet(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="w-full max-w-md rounded-t-3xl p-6 shadow-2xl flex flex-col gap-4"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textPrimary,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-1.5 rounded-full mx-auto bg-gray-300 dark:bg-gray-700 mb-2" />

                <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <img
                    src={currentTrack.artworkUrl}
                    alt={currentTrack.title}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm truncate">{currentTrack.title}</span>
                    <span className="text-xs text-gray-500 truncate">
                      {currentTrack.artists.join(', ')} · {currentTrack.album}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(10);
                      toggleLike(currentTrack.id);
                      setShowMenuSheet(false);
                    }}
                    className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    <Heart size={18} fill={liked ? theme.colors.danger : 'none'} color={liked ? theme.colors.danger : 'currentColor'} />
                    <span>{liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(10);
                      setShowMenuSheet(false);
                      openQueue();
                    }}
                    className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    <Plus size={18} />
                    <span>View Upcoming Queue</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleShare();
                      setShowMenuSheet(false);
                    }}
                    className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    <Share2 size={18} />
                    <span>Share Track Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(10);
                      setShowMenuSheet(false);
                    }}
                    className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    <Disc size={18} />
                    <span>Album: {currentTrack.album}</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Copy share toast notification */}
        <AnimatePresence>
          {copiedNotification && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-70 px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-medium"
              style={{
                backgroundColor: theme.colors.textPrimary,
                color: theme.colors.background,
              }}
            >
              <Check size={14} />
              <span>Link copied to clipboard</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
