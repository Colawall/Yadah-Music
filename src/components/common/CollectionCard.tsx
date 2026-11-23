/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play } from 'lucide-react';
import { Collection } from '../../types/music';
import { useTheme } from '../../themes/ThemeProvider';
import { triggerHaptic } from '../../utils/waveform';

interface CollectionCardProps {
  collection: Collection;
  onSelect: (collection: Collection) => void;
  onPlayDirect?: (collection: Collection) => void;
  size?: 'normal' | 'compact' | 'featured';
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onSelect,
  onPlayDirect,
  size = 'normal',
}) => {
  const { theme } = useTheme();

  const handleCardClick = () => {
    triggerHaptic(10);
    onSelect(collection);
  };

  const isCompact = size === 'compact';
  const isFeatured = size === 'featured';

  return (
    <div
      onClick={handleCardClick}
      className={`group flex flex-col cursor-pointer transition-all duration-200 active:scale-[0.98] select-none ${
        isCompact ? 'w-36 shrink-0' : isFeatured ? 'w-full' : 'w-44 shrink-0'
      }`}
    >
      {/* Artwork container */}
      <div
        className="w-full aspect-square overflow-hidden relative"
        style={{
          borderRadius: theme.shape.radiusCard,
          boxShadow: theme.effects.shadowSoft,
          backgroundColor: theme.colors.surfaceAlt,
        }}
      >
        <img
          src={collection.artworkUrl}
          alt={collection.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Play button overlay */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic(15);
            onPlayDirect?.(collection);
          }}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110 active:scale-95"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.onPrimary,
          }}
          aria-label={`Play ${collection.title}`}
        >
          <Play size={18} fill="currentColor" className="ml-0.5" />
        </button>
      </div>

      {/* Info */}
      <div className="mt-2.5 flex flex-col px-1">
        <span
          className="text-sm truncate"
          style={{
            color: theme.colors.textPrimary,
            fontWeight: theme.typography.weights.semibold,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          {collection.title}
        </span>
        <span
          className="text-xs truncate mt-0.5"
          style={{
            color: theme.colors.textSecondary,
            fontWeight: theme.typography.weights.regular,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          {collection.owner}
        </span>
      </div>
    </div>
  );
};
