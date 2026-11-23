/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Search, Library, Flame } from 'lucide-react';
import { useTheme } from '../../themes/ThemeProvider';
import { triggerHaptic } from '../../utils/waveform';

export type TabId = 'home' | 'search' | 'library' | 'hotlist';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'hotlist', label: 'Hotlist', icon: Flame },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();

  return (
    <nav
      className="w-full relative z-20 flex items-center justify-around px-2 pt-2 pb-5 border-t select-none transition-colors duration-200"
      style={{
        backgroundColor: theme.colors.navBg,
        borderColor: theme.colors.divider,
      }}
      aria-label="Main Navigation"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              triggerHaptic(12);
              onTabChange(item.id);
            }}
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition-all duration-150 active:scale-95"
            style={{
              color: isActive ? theme.colors.navActive : theme.colors.navInactive,
            }}
            aria-label={item.label}
            aria-selected={isActive}
          >
            <IconComponent
              size={22}
              strokeWidth={isActive ? 2.3 : 1.6}
              className="transition-transform duration-150"
            />
            {/* Active tab is darker, bolder and labeled as requested */}
            {isActive && (
              <span
                className="text-[10px] tracking-tight mt-1 transition-all"
                style={{
                  fontWeight: theme.typography.weights.semibold,
                  fontFamily: theme.typography.fontFamily,
                  color: theme.colors.navActive,
                }}
              >
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
