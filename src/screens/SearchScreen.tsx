/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, X, Disc, Music, User } from 'lucide-react';
import { musicProvider } from '../services/mockMusicProvider';
import { Collection, SearchResults, Track } from '../types/music';
import { useTheme } from '../themes/ThemeProvider';
import { usePlayerStore } from '../store/playerStore';
import { TrackRow } from '../components/common/TrackRow';
import { CollectionCard } from '../components/common/CollectionCard';
import { triggerHaptic } from '../utils/waveform';

type FilterType = 'all' | 'tracks' | 'albums' | 'artists';

export const SearchScreen: React.FC = () => {
  const { theme } = useTheme();
  const { playTrack, openCollection } = usePlayerStore();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({ tracks: [], collections: [], artists: [] });

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ tracks: [], collections: [], artists: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      const res = await musicProvider.search(query, activeFilter === 'all' ? undefined : activeFilter);
      setResults(res);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, activeFilter]);

  const filterTabs: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'tracks', label: 'Songs' },
    { id: 'albums', label: 'Albums' },
    { id: 'artists', label: 'Artists' },
  ];

  const hasResults = results.tracks.length > 0 || results.collections.length > 0 || results.artists.length > 0;

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
          Search
        </h1>
      </div>

      {/* Search Input Box */}
      <div className="px-5 mt-2">
        <div
          className="w-full h-12 flex items-center px-3.5 gap-2.5 transition-all"
          style={{
            backgroundColor: theme.colors.surfaceAlt,
            borderRadius: theme.shape.radiusButton,
            border: `1px solid ${theme.colors.divider}`,
          }}
        >
          <Search size={18} style={{ color: theme.colors.iconMuted }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Artists, songs, or albums"
            className="w-full bg-transparent outline-none text-sm"
            style={{
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fontFamily,
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                setQuery('');
              }}
              className="p-1 rounded-full text-gray-400 hover:text-black dark:hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 px-5 mt-3 overflow-x-auto no-scrollbar">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic(10);
                setActiveFilter(tab.id);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 active:scale-95"
              style={{
                backgroundColor: isActive ? theme.colors.primary : theme.colors.surfaceAlt,
                color: isActive ? theme.colors.onPrimary : theme.colors.textSecondary,
                borderRadius: theme.shape.radiusPill,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content states */}
      <div className="mt-5 px-3">
        {/* Loading skeleton state */}
        {isLoading && (
          <div className="flex flex-col gap-3 px-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full h-14 rounded-xl animate-pulse"
                style={{ backgroundColor: theme.colors.surfaceAlt }}
              />
            ))}
          </div>
        )}

        {/* Empty state: query entered but no results */}
        {!isLoading && query.trim() !== '' && !hasResults && (
          <div className="py-16 flex flex-col items-center justify-center text-center px-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: theme.colors.surfaceAlt }}
            >
              <Search size={28} style={{ color: theme.colors.iconMuted }} />
            </div>
            <h3
              className="text-base font-semibold"
              style={{ color: theme.colors.textPrimary }}
            >
              No results found
            </h3>
            <p
              className="text-xs max-w-xs mt-1"
              style={{ color: theme.colors.textSecondary }}
            >
              Please check your spelling or search for another artist, song, or album.
            </p>
          </div>
        )}

        {/* Initial state: no query yet */}
        {!isLoading && query.trim() === '' && (
          <div className="px-2 pt-2">
            <span
              className="text-xs uppercase font-semibold tracking-wider px-2"
              style={{ color: theme.colors.textTertiary }}
            >
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2 mt-3 px-2">
              {['Solitude', 'Lunar Tide', 'Botanica', 'Morning Mist', 'Alpine'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    triggerHaptic(10);
                    setQuery(tag);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium transition-all active:scale-95"
                  style={{
                    backgroundColor: theme.colors.surfaceAlt,
                    color: theme.colors.textPrimary,
                    borderRadius: theme.shape.radiusButton,
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grouped Results */}
        {!isLoading && hasResults && (
          <div className="flex flex-col gap-6">
            {/* Songs Group */}
            {results.tracks.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-3 mb-2">
                  <Music size={14} style={{ color: theme.colors.textTertiary }} />
                  <h3
                    className="text-xs uppercase font-semibold tracking-wider"
                    style={{ color: theme.colors.textTertiary }}
                  >
                    Songs
                  </h3>
                </div>
                <div className="flex flex-col gap-0.5">
                  {results.tracks.map((track, idx) => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={idx}
                      onPlay={(t) => playTrack(t, results.tracks)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Albums Group */}
            {results.collections.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-3 mb-2">
                  <Disc size={14} style={{ color: theme.colors.textTertiary }} />
                  <h3
                    className="text-xs uppercase font-semibold tracking-wider"
                    style={{ color: theme.colors.textTertiary }}
                  >
                    Albums
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 px-2">
                  {results.collections.map((col) => (
                    <CollectionCard
                      key={col.id}
                      collection={col}
                      size="featured"
                      onSelect={openCollection}
                      onPlayDirect={(c) => playTrack(c.items[0], c.items)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Artists Group */}
            {results.artists.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-3 mb-2">
                  <User size={14} style={{ color: theme.colors.textTertiary }} />
                  <h3
                    className="text-xs uppercase font-semibold tracking-wider"
                    style={{ color: theme.colors.textTertiary }}
                  >
                    Artists
                  </h3>
                </div>
                <div className="flex flex-col gap-1 px-2">
                  {results.artists.map((artist) => (
                    <div
                      key={artist}
                      onClick={() => {
                        triggerHaptic(10);
                        setQuery(artist);
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: theme.colors.surfaceAlt }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.onPrimary,
                        }}
                      >
                        {artist[0]}
                      </div>
                      <span
                        className="text-sm font-semibold truncate"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {artist}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
