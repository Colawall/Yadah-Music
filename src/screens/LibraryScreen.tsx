/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Disc, History, Play } from 'lucide-react';
import { musicProvider } from '../services/mockMusicProvider';
import { Collection, Track } from '../types/music';
import { useTheme } from '../themes/ThemeProvider';
import { usePlayerStore } from '../store/playerStore';
import { TrackRow } from '../components/common/TrackRow';
import { CollectionCard } from '../components/common/CollectionCard';
import { triggerHaptic } from '../utils/waveform';

type LibraryTab = 'liked' | 'albums' | 'recent';

export const LibraryScreen: React.FC = () => {
  const { theme } = useTheme();
  const { likedTrackIds, playTrack, openCollection } = usePlayerStore();

  const [activeTab, setActiveTab] = useState<LibraryTab>('liked');
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    async function loadData() {
      const trending = await musicProvider.getTrending();
      const cols = await musicProvider.getFeaturedCollections();
      setAllTracks(trending);
      setCollections(cols);
    }
    loadData();
  }, []);

  const likedTracks = allTracks.filter((t) => likedTrackIds.includes(t.id));

  return (
    <div
      className="w-full flex-1 flex flex-col overflow-y-auto pb-32 select-none"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* Title */}
      <div className="px-5 pt-6 pb-2">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{
            color: theme.colors.textPrimary,
            fontWeight: theme.typography.weights.bold,
          }}
        >
          Your Library
        </h1>
      </div>

      {/* Segmented Tabs */}
      <div className="flex items-center gap-2 px-5 mt-3 border-b pb-3"
        style={{ borderColor: theme.colors.divider }}
      >
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setActiveTab('liked');
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
          style={{
            backgroundColor: activeTab === 'liked' ? theme.colors.primary : theme.colors.surfaceAlt,
            color: activeTab === 'liked' ? theme.colors.onPrimary : theme.colors.textSecondary,
            borderRadius: theme.shape.radiusPill,
          }}
        >
          <Heart size={13} fill={activeTab === 'liked' ? 'currentColor' : 'none'} />
          <span>Liked Songs</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setActiveTab('albums');
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
          style={{
            backgroundColor: activeTab === 'albums' ? theme.colors.primary : theme.colors.surfaceAlt,
            color: activeTab === 'albums' ? theme.colors.onPrimary : theme.colors.textSecondary,
            borderRadius: theme.shape.radiusPill,
          }}
        >
          <Disc size={13} />
          <span>Albums</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setActiveTab('recent');
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
          style={{
            backgroundColor: activeTab === 'recent' ? theme.colors.primary : theme.colors.surfaceAlt,
            color: activeTab === 'recent' ? theme.colors.onPrimary : theme.colors.textSecondary,
            borderRadius: theme.shape.radiusPill,
          }}
        >
          <History size={13} />
          <span>Recent</span>
        </button>
      </div>

      {/* Content */}
      <div className="mt-4 px-2">
        {/* Tab 1: Liked Tracks */}
        {activeTab === 'liked' && (
          <div className="flex flex-col gap-2">
            {likedTracks.length > 0 && (
              <div className="px-3 pb-2 flex items-center justify-between">
                <span
                  className="text-xs font-medium"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {likedTracks.length} {likedTracks.length === 1 ? 'song' : 'songs'} saved
                </span>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(15);
                    playTrack(likedTracks[0], likedTracks);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.onPrimary,
                  }}
                >
                  <Play size={12} fill="currentColor" />
                  <span>Play All</span>
                </button>
              </div>
            )}

            {likedTracks.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center gap-2">
                <Heart size={32} style={{ color: theme.colors.iconMuted }} />
                <span className="text-sm font-semibold">No liked songs yet</span>
                <span className="text-xs text-gray-400">
                  Tap the heart icon on any track to add it to your library.
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {likedTracks.map((track, idx) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={idx}
                    onPlay={(t) => playTrack(t, likedTracks)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Albums */}
        {activeTab === 'albums' && (
          <div className="grid grid-cols-2 gap-3 px-3">
            {collections.map((col) => (
              <CollectionCard
                key={col.id}
                collection={col}
                size="featured"
                onSelect={openCollection}
                onPlayDirect={(c) => playTrack(c.items[0], c.items)}
              />
            ))}
          </div>
        )}

        {/* Tab 3: Recent */}
        {activeTab === 'recent' && (
          <div className="flex flex-col gap-0.5">
            {allTracks.slice(0, 5).map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                onPlay={(t) => playTrack(t, allTracks)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
