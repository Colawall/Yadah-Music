/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, TrendingDown, Minus, Play } from 'lucide-react';
import { musicProvider } from '../services/mockMusicProvider';
import { Track } from '../types/music';
import { useTheme } from '../themes/ThemeProvider';
import { usePlayerStore } from '../store/playerStore';
import { EqualizerBars } from '../components/common/EqualizerBars';
import { triggerHaptic } from '../utils/waveform';

export const HotlistScreen: React.FC = () => {
  const { theme } = useTheme();
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    async function loadData() {
      const trending = await musicProvider.getTrending();
      setTracks(trending);
    }
    loadData();
  }, []);

  const formatPlays = (plays?: number): string => {
    if (!plays) return '—';
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M plays`;
    if (plays >= 1000) return `${Math.round(plays / 1000)}K plays`;
    return `${plays} plays`;
  };

  return (
    <div
      className="w-full flex-1 flex flex-col overflow-y-auto pb-32 select-none"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center gap-1.5">
          <Flame size={18} style={{ color: theme.colors.primary }} />
          <span
            className="text-xs uppercase font-semibold tracking-wider"
            style={{ color: theme.colors.primary }}
          >
            Trending Worldwide
          </span>
        </div>
        <h1
          className="text-2xl font-bold tracking-tight mt-0.5"
          style={{
            color: theme.colors.textPrimary,
            fontWeight: theme.typography.weights.bold,
          }}
        >
          Hotlist Top 50
        </h1>
        <p
          className="text-xs mt-1"
          style={{ color: theme.colors.textSecondary }}
        >
          The most streamed and discovered music on Yadah this week.
        </p>
      </div>

      {/* Ranked Track List */}
      <div className="mt-4 px-3 flex flex-col gap-1">
        {tracks.map((track, idx) => {
          const isCurrent = currentTrack?.id === track.id;
          const rank = idx + 1;
          const formattedRank = rank.toString().padStart(2, '0');

          return (
            <div
              key={track.id}
              onClick={() => {
                triggerHaptic(12);
                playTrack(track, tracks);
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all active:scale-[0.99] group"
              style={{
                backgroundColor: isCurrent ? theme.colors.surfaceActive : theme.colors.surface,
                border: `1px solid ${theme.colors.divider}`,
              }}
            >
              {/* Left: Rank & Delta indicator */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 flex flex-col items-center justify-center shrink-0">
                  {isCurrent ? (
                    <EqualizerBars isPlaying={isPlaying} color={theme.colors.primary} size={15} />
                  ) : (
                    <span
                      className="text-base font-bold font-mono tabular-nums leading-none"
                      style={{
                        color: rank <= 3 ? theme.colors.primary : theme.colors.textSecondary,
                      }}
                    >
                      {formattedRank}
                    </span>
                  )}

                  {/* Rank Delta */}
                  <div className="flex items-center mt-1">
                    {track.rankChange === 'up' && (
                      <TrendingUp size={11} className="text-emerald-500" />
                    )}
                    {track.rankChange === 'down' && (
                      <TrendingDown size={11} style={{ color: theme.colors.danger }} />
                    )}
                    {(!track.rankChange || track.rankChange === 'same') && (
                      <Minus size={11} style={{ color: theme.colors.textTertiary }} />
                    )}
                  </div>
                </div>

                {/* Artwork */}
                <div
                  className="w-12 h-12 rounded-xl overflow-hidden shrink-0 relative"
                  style={{ backgroundColor: theme.colors.surfaceAlt }}
                >
                  <img
                    src={track.artworkUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col min-w-0 flex-1 pr-2">
                  <span
                    className="text-sm font-semibold truncate"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {track.title}
                  </span>
                  <span
                    className="text-xs truncate opacity-75 mt-0.5"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {track.artists.join(', ')}
                  </span>
                  <span
                    className="text-[11px] font-mono tabular-nums opacity-60 mt-0.5"
                    style={{ color: theme.colors.textTertiary }}
                  >
                    {formatPlays(track.plays)}
                  </span>
                </div>
              </div>

              {/* Play CTA */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic(15);
                  playTrack(track, tracks);
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-90 shrink-0"
                style={{
                  backgroundColor: isCurrent ? theme.colors.primary : theme.colors.surfaceAlt,
                  color: isCurrent ? theme.colors.onPrimary : theme.colors.icon,
                }}
                aria-label={`Play ${track.title}`}
              >
                <Play size={16} fill="currentColor" className="ml-0.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
