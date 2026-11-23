/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { YadahTheme } from './types';
import { yadahLight } from './yadahLight';
import { yadahDark } from './yadahDark';
import { demoSand } from './demoSand';

export * from './types';
export * from './yadahLight';
export * from './yadahDark';
export * from './demoSand';

/**
 * Registry of available themes in Yadah.
 * To add a theme:
 * 1. Create a new file in src/themes/<myTheme>.ts implementing YadahTheme
 * 2. Import it and add to this array!
 */
export const THEMES: YadahTheme[] = [
  yadahLight,
  yadahDark,
  demoSand,
];

export const DEFAULT_THEME_ID = 'yadah-light';
export const DEFAULT_DARK_THEME_ID = 'yadah-dark';
export const DEFAULT_LIGHT_THEME_ID = 'yadah-light';
