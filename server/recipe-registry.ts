import type { CompositionRecipe } from '../src/manifest/types.js';

import { RECIPE as ProfileCard } from '../src/manifest/recipes/profile-card.recipe.js';
import { RECIPE as SettingsPanel } from '../src/manifest/recipes/settings-panel.recipe.js';
import { RECIPE as StatsRow } from '../src/manifest/recipes/stats-row.recipe.js';
import { RECIPE as ActionBar } from '../src/manifest/recipes/action-bar.recipe.js';
import { RECIPE as FormLayout } from '../src/manifest/recipes/form-layout.recipe.js';
import { RECIPE as EmptyStateCard } from '../src/manifest/recipes/empty-state-card.recipe.js';
import { RECIPE as CollapsibleCard } from '../src/manifest/recipes/collapsible-card.recipe.js';

export const ALL_RECIPES: CompositionRecipe[] = [
  ProfileCard,
  SettingsPanel,
  StatsRow,
  ActionBar,
  FormLayout,
  EmptyStateCard,
  CollapsibleCard,
];
