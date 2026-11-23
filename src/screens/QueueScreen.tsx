/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trash2, ArrowUp, ArrowDown, GripVertical, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayerStore } from '../store/playerStore';
import { useTheme } from '../themes/ThemeProvider';
import { formatDuration, triggerHaptic } from '../utils/waveform';

export const QueueScreen: React.FC = () => {
  const { theme } = useTheme();
  const {
    currentTrack,
    queue,
    isQueueOpen,
    closeQueue,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    playTrack,
    reducedMotion,
  } = usePlayerStore();

  if (!isQueueOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { y: '100%' }}
        animate={reducedMotion ? { opacity: 1 } : { y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        className="fixed inset-0 z-55 flex flex-col justify-between overflow-hidden select-none"
        style={{
          backgroundColor: theme.colors.background,
          color: theme.colors.textPrimary,
          fontFamily: theme.typography.fontFamily,
        }}
      >
        {/* Header */}
        <div
          className="w-full flex items-center justify-between px-5 pt-8 pb-3 border-b shrink-0"
          style={{ borderColor: theme.colors.divider }}
        >
          <div className="flex flex-col">
            <h2
              className="text-lg font-bold"
              style={{
                color: theme.colors.textPrimary,
                fontWeight: theme.typography.weights.bold,
              }}
            >
              Play Queue
            </h2>
            <span
              className="text-xs"
              style={{ color: theme.colors.textSecondary }}
            >
              {queue.length} {queue.length === 1 ? 'track' : 'tracks'} upcoming
            </span>
          </div>

          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(14);
                  clearQueue();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
                style={{
                  backgroundColor: theme.colors.surfaceAlt,
                  color: theme.colors.textSecondary,
                }}
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                closeQueue();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-transform active:scale-90"
              style={{ color: theme.colors.icon }}
              aria-label="Close queue"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
          {/* Now Playing Item */}
          {currentTrack && (
            <div className="flex flex-col gap-2">
              <span
                className="text-xs uppercase font-semibold tracking-wider px-2"
                style={{ color: theme.colors.textTertiary }}
              >
                Now Playing
              </span>
              <div
                className="flex items-center justify-between p-3 rounded-2xl"
                style={{
                  backgroundColor: theme.colors.surfaceActive,
                  borderRadius: theme.shape.radiusCard,
                }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={currentTrack.artworkUrl}
                    alt={currentTrack.title}
                    className="w-11 h-11 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span
                      className="text-sm font-semibold truncate"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      {currentTrack.title}
                    </span>
                    <span
                      className="text-xs truncate"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {currentTrack.artists.join(', ')}
                    </span>
                  </div>
                </div>
                <span
                  className="text-xs font-mono tabular-nums"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {formatDuration(currentTrack.durationMs)}
                </span>
              </div>
            </div>
          )}

          {/* Next in Queue */}
          <div className="flex flex-col gap-2">
            <span
              className="text-xs uppercase font-semibold tracking-wider px-2"
              style={{ color: theme.colors.textTertiary }}
            >
              Next in Queue
            </span>

            {queue.length === 0 ? (
              <div
                className="p-8 text-center rounded-2xl flex flex-col items-center justify-center gap-2"
                style={{
                  backgroundColor: theme.colors.surfaceAlt,
                  borderRadius: theme.shape.radiusCard,
                }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Your queue is empty
                </span>
                <span
                  className="text-xs"
                  style={{ color: theme.colors.textTertiary }}
                >
                  Play songs or albums from Home and Search to build your queue.
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {queue.map((track, idx) => (
                  <div
                    key={`${track.id}-${idx}`}
                    className="flex items-center justify-between p-2.5 rounded-xl transition-all group"
                    style={{
                      backgroundColor: theme.colors.surface,
                      border: `1px solid ${theme.colors.divider}`,
                    }}
                  >
                    {/* Reorder and Drag handle */}
                    <div className="flex items-center gap-1.5 shrink-0 text-gray-400">
                      <div className="flex flex-col">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            triggerHaptic(10);
                            reorderQueue(idx, idx - 1);
                          }}
                          className="p-1 hover:text-black dark:hover:text-white disabled:opacity-20"
                          aria-label="Move track up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === queue.length - 1}
                          onClick={() => {
                            triggerHaptic(10);
                            reorderQueue(idx, idx + 1);
                          }}
                          className="p-1 hover:text-black dark:hover:text-white disabled:opacity-20"
                          aria-label="Move track down"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                      <GripVertical size={16} className="opacity-40" />
                    </div>

                    {/* Track info */}
                    <div
                      onClick={() => {
                        triggerHaptic(15);
                        playTrack(track);
                      }}
                      className="flex items-center gap-3 min-w-0 flex-1 px-2 cursor-pointer"
                    >
                      <img
                        src={track.artworkUrl}
                        alt={track.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span
                          className="text-sm font-medium truncate"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          {track.title}
                        </span>
                        <span
                          className="text-xs truncate"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          {track.artists.join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="text-xs font-mono tabular-nums"
                        style={{ color: theme.colors.textTertiary }}
                      >
                        {formatDuration(track.durationMs)}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(12);
                          removeFromQueue(idx);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove from queue"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Done button */}
        <div
          className="p-4 border-t"
          style={{ borderColor: theme.colors.divider }}
        >
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              closeQueue();
            }}
            className="w-full h-12 flex items-center justify-center font-semibold text-sm transition-transform active:scale-98"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.onPrimary,
              borderRadius: theme.shape.radiusButton,
            }}
          >
            Done
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
