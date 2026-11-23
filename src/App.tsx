/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './themes/ThemeProvider';
import { usePlayerStore } from './store/playerStore';
import { BottomNav, TabId } from './components/layout/BottomNav';
import { MiniPlayer } from './components/player/MiniPlayer';
import { NowPlayingModal } from './components/player/NowPlayingModal';
import { QueueScreen } from './screens/QueueScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { HotlistScreen } from './screens/HotlistScreen';
import { AlbumDetailScreen } from './screens/AlbumDetailScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { Wifi, Battery, Smartphone, Maximize, Minimize } from 'lucide-react';
import { triggerHaptic } from './utils/waveform';

type DevicePreset = 'iphone-16-pro' | 'iphone-se' | 'pixel-9';

interface DeviceSpec {
  name: string;
  width: number;
  height: number;
  hasDynamicIsland?: boolean;
}

const DEVICE_SPECS: Record<DevicePreset, DeviceSpec> = {
  'iphone-16-pro': {
    name: 'iPhone 16 Pro',
    width: 393,
    height: 852,
    hasDynamicIsland: true,
  },
  'iphone-se': {
    name: 'iPhone SE',
    width: 375,
    height: 667,
  },
  'pixel-9': {
    name: 'Pixel 9',
    width: 412,
    height: 890,
  },
};

const YadahAppContent: React.FC = () => {
  const { theme } = useTheme();
  const {
    currentTrack,
    initialize,
    selectedCollection,
    closeCollection,
  } = usePlayerStore();

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [devicePreset, setDevicePreset] = useState<DevicePreset>('iphone-16-pro');
  const [currentTimeStr, setCurrentTimeStr] = useState('09:41');
  const [isRealFullscreen, setIsRealFullscreen] = useState(false);
  const [showExitFloatingButton, setShowExitFloatingButton] = useState(true);

  useEffect(() => {
    initialize();

    // Clock for mobile status bar
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [initialize]);

  const toggleRealFullscreen = () => {
    triggerHaptic(15);
    const nextState = !isRealFullscreen;
    setIsRealFullscreen(nextState);

    // Attempt browser native fullscreen API if available
    try {
      if (nextState) {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {
            // Ignore if blocked in sandboxed iframe
          });
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch {
      // Browser environment restrictions
    }
  };

  const activeDevice = DEVICE_SPECS[devicePreset];

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: isRealFullscreen ? theme.colors.background : theme.colors.backdrop,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* Device Viewport Testing Header Bar - Hidden in Real Fullscreen */}
      {!isRealFullscreen && (
        <header
          className="w-full py-2.5 px-4 flex items-center justify-between z-40 shrink-0 text-xs select-none border-b shadow-xs"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.divider,
            color: theme.colors.textSecondary,
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-bold tracking-tight text-sm"
              style={{ color: theme.colors.textPrimary }}
            >
              Yadah
            </span>
            <span className="hidden sm:inline-block opacity-60">·</span>
            <span className="hidden sm:inline-block text-[11px] opacity-80">
              {theme.name} ({theme.mode})
            </span>
          </div>

          {/* Controls: Device Preset Selectors & Real Fullscreen Toggle */}
          <div className="flex items-center gap-2">
            {/* Device Switcher Buttons */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  setDevicePreset('iphone-16-pro');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  devicePreset === 'iphone-16-pro'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'hover:opacity-80'
                }`}
              >
                iPhone 16 Pro
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  setDevicePreset('iphone-se');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  devicePreset === 'iphone-se'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'hover:opacity-80'
                }`}
              >
                iPhone SE
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  setDevicePreset('pixel-9');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  devicePreset === 'pixel-9'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'hover:opacity-80'
                }`}
              >
                Pixel 9
              </button>
            </div>

            {/* Activate Real Fullscreen Button */}
            <button
              type="button"
              onClick={toggleRealFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.onPrimary,
                borderRadius: theme.shape.radiusButton,
              }}
              title="Deactivate device frame and view in real fullscreen"
            >
              <Maximize size={14} />
              <span>Real Fullscreen</span>
            </button>
          </div>
        </header>
      )}

      {/* Real Fullscreen Floating Exit Button (allows user to reactivate device viewport anytime) */}
      {isRealFullscreen && (
        <aside
          className="fixed top-3 right-4 z-60 group flex items-center"
          onMouseEnter={() => setShowExitFloatingButton(true)}
        >
          <button
            type="button"
            onClick={toggleRealFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-200 active:scale-95 cursor-pointer opacity-85 hover:opacity-100"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.textPrimary,
              border: `1px solid ${theme.colors.divider}`,
              borderRadius: theme.shape.radiusPill,
            }}
            aria-label="Exit real fullscreen and return to device viewport"
          >
            <Minimize size={14} style={{ color: theme.colors.primary }} />
            <span className="text-xs font-semibold">Device Viewport</span>
          </button>
        </aside>
      )}

      {/* Main Canvas: Either device frame OR real edge-to-edge fullscreen */}
      <main
        className={`w-full flex items-center justify-center overflow-hidden ${
          isRealFullscreen ? 'h-screen p-0 m-0' : 'flex-1 p-0 sm:p-4'
        }`}
      >
        <div
          className={`relative overflow-hidden flex flex-col transition-all duration-300 ${
            isRealFullscreen
              ? 'w-full h-full rounded-none shadow-none ring-0'
              : 'rounded-[46px] shadow-2xl ring-1 ring-black/10 dark:ring-white/10'
          }`}
          style={{
            width: isRealFullscreen ? '100%' : `${activeDevice.width}px`,
            height: isRealFullscreen ? '100%' : `${activeDevice.height}px`,
            maxHeight: isRealFullscreen ? '100%' : '92vh',
            maxWidth: isRealFullscreen ? '100%' : '100%',
            backgroundColor: theme.colors.background,
            color: theme.colors.textPrimary,
          }}
        >
          {/* iOS / Mobile Status Bar with Safe Area Top */}
          <div
            className="w-full pt-3 px-6 pb-1 flex items-center justify-between select-none shrink-0 z-30"
            style={{
              color: theme.colors.textPrimary,
            }}
          >
            {/* Left: Time */}
            <span className="text-xs font-semibold tracking-tight tabular-nums">
              {currentTimeStr}
            </span>

            {/* Center: Dynamic Island or Speaker notch (only when in iPhone 16 Pro device mode) */}
            {!isRealFullscreen && activeDevice.hasDynamicIsland && (
              <div className="w-24 h-5 rounded-full bg-black flex items-center justify-end px-2 mx-auto">
                <div className="w-2 h-2 rounded-full bg-blue-900/40" />
              </div>
            )}

            {/* Right: Wifi, Battery */}
            <div className="flex items-center gap-1.5 opacity-90">
              <Wifi size={13} strokeWidth={2.4} />
              <Battery size={15} strokeWidth={2.2} />
            </div>
          </div>

          {/* Screen Content Container */}
          <div className="flex-1 w-full overflow-hidden flex flex-col relative">
            {/* Primary Tab Screens */}
            {!selectedCollection && !isSettingsOpen && (
              <>
                {activeTab === 'home' && (
                  <HomeScreen onOpenSettings={() => setIsSettingsOpen(true)} />
                )}
                {activeTab === 'search' && <SearchScreen />}
                {activeTab === 'library' && <LibraryScreen />}
                {activeTab === 'hotlist' && <HotlistScreen />}
              </>
            )}

            {/* Album Detail View */}
            {selectedCollection && (
              <AlbumDetailScreen
                collection={selectedCollection}
                onBack={closeCollection}
                onSearchClick={() => {
                  closeCollection();
                  setActiveTab('search');
                }}
              />
            )}

            {/* Settings View */}
            {isSettingsOpen && (
              <SettingsScreen onBack={() => setIsSettingsOpen(false)} />
            )}
          </div>

          {/* Floating Docked Mini Player (Overlaps top of Bottom Nav) */}
          {currentTrack && <MiniPlayer />}

          {/* Bottom Tab Navigation */}
          <BottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              closeCollection();
              setIsSettingsOpen(false);
              setActiveTab(tab);
            }}
          />

          {/* Safe Area Bottom Home Indicator Bar */}
          <div
            className="w-full pb-1.5 pt-0.5 flex justify-center shrink-0 z-30"
            style={{ backgroundColor: theme.colors.navBg }}
          >
            <div
              className="w-32 h-1 rounded-full opacity-40"
              style={{ backgroundColor: theme.colors.textPrimary }}
            />
          </div>

          {/* Full Screen Now Playing Modal */}
          <NowPlayingModal />

          {/* Reorderable Queue Screen */}
          <QueueScreen />
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <YadahAppContent />
    </ThemeProvider>
  );
}
