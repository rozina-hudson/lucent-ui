import type { CompositionPattern } from '../src/manifest/types.js';

import { PATTERN as ProfileCard } from '../src/manifest/patterns/profile-card.pattern.js';
import { PATTERN as SettingsPanel } from '../src/manifest/patterns/settings-panel.pattern.js';
import { PATTERN as StatsRow } from '../src/manifest/patterns/stats-row.pattern.js';
import { PATTERN as ActionBar } from '../src/manifest/patterns/action-bar.pattern.js';
import { PATTERN as FormLayout } from '../src/manifest/patterns/form-layout.pattern.js';
import { PATTERN as EmptyStateCard } from '../src/manifest/patterns/empty-state-card.pattern.js';
import { PATTERN as CollapsibleCard } from '../src/manifest/patterns/collapsible-card.pattern.js';
import { PATTERN as SearchFilterBar } from '../src/manifest/patterns/search-filter-bar.pattern.js';
import { PATTERN as ProductItemCard } from '../src/manifest/patterns/product-item-card.pattern.js';
import { PATTERN as NotificationCard } from '../src/manifest/patterns/notification-card.pattern.js';
import { PATTERN as ConfirmationDialog } from '../src/manifest/patterns/confirmation-dialog.pattern.js';
import { PATTERN as BulkActionBar } from '../src/manifest/patterns/bulk-action-bar.pattern.js';
import { PATTERN as ActivityFeed } from '../src/manifest/patterns/activity-feed.pattern.js';
import { PATTERN as MetricsDashboard } from '../src/manifest/patterns/metrics-dashboard.pattern.js';
import { PATTERN as TabPage } from '../src/manifest/patterns/tab-page.pattern.js';

export const ALL_PATTERNS: CompositionPattern[] = [
  ProfileCard,
  SettingsPanel,
  StatsRow,
  ActionBar,
  FormLayout,
  EmptyStateCard,
  CollapsibleCard,
  SearchFilterBar,
  ProductItemCard,
  NotificationCard,
  ConfirmationDialog,
  BulkActionBar,
  ActivityFeed,
  MetricsDashboard,
  TabPage,
];
