/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Collection, MusicProvider, SearchResults, Track } from '../types/music';
import { ARTWORK_DOMINANT_COLORS } from '../themes/dominantPalettes';

// Generated authentic artwork assets
import artworkAmber from '../assets/images/artwork_amber_solitude_1792153397670.jpg';
import artworkMidnight from '../assets/images/artwork_midnight_echoes_1792153397425.jpg';
import artworkBotanical from '../assets/images/artwork_botanical_drift_1792153399275.jpg';
import artworkDawn from '../assets/images/artwork_dawn_aurora_1792153399476.jpg';

export const MOCK_TRACKS: Track[] = [
  {
    id: 'track-1',
    source: 'yadah-original',
    title: 'Horizon Line',
    artists: ['Arid Lands'],
    album: 'Solitude',
    artworkUrl: artworkAmber,
    artworkDominantColor: ARTWORK_DOMINANT_COLORS.AMBER_SOLITUDE, // Saturated warm amber
    durationMs: 234000, // 3:54
    kind: 'music',
    liked: true,
    plays: 1842000,
    rank: 1,
    rankChange: 'same',
  },
  {
    id: 'track-2',
    source: 'yadah-original',
    title: 'Deep Currents',
    artists: ['Lunar Tide'],
    album: 'Midnight Echoes',
    artworkUrl: artworkMidnight,
    artworkDominantColor: ARTWORK_DOMINANT_COLORS.MIDNIGHT_ECHOES, // Cool dark indigo
    durationMs: 198000, // 3:18
    kind: 'music',
    liked: true,
    plays: 1420500,
    rank: 2,
    rankChange: 'up',
  },
  {
    id: 'track-3',
    source: 'yadah-original',
    title: 'Canopy Whispers',
    artists: ['Verdant Echo'],
    album: 'Botanica',
    artworkUrl: artworkBotanical,
    artworkDominantColor: ARTWORK_DOMINANT_COLORS.BOTANICAL_DRIFT, // Vibrant emerald teal
    durationMs: 247000, // 4:07
    kind: 'music',
    liked: false,
    plays: 984000,
    rank: 3,
    rankChange: 'up',
  },
  {
    id: 'track-4',
    source: 'yadah-original',
    title: 'First Light over Alpine',
    artists: ['Morning Mist', 'Kora Vale'],
    album: 'Aeterna',
    artworkUrl: artworkDawn,
    artworkDominantColor: ARTWORK_DOMINANT_COLORS.DAWN_AURORA, // Soft rose peach
    durationMs: 212000, // 3:32
    kind: 'music',
    liked: true,
    plays: 871000,
    rank: 4,
    rankChange: 'down',
  },
  {
    id: 'track-5',
    source: 'yadah-original',
    title: 'Mirage Mirage',
    artists: ['Arid Lands'],
    album: 'Solitude',
    artworkUrl: artworkAmber,
    artworkDominantColor: ARTWORK_DOMINANT_COLORS.AMBER_SOLITUDE,
    durationMs: 185000, // 3:05
    kind: 'music',
    liked: false,
    plays: 642000,
    rank: 5,
    rankChange: 'up',
  },
  {
    id: 'track-6',
    source: 'yadah-original',
    title: 'Tidal Rhythm',
    artists: ['Lunar Tide'],
    album: 'Midnight Echoes',
    artworkUrl: artworkMidnight,
    artworkDominantColor: ARTWORK_DOMINANT_COLORS.MIDNIGHT_ECHOES,
    durationMs: 221000, // 3:41
    kind: 'music',
    liked: false,
    plays: 520000,
    rank: 6,
    rankChange: 'down',
  },
  {
    id: 'track-7',
    source: 'yadah-original',
    title: 'Silver Moss',
    artists: ['Verdant Echo'],
    album: 'Botanica',
    artworkUrl: artworkBotanical,
    artworkDominantColor: ARTWORK_DOMINANT_COLORS.BOTANICAL_DRIFT,
    durationMs: 263000, // 4:23
    kind: 'music',
    liked: true,
    plays: 490000,
    rank: 7,
    rankChange: 'same',
  },
  {
    id: 'track-8',
    source: 'yadah-original',
    title: 'Luminous Veil',
    artists: ['Morning Mist'],
    album: 'Aeterna',
    artworkUrl: artworkDawn,
    artworkDominantColor: ARTWORK_DOMINANT_COLORS.DAWN_AURORA,
    durationMs: 176000, // 2:56
    kind: 'music',
    liked: false,
    plays: 410000,
    rank: 8,
    rankChange: 'up',
  },
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col-solitude',
    source: 'yadah-catalog',
    type: 'album',
    title: 'Solitude',
    owner: 'Arid Lands',
    year: 2026,
    artworkUrl: artworkAmber,
    artworkDominantColor: ARTWORK_DOMINANT_COLORS.AMBER_SOLITUDE,
    items: [MOCK_TRACKS[0], MOCK_TRACKS[4]],
  },
  {
    id: 'col-midnight',
    source: 'yadah-catalog',
    type: 'album',
    title: 'Midnight Echoes',
    owner: 'Lunar Tide',
    year: 2025,
    artworkUrl: artworkMidnight,
    artworkDominantColor: ARTWORK_DOMINANT_COLORS.MIDNIGHT_ECHOES,
    items: [MOCK_TRACKS[1], MOCK_TRACKS[5]],
  },
  {
    id: 'col-botanica',
    source: 'yadah-catalog',
    type: 'album',
    title: 'Botanica',
    owner: 'Verdant Echo',
    year: 2026,
    artworkUrl: artworkBotanical,
    artworkDominantColor: ARTWORK_DOMINANT_COLORS.BOTANICAL_DRIFT,
    items: [MOCK_TRACKS[2], MOCK_TRACKS[6]],
  },
  {
    id: 'col-aeterna',
    source: 'yadah-catalog',
    type: 'album',
    title: 'Aeterna',
    owner: 'Morning Mist',
    year: 2026,
    artworkUrl: artworkDawn,
    artworkDominantColor: ARTWORK_DOMINANT_COLORS.DAWN_AURORA,
    items: [MOCK_TRACKS[3], MOCK_TRACKS[7]],
  },
];

class MockMusicProvider implements MusicProvider {
  async getFeaturedCollections(): Promise<Collection[]> {
    return MOCK_COLLECTIONS;
  }

  async getRecentlyPlayed(): Promise<Track[]> {
    return [MOCK_TRACKS[0], MOCK_TRACKS[1], MOCK_TRACKS[2], MOCK_TRACKS[3]];
  }

  async getTrending(): Promise<Track[]> {
    return MOCK_TRACKS;
  }

  async getCollectionById(id: string): Promise<Collection | null> {
    const col = MOCK_COLLECTIONS.find((c) => c.id === id);
    return col || null;
  }

  async search(query: string, filter?: string): Promise<SearchResults> {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { tracks: [], collections: [], artists: [] };
    }

    const matchedTracks = MOCK_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artists.some((a) => a.toLowerCase().includes(q)) ||
        t.album.toLowerCase().includes(q)
    );

    const matchedCollections = MOCK_COLLECTIONS.filter(
      (c) => c.title.toLowerCase().includes(q) || c.owner.toLowerCase().includes(q)
    );

    const artistsSet = new Set<string>();
    MOCK_TRACKS.forEach((t) => {
      t.artists.forEach((a) => {
        if (a.toLowerCase().includes(q)) {
          artistsSet.add(a);
        }
      });
    });

    if (filter === 'tracks') {
      return { tracks: matchedTracks, collections: [], artists: [] };
    }
    if (filter === 'albums') {
      return { tracks: [], collections: matchedCollections, artists: [] };
    }
    if (filter === 'artists') {
      return { tracks: [], collections: [], artists: Array.from(artistsSet) };
    }

    return {
      tracks: matchedTracks,
      collections: matchedCollections,
      artists: Array.from(artistsSet),
    };
  }

  async getLikedTracks(): Promise<Track[]> {
    return MOCK_TRACKS.filter((t) => t.liked);
  }
}

export const musicProvider = new MockMusicProvider();
