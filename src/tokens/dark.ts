import type { LucentTokens } from './types.js';
import { lightTokens } from './light.js';
import { deriveDarkFromLight } from './scheme.js';

export const darkTokens: LucentTokens = deriveDarkFromLight(lightTokens);
