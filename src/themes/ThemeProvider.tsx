/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { YadahTheme } from './types';
import { THEMES, DEFAULT_THEME_ID, DEFAULT_DARK_THEME_ID, DEFAULT_LIGHT_THEME_ID } from './index';

interface ThemeContextType {
  theme: YadahTheme;
  themeId: string;
  setThemeId: (id: string) => void;
  followSystem: boolean;
  setFollowSystem: (enabled: boolean) => void;
  systemLightId: string;
  setSystemLightId: (id: string) => void;
  systemDarkId: string;
  setSystemDarkId: (id: string) => void;
  availableThemes: YadahTheme[];
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEYS = {
  THEME_ID: 'yadah_theme_id',
  FOLLOW_SYSTEM: 'yadah_follow_system',
  SYSTEM_LIGHT: 'yadah_system_light_id',
  SYSTEM_DARK: 'yadah_system_dark_id',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME_ID) || DEFAULT_THEME_ID;
  });

  const [followSystem, setFollowSystemState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.FOLLOW_SYSTEM) === 'true';
  });

  const [systemLightId, setSystemLightIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SYSTEM_LIGHT) || DEFAULT_LIGHT_THEME_ID;
  });

  const [systemDarkId, setSystemDarkIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SYSTEM_DARK) || DEFAULT_DARK_THEME_ID;
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen to OS system preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const setThemeId = (id: string) => {
    setThemeIdState(id);
    localStorage.setItem(STORAGE_KEYS.THEME_ID, id);
    if (followSystem) {
      setFollowSystemState(false);
      localStorage.setItem(STORAGE_KEYS.FOLLOW_SYSTEM, 'false');
    }
  };

  const setFollowSystem = (enabled: boolean) => {
    setFollowSystemState(enabled);
    localStorage.setItem(STORAGE_KEYS.FOLLOW_SYSTEM, enabled ? 'true' : 'false');
  };

  const setSystemLightId = (id: string) => {
    setSystemLightIdState(id);
    localStorage.setItem(STORAGE_KEYS.SYSTEM_LIGHT, id);
  };

  const setSystemDarkId = (id: string) => {
    setSystemDarkIdState(id);
    localStorage.setItem(STORAGE_KEYS.SYSTEM_DARK, id);
  };

  // Resolve current active theme
  const effectiveThemeId = useMemo(() => {
    if (followSystem) {
      return systemPrefersDark ? systemDarkId : systemLightId;
    }
    return themeId;
  }, [followSystem, systemPrefersDark, systemDarkId, systemLightId, themeId]);

  const activeTheme = useMemo(() => {
    return THEMES.find((t) => t.id === effectiveThemeId) || THEMES[0];
  }, [effectiveThemeId]);

  const toggleTheme = () => {
    const nextTheme = activeTheme.mode === 'light' ? yadahDarkId() : yadahLightId();
    setThemeId(nextTheme);
  };

  function yadahDarkId(): string {
    const darkTheme = THEMES.find((t) => t.mode === 'dark');
    return darkTheme ? darkTheme.id : DEFAULT_DARK_THEME_ID;
  }

  function yadahLightId(): string {
    const lightTheme = THEMES.find((t) => t.mode === 'light');
    return lightTheme ? lightTheme.id : DEFAULT_LIGHT_THEME_ID;
  }

  // Inject CSS variables for performance & animations
  useEffect(() => {
    const root = document.documentElement;
    const { colors, typography, shape, effects } = activeTheme;

    // Apply colors as CSS variables
    Object.entries(colors).forEach(([key, val]) => {
      root.style.setProperty(`--theme-color-${key}`, val);
    });

    // Apply shape as CSS variables
    Object.entries(shape).forEach(([key, val]) => {
      root.style.setProperty(`--theme-shape-${key}`, val);
    });

    // Apply typography
    root.style.setProperty('--theme-font-family', typography.fontFamily);

    // Apply effects
    root.style.setProperty('--theme-shadow-soft', effects.shadowSoft);
    root.style.setProperty('--theme-shadow-artwork', effects.shadowArtwork);

    // Meta theme-color for mobile browser chrome
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colors.background);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = colors.background;
      document.head.appendChild(meta);
    }
  }, [activeTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        themeId: effectiveThemeId,
        setThemeId,
        followSystem,
        setFollowSystem,
        systemLightId,
        setSystemLightId,
        systemDarkId,
        setSystemDarkId,
        availableThemes: THEMES,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
