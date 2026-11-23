/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  source: string;
  title: string;
  artists: string[];
  album: string;
  artworkUrl: string;
  artworkDominantColor: string; // for pastel tint calculation
  durationMs: number;
  kind: 'music' | 'episode' | 'radio';
  liked?: boolean;
  plays?: number;
  rank?: number;
  rankChange?: 'up' | 'down' | 'same';
}

export interface Collection {
  id: string;
  source: string;
  type: 'album' | 'playlist' | 'ep';
  title: string;
  owner: string;
  artworkUrl: string;
  artworkDominantColor?: string;
  year?: number;
  items: Track[];
}

export interface SearchResults {
  tracks: Track[];
  collections: Collection[];
  artists: string[];
}

export interface MusicProvider {
  getFeaturedCollections(): Promise<Collection[]>;
  getRecentlyPlayed(): Promise<Track[]>;
  getTrending(): Promise<Track[]>;
  getCollectionById(id: string): Promise<Collection | null>;
  search(query: string, filter?: string): Promise<SearchResults>;
  getLikedTracks(): Promise<Track[]>;
}
