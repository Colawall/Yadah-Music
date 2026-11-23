/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Search, Plus, Check, Download, MoreHorizontal, Play, Shuffle } from 'lucide-react';
import { Collection, Track } from '../types/music';
import { useTheme } from '../themes/ThemeProvider';
import { usePlayerStore } from '../store/playerStore';
import { TrackRow } from '../components/common/TrackRow';
import { triggerHaptic } from '../utils/waveform';

interface AlbumDetailScreenProps {
  collection: Collection;
  onBack: () => void;
  onSearchClick?: () => void;
}

export const AlbumDetailScreen: React.FC<AlbumDetailScreenProps> = ({
  collection,
  onBack,
  onSearchClick,
}) => {
  const { theme } = useTheme();
  const { playTrack } = usePlayerStore();
  const [isSavedToLibrary, setIsSavedToLibrary] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloadToast, setDownloadToast] = useState(false);

  const handlePlayAll = () => {
    if (collection.items.length > 0) {
      triggerHaptic(15);
      playTrack(collection.items[0], collection.items);
    }
  };

  const handleShufflePlay = () => {
    if (collection.items.length > 0) {
      triggerHaptic(15);
      const shuffled = [...collection.items].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled);
    }
  };

  const handleDownload = () => {
    triggerHaptic(12);
    setIsDownloaded(!isDownloaded);
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 2000);
  };

  const trackCountText = `${collection.items.length} ${collection.items.length === 1 ? 'song' : 'songs'}`;
  const metaText = `${collection.type.toUpperCase()} · ${trackCountText} · ${collection.year || 2026}`;

  return (
    <div
      className="w-full flex-1 flex flex-col overflow-y-auto pb-32 select-none"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* Top Header: Back arrow & Search icon */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 backdrop-blur-md bg-opacity-90"
        style={{ backgroundColor: theme.colors.background + 'EE' }}
      >
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            onBack();
          }}
          className="w-11 h-11 flex items-center justify-center rounded-full transition-transform active:scale-90"
          style={{ color: theme.colors.icon }}
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>

        <span
          className="text-xs font-semibold uppercase tracking-wider truncate max-w-[180px]"
          style={{ color: theme.colors.textSecondary }}
        >
          {collection.title}
        </span>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            onSearchClick?.();
          }}
          className="w-11 h-11 flex items-center justify-center rounded-full transition-transform active:scale-90"
          style={{ color: theme.colors.icon }}
          aria-label="Search within album"
        >
          <Search size={22} />
        </button>
      </div>

      {/* Album Hero Info: Small rounded cover on left, metadata, bold title, dotted underline artist */}
      <div className="px-5 pt-3 pb-5 flex gap-4 items-center">
        {/* Small rounded cover on left */}
        <div
          className="w-28 h-28 shrink-0 overflow-hidden relative shadow-md"
          style={{
            borderRadius: theme.shape.radiusArtwork,
            backgroundColor: theme.colors.surfaceAlt,
            boxShadow: theme.effects.shadowArtwork,
          }}
        >
          <img
            src={collection.artworkUrl}
            alt={collection.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Info cluster */}
        <div className="flex flex-col min-w-0 flex-1 justify-center">
          {/* Type / track count / year in small secondary text */}
          <span
            className="text-xs tracking-wide uppercase truncate"
            style={{
              color: theme.colors.textSecondary,
              fontWeight: theme.typography.weights.medium,
            }}
          >
            {metaText}
          </span>

          {/* Bold title */}
          <h1
            className="text-xl leading-tight truncate mt-1"
            style={{
              color: theme.colors.textPrimary,
              fontWeight: theme.typography.weights.bold,
              fontSize: theme.typography.sizes.title,
            }}
          >
            {collection.title}
          </h1>

          {/* Artist with dotted underline as specified in requirements */}
          <div className="mt-1 flex items-center">
            <span
              className="text-sm truncate pb-0.5 border-b border-dotted"
              style={{
                color: theme.colors.textPrimary,
                borderColor: theme.colors.textSecondary,
                fontWeight: theme.typography.weights.medium,
              }}
            >
              {collection.owner}
            </span>
          </div>
        </div>
      </div>

      {/* Action Icon Row: Add to library, download, '...' pill */}
      <div className="px-5 pb-4 flex items-center gap-3">
        {/* Add to library */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(12);
            setIsSavedToLibrary(!isSavedToLibrary);
          }}
          className="h-10 px-3.5 rounded-full flex items-center gap-2 text-xs font-medium transition-transform active:scale-95"
          style={{
            backgroundColor: isSavedToLibrary ? theme.colors.primary : theme.colors.secondaryButton,
            color: isSavedToLibrary ? theme.colors.onPrimary : theme.colors.onSecondaryButton,
            borderRadius: theme.shape.radiusPill,
          }}
          aria-label={isSavedToLibrary ? 'Saved to library' : 'Save to library'}
        >
          {isSavedToLibrary ? <Check size={16} /> : <Plus size={16} />}
          <span>{isSavedToLibrary ? 'Saved' : 'Add to Library'}</span>
        </button>

        {/* Download */}
        <button
          type="button"
          onClick={handleDownload}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-transform active:scale-95"
          style={{
            backgroundColor: theme.colors.secondaryButton,
            color: isDownloaded ? theme.colors.primary : theme.colors.onSecondaryButton,
            borderRadius: theme.shape.radiusPill,
          }}
          aria-label="Download collection"
        >
          <Download size={18} />
        </button>

        {/* '...' pill */}
        <button
          type="button"
          onClick={() => triggerHaptic(10)}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-transform active:scale-95"
          style={{
            backgroundColor: theme.colors.secondaryButton,
            color: theme.colors.onSecondaryButton,
            borderRadius: theme.shape.radiusPill,
          }}
          aria-label="More collection options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Wide Play (primary) & Shuffle (secondary) buttons */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handlePlayAll}
          className="h-12 flex items-center justify-center gap-2 text-sm font-semibold shadow-sm transition-transform active:scale-98"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.onPrimary,
            borderRadius: theme.shape.radiusButton,
          }}
        >
          <Play size={18} fill="currentColor" />
          <span>Play</span>
        </button>

        <button
          type="button"
          onClick={handleShufflePlay}
          className="h-12 flex items-center justify-center gap-2 text-sm font-semibold transition-transform active:scale-98"
          style={{
            backgroundColor: theme.colors.secondaryButton,
            color: theme.colors.onSecondaryButton,
            borderRadius: theme.shape.radiusButton,
          }}
        >
          <Shuffle size={18} />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Numbered Track List (01, 02...) with Equalizer on active track */}
      <div className="px-2 flex flex-col gap-0.5">
        <div className="px-3 py-1 flex items-center justify-between text-xs uppercase font-medium tracking-wider"
          style={{ color: theme.colors.textTertiary }}
        >
          <span>Track</span>
          <span>Time</span>
        </div>

        {collection.items.map((track: Track, idx: number) => (
          <TrackRow
            key={track.id}
            track={track}
            index={idx}
            onPlay={(t) => playTrack(t, collection.items)}
          />
        ))}
      </div>

      {/* Download notification toast */}
      {downloadToast && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-medium animate-fade-in"
          style={{
            backgroundColor: theme.colors.textPrimary,
            color: theme.colors.background,
          }}
        >
          <Check size={14} />
          <span>{isDownloaded ? 'Downloaded to offline storage' : 'Removed from offline storage'}</span>
        </div>
      )}
    </div>
  );
};
