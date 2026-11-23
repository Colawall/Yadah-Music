/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Sparkles, SlidersHorizontal, Play } from 'lucide-react';
import { Collection, Track } from '../types/music';
import { musicProvider } from '../services/mockMusicProvider';
import { useTheme } from '../themes/ThemeProvider';
import { usePlayerStore } from '../store/playerStore';
import { CollectionCard } from '../components/common/CollectionCard';
import { TrackRow } from '../components/common/TrackRow';
import { triggerHaptic } from '../utils/waveform';

interface HomeScreenProps {
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenSettings }) => {
  const { theme } = useTheme();
  const { playTrack, openCollection } = usePlayerStore();

  const [featuredCollections, setFeaturedCollections] = useState<Collection[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [greeting, setGreeting] = useState('Welcome');

  useEffect(() => {
    async function loadData() {
      const collections = await musicProvider.getFeaturedCollections();
      const recent = await musicProvider.getRecentlyPlayed();
      setFeaturedCollections(collections);
      setRecentlyPlayed(recent);
    }
    loadData();

    // Time of day greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div
      className="w-full flex-1 flex flex-col overflow-y-auto pb-32 select-none"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <div className="flex flex-col">
          <span
            className="text-xs uppercase tracking-wider"
            style={{
              color: theme.colors.textSecondary,
              fontWeight: theme.typography.weights.medium,
            }}
          >
            {greeting}
          </span>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{
              color: theme.colors.textPrimary,
              fontWeight: theme.typography.weights.bold,
            }}
          >
            Yadah
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            onOpenSettings();
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-transform active:scale-95"
          style={{
            backgroundColor: theme.colors.surfaceAlt,
            color: theme.colors.icon,
          }}
          aria-label="Settings and Appearance"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Featured Banner Card */}
      {featuredCollections.length > 0 && (
        <div className="px-5 mt-4">
          <div
            onClick={() => {
              triggerHaptic(12);
              openCollection(featuredCollections[0]);
            }}
            className="w-full rounded-3xl p-5 flex items-end relative overflow-hidden cursor-pointer group shadow-sm transition-transform active:scale-[0.99]"
            style={{
              borderRadius: theme.shape.radiusCard,
              backgroundColor: theme.colors.surfaceAlt,
              boxShadow: theme.effects.shadowSoft,
              minHeight: '160px',
            }}
          >
            <img
              src={featuredCollections[0].artworkUrl}
              alt={featuredCollections[0].title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="relative z-10 flex items-end justify-between w-full">
              <div className="flex flex-col text-white">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                  Featured Album
                </span>
                <span className="text-xl font-bold mt-0.5">{featuredCollections[0].title}</span>
                <span className="text-xs text-white/80 mt-0.5">{featuredCollections[0].owner}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic(15);
                  playTrack(featuredCollections[0].items[0], featuredCollections[0].items);
                }}
                className="w-11 h-11 rounded-full flex items-center justify-center bg-white text-black shadow-lg transition-transform active:scale-90"
                aria-label="Play featured album"
              >
                <Play size={18} fill="currentColor" className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Albums Carousel */}
      <div className="mt-7">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2
            className="text-base font-bold tracking-tight"
            style={{
              color: theme.colors.textPrimary,
              fontWeight: theme.typography.weights.bold,
            }}
          >
            Recommended For You
          </h2>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto px-5 no-scrollbar pb-2">
          {featuredCollections.map((col) => (
            <CollectionCard
              key={col.id}
              collection={col}
              onSelect={openCollection}
              onPlayDirect={(c) => playTrack(c.items[0], c.items)}
            />
          ))}
        </div>
      </div>

      {/* Recently Played */}
      <div className="mt-6 px-3">
        <div className="flex items-center justify-between px-2 mb-2">
          <h2
            className="text-base font-bold tracking-tight"
            style={{
              color: theme.colors.textPrimary,
              fontWeight: theme.typography.weights.bold,
            }}
          >
            Recently Played
          </h2>
        </div>

        <div className="flex flex-col gap-0.5">
          {recentlyPlayed.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              onPlay={(t) => playTrack(t, recentlyPlayed)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
