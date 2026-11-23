/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { Collection, Track } from '../types/music';
import { musicProvider } from '../services/mockMusicProvider';

export type RepeatMode = 'off' | 'all' | 'one';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progressMs: number;
  queue: Track[];
  history: Track[];
  shuffle: boolean;
  repeatMode: RepeatMode;
  likedTrackIds: string[];
  isNowPlayingOpen: boolean;
  isQueueOpen: boolean;
  selectedCollection: Collection | null;
  reducedMotion: boolean;

  // Actions
  initialize: () => Promise<void>;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (ms: number) => void;
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  openNowPlaying: () => void;
  closeNowPlaying: () => void;
  openQueue: () => void;
  closeQueue: () => void;
  openCollection: (collection: Collection) => void;
  closeCollection: () => void;
  setReducedMotion: (enabled: boolean) => void;
}

let timerInterval: ReturnType<typeof setInterval> | null = null;

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  progressMs: 0,
  queue: [],
  history: [],
  shuffle: false,
  repeatMode: 'off',
  likedTrackIds: ['track-1', 'track-2', 'track-4', 'track-7'],
  isNowPlayingOpen: false,
  isQueueOpen: false,
  selectedCollection: null,
  reducedMotion: false,

  initialize: async () => {
    const trending = await musicProvider.getTrending();
    if (trending.length > 0 && !get().currentTrack) {
      set({
        currentTrack: trending[0],
        queue: trending.slice(1),
        progressMs: 34000, // seed initial progress for preview realism
      });
    }
  },

  playTrack: (track: Track, newQueue?: Track[]) => {
    const state = get();
    const updatedQueue = newQueue
      ? newQueue.filter((t) => t.id !== track.id)
      : state.queue.filter((t) => t.id !== track.id);

    set({
      currentTrack: track,
      isPlaying: true,
      progressMs: 0,
      queue: updatedQueue,
      history: state.currentTrack ? [state.currentTrack, ...state.history] : state.history,
    });
    startTimer();
  },

  togglePlay: () => {
    const { isPlaying, currentTrack, queue } = get();
    if (!currentTrack) {
      if (queue.length > 0) {
        get().playTrack(queue[0]);
      }
      return;
    }
    const nextState = !isPlaying;
    set({ isPlaying: nextState });
    if (nextState) {
      startTimer();
    } else {
      stopTimer();
    }
  },

  next: () => {
    const { queue, repeatMode, currentTrack, history } = get();

    if (repeatMode === 'one' && currentTrack) {
      set({ progressMs: 0, isPlaying: true });
      return;
    }

    if (queue.length === 0) {
      if (repeatMode === 'all' && history.length > 0) {
        const fullList = [...history].reverse();
        if (currentTrack) fullList.push(currentTrack);
        const [nextTrack, ...remaining] = fullList;
        set({
          currentTrack: nextTrack,
          queue: remaining,
          history: [],
          progressMs: 0,
          isPlaying: true,
        });
        return;
      }
      set({ isPlaying: false, progressMs: 0 });
      stopTimer();
      return;
    }

    const [nextTrack, ...remainingQueue] = queue;
    set({
      currentTrack: nextTrack,
      queue: remainingQueue,
      history: currentTrack ? [currentTrack, ...history] : history,
      progressMs: 0,
      isPlaying: true,
    });
  },

  previous: () => {
    const { progressMs, history, currentTrack, queue } = get();
    // If more than 3 seconds in, restart track
    if (progressMs > 3000 || history.length === 0) {
      set({ progressMs: 0 });
      return;
    }

    const [prevTrack, ...remainingHistory] = history;
    set({
      currentTrack: prevTrack,
      history: remainingHistory,
      queue: currentTrack ? [currentTrack, ...queue] : queue,
      progressMs: 0,
      isPlaying: true,
    });
  },

  seek: (ms: number) => {
    const { currentTrack } = get();
    if (!currentTrack) return;
    const clamped = Math.max(0, Math.min(ms, currentTrack.durationMs));
    set({ progressMs: clamped });
  },

  toggleLike: (trackId: string) => {
    const { likedTrackIds } = get();
    if (likedTrackIds.includes(trackId)) {
      set({ likedTrackIds: likedTrackIds.filter((id) => id !== trackId) });
    } else {
      set({ likedTrackIds: [...likedTrackIds, trackId] });
    }
  },

  isLiked: (trackId: string) => {
    return get().likedTrackIds.includes(trackId);
  },

  toggleShuffle: () => {
    const { shuffle, queue } = get();
    const nextShuffle = !shuffle;
    if (nextShuffle) {
      // Shuffle queue
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      set({ shuffle: true, queue: shuffled });
    } else {
      set({ shuffle: false });
    }
  },

  cycleRepeat: () => {
    const { repeatMode } = get();
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const nextIndex = (modes.indexOf(repeatMode) + 1) % modes.length;
    set({ repeatMode: modes[nextIndex] });
  },

  addToQueue: (track: Track) => {
    set((state) => ({ queue: [...state.queue, track] }));
  },

  removeFromQueue: (index: number) => {
    set((state) => {
      const q = [...state.queue];
      q.splice(index, 1);
      return { queue: q };
    });
  },

  reorderQueue: (fromIndex: number, toIndex: number) => {
    set((state) => {
      const q = [...state.queue];
      const [moved] = q.splice(fromIndex, 1);
      q.splice(toIndex, 0, moved);
      return { queue: q };
    });
  },

  clearQueue: () => {
    set({ queue: [] });
  },

  openNowPlaying: () => {
    set({ isNowPlayingOpen: true });
  },

  closeNowPlaying: () => {
    set({ isNowPlayingOpen: false });
  },

  openQueue: () => {
    set({ isQueueOpen: true });
  },

  closeQueue: () => {
    set({ isQueueOpen: false });
  },

  openCollection: (collection: Collection) => {
    set({ selectedCollection: collection });
  },

  closeCollection: () => {
    set({ selectedCollection: null });
  },

  setReducedMotion: (enabled: boolean) => {
    set({ reducedMotion: enabled });
  },
}));

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const { isPlaying, currentTrack, progressMs, next } = usePlayerStore.getState();
    if (!isPlaying || !currentTrack) return;

    const newProgress = progressMs + 500;
    if (newProgress >= currentTrack.durationMs) {
      next();
    } else {
      usePlayerStore.setState({ progressMs: newProgress });
    }
  }, 500);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}
