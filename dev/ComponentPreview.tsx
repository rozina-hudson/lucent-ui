import { useState, useMemo } from 'react';
import { LucentProvider, useLucent, createTheme } from '../src/index.js';
import { LucentDevTools } from '../src/devtools/index.js';
import type { PaletteName, ShapeName, ShadowName } from '../src/tokens/presets/types.js';
import type { ColorPalette } from '../src/tokens/presets/types.js';
import {
  defaultPalette, brandPalette, indigoPalette, violetPalette, emeraldPalette, tealPalette,
  rosePalette, coralPalette, amberPalette, oceanPalette, slatePalette, sagePalette,
  sharpShape, roundedShape, pillShape,
  flatShadow, subtleShadow, elevatedShadow,
} from '../src/tokens/presets/index.js';
import { Button } from '../src/components/atoms/Button/index.js';
import { Input } from '../src/components/atoms/Input/index.js';
import { Textarea } from '../src/components/atoms/Textarea/index.js';
import { Badge } from '../src/components/atoms/Badge/index.js';
import { Chip } from '../src/components/atoms/Chip/index.js';
import { Avatar } from '../src/components/atoms/Avatar/index.js';
import { Spinner } from '../src/components/atoms/Spinner/index.js';
import { Divider } from '../src/components/atoms/Divider/index.js';
import { Checkbox } from '../src/components/atoms/Checkbox/index.js';
import { Radio, RadioGroup } from '../src/components/atoms/Radio/index.js';
import { Toggle } from '../src/components/atoms/Toggle/index.js';
import { Select } from '../src/components/atoms/Select/index.js';
import { Tag } from '../src/components/atoms/Tag/index.js';
import { Tooltip } from '../src/components/atoms/Tooltip/index.js';
import { Icon } from '../src/components/atoms/Icon/index.js';
import { Text } from '../src/components/atoms/Text/index.js';
import { FormField } from '../src/components/molecules/FormField/index.js';
import { SearchInput } from '../src/components/molecules/SearchInput/index.js';
import { Card, CardBleed, CardPaddingContext } from '../src/components/molecules/Card/index.js';
import { Alert } from '../src/components/molecules/Alert/index.js';
import { EmptyState } from '../src/components/molecules/EmptyState/index.js';
import { Skeleton } from '../src/components/molecules/Skeleton/index.js';
import { Breadcrumb } from '../src/components/molecules/Breadcrumb/index.js';
import { Tabs } from '../src/components/molecules/Tabs/index.js';
import { Collapsible } from '../src/components/molecules/Collapsible/index.js';
import { NavLink } from '../src/components/atoms/NavLink/index.js';
import { Slider } from '../src/components/atoms/Slider/index.js';
import { CodeBlock } from '../src/components/atoms/CodeBlock/index.js';
import { Table } from '../src/components/atoms/Table/index.js';
import { PageLayout } from '../src/components/molecules/PageLayout/index.js';
import { TokenPreview } from './TokenPreview.js';
import { SelectPlayground } from './SelectPlayground.js';
import { DataTable } from '../src/components/molecules/DataTable/index.js';
import { CommandPalette } from '../src/components/molecules/CommandPalette/index.js';
import { MultiSelect } from '../src/components/molecules/MultiSelect/index.js';
import { DatePicker } from '../src/components/molecules/DatePicker/index.js';
import { DateRangePicker } from '../src/components/molecules/DateRangePicker/index.js';
import { FileUpload } from '../src/components/molecules/FileUpload/index.js';
import { Timeline } from '../src/components/molecules/Timeline/index.js';
import { Menu, MenuItem, MenuSeparator, MenuGroup } from '../src/components/molecules/Menu/index.js';
import { FilterMultiSelect } from '../src/components/molecules/FilterMultiSelect/index.js';
import { FilterSelect } from '../src/components/molecules/FilterSelect/index.js';
import { FilterSearch } from '../src/components/molecules/FilterSearch/index.js';
import { FilterDateRange } from '../src/components/molecules/FilterDateRange/index.js';
import { ToastProvider, useToast, type ToastPosition } from '../src/components/molecules/Toast/index.js';
import { ColorPicker, type ColorPresetGroup } from '../src/components/atoms/ColorPicker/index.js';
import { ColorSwatch } from '../src/components/atoms/ColorSwatch/index.js';
import { SegmentedControl } from '../src/components/atoms/SegmentedControl/index.js';
import { Stack as StackAtom } from '../src/components/atoms/Stack/index.js';
import { Row as RowAtom } from '../src/components/atoms/Row/index.js';
import { Progress } from '../src/components/atoms/Progress/index.js';
import { Stepper } from '../src/components/molecules/Stepper/index.js';
import { SplitButton } from '../src/components/atoms/SplitButton/index.js';
import { ButtonGroup } from '../src/components/atoms/ButtonGroup/index.js';
import { NavMenu } from '../src/components/molecules/NavMenu/index.js';
import type { Theme, ThemeAnchors, UploadFile } from '../src/index.js';
import { ProfileCard } from './compositions/ProfileCard.js';
import { PreferencesCard } from './compositions/PreferencesCard.js';
import { PricingTable } from './compositions/PricingTable.js';
import { NotificationFeed } from './compositions/NotificationFeed.js';
import { OnboardingFlow } from './compositions/OnboardingFlow.js';
import { DashboardHeader } from './compositions/DashboardHeader.js';

// ─── Palette map ────────────────────────────────────────────────────────────

const PALETTE_MAP: Record<PaletteName, ColorPalette> = {
  default: defaultPalette, brand: brandPalette, indigo: indigoPalette,
  violet: violetPalette, emerald: emeraldPalette, teal: tealPalette,
  rose: rosePalette, coral: coralPalette, amber: amberPalette,
  ocean: oceanPalette, slate: slatePalette, sage: sagePalette,
};

import type { ShapePreset, ShadowPreset } from '../src/tokens/presets/types.js';
const SHAPE_MAP: Record<ShapeName, ShapePreset> = { sharp: sharpShape, rounded: roundedShape, pill: pillShape };
const SHADOW_MAP: Record<ShadowName, ShadowPreset> = { flat: flatShadow, subtle: subtleShadow, elevated: elevatedShadow };

function ColorPickerDemo({ presetGroups }: { presetGroups?: ColorPresetGroup[] }) {
  const [color, setColor] = useState('#3b82f6');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lucent-space-4)' }}>
      <ColorPicker value={color} onChange={setColor} label="Color" {...(presetGroups !== undefined && { presetGroups })} />
      <span style={{ fontSize: 'var(--lucent-font-size-sm)', fontFamily: 'var(--lucent-font-family-mono)', color: 'var(--lucent-text-secondary)' }}>
        {color}
      </span>
    </div>
  );
}

const TOAST_POSITIONS: ToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];

function ToastButtons({ position, onChangePosition }: { position: ToastPosition; onChangePosition: (p: ToastPosition) => void }) {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lucent-space-3)' }}>
        <Text as="span" size="sm" color="secondary">Position:</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 'var(--lucent-space-1)' }}>
          {TOAST_POSITIONS.map((p) => (
            <Button
              key={p}
              size="sm"
              variant={p === position ? 'primary' : 'ghost'}
              onClick={() => onChangePosition(p)}
              style={{ fontSize: 'var(--lucent-font-size-xs)', padding: '2px 8px', minWidth: 0, height: 26 }}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--lucent-space-2)' }}>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Changes saved' })}>Default</Button>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Profile updated', description: 'Your changes have been saved successfully.', variant: 'success' })}>Success</Button>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Approaching limit', description: 'You have used 80% of your monthly quota.\nConsider upgrading your plan.', variant: 'warning' })}>Warning (multi-line)</Button>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Payment failed', description: 'Check your card details and try again.', variant: 'danger' })}>Danger</Button>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'New version available', description: 'v2.1.0 includes performance improvements and bug fixes.', variant: 'info' })}>Info</Button>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Message deleted', variant: 'danger', action: { label: 'Undo', onClick: () => toast({ title: 'Message restored', variant: 'success' }) } })}>Action (button)</Button>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Event created', description: 'Sunday, December 03, 2023 at 9:00 AM', action: { label: 'Undo', style: 'link', onClick: () => toast({ title: 'Event removed', variant: 'success' }) } })}>Action (link)</Button>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Persistent toast', description: 'This toast will not auto-dismiss.', duration: Infinity })}>No auto-dismiss</Button>
      </div>
    </div>
  );
}

function NavIcon() {
  return (
    <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function SmallIcon({ d }: { d: string }) {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export type DevTab = 'components' | 'tokens' | 'playground';

export function ComponentPreview({ tab, setTab }: { tab: DevTab; setTab: (t: DevTab) => void }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [toastPosition, setToastPosition] = useState<ToastPosition>('bottom-right');

  // Compute final tokens synchronously from theme
  const finalTokens = useMemo(() => {
    const pa = PALETTE_MAP.default[theme];
    const anchors: ThemeAnchors = { ...pa, textPrimary: pa.textPrimary ?? (theme === 'light' ? '#111111' : '#eeeeee') };
    const colorTokens = createTheme(anchors, theme);
    const shapeTokens = SHAPE_MAP.rounded.tokens;
    const shadowTokens = SHADOW_MAP.subtle[theme];
    return { ...colorTokens, ...shapeTokens, ...shadowTokens };
  }, [theme]);

  return (
    <LucentProvider theme={theme} tokens={finalTokens}>
      <ToastProvider position={toastPosition}>
        <Inner
          tab={tab}
          setTab={setTab}
          theme={theme}
          onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          toastPosition={toastPosition}
          onChangeToastPosition={setToastPosition}
        />
      </ToastProvider>
      <LucentDevTools onThemeChange={setTheme} />
    </LucentProvider>
  );
}

function Inner({
  tab, setTab, theme,
  onToggleTheme,
  toastPosition, onChangeToastPosition,
}: {
  tab: DevTab;
  setTab: (t: DevTab) => void;
  theme: Theme;
  onToggleTheme: () => void;
  toastPosition: ToastPosition;
  onChangeToastPosition: (p: ToastPosition) => void;
}) {
  const { tokens } = useLucent();
  const [componentFilter, setComponentFilter] = useState('');

  const sectionGroups: Record<string, { label: string; tier: 'atom' | 'molecule' | 'pattern' | 'composition'; items: string[] }> = {
    buttons:     { label: 'Buttons & Actions', tier: 'atom', items: ['Button', 'SplitButton', 'ButtonGroup', 'Toggle', 'SegmentedControl'] },
    inputs:      { label: 'Input Fields',      tier: 'atom', items: ['Input', 'Textarea', 'Select', 'Checkbox', 'Radio', 'Slider', 'ColorPicker', 'ColorSwatch'] },
    text:        { label: 'Text & Labels',      tier: 'atom', items: ['Text', 'Badge', 'Chip', 'Tag', 'Icon', 'Tooltip', 'CodeBlock'] },
    media:       { label: 'Media & Status',     tier: 'atom', items: ['Avatar', 'Spinner', 'Progress', 'Divider'] },
    layout:      { label: 'Layout',             tier: 'atom', items: ['Stack', 'Row', 'Table'] },
    forms:       { label: 'Forms',              tier: 'molecule', items: ['FormField', 'SearchInput', 'MultiSelect', 'DatePicker', 'DateRangePicker', 'FileUpload'] },
    filters:     { label: 'Filters',            tier: 'molecule', items: ['FilterSearch', 'FilterSelect', 'FilterMultiSelect', 'FilterDateRange'] },
    containers:  { label: 'Containers',         tier: 'molecule', items: ['Card', 'Alert', 'EmptyState', 'Skeleton', 'Collapsible'] },
    navigation:  { label: 'Navigation',         tier: 'molecule', items: ['Breadcrumb', 'Tabs', 'NavLink', 'NavMenu', 'PageLayout', 'Stepper'] },
    data:        { label: 'Data & Tables',      tier: 'molecule', items: ['DataTable', 'Timeline'] },
    overlays:    { label: 'Overlays & Menus',   tier: 'molecule', items: ['Menu', 'CommandPalette', 'Toast'] },
    'r-cards':   { label: 'Cards',              tier: 'pattern', items: ['ProfileCard', 'ProductItemCard', 'AnnouncementCard', 'CollapsibleCard', 'EmptyStateCard'] },
    'r-layouts': { label: 'Layouts',            tier: 'pattern', items: ['SettingsPanel', 'FormLayout', 'StatsRow', 'ActionBar', 'ConfirmationDialog', 'BulkActionBar'] },
    'r-filters': { label: 'Filters',           tier: 'pattern', items: ['SearchFilterBar'] },
    'c-all':     { label: 'All Compositions',   tier: 'composition', items: ['GoldenProfileCard', 'GoldenPreferencesCard', 'GoldenPricingTable', 'GoldenNotificationFeed', 'GoldenOnboardingFlow', 'GoldenDashboardHeader'] },
  };

  const allSections = Object.values(sectionGroups).flatMap(g => g.items);

  // Groups where clicking the parent selects all children (not a specific one)
  const selectAllGroups = new Set(['text']);

  const filterLower = componentFilter.toLowerCase();
  const showSection = (name: string) => {
    if (!filterLower) return true;
    if (componentFilter.startsWith('group:')) {
      const groupKey = componentFilter.slice(6);
      const group = sectionGroups[groupKey];
      return group ? group.items.includes(name) : false;
    }
    return name.toLowerCase().includes(filterLower);
  };

  const [inputVal, setInputVal] = useState('');
  const [textareaVal, setTextareaVal] = useState('');
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState('option1');
  const [radioSize, setRadioSize] = useState('m');
  const [toggled, setToggled] = useState(false);
  const [sliderValue, setSliderValue] = useState(40);
  const [selectVal, setSelectVal] = useState('');
  const [tags, setTags] = useState(['React', 'TypeScript', 'Design Systems']);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [menuSort, setMenuSort] = useState('name');
  const [comboOpen, setComboOpen] = useState(true);
  const [navInverse, setNavInverse] = useState(false);
  const [navIcons, setNavIcons] = useState(false);
  const [navSize, setNavSize] = useState<'sm' | 'md' | 'lg'>('sm');
  const [settingsTab, setSettingsTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [sfbSearchOpen, setSfbSearchOpen] = useState(false);
  const [sfbTags, setSfbTags] = useState<Set<string>>(new Set(['data-science']));
  const toggleSfbTag = (tag: string) => setSfbTags(prev => { const next = new Set(prev); if (next.has(tag)) next.delete(tag); else next.add(tag); return next; });
  const [sfbStatuses, setSfbStatuses] = useState<Set<string>>(new Set());
  const toggleSfbStatus = (s: string) => setSfbStatuses(prev => { if (s === 'all') return new Set(); const next = new Set(prev); if (next.has(s)) next.delete(s); else next.add(s); return next; });
  const [sfbOpenMenu, setSfbOpenMenu] = useState<string | null>(null);
  const sfbMenuProps = (id: string) => ({ open: sfbOpenMenu === id, onOpenChange: (open: boolean) => setSfbOpenMenu(open ? id : null) });
  const sfbKeepOpen = (id: string) => setSfbOpenMenu(id);
  const [sfbDateRange, setSfbDateRange] = useState<{ start: Date; end: Date } | undefined>();
  const sfbHasFilters = sfbStatuses.size > 0 || sfbTags.size > 0 || sfbDateRange !== undefined;
  const sfbClearAll = () => { setSfbStatuses(new Set()); setSfbTags(new Set()); setSfbDateRange(undefined); setSfbSearch(''); setSfbSearchOpen(false); };

  // Filter bar + DataTable composition
  const [sfbSearch, setSfbSearch] = useState('');
  const sfbTagOptions = [
    { value: 'data-science', label: 'Data Science', swatch: '#6366f1' },
    { value: 'devops', label: 'DevOps', swatch: '#10b981' },
    { value: 'hot', label: 'Hot Candidate', swatch: '#f59e0b' },
    { value: 'react', label: 'React', swatch: '#3b82f6' },
  ] as const;
  const sfbCandidates = [
    { name: 'Alice Chen', role: 'Engineer', status: 'Active', tags: ['react', 'data-science'], added: new Date(2026, 2, 5) },
    { name: 'Bob Martinez', role: 'Designer', status: 'Active', tags: ['devops'], added: new Date(2026, 2, 10) },
    { name: 'Carol Park', role: 'Product', status: 'Archived', tags: ['data-science'], added: new Date(2026, 1, 20) },
    { name: 'Dan Okafor', role: 'Engineer', status: 'On hold', tags: ['react', 'devops'], added: new Date(2026, 2, 15) },
    { name: 'Eve Johansson', role: 'Marketing', status: 'Active', tags: ['hot'], added: new Date(2026, 2, 22) },
    { name: 'Frank Liu', role: 'Engineer', status: 'Active', tags: ['react'], added: new Date(2026, 2, 1) },
    { name: 'Grace Kim', role: 'Designer', status: 'Archived', tags: ['data-science', 'hot'], added: new Date(2026, 1, 14) },
    { name: 'Hiro Tanaka', role: 'Engineer', status: 'Active', tags: ['devops', 'react'], added: new Date(2026, 2, 28) },
  ];
  const sfbFilteredCandidates = sfbCandidates.filter(c => {
    if (sfbSearch && !c.name.toLowerCase().includes(sfbSearch.toLowerCase()) && !c.role.toLowerCase().includes(sfbSearch.toLowerCase())) return false;
    if (sfbStatuses.size > 0 && !sfbStatuses.has(c.status.toLowerCase().replace(' ', '-'))) return false;
    if (sfbTags.size > 0 && !c.tags.some(t => sfbTags.has(t))) return false;
    if (sfbDateRange && (c.added < sfbDateRange.start || c.added > sfbDateRange.end)) return false;
    return true;
  });

  const allFruits = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange', 'Peach', 'Pear', 'Pineapple', 'Strawberry'];
  const searchResults = searchQuery.length > 0
    ? allFruits
        .filter(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((f, i) => ({ id: i, label: f }))
    : [];

  const atomGroups = Object.entries(sectionGroups).filter(([, g]) => g.tier === 'atom');
  const moleculeGroups = Object.entries(sectionGroups).filter(([, g]) => g.tier === 'molecule');
  const patternGroups = Object.entries(sectionGroups).filter(([, g]) => g.tier === 'pattern');
  const compositionGroups = Object.entries(sectionGroups).filter(([, g]) => g.tier === 'composition');

  const navSidebar = (
    <div style={{ padding: tokens.space3, display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
        <SegmentedControl
          size="sm"
          options={[{ value: 'sm', label: 'SM' }, { value: 'md', label: 'MD' }, { value: 'lg', label: 'LG' }]}
          value={navSize}
          onChange={(v) => setNavSize(v as 'sm' | 'md' | 'lg')}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.space3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.space2 }}>
            <Text size="xs" color="secondary">Inverse</Text>
            <Toggle size="sm" checked={navInverse} onChange={(e) => setNavInverse(e.target.checked)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.space2 }}>
            <Text size="xs" color="secondary">Icons</Text>
            <Toggle size="sm" checked={navIcons} onChange={(e) => setNavIcons(e.target.checked)} />
          </div>
        </div>
      </div>
      <NavMenu orientation="vertical" size={navSize} inverse={navInverse} hasIcons={navIcons}>
        <NavMenu.Item
          as="button"
          isActive={!componentFilter}
          onClick={() => setComponentFilter('')}
          icon={navIcons ? <NavIcon /> : undefined}
        >
          All components
        </NavMenu.Item>
        <NavMenu.Separator />
        <NavMenu.Group label="Atoms">
          {atomGroups.map(([key, group]) => {
            const isSelectAll = selectAllGroups.has(key);
            return (
              <NavMenu.Item
                key={key}
                as="button"
                isActive={isSelectAll
                  ? componentFilter === `group:${key}`
                  : group.items.includes(componentFilter)
                }
                onClick={() => setComponentFilter(isSelectAll ? `group:${key}` : group.items[0])}
                icon={navIcons ? <NavIcon /> : undefined}
              >
                {group.label}
                <NavMenu.Sub>
                  {group.items.map(name => (
                    <NavMenu.Item
                      key={name}
                      as="button"
                      isActive={componentFilter === name}
                      onClick={() => setComponentFilter(name)}
                    >
                      {name}
                    </NavMenu.Item>
                  ))}
                </NavMenu.Sub>
              </NavMenu.Item>
            );
          })}
          <NavMenu.Item as="button" isActive={componentFilter === 'atoms-overview'} onClick={() => setComponentFilter('atoms-overview')} icon={navIcons ? <NavIcon /> : undefined}>Overview</NavMenu.Item>
          <NavMenu.Item as="button" isActive={componentFilter === 'atoms-guidelines'} onClick={() => setComponentFilter('atoms-guidelines')} icon={navIcons ? <NavIcon /> : undefined}>Guidelines</NavMenu.Item>
        </NavMenu.Group>
        <NavMenu.Group label="Molecules">
          {moleculeGroups.map(([key, group]) => (
            <NavMenu.Item
              key={key}
              as="button"
              isActive={group.items.includes(componentFilter)}
              onClick={() => setComponentFilter(group.items[0])}
              icon={navIcons ? <NavIcon /> : undefined}
            >
              {group.label}
              <NavMenu.Sub>
                {group.items.map(name => (
                  <NavMenu.Item
                    key={name}
                    as="button"
                    isActive={componentFilter === name}
                    onClick={() => setComponentFilter(name)}
                  >
                    {name}
                  </NavMenu.Item>
                ))}
              </NavMenu.Sub>
            </NavMenu.Item>
          ))}
          <NavMenu.Item as="button" isActive={componentFilter === 'mol-patterns'} onClick={() => setComponentFilter('mol-patterns')} icon={navIcons ? <NavIcon /> : undefined}>Patterns</NavMenu.Item>
        </NavMenu.Group>
        <NavMenu.Group label="Patterns">
          {patternGroups.map(([key, group]) => (
            <NavMenu.Item
              key={key}
              as="button"
              isActive={group.items.includes(componentFilter)}
              onClick={() => setComponentFilter(group.items[0])}
              icon={navIcons ? <NavIcon /> : undefined}
            >
              {group.label}
              <NavMenu.Sub>
                {group.items.map(name => (
                  <NavMenu.Item
                    key={name}
                    as="button"
                    isActive={componentFilter === name}
                    onClick={() => setComponentFilter(name)}
                  >
                    {name.replace(/([A-Z])/g, ' $1').trim()}
                  </NavMenu.Item>
                ))}
              </NavMenu.Sub>
            </NavMenu.Item>
          ))}
        </NavMenu.Group>
        <NavMenu.Group label="Compositions">
          {compositionGroups.map(([key, group]) => (
            group.items.map(name => (
              <NavMenu.Item
                key={name}
                as="button"
                isActive={componentFilter === name}
                onClick={() => setComponentFilter(name)}
                icon={navIcons ? <NavIcon /> : undefined}
              >
                {name.replace(/^Golden/, '').replace(/([A-Z])/g, ' $1').trim()}
              </NavMenu.Item>
            ))
          ))}
        </NavMenu.Group>
        <NavMenu.Separator />
        <NavMenu.Item as="button" isActive={componentFilter === 'changelog'} onClick={() => setComponentFilter('changelog')} icon={navIcons ? <NavIcon /> : undefined}>Changelog</NavMenu.Item>
        <NavMenu.Item as="button" isActive={componentFilter === 'about'} onClick={() => setComponentFilter('about')} icon={navIcons ? <NavIcon /> : undefined}>About</NavMenu.Item>
      </NavMenu>
    </div>
  );

  const tabItems: { key: DevTab; label: string }[] = [
    { key: 'components', label: 'Components' },
    { key: 'tokens', label: 'Tokens' },
    { key: 'playground', label: 'Playground' },
  ];

  // ─── Cmd+K command palette items ──────────────────────────────────────────
  const paletteCommands = useMemo(() => {
    const items: import('../src/components/molecules/CommandPalette/CommandPalette.js').CommandItem[] = [];

    // All component sections grouped by tier
    for (const [, group] of Object.entries(sectionGroups)) {
      const tierLabel = group.tier === 'atom' ? 'Atoms' : group.tier === 'molecule' ? 'Molecules' : group.tier === 'pattern' ? 'Patterns' : 'Compositions';
      for (const name of group.items) {
        items.push({
          id: name,
          label: name,
          description: group.label,
          group: tierLabel,
          onSelect: () => { setTab('components'); setComponentFilter(name); },
        });
      }
    }

    // Special pages
    items.push(
      { id: 'tokens-page', label: 'Tokens', description: 'Token reference', group: 'Pages', onSelect: () => setTab('tokens') },
      { id: 'playground-page', label: 'Playground', description: 'Select playground', group: 'Pages', onSelect: () => setTab('playground') },
      { id: 'all-components', label: 'All Components', description: 'Show everything', group: 'Pages', onSelect: () => { setTab('components'); setComponentFilter(''); } },
    );

    return items;
  }, [sectionGroups]);

  return (
    <>
    <CommandPalette commands={paletteCommands} placeholder="Jump to component…" />
    <PageLayout
      header={
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${tokens.space5}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.space5 }}>
            <Text as="span" size="lg" weight="bold">Lucent UI</Text>
            <nav style={{ display: 'flex', gap: 0, height: '100%' }}>
              {tabItems.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    padding: `0 ${tokens.space4}`,
                    height: '100%',
                    border: 'none',
                    borderBottom: tab === t.key ? `2px solid ${tokens.accentDefault}` : '2px solid transparent',
                    background: 'transparent',
                    fontFamily: tokens.fontFamilyBase,
                    fontSize: tokens.fontSizeSm,
                    fontWeight: tab === t.key ? tokens.fontWeightSemibold : tokens.fontWeightRegular,
                    color: tab === t.key ? tokens.textPrimary : tokens.textSecondary,
                    cursor: 'pointer',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
          <Toggle label="Dark" checked={theme === 'dark'} onChange={onToggleTheme} />
        </div>
      }
      headerHeight={48}
      chromeBackground="bgBase"
      mainStyle={{ background: 'var(--lucent-surface)' }}
      {...(tab === 'components' && { sidebar: navSidebar, sidebarWidth: navSize === 'lg' ? 280 : navSize === 'md' ? 250 : 220 })}
    >
      {tab === 'components' ? (
      <div style={{ padding: tokens.space6 }}>

      {/* Text */}
      <Section title="Text" tokens={tokens} hidden={!showSection('Text')}>
        <Row label="Sizes" tokens={tokens}>
          <Text as="span" size="xs">xs — Extra small</Text>
          <Text as="span" size="sm">sm — Small</Text>
          <Text as="span" size="md">md — Medium (base)</Text>
          <Text as="span" size="lg">lg — Large</Text>
          <Text as="span" size="xl">xl — X-Large</Text>
          <Text as="span" size="2xl">2xl — 2X-Large</Text>
          <Text as="span" size="3xl">3xl — 3X-Large</Text>
        </Row>
        <Row label="Weights" tokens={tokens}>
          <Text as="span" weight="regular">Regular</Text>
          <Text as="span" weight="medium">Medium</Text>
          <Text as="span" weight="semibold">Semibold</Text>
          <Text as="span" weight="bold">Bold</Text>
        </Row>
        <Row label="Colors" tokens={tokens}>
          <Text as="span" color="primary">Primary</Text>
          <Text as="span" color="secondary">Secondary</Text>
          <Text as="span" color="disabled">Disabled</Text>
          <Text as="span" color="success">Success</Text>
          <Text as="span" color="warning">Warning</Text>
          <Text as="span" color="danger">Danger</Text>
          <Text as="span" color="info">Info</Text>
        </Row>
        <Row label="Family" tokens={tokens}>
          <Text as="span" size="sm">base — DM Sans body text</Text>
          <Text as="code" family="mono" size="sm">mono — const hello = 'world';</Text>
          <Text as="span" family="display" size="lg" weight="semibold">display — Unbounded heading</Text>
        </Row>
        <Row label="Truncate" tokens={tokens}>
          <Text as="span" truncate style={{ maxWidth: 180 }}>This text is truncated because it exceeds the max-width container</Text>
        </Row>
        <Row label="Style escape hatch" tokens={tokens}>
          <Text as="span" style={{ color: tokens.accentDefault }}>Accent via style</Text>
          <Text as="span" style={{ color: 'var(--lucent-success-text)' }}>Token var via style</Text>
          <Text as="span" color="secondary" style={{ fontStyle: 'italic' }}>Italic override</Text>
        </Row>
      </Section>

      {/* Input */}
      <Section title="Input" tokens={tokens} hidden={!showSection('Input')}>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
            <Input size="sm" placeholder="Small" />
            <Input size="md" placeholder="Medium (default)" />
            <Input size="lg" placeholder="Large" />
          </div>
        </Row>
        <Row label="Label + helper" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Input label="Email" type="email" placeholder="you@example.com" helperText="We'll never share your email." value={inputVal} onChange={e => setInputVal(e.target.value)} />
          </div>
        </Row>
        <Row label="Icons" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
            <Input leftElement={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>} placeholder="Search…" />
            <Input rightElement={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>} type="password" placeholder="Password" />
          </div>
        </Row>
        <Row label="Prefix / suffix" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
            <Input prefix="$" suffix="USD" placeholder="0.00" />
            <Input prefix="https://" suffix=".com" placeholder="yourdomain" />
            <Input suffix="kg" placeholder="Weight" />
          </div>
        </Row>
        <Row label="Error state" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Input label="Password" type="password" errorText="Must be at least 8 characters" defaultValue="short" />
          </div>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Input label="Username" disabled defaultValue="locked_user" />
          </div>
        </Row>
      </Section>

      {/* Textarea */}
      <Section title="Textarea" tokens={tokens} hidden={!showSection('Textarea')}>
        <Row label="Auto-resize" tokens={tokens}>
          <div style={{ width: 320 }}>
            <Textarea label="Bio" autoResize placeholder="Tell us about yourself…" value={textareaVal} onChange={e => setTextareaVal(e.target.value)} />
          </div>
        </Row>
        <Row label="With count" tokens={tokens}>
          <div style={{ width: 320 }}>
            <Textarea label="Tweet" maxLength={280} showCount value={textareaVal} onChange={e => setTextareaVal(e.target.value)} />
          </div>
        </Row>
        <Row label="Error + disabled" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 320 }}>
            <Textarea label="Notes" errorText="This field is required" />
            <Textarea label="Archived" disabled defaultValue="Read-only content here." />
          </div>
        </Row>
      </Section>

      {/* FormField */}
      <Section title="FormField" tokens={tokens} hidden={!showSection('FormField')}>
        <Row label="Basic" tokens={tokens}>
          <div style={{ width: 280 }}>
            <FormField label="Email address" htmlFor="ff-email">
              <Input id="ff-email" type="email" placeholder="you@example.com" />
            </FormField>
          </div>
        </Row>
        <Row label="Required + helper" tokens={tokens}>
          <div style={{ width: 280 }}>
            <FormField label="Username" htmlFor="ff-user" required helperText="Letters and numbers only, 3–20 chars">
              <Input id="ff-user" placeholder="yourname" />
            </FormField>
          </div>
        </Row>
        <Row label="Error state" tokens={tokens}>
          <div style={{ width: 280 }}>
            <FormField label="Password" htmlFor="ff-pw" required errorMessage="Must be at least 8 characters">
              <Input id="ff-pw" type="password" defaultValue="short" />
            </FormField>
          </div>
        </Row>
        <Row label="Wrapping Select" tokens={tokens}>
          <div style={{ width: 280 }}>
            <FormField label="Country" htmlFor="ff-country">
              <Select
                id="ff-country"
                placeholder="Choose a country"
                options={[
                  { value: 'us', label: 'United States' },
                  { value: 'gb', label: 'United Kingdom' },
                  { value: 'ca', label: 'Canada' },
                ]}
              />
            </FormField>
          </div>
        </Row>
      </Section>

      {/* SearchInput */}
      <Section title="SearchInput" tokens={tokens} hidden={!showSection('SearchInput')}>
        <Row label="With results dropdown" tokens={tokens}>
          <div style={{ width: 320 }}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search fruits…"
              results={searchResults}
              onResultSelect={(r) => { setSearchQuery(r.label); }}
            />
          </div>
        </Row>
        <Row label="Loading state" tokens={tokens}>
          <div style={{ width: 320 }}>
            <SearchInput value="pineapple" onChange={() => {}} isLoading />
          </div>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <div style={{ width: 320 }}>
            <SearchInput value="" onChange={() => {}} disabled placeholder="Search disabled…" />
          </div>
        </Row>
        <Row label="Filter mode" tokens={tokens}>
          <div style={{ width: 320 }}>
            <SearchInput mode="filter" value={filterQuery} onChange={setFilterQuery} placeholder="Filter items…" />
          </div>
        </Row>
        <Row label="Filter mode (disabled)" tokens={tokens}>
          <div style={{ width: 320 }}>
            <SearchInput mode="filter" value="" onChange={() => {}} disabled placeholder="Filter disabled…" />
          </div>
        </Row>
      </Section>

      {/* Card */}
      <Section title="Card" tokens={tokens} hidden={!showSection('Card')}>
        <Row label="Elevation hierarchy" tokens={tokens}>
          <Card variant="ghost" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">ghost</Text>
            <Text size="xs" color="secondary">Transparent, no border</Text>
          </Card>
          <Card variant="outline" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">outline</Text>
            <Text size="xs" color="secondary">Surface bg, border</Text>
          </Card>
          <Card variant="filled" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">filled</Text>
            <Text size="xs" color="secondary">Secondary surface, no border</Text>
          </Card>
          <Card variant="elevated" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">elevated</Text>
            <Text size="xs" color="secondary">Surface bg, shadow</Text>
          </Card>
        </Row>
        <Row label="Combo variant" tokens={tokens}>
          <Card
            variant="combo"
            style={{ width: 320 }}
            header={<Text weight="semibold" size="sm">Profile</Text>}
            footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: tokens.space2 }}>
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button variant="primary" size="sm">Update</Button>
              </div>
            }
          >
            <Text size="sm" color="secondary">
              Body uses primary surface. Header and footer recede into secondary surface.
            </Text>
          </Card>
        </Row>
        <Row label="Outline with header + footer" tokens={tokens}>
          <Card
            style={{ width: 280 }}
            header={<Text family="display" weight="semibold">Card title</Text>}
            footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: tokens.space2 }}>
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button variant="primary" size="sm">Save</Button>
              </div>
            }
          >
            <Text size="sm" color="secondary">Edit your profile information below.</Text>
          </Card>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Card variant="outline" padding="sm" radius="sm" style={{ width: 160 }}>
            <Text size="xs">sm / outline</Text>
          </Card>
          <Card variant="filled" padding="md" radius="md" style={{ width: 160 }}>
            <Text size="xs">md / filled</Text>
          </Card>
          <Card variant="elevated" padding="lg" radius="lg" style={{ width: 160 }}>
            <Text size="xs">lg / elevated</Text>
          </Card>
        </Row>
        <Row label="Interactive" tokens={tokens}>
          <Card variant="elevated" onClick={() => {}} style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Clickable card</Text>
            <Text size="xs" color="secondary">Hover, focus, press</Text>
          </Card>
          <Card variant="elevated" href="#" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Link card</Text>
            <Text size="xs" color="secondary">Renders as {'<a>'}</Text>
          </Card>
          <Card variant="elevated" onClick={() => {}} disabled style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Disabled</Text>
            <Text size="xs" color="secondary">No interaction</Text>
          </Card>
        </Row>
        <Row label="Status accent" tokens={tokens}>
          <Card status="success" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Success</Text>
          </Card>
          <Card status="warning" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Warning</Text>
          </Card>
          <Card status="danger" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Danger</Text>
          </Card>
          <Card status="info" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Info</Text>
          </Card>
        </Row>
        <Row label="Selectable" tokens={tokens}>
          <Card variant="elevated" selected={false} onClick={() => {}} style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Unselected</Text>
          </Card>
          <Card variant="elevated" selected onClick={() => {}} style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Selected</Text>
          </Card>
          <Card variant="outline" selected onClick={() => {}} style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Selected outline</Text>
          </Card>
        </Row>
        <Row label="Media slot" tokens={tokens}>
          <Card
            variant="elevated"
            style={{ width: 240 }}
            media={
              <div style={{ height: 120, background: `linear-gradient(135deg, ${tokens.accentDefault}, ${tokens.accentSubtle})` }} />
            }
          >
            <Text size="xs" weight="semibold">Hero card</Text>
            <Text size="xs" color="secondary">Full-bleed media at the top.</Text>
          </Card>
        </Row>
        <Row label="CardBleed" tokens={tokens}>
          <Card style={{ width: 320 }}>
            <Text weight="semibold" size="sm">Settings</Text>
            <CardBleed
              style={{
                borderTop: `1px solid ${tokens.borderDefault}`,
                borderBottom: `1px solid ${tokens.borderDefault}`,
                marginTop: tokens.space3,
                paddingTop: tokens.space3,
                paddingBottom: tokens.space3,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text size="sm">Email alerts</Text>
                <Toggle checked onChange={() => {}} />
              </div>
            </CardBleed>
            <CardBleed
              style={{
                borderBottom: `1px solid ${tokens.borderDefault}`,
                paddingTop: tokens.space3,
                paddingBottom: tokens.space3,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text size="sm">Push notifications</Text>
                <Toggle onChange={() => {}} />
              </div>
            </CardBleed>
            <div style={{ paddingTop: tokens.space3 }}>
              <Text size="xs" color="secondary">Bleed rows stretch edge-to-edge.</Text>
            </div>
          </Card>
        </Row>
      </Section>

      {/* Alert */}
      <Section title="Alert" tokens={tokens} hidden={!showSection('Alert')}>
        <Row label="All variants" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space3, width: '100%' }}>
            <Alert variant="info" title="Did you know?">You can customize the accent color using token overrides.</Alert>
            <Alert variant="success" title="Changes saved">Your profile has been updated successfully.</Alert>
            <Alert variant="warning" title="Approaching limit">You've used 80% of your monthly quota.</Alert>
            <Alert variant="danger" title="Payment failed" onDismiss={alertDismissed ? undefined : () => setAlertDismissed(true)}>
              {alertDismissed ? 'Dismissed! (re-renders on theme toggle)' : 'Check your card details and try again.'}
            </Alert>
          </div>
        </Row>
        <Row label="Body only (no title)" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <Alert variant="info">Your session expires in 5 minutes.</Alert>
          </div>
        </Row>
      </Section>

      {/* EmptyState */}
      <Section title="EmptyState" tokens={tokens} hidden={!showSection('EmptyState')}>
        <Row label="With illustration + CTA" tokens={tokens}>
          <Card style={{ width: 360 }}>
            <EmptyState
              illustration={
                <Icon size="xl">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx={11} cy={11} r={8} />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </Icon>
              }
              title="No results found"
              description="Try adjusting your search or filters to find what you're looking for."
              action={<Button variant="secondary" size="sm">Clear filters</Button>}
            />
          </Card>
        </Row>
        <Row label="Minimal (title only)" tokens={tokens}>
          <Card style={{ width: 280 }}>
            <EmptyState title="Nothing here yet" />
          </Card>
        </Row>
      </Section>

      {/* Skeleton */}
      <Section title="Skeleton" tokens={tokens} hidden={!showSection('Skeleton')}>
        <Row label="Text lines" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Skeleton variant="text" lines={3} />
          </div>
        </Row>
        <Row label="Shapes" tokens={tokens}>
          <Skeleton variant="circle" width={40} height={40} />
          <Skeleton variant="rectangle" width={120} height={40} />
          <Skeleton variant="text" width={160} />
        </Row>
        <Row label="Card placeholder" tokens={tokens}>
          <Card style={{ width: 280 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space3 }}>
              <Skeleton variant="rectangle" height={120} />
              <div style={{ display: 'flex', gap: tokens.space2, alignItems: 'center' }}>
                <Skeleton variant="circle" width={32} height={32} />
                <Skeleton variant="text" width="60%" />
              </div>
              <Skeleton variant="text" lines={2} />
            </div>
          </Card>
        </Row>
        <Row label="No animation" tokens={tokens}>
          <Skeleton variant="rectangle" width={200} height={32} animate={false} />
        </Row>
      </Section>

      <Divider style={{ marginBottom: tokens.space6 }} />

      {/* ── Wave 2 ── */}

      {/* Checkbox */}
      <Section title="Checkbox" tokens={tokens} hidden={!showSection('Checkbox')}>
        <Row label="States" tokens={tokens}>
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Indeterminate" indeterminate />
        </Row>
        <Row label="Controlled" tokens={tokens}>
          <Checkbox label="Accept terms" checked={checked} onChange={e => setChecked(e.target.checked)} />
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Checkbox size="sm" label="Small" defaultChecked />
          <Checkbox size="md" label="Medium" defaultChecked />
          <Checkbox size="lg" label="Large" defaultChecked />
        </Row>
        <Row label="With helper text" tokens={tokens}>
          <Checkbox label="Marketing emails" helperText="Receive occasional updates about new features" defaultChecked />
          <Checkbox label="Analytics" helperText="Help us improve by sharing anonymous usage data" />
        </Row>
        <Row label="Contained" tokens={tokens}>
          <Checkbox label="Free plan" helperText="Up to 3 projects, 1 GB storage" contained />
          <Checkbox label="Pro plan" helperText="Unlimited projects, 100 GB storage" contained defaultChecked />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <Checkbox label="Disabled off" disabled />
          <Checkbox label="Disabled checked" disabled defaultChecked />
          <Checkbox label="Disabled indeterminate" disabled indeterminate />
        </Row>
      </Section>

      {/* Radio */}
      <Section title="Radio" tokens={tokens} hidden={!showSection('Radio')}>
        <Row label="Vertical group (default)" tokens={tokens}>
          <RadioGroup name="plan" value={radio} onChange={setRadio}>
            <Radio value="option1" label="Free — up to 3 projects" />
            <Radio value="option2" label="Pro — unlimited projects" />
            <Radio value="option3" label="Enterprise — custom limits" />
          </RadioGroup>
        </Row>
        <Row label="Horizontal group" tokens={tokens}>
          <RadioGroup name="size-demo" value={radioSize} onChange={setRadioSize} orientation="horizontal">
            <Radio value="s" label="S" />
            <Radio value="m" label="M" />
            <Radio value="l" label="L" />
            <Radio value="xl" label="XL" />
          </RadioGroup>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <RadioGroup name="size-preview" value="a" onChange={() => {}} orientation="horizontal">
            <Radio size="sm" value="a" label="Small" />
          </RadioGroup>
          <RadioGroup name="size-preview-md" value="a" onChange={() => {}} orientation="horizontal">
            <Radio size="md" value="a" label="Medium" />
          </RadioGroup>
          <RadioGroup name="size-preview-lg" value="a" onChange={() => {}} orientation="horizontal">
            <Radio size="lg" value="a" label="Large" />
          </RadioGroup>
        </Row>
        <Row label="Contained" tokens={tokens}>
          <RadioGroup name="contained-demo" value="pro" onChange={() => {}}>
            <Radio value="free" label="Free plan" helperText="Up to 3 projects, 1 GB storage" contained />
            <Radio value="pro" label="Pro plan" helperText="Unlimited projects, 100 GB storage" contained />
          </RadioGroup>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <RadioGroup name="disabled-off" value="" onChange={() => {}} disabled>
            <Radio value="a" label="Disabled unselected" />
          </RadioGroup>
          <RadioGroup name="disabled-on" value="a" onChange={() => {}} disabled>
            <Radio value="a" label="Disabled selected" />
          </RadioGroup>
        </Row>
      </Section>

      {/* Toggle */}
      <Section title="Toggle" tokens={tokens} hidden={!showSection('Toggle')}>
        <Row label="States" tokens={tokens}>
          <Toggle label="Off" />
          <Toggle label="On" defaultChecked />
        </Row>
        <Row label="Controlled" tokens={tokens}>
          <Toggle label="Dark mode" checked={toggled} onChange={e => setToggled(e.target.checked)} />
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Toggle size="sm" label="Small" defaultChecked />
          <Toggle size="md" label="Medium" defaultChecked />
          <Toggle size="lg" label="Large" defaultChecked />
        </Row>
        <Row label="With helper text" tokens={tokens}>
          <Toggle label="Notifications" helperText="Receive email alerts for new activity" defaultChecked />
          <Toggle label="Auto-save" helperText="Save changes automatically every 30 seconds" />
        </Row>
        <Row label="Contained" tokens={tokens}>
          <Toggle label="Dark mode" helperText="Use dark colour scheme across the app" contained defaultChecked />
          <Toggle label="Compact view" helperText="Reduce spacing for denser layouts" contained />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <Toggle disabled label="Disabled off" />
          <Toggle disabled defaultChecked label="Disabled on" />
        </Row>
      </Section>

      {/* Slider */}
      <Section title="Slider" tokens={tokens} hidden={!showSection('Slider')}>
        <Row label="Controlled" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Slider label="Volume" showValue value={sliderValue} onChange={e => setSliderValue(Number(e.target.value))} />
          </div>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-4)' }}>
            <Slider size="sm" label="Small" showValue defaultValue={30} />
            <Slider size="md" label="Medium" showValue defaultValue={50} />
            <Slider size="lg" label="Large" showValue defaultValue={70} />
          </div>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Slider label="Locked" disabled defaultValue={40} showValue />
          </div>
        </Row>
      </Section>

      {/* Progress */}
      <Section title="Progress" tokens={tokens} hidden={!showSection('Progress')}>
        <Row label="Basic" tokens={tokens}>
          <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-4)' }}>
            <Progress value={60} label />
            <Progress value={30} variant="success" label />
            <Progress value={75} variant="warning" label />
            <Progress value={90} variant="danger" label />
          </div>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-4)' }}>
            <Progress size="sm" value={50} label />
            <Progress size="md" value={50} label />
            <Progress size="lg" value={50} label />
          </div>
        </Row>
        <Row label="Thresholds (ascending)" tokens={tokens}>
          <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-4)' }}>
            <Progress value={40} warnAt={60} dangerAt={85} label />
            <Progress value={72} warnAt={60} dangerAt={85} label />
            <Progress value={92} warnAt={60} dangerAt={85} label />
          </div>
        </Row>
        <Row label="Thresholds (descending)" tokens={tokens}>
          <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-4)' }}>
            <Progress value={80} warnAt={30} dangerAt={10} label />
            <Progress value={22} warnAt={30} dangerAt={10} label />
            <Progress value={5} warnAt={30} dangerAt={10} label />
          </div>
        </Row>
        <Row label="Custom label" tokens={tokens}>
          <div style={{ width: 320 }}>
            <Progress value={3} max={5} label={<span>3 of 5 tasks</span>} />
          </div>
        </Row>
      </Section>

      {/* Stepper */}
      <Section title="Stepper" tokens={tokens} hidden={!showSection('Stepper')}>
        <Row label="Horizontal — basic" tokens={tokens}>
          <div style={{ width: 400 }}>
            <Stepper steps={['Profile', 'Preferences', 'Confirm']} current={1} />
          </div>
        </Row>
        <Row label="Horizontal — numbered + status" tokens={tokens}>
          <div style={{ width: 480 }}>
            <Stepper steps={['Basic Details', 'Company Details', 'Subscription', 'Payment']} current={2} numbered showStatus />
          </div>
        </Row>
        <Row label="Horizontal — completed" tokens={tokens}>
          <div style={{ width: 400 }}>
            <Stepper steps={['Cart', 'Shipping', 'Payment']} current={2} showStatus />
          </div>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-6)' }}>
            <Stepper steps={['Step 1', 'Step 2', 'Step 3']} current={1} size="sm" />
            <Stepper steps={['Step 1', 'Step 2', 'Step 3']} current={1} size="md" />
            <Stepper steps={['Step 1', 'Step 2', 'Step 3']} current={1} size="lg" />
          </div>
        </Row>
        <Row label="Vertical — numbered + status" tokens={tokens}>
          <Stepper
            orientation="vertical"
            numbered
            showStatus
            size="lg"
            current={1}
            steps={[
              { label: 'Basic Details', description: 'Name, email, and contact info' },
              { label: 'Company Details', description: 'Organization and team size' },
              { label: 'Subscription Plan', description: 'Choose your plan and billing' },
              { label: 'Payment Details', description: 'Card information and billing address' },
            ]}
          />
        </Row>
        <Row label="Vertical — simple" tokens={tokens}>
          <Stepper
            orientation="vertical"
            current={2}
            steps={['Cart', 'Shipping', 'Payment', 'Done']}
          />
        </Row>
      </Section>

      {/* CodeBlock */}
      <Section title="CodeBlock" tokens={tokens} hidden={!showSection('CodeBlock')}>
        <Row label="Single snippet" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <CodeBlock
              language="tsx"
              code={`import { Button } from 'lucent-ui';\n\nexport function App() {\n  return <Button variant="primary">Save changes</Button>;\n}`}
            />
          </div>
        </Row>
        <Row label="Tabbed (package manager)" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <CodeBlock
              tabs={[
                { label: 'pnpm', code: 'pnpm add lucent-ui', language: 'bash' },
                { label: 'npm',  code: 'npm install lucent-ui', language: 'bash' },
                { label: 'yarn', code: 'yarn add lucent-ui', language: 'bash' },
                { label: 'bun',  code: 'bun add lucent-ui', language: 'bash' },
              ]}
            />
          </div>
        </Row>
        <Row label="AI prompt (variant=prompt)" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <CodeBlock
              variant="prompt"
              helperText="Paste this into a Claude conversation or claude.ai:"
              tabs={[
                {
                  label: 'Claude',
                  icon: '♦',
                  code: '"Add a Button from lucent-ui with variant=\\"primary\\". It should trigger form submission and show a loading state while the request is in flight."',
                },
                {
                  label: 'Cursor',
                  icon: '↖',
                  code: '@lucent-ui Add a primary Button with an onClick handler that triggers form submission and shows a loading spinner.',
                },
                {
                  label: 'VS Code',
                  icon: '↺',
                  code: 'Use lucent-ui Button component: variant="primary", loading state tied to form submit handler.',
                },
              ]}
            />
          </div>
        </Row>
        <Row label="No copy button" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <CodeBlock showCopyButton={false} language="bash" code="npm install lucent-ui" />
          </div>
        </Row>
        <Row label="Minimal" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <CodeBlock minimal code="import { Button } from 'lucent-ui'" />
          </div>
        </Row>
        <Row label="Wrap (code)" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <CodeBlock
              wrap
              language="tsx"
              code={`export const VERY_LONG_DESCRIPTION = "This is a deliberately long string that would normally cause horizontal scrolling in a code block, but with the wrap prop enabled it will instead break onto multiple lines so the full content is visible without scrolling.";`}
            />
          </div>
        </Row>
        <Row label="Wrap (prompt)" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <CodeBlock
              variant="prompt"
              wrap
              helperText="Paste into Claude:"
              code="Add a Button from lucent-ui with variant=&quot;primary&quot;. It should trigger form submission and show a loading state while the request is in flight."
            />
          </div>
        </Row>
      </Section>

      {/* Table */}
      <Section title="Table" tokens={tokens} hidden={!showSection('Table')}>
        <Row label="Basic" tokens={tokens}>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell as="th">Prop</Table.Cell>
                <Table.Cell as="th">Type</Table.Cell>
                <Table.Cell as="th">Default</Table.Cell>
                <Table.Cell as="th">Description</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {[
                ['variant', '"primary" | "secondary" | "outline" | "ghost" | "danger"', '"primary"', 'Visual style of the button'],
                ['size', '"sm" | "md" | "lg"', '"md"', 'Controls height and padding'],
                ['disabled', 'boolean', 'false', 'Prevents interaction'],
                ['loading', 'boolean', 'false', 'Shows a spinner, disables click'],
              ].map(([prop, type, def, desc]) => (
                <Table.Row key={prop}>
                  <Table.Cell style={{ fontFamily: 'var(--lucent-font-family-mono)', fontSize: 'var(--lucent-font-size-xs)' }}>{prop}</Table.Cell>
                  <Table.Cell style={{ fontFamily: 'var(--lucent-font-family-mono)', fontSize: 'var(--lucent-font-size-xs)', color: 'var(--lucent-text-secondary)' }}>{type}</Table.Cell>
                  <Table.Cell style={{ fontFamily: 'var(--lucent-font-family-mono)', fontSize: 'var(--lucent-font-size-xs)' }}>{def}</Table.Cell>
                  <Table.Cell>{desc}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Row>
        <Row label="Striped" tokens={tokens}>
          <Table striped>
            <Table.Head>
              <Table.Row>
                <Table.Cell as="th">Name</Table.Cell>
                <Table.Cell as="th">Role</Table.Cell>
                <Table.Cell as="th">Status</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {[
                ['Alice', 'Engineer', 'Active'],
                ['Bob', 'Designer', 'Away'],
                ['Carol', 'Product', 'Active'],
                ['Dan', 'Engineer', 'Active'],
              ].map(([name, role, status]) => (
                <Table.Row key={name}>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>{role}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={status === 'Active' ? 'success' : 'neutral'}>{status}</Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Row>
      </Section>

      {/* ColorSwatch */}
      <Section title="ColorSwatch" tokens={tokens} hidden={!showSection('ColorSwatch')}>
        <Row label="Circle sizes" tokens={tokens}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map(s => (
              <ColorSwatch key={s} color="#3b82f6" size={s} shape="circle" />
            ))}
          </div>
        </Row>
        <Row label="Square sizes" tokens={tokens}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map(s => (
              <ColorSwatch key={s} color="#8b5cf6" size={s} shape="square" />
            ))}
          </div>
        </Row>
        <Row label="Selected" tokens={tokens}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#8b5cf6'].map((c, i) => (
              <ColorSwatch key={c} color={c} selected={i === 3} onClick={() => {}} />
            ))}
          </div>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <div style={{ display: 'flex', gap: 8 }}>
            <ColorSwatch color="#3b82f6" disabled />
            <ColorSwatch color="#22c55e" disabled selected />
          </div>
        </Row>
      </Section>

      {/* ColorPicker */}
      <Section title="ColorPicker" tokens={tokens} hidden={!showSection('ColorPicker')}>
        <Row label="Default" tokens={tokens}>
          <ColorPickerDemo />
        </Row>
        <Row label="Multiple groups" tokens={tokens}>
          <ColorPickerDemo presetGroups={[
            { label: 'Brand', colors: ['#111827', '#3b82f6', '#8b5cf6', '#ec4899'] },
            { label: 'Semantic', colors: ['#22c55e', '#f59e0b', '#ef4444', '#0ea5e9'] },
          ]} />
        </Row>
        <Row label="No presets" tokens={tokens}>
          <ColorPickerDemo presetGroups={[]} />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <ColorPicker value="#6b7280" disabled label="Theme color" />
        </Row>
      </Section>

      {/* SegmentedControl */}
      <Section title="SegmentedControl" tokens={tokens} hidden={!showSection('SegmentedControl')}>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 320 }}>
            <SegmentedControl size="sm" defaultValue="grid" options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'table', label: 'Table' }]} />
            <SegmentedControl size="md" defaultValue="grid" options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'table', label: 'Table' }]} />
            <SegmentedControl size="lg" defaultValue="grid" options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'table', label: 'Table' }]} />
          </div>
        </Row>
        <Row label="4 options" tokens={tokens}>
          <div style={{ width: 320 }}>
            <SegmentedControl defaultValue="day" options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }, { value: 'year', label: 'Year' }]} />
          </div>
        </Row>
        <Row label="Inline (fit-content)" tokens={tokens}>
          <SegmentedControl fullWidth={false} defaultValue="a" options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }, { value: 'c', label: 'Gamma' }]} />
        </Row>
        <Row label="Disabled option" tokens={tokens}>
          <div style={{ width: 280 }}>
            <SegmentedControl defaultValue="a" options={[{ value: 'a', label: 'Active' }, { value: 'b', label: 'Disabled', disabled: true }, { value: 'c', label: 'Normal' }]} />
          </div>
        </Row>
        <Row label="All disabled" tokens={tokens}>
          <div style={{ width: 280 }}>
            <SegmentedControl disabled defaultValue="hex" options={[{ value: 'hex', label: 'Hex' }, { value: 'rgb', label: 'RGB' }, { value: 'hsl', label: 'HSL' }]} />
          </div>
        </Row>
      </Section>

      {/* Select */}
      <Section title="Select" tokens={tokens} hidden={!showSection('Select')}>
        <Row label="Default" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Select
              label="Country"
              placeholder="Choose a country"
              options={[
                { value: 'us', label: 'United States' },
                { value: 'gb', label: 'United Kingdom' },
                { value: 'ca', label: 'Canada' },
                { value: 'au', label: 'Australia' },
              ]}
              value={selectVal}
              onChange={e => setSelectVal(e.target.value)}
            />
          </div>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          {(['sm', 'md', 'lg'] as const).map(s => (
            <div key={s} style={{ width: 180 }}>
              <Select
                size={s}
                options={[{ value: 'a', label: `Size ${s}` }, { value: 'b', label: 'Option B' }]}
                defaultValue="a"
              />
            </div>
          ))}
        </Row>
        <Row label="With error" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Select
              label="Role"
              placeholder="Select a role"
              options={[{ value: 'admin', label: 'Admin' }, { value: 'member', label: 'Member' }]}
              errorText="Please select a role to continue"
            />
          </div>
        </Row>
      </Section>

      {/* Chip */}
      <Section title="Chip" tokens={tokens} hidden={!showSection('Chip')}>
        <Row label="Dismissible" tokens={tokens}>
          {tags.map(t => (
            <Chip key={t} onDismiss={() => setTags(prev => prev.filter(x => x !== t))}>{t}</Chip>
          ))}
          {tags.length === 0 && <span style={{ fontSize: tokens.fontSizeSm, color: tokens.textSecondary }}>All chips dismissed — refresh to reset</span>}
        </Row>
        <Row label="Variants" tokens={tokens}>
          <Chip variant="neutral">Neutral</Chip>
          <Chip variant="accent">Accent</Chip>
          <Chip variant="success">Success</Chip>
          <Chip variant="warning">Warning</Chip>
          <Chip variant="danger">Danger</Chip>
          <Chip variant="info">Info</Chip>
        </Row>
        <Row label="With dot" tokens={tokens}>
          <Chip variant="success" dot>Online</Chip>
          <Chip variant="danger" dot>Offline</Chip>
          <Chip variant="neutral" dot>Suspended</Chip>
        </Row>
        <Row label="Pulse" tokens={tokens}>
          <Chip variant="success" dot pulse>Running</Chip>
          <Chip variant="warning" dot pulse>Deploying</Chip>
          <Chip variant="danger" dot pulse>Live incident</Chip>
          <Chip variant="info" dot pulse>Syncing</Chip>
        </Row>
        <Row label="Ghost" tokens={tokens}>
          <Chip variant="success" ghost dot>Online</Chip>
          <Chip variant="danger" ghost dot>Offline</Chip>
          <Chip variant="warning" ghost dot>Away</Chip>
          <Chip variant="neutral" ghost dot>Idle</Chip>
        </Row>
        <Row label="Ghost + Pulse" tokens={tokens}>
          <Chip variant="success" ghost dot pulse>Running</Chip>
          <Chip variant="warning" ghost dot pulse>Deploying</Chip>
          <Chip variant="danger" ghost dot pulse>Live incident</Chip>
          <Chip variant="info" ghost dot pulse>Syncing</Chip>
        </Row>
        <Row label="Dot only" tokens={tokens}>
          <Chip variant="success" dot />
          <Chip variant="danger" dot />
          <Chip variant="warning" dot />
          <Chip variant="info" dot />
        </Row>
        <Row label="Dot only + Pulse" tokens={tokens}>
          <Chip variant="success" dot pulse />
          <Chip variant="danger" dot pulse />
          <Chip variant="warning" dot pulse />
          <Chip variant="info" dot pulse />
        </Row>
        <Row label="With swatch" tokens={tokens}>
          <Chip swatch="#6366f1" onDismiss={() => {}}>Indigo</Chip>
          <Chip swatch="#10b981" onDismiss={() => {}}>Emerald</Chip>
          <Chip swatch="#f43f5e" onDismiss={() => {}}>Rose</Chip>
        </Row>
        <Row label="With icon" tokens={tokens}>
          <Chip leftIcon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4l5-3 5 3v5a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" /></svg>} onDismiss={() => {}}>Folders</Chip>
          <Chip leftIcon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="1" width="8" height="10" rx="1" /><path d="M4 4h4M4 6h4M4 8h2" /></svg>} onDismiss={() => {}}>Files</Chip>
        </Row>
        <Row label="Borderless" tokens={tokens}>
          <Chip variant="success" borderless>New</Chip>
          <Chip variant="warning" borderless>Pending</Chip>
          <Chip variant="neutral" borderless>Active</Chip>
          <Chip variant="danger" borderless>Closed</Chip>
        </Row>
        <Row label="Clickable" tokens={tokens}>
          <Chip variant="accent" onClick={() => {}}>UX</Chip>
          <Chip variant="accent" onClick={() => {}}>UI</Chip>
          <Chip variant="accent" onClick={() => {}}>Motion</Chip>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Chip size="sm" onDismiss={() => {}}>Small</Chip>
          <Chip size="md" onDismiss={() => {}}>Medium</Chip>
          <Chip size="lg" onDismiss={() => {}}>Large</Chip>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <Chip disabled onDismiss={() => {}}>Disabled</Chip>
          <Chip disabled variant="accent">Disabled accent</Chip>
        </Row>
      </Section>

      {/* Tooltip */}
      <Section title="Tooltip" tokens={tokens} hidden={!showSection('Tooltip')}>
        <Row label="Placements" tokens={tokens}>
          <Tooltip content="Tooltip on top" placement="top">
            <Button variant="secondary" size="sm">Top</Button>
          </Tooltip>
          <Tooltip content="Tooltip on bottom" placement="bottom">
            <Button variant="secondary" size="sm">Bottom</Button>
          </Tooltip>
          <Tooltip content="Tooltip on left" placement="left">
            <Button variant="secondary" size="sm">Left</Button>
          </Tooltip>
          <Tooltip content="Tooltip on right" placement="right">
            <Button variant="secondary" size="sm">Right</Button>
          </Tooltip>
        </Row>
        <Row label="No delay" tokens={tokens}>
          <Tooltip content="Instant tooltip" delay={0}>
            <Button variant="ghost" size="sm">Hover me (instant)</Button>
          </Tooltip>
        </Row>
      </Section>

      {/* Icon */}
      <Section title="Icon" tokens={tokens} hidden={!showSection('Icon')}>
        <Row label="Sizes" tokens={tokens}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(s => (
            <Tooltip key={s} content={s} delay={0}>
              <Icon size={s} label={`${s} icon`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx={12} cy={12} r={10} />
                  <path d="M12 8v4l3 3" />
                </svg>
              </Icon>
            </Tooltip>
          ))}
        </Row>
        <Row label="Coloured" tokens={tokens}>
          <Icon size="lg" color="var(--lucent-success-default)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </Icon>
          <Icon size="lg" color="var(--lucent-danger-default)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10} /><path d="M15 9l-6 6M9 9l6 6" /></svg>
          </Icon>
          <Icon size="lg" color="var(--lucent-warning-default)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1={12} y1={9} x2={12} y2={13} /><line x1={12} y1={17} x2="12.01" y2={17} /></svg>
          </Icon>
        </Row>
      </Section>

      <Divider style={{ marginBottom: tokens.space6 }} />

      {/* ── Wave 1 ── */}

      {/* Button */}
      <Section title="Button" tokens={tokens} hidden={!showSection('Button')}>
        <Row label="Variants" tokens={tokens}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="danger-outline">Danger outline</Button>
          <Button variant="danger-ghost">Danger ghost</Button>
        </Row>
        <Row label="Pressed" tokens={tokens}>
          {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((v) => (
            <Button key={v} variant={v} disableHoverStyles style={{ transform: 'translateY(1px)', boxShadow: `0 0 0 2px var(--lucent-surface), 0 0 0 4px ${v === 'danger' ? 'var(--lucent-danger-default)' : 'var(--lucent-accent-default)'}` }}>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
          ))}
        </Row>
        <Row label="Disabled" tokens={tokens}>
          {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((v) => (
            <Button key={v} variant={v} disabled>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
          ))}
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Button size="2xs">Tiny</Button>
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="2xs icon-only" tokens={tokens}>
          <Button size="2xs" variant="ghost" leftIcon={<SmallIcon d="M6 9l6 6 6-6" />} aria-label="Expand" />
          <Button size="2xs" variant="ghost" leftIcon={<SmallIcon d="M4 12h16M12 4v16" />} aria-label="Add" />
          <Button size="2xs" variant="ghost" leftIcon={<SmallIcon d="M23 4l-6.5 17L13 12 2 8.5z" />} aria-label="Send" />
          <Button size="2xs" variant="outline" leftIcon={<SmallIcon d="M1 4v6h6M23 20v-6h-6" />} aria-label="Refresh" />
          <Button size="2xs" variant="outline" leftIcon={<SmallIcon d="M18 6L6 18M6 6l12 12" />} aria-label="Close" />
          <Button size="2xs" variant="secondary" leftIcon={<SmallIcon d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" />} aria-label="Edit" />
          <Button size="2xs" variant="danger" leftIcon={<SmallIcon d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />} aria-label="Delete" />
          <Button size="2xs" variant="danger-outline" leftIcon={<SmallIcon d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />} aria-label="Warn" />
          <Button size="2xs" variant="danger-ghost" leftIcon={<SmallIcon d="M18 6L6 18M6 6l12 12" />} aria-label="Remove" />
        </Row>
        <Row label="Icons" tokens={tokens}>
          <Button leftIcon={<StarIcon />}>With prefix</Button>
          <Button variant="outline" rightIcon={<StarIcon />}>With suffix</Button>
          <Button variant="outline" chevron>Dropdown</Button>
          <Button leftIcon={<StarIcon />} chevron>Both</Button>
        </Row>
        <Row label="With swatches" tokens={tokens}>
          <Button size="xs" variant="outline" leftIcon={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', border: '1px solid rgba(0,0,0,0.1)' }} />}>Indigo</Button>
          <Button size="xs" variant="outline" leftIcon={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', border: '1px solid rgba(0,0,0,0.1)' }} />}>Emerald</Button>
          <Button size="xs" variant="outline" leftIcon={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e', border: '1px solid rgba(0,0,0,0.1)' }} />}>Rose</Button>
          <Button size="sm" variant="outline" leftIcon={<span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0ea5e9', border: '1px solid rgba(0,0,0,0.1)' }} />}>Ocean</Button>
          <Button size="sm" variant="primary" leftIcon={<span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e9c96b', border: '1px solid rgba(0,0,0,0.1)' }} />}>Brand</Button>
        </Row>
        <Row label="States" tokens={tokens}>
          <Button loading>Loading</Button>
          <Button variant="primary" fullWidth>Full width</Button>
        </Row>
      </Section>

      {/* SplitButton */}
      <Section title="SplitButton" tokens={tokens} hidden={!showSection('SplitButton')}>
        <StackAtom gap="2">
          <span style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, fontFamily: tokens.fontFamilyMono, letterSpacing: tokens.letterSpacingWide, textTransform: 'uppercase' }}>Variants</span>
          <RowAtom gap="5" wrap>
            {(['primary', 'secondary', 'outline', 'ghost', 'danger', 'danger-outline', 'danger-ghost'] as const).map((v) => (
              <SplitButton key={v} variant={v} onClick={() => alert(`${v} primary`)} menuItems={[{ label: 'Alternative A', onSelect: () => alert('A') }, { label: 'Alternative B', onSelect: () => alert('B') }]}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </SplitButton>
            ))}
          </RowAtom>
        </StackAtom>
        <StackAtom gap="2">
          <span style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, fontFamily: tokens.fontFamilyMono, letterSpacing: tokens.letterSpacingWide, textTransform: 'uppercase' }}>Sizes</span>
          <RowAtom gap="5" wrap>
            {(['2xs', 'xs', 'sm', 'md', 'lg'] as const).map((s) => (
              <SplitButton key={s} size={s} onClick={() => {}} menuItems={[{ label: 'Option', onSelect: () => {} }]}>
                {s}
              </SplitButton>
            ))}
          </RowAtom>
        </StackAtom>
        <StackAtom gap="2">
          <span style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, fontFamily: tokens.fontFamilyMono, letterSpacing: tokens.letterSpacingWide, textTransform: 'uppercase' }}>Bordered ghost</span>
          <RowAtom gap="5" wrap>
            <SplitButton variant="ghost" size="2xs" bordered onClick={() => {}} menuItems={[{ label: 'Reset layout', onSelect: () => {} }]}>Collapse all</SplitButton>
            <SplitButton variant="ghost" size="sm" bordered onClick={() => {}} menuItems={[{ label: 'Export config', onSelect: () => {} }]}>Options</SplitButton>
            <SplitButton variant="outline" size="sm" onClick={() => {}} menuItems={[{ label: 'Save as draft', onSelect: () => {} }, { label: 'Discard', onSelect: () => {}, danger: true }]}>Save</SplitButton>
          </RowAtom>
        </StackAtom>
        <StackAtom gap="2">
          <span style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, fontFamily: tokens.fontFamilyMono, letterSpacing: tokens.letterSpacingWide, textTransform: 'uppercase' }}>With icons</span>
          <RowAtom gap="5" wrap>
            <SplitButton leftIcon={<StarIcon />} onClick={() => {}} menuItems={[{ label: 'Save as draft', onSelect: () => {}, icon: <SmallIcon d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /> }, { label: 'Export', onSelect: () => {}, icon: <SmallIcon d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /> }]}>Save</SplitButton>
            <SplitButton variant="outline" leftIcon={<SmallIcon d="M12 19V5M5 12l7-7 7 7" />} onClick={() => {}} menuItems={[{ label: 'Deploy to staging', onSelect: () => {}, icon: <SmallIcon d="M22 12h-4l-3 9L9 3l-3 9H2" /> }, { label: 'Rollback', onSelect: () => {}, danger: true, icon: <SmallIcon d="M1 4v6h6M23 20v-6h-6" /> }]}>Deploy</SplitButton>
            <SplitButton variant="danger" leftIcon={<SmallIcon d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />} onClick={() => {}} menuItems={[{ label: 'Move to trash', onSelect: () => {}, icon: <SmallIcon d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /> }, { label: 'Delete forever', onSelect: () => {}, danger: true, icon: <SmallIcon d="M18 6L6 18M6 6l12 12" /> }]}>Delete</SplitButton>
          </RowAtom>
        </StackAtom>
        <StackAtom gap="2">
          <span style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, fontFamily: tokens.fontFamilyMono, letterSpacing: tokens.letterSpacingWide, textTransform: 'uppercase' }}>Disabled & loading</span>
          <RowAtom gap="5" wrap>
            <SplitButton disabled onClick={() => {}} menuItems={[{ label: 'Nope', onSelect: () => {} }]}>Disabled</SplitButton>
            <SplitButton loading onClick={() => {}} menuItems={[{ label: 'Nope', onSelect: () => {} }]}>Loading</SplitButton>
            <SplitButton variant="outline" disabled onClick={() => {}} menuItems={[{ label: 'Nope', onSelect: () => {} }]}>Outline disabled</SplitButton>
          </RowAtom>
        </StackAtom>
      </Section>

      {/* ButtonGroup */}
      <Section title="ButtonGroup" tokens={tokens} hidden={!showSection('ButtonGroup')}>
        <Row label="Outline toolbar" tokens={tokens}>
          <ButtonGroup>
            <Button variant="outline" leftIcon={<SmallIcon d="M6 4h8a4 4 0 010 8H6z" />} aria-label="Bold" />
            <Button variant="outline" leftIcon={<SmallIcon d="M19 4h-9M14 20H5M15 4L9 20" />} aria-label="Italic" />
            <Button variant="outline" leftIcon={<SmallIcon d="M6 3v7a6 6 0 0012 0V3M4 21h16" />} aria-label="Underline" />
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Center</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
        </Row>
        <Row label="Ghost toolbar" tokens={tokens}>
          <ButtonGroup>
            <Button variant="ghost" leftIcon={<SmallIcon d="M6 4h8a4 4 0 010 8H6z" />} aria-label="Bold" />
            <Button variant="ghost" leftIcon={<SmallIcon d="M19 4h-9M14 20H5M15 4L9 20" />} aria-label="Italic" />
            <Button variant="ghost" leftIcon={<SmallIcon d="M6 3v7a6 6 0 0012 0V3M4 21h16" />} aria-label="Underline" />
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="ghost">Left</Button>
            <Button variant="ghost">Center</Button>
            <Button variant="ghost">Right</Button>
          </ButtonGroup>
        </Row>
        <Row label="Ghost xs" tokens={tokens}>
          <ButtonGroup>
            <Button variant="ghost" size="xs" leftIcon={<SmallIcon d="M6 4h8a4 4 0 010 8H6z" />} aria-label="Bold" />
            <Button variant="ghost" size="xs" leftIcon={<SmallIcon d="M19 4h-9M14 20H5M15 4L9 20" />} aria-label="Italic" />
            <Button variant="ghost" size="xs" leftIcon={<SmallIcon d="M6 3v7a6 6 0 0012 0V3M4 21h16" />} aria-label="Underline" />
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="ghost" size="xs">Left</Button>
            <Button variant="ghost" size="xs">Center</Button>
            <Button variant="ghost" size="xs">Right</Button>
          </ButtonGroup>
        </Row>
        <Row label="Mixed variants" tokens={tokens}>
          <ButtonGroup>
            <Button variant="primary">Save</Button>
            <Button variant="outline">Cancel</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="secondary">Edit</Button>
            <Button variant="secondary">Duplicate</Button>
            <Button variant="danger-outline">Delete</Button>
          </ButtonGroup>
        </Row>
        <Row label="With SplitButton" tokens={tokens}>
          <ButtonGroup>
            <SplitButton onClick={() => {}} menuItems={[{ label: 'Deploy to staging', onSelect: () => {} }]}>Deploy</SplitButton>
            <Button variant="outline">Logs</Button>
          </ButtonGroup>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <ButtonGroup>
            <Button variant="outline" size="xs">A</Button>
            <Button variant="outline" size="xs">B</Button>
            <Button variant="outline" size="xs">C</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="sm">A</Button>
            <Button variant="outline" size="sm">B</Button>
            <Button variant="outline" size="sm">C</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="md">A</Button>
            <Button variant="outline" size="md">B</Button>
            <Button variant="outline" size="md">C</Button>
          </ButtonGroup>
        </Row>
      </Section>

      {/* Input */}
      {/* Badge */}
      {/* Badge — replaced by Chip, kept for backward compat */}

      {/* Avatar */}
      <Section title="Avatar" tokens={tokens} hidden={!showSection('Avatar')}>
        <Row label="With image" tokens={tokens}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(s => (
            <Avatar key={s} src="https://i.pravatar.cc/150?img=3" alt="Jane Doe" size={s} />
          ))}
        </Row>
        <Row label="Initials fallback" tokens={tokens}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(s => (
            <Avatar key={s} alt="Jane Doe" size={s} />
          ))}
        </Row>
      </Section>

      {/* Spinner */}
      <Section title="Spinner" tokens={tokens} hidden={!showSection('Spinner')}>
        <Row label="Sizes" tokens={tokens}>
          <Spinner size="xs" />
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Row>
      </Section>

      {/* Divider */}
      <Section title="Divider" tokens={tokens} hidden={!showSection('Divider')}>
        <Row label="Horizontal" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <p style={{ margin: `0 0 ${tokens.space2}`, color: tokens.textSecondary, fontSize: tokens.fontSizeSm }}>Content above</p>
            <Divider spacing="var(--lucent-space-4)" />
            <p style={{ margin: `${tokens.space2} 0 0`, color: tokens.textSecondary, fontSize: tokens.fontSizeSm }}>Content below</p>
          </div>
        </Row>
        <Row label="With label" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <Divider label="OR" />
          </div>
        </Row>
        <Row label="Vertical" tokens={tokens}>
          <div style={{ display: 'flex', alignItems: 'center', height: 32 }}>
            <span style={{ color: tokens.textSecondary, fontSize: tokens.fontSizeSm }}>Home</span>
            <Divider orientation="vertical" />
            <span style={{ color: tokens.textSecondary, fontSize: tokens.fontSizeSm }}>About</span>
            <Divider orientation="vertical" />
            <span style={{ color: tokens.textSecondary, fontSize: tokens.fontSizeSm }}>Contact</span>
          </div>
        </Row>
      </Section>

      <Section title="Breadcrumb" tokens={tokens} hidden={!showSection('Breadcrumb')}>
        <Row label="Default" tokens={tokens}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '#' },
              { label: 'Settings', href: '#' },
              { label: 'Profile' },
            ]}
          />
        </Row>
        <Row label="Custom separator" tokens={tokens}>
          <Breadcrumb
            separator="›"
            items={[
              { label: 'Dashboard', href: '#' },
              { label: 'Projects', href: '#' },
              { label: 'lucent-ui' },
            ]}
          />
        </Row>
      </Section>

      <Section title="Tabs" tokens={tokens} hidden={!showSection('Tabs')}>
        <Row label="Underline (default)" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <Tabs
              tabs={[
                { value: 'overview', label: 'Overview', content: <Text size="sm" color="secondary">Overview content goes here.</Text> },
                { value: 'api', label: 'API', content: <Text size="sm" color="secondary">API reference content.</Text> },
                { value: 'examples', label: 'Examples', content: <Text size="sm" color="secondary">Usage examples.</Text> },
                { value: 'disabled', label: 'Disabled', content: null, disabled: true },
              ]}
            />
          </div>
        </Row>
        <Row label="Pills" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <Tabs
              variant="pills"
              tabs={[
                { value: 'overview', label: 'Overview', content: <Text size="sm" color="secondary">Overview content goes here.</Text> },
                { value: 'api', label: 'API', content: <Text size="sm" color="secondary">API reference content.</Text> },
                { value: 'examples', label: 'Examples', content: <Text size="sm" color="secondary">Usage examples.</Text> },
                { value: 'disabled', label: 'Disabled', content: null, disabled: true },
              ]}
            />
          </div>
        </Row>
        <Row label="Overflow (constrained width)" tokens={tokens}>
          <div style={{ width: 360 }}>
            <Tabs
              tabs={[
                { value: 'overview', label: 'Overview', content: <Text size="sm" color="secondary">Overview content.</Text> },
                { value: 'api', label: 'API', content: <Text size="sm" color="secondary">API reference.</Text> },
                { value: 'examples', label: 'Examples', content: <Text size="sm" color="secondary">Usage examples.</Text> },
                { value: 'changelog', label: 'Changelog', content: <Text size="sm" color="secondary">Changelog content.</Text> },
                { value: 'settings', label: 'Settings', content: <Text size="sm" color="secondary">Settings content.</Text> },
                { value: 'advanced', label: 'Advanced', content: <Text size="sm" color="secondary">Advanced options.</Text> },
              ]}
            />
          </div>
        </Row>
      </Section>

      <Section title="Collapsible" tokens={tokens} hidden={!showSection('Collapsible')}>
        <Row label="Default" tokens={tokens}>
          <CardPaddingContext.Provider value={{ px: '0', py: '0' }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
              <Collapsible trigger={<Text weight="medium">Advanced options</Text>}>
                <Text color="secondary">Hidden content that expands when you click the trigger above. Can contain any ReactNode.</Text>
              </Collapsible>
            </div>
          </CardPaddingContext.Provider>
        </Row>
        <Row label="Default open" tokens={tokens}>
          <CardPaddingContext.Provider value={{ px: '0', py: '0' }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
              <Collapsible defaultOpen trigger={<Text weight="medium">Expanded by default</Text>}>
                <Text color="secondary">This section starts expanded.</Text>
              </Collapsible>
            </div>
          </CardPaddingContext.Provider>
        </Row>
        <Row label="CollapsibleCard pattern" tokens={tokens}>
          <Card variant="ghost" padding="none" hoverable style={{ width: '100%', maxWidth: 360 }}>
            <Collapsible trigger={<Text as="span" weight="semibold" size="sm">ghost</Text>} defaultOpen>
              <Text size="sm" color="secondary">Transparent container, content floats on page.</Text>
            </Collapsible>
          </Card>
          <Card variant="outline" padding="none" hoverable style={{ width: '100%', maxWidth: 360 }}>
            <Collapsible trigger={<Text as="span" weight="semibold" size="sm">outline</Text>} defaultOpen>
              <Text size="sm" color="secondary">Bordered card — the default variant.</Text>
            </Collapsible>
          </Card>
          <Card variant="filled" padding="none" hoverable style={{ width: '100%', maxWidth: 360 }}>
            <Collapsible trigger={<Text as="span" weight="semibold" size="sm">filled</Text>} defaultOpen>
              <Text size="sm" color="secondary">Tinted background, no border.</Text>
            </Collapsible>
          </Card>
          <Card variant="elevated" padding="none" hoverable style={{ width: '100%', maxWidth: 360 }}>
            <Collapsible trigger={<Text as="span" weight="semibold" size="sm">elevated</Text>} defaultOpen>
              <Text size="sm" color="secondary">Surface with shadow depth.</Text>
            </Collapsible>
          </Card>
          <Card variant="filled" padding="none" hoverable style={{ width: '100%', maxWidth: 360 }}>
            <Collapsible open={comboOpen} onOpenChange={setComboOpen} padded={false} trigger={<Text as="span" weight="semibold" size="sm">combo</Text>}>
              <Card variant="elevated" padding="sm" style={{ margin: 'var(--lucent-space-1) var(--lucent-space-2) var(--lucent-space-2)' }}>
                <Text size="sm" color="secondary">Two-tone — flat trigger, elevated body.</Text>
              </Card>
            </Collapsible>
          </Card>
        </Row>
        <Row label="CollapsibleCard pattern" tokens={tokens}>
          <Card variant="ghost" padding="none" hoverable style={{ width: '100%', maxWidth: 360 }}>
            <Collapsible trigger={<Text as="span" weight="semibold" size="sm">ghost</Text>} defaultOpen>
              <Text size="sm" color="secondary">Transparent container, content floats on page.</Text>
            </Collapsible>
          </Card>
          <Card variant="outline" padding="none" hoverable style={{ width: '100%', maxWidth: 360 }}>
            <Collapsible trigger={<Text as="span" weight="semibold" size="sm">outline</Text>} defaultOpen>
              <Text size="sm" color="secondary">Bordered card — the default variant.</Text>
            </Collapsible>
          </Card>
          <Card variant="filled" padding="none" hoverable style={{ width: '100%', maxWidth: 360 }}>
            <Collapsible trigger={<Text as="span" weight="semibold" size="sm">filled</Text>} defaultOpen>
              <Text size="sm" color="secondary">Tinted background, no border.</Text>
            </Collapsible>
          </Card>
          <Card variant="elevated" padding="none" hoverable style={{ width: '100%', maxWidth: 360 }}>
            <Collapsible trigger={<Text as="span" weight="semibold" size="sm">elevated</Text>} defaultOpen>
              <Text size="sm" color="secondary">Surface with shadow depth.</Text>
            </Collapsible>
          </Card>
          <Card variant="filled" padding="none" hoverable style={{ width: '100%', maxWidth: 360 }}>
            <Collapsible open={comboOpen} onOpenChange={setComboOpen} padded={false} trigger={<Text as="span" weight="semibold" size="sm">combo</Text>}>
              <Card variant="elevated" padding="sm" style={{ margin: 'var(--lucent-space-3) var(--lucent-space-2) var(--lucent-space-2)' }}>
                <Text size="sm" color="secondary">Two-tone — flat trigger, elevated body.</Text>
              </Card>
            </Collapsible>
          </Card>
        </Row>
      </Section>

      <Section title="NavLink" tokens={tokens} hidden={!showSection('NavLink')}>
        <Row label="States" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space1, width: 220 }}>
            <NavLink href="#" icon={<NavIcon />}>Dashboard</NavLink>
            <NavLink href="#" icon={<NavIcon />} isActive>Components</NavLink>
            <NavLink href="#" icon={<NavIcon />}>Settings</NavLink>
            <NavLink href="#" icon={<NavIcon />} disabled>Disabled</NavLink>
          </div>
        </Row>
        <Row label="Without icons" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space1, width: 220 }}>
            <NavLink href="#">Overview</NavLink>
            <NavLink href="#" isActive>API Reference</NavLink>
            <NavLink href="#">Examples</NavLink>
          </div>
        </Row>
        <Row label="Inverse (surface highlight)" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space1, width: 220, background: tokens.bgSubtle, borderRadius: tokens.radiusMd, padding: tokens.space3 }}>
            <NavLink href="#" icon={<NavIcon />} inverse>Dashboard</NavLink>
            <NavLink href="#" icon={<NavIcon />} isActive inverse>Components</NavLink>
            <NavLink href="#" icon={<NavIcon />} inverse>Settings</NavLink>
            <NavLink href="#" icon={<NavIcon />} disabled inverse>Disabled</NavLink>
          </div>
        </Row>
      </Section>

      <Section title="PageLayout" tokens={tokens} hidden={!showSection('PageLayout')}>
        <Row label="With header + sidebar" tokens={tokens}>
          <div style={{ width: '100%', height: 320, border: `1px solid ${tokens.borderDefault}`, borderRadius: tokens.radiusMd, overflow: 'hidden' }}>
            <PageLayout
              headerHeight={44}
              sidebarWidth={180}
              chromeBackground="bgSubtle"
              header={
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: `0 ${tokens.space6}` }}>
                  <Text weight="semibold">My App</Text>
                </div>
              }
              sidebar={
                <div style={{ padding: tokens.space4, display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
                  <NavLink href="#" isActive inverse>Dashboard</NavLink>
                  <NavLink href="#" inverse>Components</NavLink>
                  <NavLink href="#" inverse>Settings</NavLink>
                </div>
              }
            >
              <div style={{ padding: tokens.space5 }}>
                <Text color="secondary">Main scrollable content area.</Text>
              </div>
            </PageLayout>
          </div>
        </Row>
        <Row label="With status bar footer" tokens={tokens}>
          <div style={{ width: '100%', height: 320, border: `1px solid ${tokens.borderDefault}`, borderRadius: tokens.radiusMd, overflow: 'hidden' }}>
            <PageLayout
              headerHeight={44}
              sidebarWidth={180}
              chromeBackground="bgSubtle"
              header={
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: `0 ${tokens.space6}` }}>
                  <Text weight="semibold">My App</Text>
                </div>
              }
              sidebar={
                <div style={{ padding: tokens.space4, display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
                  <NavLink href="#" isActive inverse>Dashboard</NavLink>
                  <NavLink href="#" inverse>Components</NavLink>
                  <NavLink href="#" inverse>Settings</NavLink>
                </div>
              }
              footer={
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${tokens.space3}`, borderTop: `1px solid ${tokens.borderDefault}` }}>
                  <Text size="xs" color="secondary">main</Text>
                  <div style={{ display: 'flex', gap: tokens.space4 }}>
                    <Text size="xs" color="secondary">Ln 42, Col 7</Text>
                    <Text size="xs" color="secondary">UTF-8</Text>
                    <Text size="xs" color="info">Ready</Text>
                  </div>
                </div>
              }
            >
              <div style={{ padding: tokens.space5 }}>
                <Text color="secondary">Main scrollable content area.</Text>
              </div>
            </PageLayout>
          </div>
        </Row>
        <Row label="With header + sidebar + right panel" tokens={tokens}>
          <div style={{ width: '100%', height: 320, border: `1px solid ${tokens.borderDefault}`, borderRadius: tokens.radiusMd, overflow: 'hidden' }}>
            <PageLayout
              headerHeight={44}
              sidebarWidth={160}
              rightSidebarWidth={160}
              chromeBackground="bgSubtle"
              header={
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: `0 ${tokens.space6}` }}>
                  <Text weight="semibold">My App</Text>
                </div>
              }
              sidebar={
                <div style={{ padding: tokens.space4, display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
                  <NavLink href="#" isActive inverse>Dashboard</NavLink>
                  <NavLink href="#" inverse>Components</NavLink>
                  <NavLink href="#" inverse>Settings</NavLink>
                </div>
              }
              rightSidebar={
                <div style={{ padding: tokens.space4, display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
                  <Text size="xs" weight="semibold" color="secondary">Details</Text>
                  <Text size="xs" color="secondary">Status: Active</Text>
                  <Text size="xs" color="secondary">Owner: You</Text>
                  <Text size="xs" color="secondary">Updated: today</Text>
                </div>
              }
            >
              <div style={{ padding: tokens.space5 }}>
                <Text color="secondary">Main scrollable content area.</Text>
              </div>
            </PageLayout>
          </div>
        </Row>
      </Section>

      {/* ── Molecules Wave 2 ── */}

      <Section title="DataTable" tokens={tokens} hidden={!showSection('DataTable')}>
        <Row label="Sortable + paginated" tokens={tokens}>
          <DataTable
            style={{ width: '100%' }}
            pageSize={5}
            columns={[
              { key: 'name', header: 'Name', sortable: true },
              { key: 'role', header: 'Role', sortable: true },
              { key: 'status', header: 'Status', render: (row: { name: string; role: string; status: string }) => <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>{row.status}</Badge> },
            ]}
            rows={[
              { name: 'Alice', role: 'Engineer', status: 'Active' },
              { name: 'Bob', role: 'Designer', status: 'Active' },
              { name: 'Carol', role: 'Product', status: 'Away' },
              { name: 'Dan', role: 'Engineer', status: 'Active' },
              { name: 'Eve', role: 'Marketing', status: 'Away' },
              { name: 'Frank', role: 'Engineer', status: 'Active' },
              { name: 'Grace', role: 'Designer', status: 'Away' },
            ]}
          />
        </Row>
        <Row label="Sortable + filterable + paginated" tokens={tokens}>
          <StackAtom gap="3" style={{ width: '100%' }}>
            <RowAtom gap="2" align="center" wrap>
              <FilterMultiSelect
                label="Name"
                size="sm"
                options={[
                  { value: 'Alice', label: 'Alice' },
                  { value: 'Bob', label: 'Bob' },
                  { value: 'Carol', label: 'Carol' },
                  { value: 'Dan', label: 'Dan' },
                  { value: 'Eve', label: 'Eve' },
                  { value: 'Frank', label: 'Frank' },
                  { value: 'Grace', label: 'Grace' },
                ]}
              />
              <FilterMultiSelect
                label="Role"
                size="sm"
                options={[
                  { value: 'Engineer', label: 'Engineer' },
                  { value: 'Designer', label: 'Designer' },
                  { value: 'Product', label: 'Product' },
                  { value: 'Marketing', label: 'Marketing' },
                ]}
              />
            </RowAtom>
            <DataTable
              style={{ width: '100%' }}
              pageSize={5}
              columns={[
                { key: 'name', header: 'Name', sortable: true },
                { key: 'role', header: 'Role', sortable: true },
                { key: 'status', header: 'Status', render: (row: { name: string; role: string; status: string }) => <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>{row.status}</Badge> },
              ]}
              rows={[
                { name: 'Alice', role: 'Engineer', status: 'Active' },
                { name: 'Bob', role: 'Designer', status: 'Active' },
                { name: 'Carol', role: 'Product', status: 'Away' },
                { name: 'Dan', role: 'Engineer', status: 'Active' },
                { name: 'Eve', role: 'Marketing', status: 'Away' },
                { name: 'Frank', role: 'Engineer', status: 'Active' },
                { name: 'Grace', role: 'Designer', status: 'Away' },
              ]}
            />
          </StackAtom>
        </Row>
        <Row label="Empty state" tokens={tokens}>
          <DataTable columns={[{ key: 'name', header: 'Name' }]} rows={[]} style={{ width: 320 }} />
        </Row>
      </Section>

      <Section title="CommandPalette" tokens={tokens} hidden={!showSection('CommandPalette')}>
        <Row label="⌘K to open" tokens={tokens}>
          <CommandPalette
            shortcutKey=""
            commands={[
              { id: 'new', label: 'New document', description: 'Create a blank document', group: 'Create', onSelect: () => {}, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { id: 'open', label: 'Open file…', description: 'Browse and open a file', group: 'Create', onSelect: () => {}, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 8.5v3a1 1 0 001 1h9a1 1 0 001-1v-3M8 3v7M5 6l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              { id: 'settings', label: 'Settings', description: 'Open app settings', group: 'Navigate', onSelect: () => {}, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { id: 'logout', label: 'Log out', group: 'Account', onSelect: () => {}, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 2.5H3.5a1 1 0 00-1 1v9a1 1 0 001 1H6M10.5 11L13.5 8l-3-3M6 8h7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            ]}
          />
          <Text size="sm" color="secondary">Press <kbd style={{ padding: '1px 5px', borderRadius: tokens.radiusSm, border: `1px solid ${tokens.borderDefault}`, fontFamily: tokens.fontFamilyMono, fontSize: tokens.fontSizeXs }}>⌘K</kbd> to open the palette</Text>
        </Row>
      </Section>

      <Section title="MultiSelect" tokens={tokens} hidden={!showSection('MultiSelect')}>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            {(['sm', 'md', 'lg'] as const).map(s => (
              <div key={s} style={{ width: 260 }}>
                <MultiSelect
                  size={s}
                  options={['React', 'Vue', 'Svelte', 'Angular', 'Solid', 'Preact', 'Lit'].map(v => ({ value: v.toLowerCase(), label: v }))}
                  placeholder={`Size ${s}`}
                />
              </div>
            ))}
          </div>
        </Row>
        <Row label="Default" tokens={tokens}>
          <div style={{ width: 320 }}>
            <MultiSelect
              options={['React', 'Vue', 'Svelte', 'Angular', 'Solid'].map(v => ({ value: v.toLowerCase(), label: v }))}
              placeholder="Select frameworks…"
            />
          </div>
        </Row>
        <Row label="Max 2 selections" tokens={tokens}>
          <div style={{ width: 320 }}>
            <MultiSelect
              options={['TypeScript', 'Rust', 'Go', 'Python', 'Elixir'].map(v => ({ value: v.toLowerCase(), label: v }))}
              max={2}
              placeholder="Pick up to 2 languages"
            />
          </div>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <div style={{ width: 320 }}>
            <MultiSelect
              options={[{ value: 'a', label: 'Option A' }]}
              disabled
              placeholder="Disabled"
            />
          </div>
        </Row>
      </Section>

      <Section title="DatePicker" tokens={tokens} hidden={!showSection('DatePicker')}>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {(['sm', 'md', 'lg'] as const).map(s => (
              <DatePicker key={s} size={s} placeholder={`Size ${s}`} onChange={() => {}} />
            ))}
          </div>
        </Row>
        <Row label="Single date" tokens={tokens}>
          <DatePicker onChange={() => {}} />
        </Row>
        <Row label="With min (today)" tokens={tokens}>
          <DatePicker min={new Date()} placeholder="Future dates only" onChange={() => {}} />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <DatePicker disabled />
        </Row>
      </Section>

      <Section title="DateRangePicker" tokens={tokens} hidden={!showSection('DateRangePicker')}>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {(['sm', 'md', 'lg'] as const).map(s => (
              <DateRangePicker key={s} size={s} placeholder={`Size ${s}`} onChange={() => {}} />
            ))}
          </div>
        </Row>
        <Row label="Default" tokens={tokens}>
          <DateRangePicker onChange={() => {}} />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <DateRangePicker disabled />
        </Row>
      </Section>

      <Section title="FileUpload" tokens={tokens} hidden={!showSection('FileUpload')}>
        <Row label="Single file" tokens={tokens}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <FileUpload accept="image/*,.pdf" maxSize={5 * 1024 * 1024} onChange={() => {}} />
          </div>
        </Row>
        <Row label="Multiple files" tokens={tokens}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <FileUpload
              multiple
              value={[
                { id: '1', file: new File([''], 'design.figma'), progress: 100 },
                { id: '2', file: new File([''], 'spec.pdf'), progress: 60 },
                { id: '3', file: new File([''], 'error.png'), error: 'Upload failed — server error' },
              ] as UploadFile[]}
              onChange={() => {}}
            />
          </div>
        </Row>
      </Section>

      <Section title="Timeline" tokens={tokens} hidden={!showSection('Timeline')}>
        <Row label="Event log" tokens={tokens}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <Timeline
              items={[
                { id: '1', title: 'Order placed', date: 'Mar 1, 2026', status: 'success' },
                { id: '2', title: 'Payment processed', date: 'Mar 1, 2026', status: 'success' },
                { id: '3', title: 'Shipped', date: 'Mar 2, 2026', description: 'FedEx tracking: 7489201837' },
                { id: '4', title: 'Delivery failed', date: 'Mar 4, 2026', status: 'danger', description: 'No one home — will retry tomorrow.' },
                { id: '5', title: 'Awaiting re-delivery', date: 'Mar 5, 2026', status: 'warning' },
              ]}
            />
          </div>
        </Row>
        <Row label="Activity feed" tokens={tokens}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <Timeline
              items={[
                { id: '1', title: 'Submitted for review', date: 'week ago', status: 'success' },
                {
                  id: '2',
                  title: 'Changes requested',
                  date: '4 days ago',
                  status: 'warning',
                  content: (
                    <Card variant="elevated" padding="md" radius="md">
                      <Text size="sm" weight="semibold">Oliver Brown</Text>
                      <div style={{ marginTop: 'var(--lucent-space-2)' }}>
                        <Text size="sm" color="secondary">
                          Please update the error handling in the auth module before merging.
                        </Text>
                      </div>
                    </Card>
                  ),
                },
                { id: '3', title: 'Resubmitted for review', date: '4h ago', status: 'info' },
                { id: '4', title: 'Approved', date: 'just now', status: 'success' },
              ]}
            />
          </div>
        </Row>
      </Section>

      {/* Menu */}
      <Section title="Menu" tokens={tokens} hidden={!showSection('Menu')}>
        <Row label="Sizes" tokens={tokens}>
          <Menu size="sm" trigger={<Button size="sm" chevron>Small</Button>}>
            <MenuItem onSelect={() => {}}>Edit</MenuItem>
            <MenuItem onSelect={() => {}}>Duplicate</MenuItem>
            <MenuSeparator />
            <MenuItem onSelect={() => {}} danger>Delete</MenuItem>
          </Menu>
          <Menu size="md" trigger={<Button size="md" chevron>Medium</Button>}>
            <MenuItem onSelect={() => {}}>Edit</MenuItem>
            <MenuItem onSelect={() => {}}>Duplicate</MenuItem>
            <MenuSeparator />
            <MenuItem onSelect={() => {}} danger>Delete</MenuItem>
          </Menu>
          <Menu size="lg" trigger={<Button size="lg" chevron>Large</Button>}>
            <MenuItem onSelect={() => {}}>Edit</MenuItem>
            <MenuItem onSelect={() => {}}>Duplicate</MenuItem>
            <MenuSeparator />
            <MenuItem onSelect={() => {}} danger>Delete</MenuItem>
          </Menu>
        </Row>
        <Row label="Basic" tokens={tokens}>
          <Menu trigger={<Button chevron>Actions</Button>}>
            <MenuItem onSelect={() => console.log('edit')}>Edit</MenuItem>
            <MenuItem onSelect={() => console.log('duplicate')}>Duplicate</MenuItem>
            <MenuSeparator />
            <MenuItem onSelect={() => console.log('delete')} danger>Delete</MenuItem>
          </Menu>
        </Row>
        <Row label="With icons" tokens={tokens}>
          <Menu trigger={<Button variant="outline" chevron>Options</Button>}>
            <MenuItem icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>} shortcut="⌘E" onSelect={() => console.log('edit')}>Edit</MenuItem>
            <MenuItem icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>} shortcut="⌘D" onSelect={() => console.log('duplicate')}>Duplicate</MenuItem>
            <MenuSeparator />
            <MenuItem icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>} onSelect={() => console.log('delete')} danger>Delete</MenuItem>
          </Menu>
        </Row>
        <Row label="With groups" tokens={tokens}>
          <Menu trigger={<Button variant="ghost" chevron>File</Button>} placement="bottom-start">
            <MenuGroup label="Document">
              <MenuItem onSelect={() => console.log('new')}>New</MenuItem>
              <MenuItem onSelect={() => console.log('open')}>Open</MenuItem>
              <MenuItem onSelect={() => console.log('save')}>Save</MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup label="Export">
              <MenuItem onSelect={() => console.log('pdf')}>PDF</MenuItem>
              <MenuItem onSelect={() => console.log('csv')}>CSV</MenuItem>
              <MenuItem onSelect={() => console.log('json')} disabled>JSON (coming soon)</MenuItem>
            </MenuGroup>
          </Menu>
        </Row>
        <Row label="Selected" tokens={tokens}>
          <Menu trigger={<Button variant="outline" chevron>Sort by</Button>}>
            <MenuItem selected={menuSort === 'name'} onSelect={() => setMenuSort('name')}>Name</MenuItem>
            <MenuItem selected={menuSort === 'date'} onSelect={() => setMenuSort('date')}>Date modified</MenuItem>
            <MenuItem selected={menuSort === 'size'} onSelect={() => setMenuSort('size')}>Size</MenuItem>
            <MenuItem selected={menuSort === 'type'} onSelect={() => setMenuSort('type')}>Type</MenuItem>
          </Menu>
        </Row>
        <Row label="Placements" tokens={tokens}>
          <Menu trigger={<Button variant="secondary" size="sm">Bottom ↓</Button>} placement="bottom">
            <MenuItem onSelect={() => {}}>Option A</MenuItem>
            <MenuItem onSelect={() => {}}>Option B</MenuItem>
          </Menu>
          <Menu trigger={<Button variant="secondary" size="sm">Top ↑</Button>} placement="top">
            <MenuItem onSelect={() => {}}>Option A</MenuItem>
            <MenuItem onSelect={() => {}}>Option B</MenuItem>
          </Menu>
          <Menu trigger={<Button variant="secondary" size="sm">Right →</Button>} placement="right">
            <MenuItem onSelect={() => {}}>Option A</MenuItem>
            <MenuItem onSelect={() => {}}>Option B</MenuItem>
          </Menu>
        </Row>
      </Section>

      <Section title="Toast" tokens={tokens} hidden={!showSection('Toast')}>
        <Row label="All variants" tokens={tokens}>
          <ToastButtons position={toastPosition} onChangePosition={onChangeToastPosition} />
        </Row>
      </Section>

      {/* Stack */}
      <Section title="Stack" tokens={tokens} hidden={!showSection('Stack')}>
        <Row label="Vertical spacing" tokens={tokens}>
          <StackAtom gap="3" style={{ padding: tokens.space4, background: tokens.surfaceSecondary, borderRadius: tokens.radiusMd, width: 200 }}>
            <Text size="sm" weight="semibold">Title</Text>
            <Text size="xs" color="secondary">Subtitle text here</Text>
            <Button variant="primary" size="sm">Action</Button>
          </StackAtom>
        </Row>
        <Row label="Gap sizes" tokens={tokens}>
          {(['1', '3', '6'] as const).map(g => (
            <StackAtom key={g} gap={g} style={{ padding: tokens.space3, background: tokens.surfaceSecondary, borderRadius: tokens.radiusMd }}>
              <Text size="xs" color="secondary">gap="{g}"</Text>
              <Badge>A</Badge>
              <Badge>B</Badge>
              <Badge>C</Badge>
            </StackAtom>
          ))}
        </Row>
        <Row label="Centered content" tokens={tokens}>
          <StackAtom gap="3" align="center" justify="center" style={{ minHeight: 120, padding: tokens.space4, background: tokens.surfaceSecondary, borderRadius: tokens.radiusMd, width: 200 }}>
            <Spinner size="sm" />
            <Text size="sm" color="secondary">Loading...</Text>
          </StackAtom>
        </Row>
      </Section>

      {/* Row */}
      <Section title="Row" tokens={tokens} hidden={!showSection('Row')}>
        <Row label="Horizontal layout" tokens={tokens}>
          <RowAtom gap="3" align="center">
            <Text size="sm">Push notifications</Text>
            <Toggle checked={toggled} onChange={setToggled} />
          </RowAtom>
        </Row>
        <Row label="justify=between" tokens={tokens}>
          <RowAtom gap="3" justify="between" style={{ width: '100%', maxWidth: 400 }}>
            <Text as="span" size="sm" weight="semibold">Dashboard</Text>
            <RowAtom gap="2">
              <Button variant="outline" size="sm">Export</Button>
              <Button variant="primary" size="sm">New</Button>
            </RowAtom>
          </RowAtom>
        </Row>
        <Row label="Wrap" tokens={tokens}>
          <RowAtom gap="2" wrap style={{ maxWidth: 260 }}>
            {['React', 'TypeScript', 'Design', 'Systems', 'Tokens', 'Layout'].map(t => (
              <Badge key={t}>{t}</Badge>
            ))}
          </RowAtom>
        </Row>
        <Row label="Stack + Row composition" tokens={tokens}>
          <Card variant="outline" padding="md" style={{ width: 280 }}>
            <StackAtom gap="4">
              <RowAtom gap="3" align="center">
                <Avatar alt="Jane Doe" size="md" />
                <StackAtom gap="1">
                  <Text size="sm" weight="semibold">Jane Doe</Text>
                  <Text size="xs" color="secondary">Software Engineer</Text>
                </StackAtom>
              </RowAtom>
              <Divider />
              <RowAtom gap="2" justify="end">
                <Button variant="outline" size="sm">Message</Button>
                <Button variant="primary" size="sm">Follow</Button>
              </RowAtom>
            </StackAtom>
          </Card>
        </Row>
      </Section>

      <Section title="NavMenu" tokens={tokens} hidden={!showSection('NavMenu')}>
        <Row label="Vertical — child active (parent highlights)" tokens={tokens}>
          <div style={{ width: 220, background: tokens.bgSubtle, borderRadius: tokens.radiusMd, padding: tokens.space3 }}>
            <NavMenu orientation="vertical">
              <NavMenu.Item href="#" icon={<NavIcon />}>Dashboard</NavMenu.Item>
              <NavMenu.Item href="#" icon={<NavIcon />} badge={<Chip size="sm" variant="neutral">12</Chip>}>Projects</NavMenu.Item>
              <NavMenu.Item icon={<NavIcon />} badge={<Chip size="sm" variant="accent">3</Chip>}>
                Settings
                <NavMenu.Sub>
                  <NavMenu.Item href="#" isActive>General</NavMenu.Item>
                  <NavMenu.Item href="#">Team</NavMenu.Item>
                  <NavMenu.Item href="#">Billing</NavMenu.Item>
                </NavMenu.Sub>
              </NavMenu.Item>
              <NavMenu.Item href="#" icon={<NavIcon />} disabled>Disabled</NavMenu.Item>
            </NavMenu>
          </div>
        </Row>
        <Row label="Vertical with groups (inverse)" tokens={tokens}>
          <div style={{ width: 220, background: tokens.bgSubtle, borderRadius: tokens.radiusMd, padding: tokens.space3 }}>
            <NavMenu orientation="vertical" inverse>
              <NavMenu.Group label="Main">
                <NavMenu.Item href="#" isActive>Dashboard</NavMenu.Item>
                <NavMenu.Item href="#" badge={<Chip size="sm" variant="neutral">5</Chip>}>Analytics</NavMenu.Item>
              </NavMenu.Group>
              <NavMenu.Separator />
              <NavMenu.Group label="Admin" defaultOpen={false}>
                <NavMenu.Item href="#">Users</NavMenu.Item>
                <NavMenu.Item href="#">Roles</NavMenu.Item>
              </NavMenu.Group>
            </NavMenu>
          </div>
        </Row>
        <Row label="Compact (size=sm)" tokens={tokens}>
          <div style={{ width: 200, background: tokens.bgSubtle, borderRadius: tokens.radiusMd, padding: tokens.space2 }}>
            <NavMenu orientation="vertical" size="sm">
              <NavMenu.Item href="#" icon={<NavIcon />} isActive>Dashboard</NavMenu.Item>
              <NavMenu.Item href="#" icon={<NavIcon />}>Projects</NavMenu.Item>
              <NavMenu.Item icon={<NavIcon />}>
                Settings
                <NavMenu.Sub>
                  <NavMenu.Item href="#">General</NavMenu.Item>
                  <NavMenu.Item href="#">Team</NavMenu.Item>
                </NavMenu.Sub>
              </NavMenu.Item>
            </NavMenu>
          </div>
        </Row>
        <Row label="Horizontal (top bar)" tokens={tokens}>
          <div style={{ borderBottom: `1px solid ${tokens.borderDefault}`, padding: `0 ${tokens.space2}` }}>
            <NavMenu orientation="horizontal">
              <NavMenu.Item href="#" isActive>Dashboard</NavMenu.Item>
              <NavMenu.Item href="#">Projects</NavMenu.Item>
              <NavMenu.Item>
                Settings
                <NavMenu.Sub>
                  <NavMenu.Item href="#" isActive>General</NavMenu.Item>
                  <NavMenu.Item href="#">Team</NavMenu.Item>
                  <NavMenu.Item href="#">Billing</NavMenu.Item>
                </NavMenu.Sub>
              </NavMenu.Item>
              <NavMenu.Item href="#" disabled>Disabled</NavMenu.Item>
            </NavMenu>
          </div>
        </Row>
      </Section>

      {/* ─── Filter Molecules ────────────────────────────────────────────── */}

      <Section title="FilterSearch" tokens={tokens} hidden={!showSection('FilterSearch')}>
        <Row label="Collapsed (default)" tokens={tokens}>
          <FilterSearch placeholder="Search…" size="sm" />
          <FilterSearch placeholder="Search…" size="md" />
          <FilterSearch placeholder="Search…" size="lg" />
        </Row>
        <Row label="Expanded (has value)" tokens={tokens}>
          <FilterSearch placeholder="Search candidates…" size="sm" defaultValue="Alice" />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <FilterSearch placeholder="Search…" size="sm" disabled />
        </Row>
        <Row label="Outline variant" tokens={tokens}>
          <FilterSearch placeholder="Search…" size="sm" variant="outline" />
        </Row>
      </Section>

      <Section title="FilterSelect" tokens={tokens} hidden={!showSection('FilterSelect')}>
        <Row label="Sizes" tokens={tokens}>
          <FilterSelect label="Sort" size="sm" options={[
            { value: 'newest', label: 'Newest first' },
            { value: 'oldest', label: 'Oldest first' },
            { value: 'name', label: 'Name A–Z' },
          ]} />
          <FilterSelect label="Sort" size="md" options={[
            { value: 'newest', label: 'Newest first' },
            { value: 'oldest', label: 'Oldest first' },
            { value: 'name', label: 'Name A–Z' },
          ]} />
          <FilterSelect label="Sort" size="lg" options={[
            { value: 'newest', label: 'Newest first' },
            { value: 'oldest', label: 'Oldest first' },
            { value: 'name', label: 'Name A–Z' },
          ]} />
        </Row>
        <Row label="With icon" tokens={tokens}>
          <FilterSelect label="Newest first" size="sm" icon={<svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 2v12M4 14l-3-3M4 14l3-3M12 14V2M12 2l-3 3M12 2l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>} options={[
            { value: 'newest', label: 'Newest first' },
            { value: 'oldest', label: 'Oldest first' },
            { value: 'name', label: 'Name A–Z' },
          ]} />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <FilterSelect label="Status" size="sm" disabled options={[
            { value: 'active', label: 'Active' },
          ]} />
        </Row>
        <Row label="Outline variant (active → secondary)" tokens={tokens}>
          <FilterSelect label="Sort" size="sm" variant="outline" options={[
            { value: 'newest', label: 'Newest first' },
            { value: 'oldest', label: 'Oldest first' },
            { value: 'name', label: 'Name A–Z' },
          ]} />
        </Row>
      </Section>

      <Section title="FilterMultiSelect" tokens={tokens} hidden={!showSection('FilterMultiSelect')}>
        <Row label="With swatches" tokens={tokens}>
          <FilterMultiSelect label="Tags" size="sm" options={sfbTagOptions} />
        </Row>
        <Row label="Plain labels" tokens={tokens}>
          <FilterMultiSelect label="Role" size="sm" options={[
            { value: 'engineer', label: 'Engineer' },
            { value: 'designer', label: 'Designer' },
            { value: 'product', label: 'Product' },
            { value: 'marketing', label: 'Marketing' },
          ]} />
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <FilterMultiSelect label="Tags" size="sm" options={sfbTagOptions} defaultValue={['react']} />
          <FilterMultiSelect label="Tags" size="md" options={sfbTagOptions} defaultValue={['react']} />
          <FilterMultiSelect label="Tags" size="lg" options={sfbTagOptions} defaultValue={['react']} />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <FilterMultiSelect label="Tags" size="sm" disabled options={sfbTagOptions} />
        </Row>
        <Row label="Outline variant (active → secondary)" tokens={tokens}>
          <FilterMultiSelect label="Tags" size="sm" variant="outline" options={sfbTagOptions} />
        </Row>
      </Section>

      <Section title="FilterDateRange" tokens={tokens} hidden={!showSection('FilterDateRange')}>
        <Row label="Sizes" tokens={tokens}>
          <FilterDateRange label="Date range" size="sm" />
          <FilterDateRange label="Date range" size="md" />
          <FilterDateRange label="Date range" size="lg" />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <FilterDateRange label="Date range" size="sm" disabled />
        </Row>
        <Row label="Outline variant (active → secondary)" tokens={tokens}>
          <FilterDateRange label="Date range" size="sm" variant="outline" />
        </Row>
      </Section>

      {/* ─── Patterns ───────────────────────────────────────────────────────── */}

      <Section title="ProfileCard" tokens={tokens} hidden={!showSection('ProfileCard')}>
        <Row label="Full profile card" tokens={tokens}>
          <Card variant="elevated" padding="none" style={{ width: 340, padding: 'var(--lucent-space-6)' }}>
            <StackAtom gap="5">
              <RowAtom gap="3" align="center">
                <Avatar alt="Jane Doe" size="lg" />
                <StackAtom gap="1">
                  <RowAtom gap="2" align="center">
                    <Text size="lg" weight="semibold" family="display">Jane Doe</Text>
                    <Chip variant="success" size="sm" dot>Pro</Chip>
                  </RowAtom>
                  <Text size="sm" color="secondary">Software Engineer</Text>
                </StackAtom>
              </RowAtom>
              <Text size="sm">Building design systems and component libraries. Passionate about accessible, token-driven UI.</Text>
              <RowAtom gap="2" wrap>
                <Chip variant="neutral" borderless onClick={() => {}}>React</Chip>
                <Chip variant="neutral" borderless onClick={() => {}}>TypeScript</Chip>
                <Chip variant="neutral" borderless onClick={() => {}}>Design Systems</Chip>
              </RowAtom>
              <Divider />
              <RowAtom gap="6" justify="around">
                <StackAtom gap="0" align="center">
                  <Text size="2xl" weight="bold" family="display">128</Text>
                  <Text size="xs" color="secondary">Posts</Text>
                </StackAtom>
                <StackAtom gap="0" align="center">
                  <Text size="2xl" weight="bold" family="display">4.2k</Text>
                  <Text size="xs" color="secondary">Followers</Text>
                </StackAtom>
                <StackAtom gap="0" align="center">
                  <Text size="2xl" weight="bold" family="display">312</Text>
                  <Text size="xs" color="secondary">Following</Text>
                </StackAtom>
              </RowAtom>
              <RowAtom gap="3">
                <Button variant="primary" style={{ flex: 1 }}>Follow</Button>
                <Button variant="outline" style={{ flex: 1 }}>Message</Button>
              </RowAtom>
            </StackAtom>
          </Card>
        </Row>
        <Row label="Compact variant (collapsible)" tokens={tokens}>
          <Card variant="filled" padding="none" hoverable style={{ width: 280 }}>
            <Collapsible
              trigger={
                <RowAtom gap="3" align="center">
                  <Avatar alt="Jane Doe" size="md" />
                  <StackAtom gap="1">
                    <Text as="span" size="sm" weight="semibold">Jane Doe</Text>
                    <Text as="span" size="xs" color="secondary">Software Engineer</Text>
                  </StackAtom>
                </RowAtom>
              }
              defaultOpen
            >
              <RowAtom gap="2" justify="end">
                <Button variant="outline" size="sm">Message</Button>
                <Button variant="primary" size="sm">Follow</Button>
              </RowAtom>
            </Collapsible>
          </Card>
        </Row>
      </Section>

      <Section title="SettingsPanel" tokens={tokens} hidden={!showSection('SettingsPanel')}>
        <Row label="Notification settings" tokens={tokens}>
          <Card variant="elevated" padding="lg" style={{ width: 400 }}>
            <StackAtom gap="5">
              <RowAtom gap="2" align="center">
                <Text size="lg" weight="semibold">Notifications</Text>
                <Badge variant="accent">Pro</Badge>
              </RowAtom>
              <Divider />
              <StackAtom gap="4">
                <RowAtom justify="between">
                  <StackAtom gap="1">
                    <Text size="sm" weight="medium">Email alerts</Text>
                    <Text size="xs" color="secondary">Get notified when someone mentions you.</Text>
                  </StackAtom>
                  <Toggle defaultChecked />
                </RowAtom>
                <RowAtom justify="between">
                  <StackAtom gap="1">
                    <Text size="sm" weight="medium">Push notifications</Text>
                    <Text size="xs" color="secondary">Receive push notifications on your device.</Text>
                  </StackAtom>
                  <Toggle />
                </RowAtom>
                <RowAtom justify="between">
                  <StackAtom gap="1">
                    <Text size="sm" weight="medium">Digest frequency</Text>
                    <Text size="xs" color="secondary">How often to send summary emails.</Text>
                  </StackAtom>
                  <Select
                    defaultValue="weekly"
                    options={[
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'monthly', label: 'Monthly' },
                    ]}
                    size="sm"
                    style={{ width: 120 }}
                  />
                </RowAtom>
              </StackAtom>
              <Divider />
              <RowAtom gap="2" justify="end">
                <Button variant="ghost" size="sm">Reset</Button>
                <Button variant="primary" size="sm">Save changes</Button>
              </RowAtom>
            </StackAtom>
          </Card>
        </Row>
        <Row label="Drill-down with NavMenu" tokens={tokens}>
          <Card variant="elevated" padding="none" style={{ width: 560 }}>
            <RowAtom gap="0" align="stretch">
              <div style={{ width: 160, borderRight: `1px solid ${tokens.borderDefault}`, padding: tokens.space3, flexShrink: 0 }}>
                <NavMenu orientation="vertical" size="sm">
                  <NavMenu.Item as="button" isActive={settingsTab === 'profile'} onClick={() => setSettingsTab('profile')}>Profile</NavMenu.Item>
                  <NavMenu.Item as="button" isActive={settingsTab === 'notifications'} onClick={() => setSettingsTab('notifications')}>Notifications</NavMenu.Item>
                  <NavMenu.Item as="button" isActive={settingsTab === 'security'} onClick={() => setSettingsTab('security')}>Security</NavMenu.Item>
                </NavMenu>
              </div>
              <div style={{ flex: 1, padding: tokens.space5 }}>
                {settingsTab === 'profile' && (
                  <StackAtom gap="4">
                    <Text size="sm" weight="semibold">Profile</Text>
                    <FormField label="Display name" htmlFor="s-name">
                      <Input id="s-name" placeholder="Jane Doe" size="sm" />
                    </FormField>
                    <FormField label="Bio" htmlFor="s-bio">
                      <Textarea id="s-bio" placeholder="Tell us about yourself..." rows={2} />
                    </FormField>
                    <RowAtom gap="2" justify="end">
                      <Button variant="primary" size="sm">Save</Button>
                    </RowAtom>
                  </StackAtom>
                )}
                {settingsTab === 'notifications' && (
                  <StackAtom gap="4">
                    <Text size="sm" weight="semibold">Notifications</Text>
                    <RowAtom justify="between">
                      <StackAtom gap="1">
                        <Text size="sm" weight="medium">Email alerts</Text>
                        <Text size="xs" color="secondary">Get notified on mentions.</Text>
                      </StackAtom>
                      <Toggle defaultChecked />
                    </RowAtom>
                    <RowAtom justify="between">
                      <StackAtom gap="1">
                        <Text size="sm" weight="medium">Push notifications</Text>
                        <Text size="xs" color="secondary">Receive push on your device.</Text>
                      </StackAtom>
                      <Toggle />
                    </RowAtom>
                  </StackAtom>
                )}
                {settingsTab === 'security' && (
                  <StackAtom gap="4">
                    <Text size="sm" weight="semibold">Security</Text>
                    <RowAtom justify="between">
                      <StackAtom gap="1">
                        <Text size="sm" weight="medium">Two-factor auth</Text>
                        <Text size="xs" color="secondary">Add an extra layer of security.</Text>
                      </StackAtom>
                      <Toggle />
                    </RowAtom>
                    <FormField label="Current password" htmlFor="s-pass">
                      <Input id="s-pass" type="password" size="sm" />
                    </FormField>
                    <RowAtom gap="2" justify="end">
                      <Button variant="primary" size="sm">Update password</Button>
                    </RowAtom>
                  </StackAtom>
                )}
              </div>
            </RowAtom>
          </Card>
        </Row>
      </Section>

      <Section title="StatsRow" tokens={tokens} hidden={!showSection('StatsRow')}>
        <Row label="Stat cards with trends" tokens={tokens}>
          <RowAtom gap="3" wrap>
            <Card variant="outline" padding="md" style={{ flex: 1, minWidth: 180 }}>
              <StackAtom gap="3">
                <Text size="xs" color="secondary" weight="medium">Total Events</Text>
                <Text size="2xl" weight="bold" family="display">32</Text>
                <RowAtom gap="2" align="center">
                  <Chip variant="success" size="sm" borderless>+20%</Chip>
                  <Text size="xs" color="secondary">25 last week</Text>
                </RowAtom>
              </StackAtom>
            </Card>
            <Card variant="outline" padding="md" style={{ flex: 1, minWidth: 180 }}>
              <StackAtom gap="3">
                <Text size="xs" color="secondary" weight="medium">Total Hours</Text>
                <Text size="2xl" weight="bold" family="display">38.2 hr</Text>
                <RowAtom gap="2" align="center">
                  <Chip variant="danger" size="sm" borderless>-8%</Chip>
                  <Text size="xs" color="secondary">42.0 hr last week</Text>
                </RowAtom>
              </StackAtom>
            </Card>
            <Card variant="outline" padding="md" style={{ flex: 1, minWidth: 180 }}>
              <StackAtom gap="3">
                <Text size="xs" color="secondary" weight="medium">Focus Time</Text>
                <Text size="2xl" weight="bold" family="display">16.8 hr</Text>
                <RowAtom gap="2" align="center">
                  <Chip variant="success" size="sm" borderless>+12%</Chip>
                  <Text size="xs" color="secondary">14.4 hr last week</Text>
                </RowAtom>
              </StackAtom>
            </Card>
          </RowAtom>
        </Row>
        <Row label="Revenue stat cards" tokens={tokens}>
          <RowAtom gap="3" wrap>
            <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 180 }}>
              <StackAtom gap="3">
                <RowAtom gap="2" align="center">
                  <Avatar alt="Airbnb" size="sm" />
                  <StackAtom gap="0">
                    <Text size="sm" weight="semibold">Airbnb</Text>
                    <Text size="xs" color="secondary">Travel and tourism</Text>
                  </StackAtom>
                </RowAtom>
                <RowAtom justify="between" align="end">
                  <StackAtom gap="1">
                    <RowAtom gap="2" align="baseline">
                      <Text size="lg" weight="bold" family="display">$33.2k</Text>
                      <Chip variant="success" size="sm" borderless>+37%</Chip>
                    </RowAtom>
                    <Text size="xs" color="secondary">Recurring Revenue</Text>
                  </StackAtom>
                </RowAtom>
              </StackAtom>
            </Card>
            <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 180 }}>
              <StackAtom gap="3">
                <RowAtom gap="2" align="center">
                  <Avatar alt="MailChimp" size="sm" />
                  <StackAtom gap="0">
                    <Text size="sm" weight="semibold">MailChimp</Text>
                    <Text size="xs" color="secondary">Email Marketing</Text>
                  </StackAtom>
                </RowAtom>
                <RowAtom justify="between" align="end">
                  <StackAtom gap="1">
                    <RowAtom gap="2" align="baseline">
                      <Text size="lg" weight="bold" family="display">$3.2k</Text>
                      <Chip variant="danger" size="sm" borderless>-23%</Chip>
                    </RowAtom>
                    <Text size="xs" color="secondary">Recurring Revenue</Text>
                  </StackAtom>
                </RowAtom>
              </StackAtom>
            </Card>
            <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 180 }}>
              <StackAtom gap="3">
                <RowAtom gap="2" align="center">
                  <Avatar alt="Hubspot" size="sm" />
                  <StackAtom gap="0">
                    <Text size="sm" weight="semibold">Hubspot</Text>
                    <Text size="xs" color="secondary">CRM Software</Text>
                  </StackAtom>
                </RowAtom>
                <RowAtom justify="between" align="end">
                  <StackAtom gap="1">
                    <RowAtom gap="2" align="baseline">
                      <Text size="lg" weight="bold" family="display">$50.2k</Text>
                      <Chip variant="success" size="sm" borderless>+45%</Chip>
                    </RowAtom>
                    <Text size="xs" color="secondary">Recurring Revenue</Text>
                  </StackAtom>
                </RowAtom>
              </StackAtom>
            </Card>
          </RowAtom>
        </Row>
      </Section>

      <Section title="ActionBar" tokens={tokens} hidden={!showSection('ActionBar')}>
        <Row label="Page header with breadcrumb" tokens={tokens}>
          <StackAtom gap="4" style={{ width: '100%', maxWidth: 600 }}>
            <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Acme Corp' }]} />
            <RowAtom justify="between" align="end">
              <StackAtom gap="1">
                <Text as="h1" size="3xl" weight="bold" family="display">Acme Corp</Text>
                <Text size="sm" color="secondary">Last updated 5 minutes ago</Text>
              </StackAtom>
              <RowAtom gap="2">
                <Button variant="outline" size="sm">Export</Button>
                <Button variant="primary" size="sm">New report</Button>
              </RowAtom>
            </RowAtom>
            <Divider />
          </StackAtom>
        </Row>
        <Row label="Page header — danger zone" tokens={tokens}>
          <StackAtom gap="4" style={{ width: '100%', maxWidth: 600 }}>
            <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Settings', href: '#' }, { label: 'Danger zone' }]} />
            <RowAtom justify="between" align="end">
              <StackAtom gap="1">
                <Text as="h1" size="3xl" weight="bold" family="display">Danger zone</Text>
                <Text size="sm" color="secondary">These actions are irreversible.</Text>
              </StackAtom>
              <Button variant="danger" size="sm">Delete project</Button>
            </RowAtom>
            <Divider />
          </StackAtom>
        </Row>
        <Row label="Card header (compact)" tokens={tokens}>
          <Card variant="outline" padding="md" style={{ width: 400 }}>
            <StackAtom gap="4">
              <RowAtom justify="between" align="start">
                <StackAtom gap="1">
                  <Text size="xs" color="secondary" weight="medium" style={{ letterSpacing: 'var(--lucent-letter-spacing-wide)', textTransform: 'uppercase' }}>Activity</Text>
                  <Text size="md" weight="semibold" style={{ letterSpacing: 'var(--lucent-letter-spacing-tight)' }}>Recent activity</Text>
                </StackAtom>
                <RowAtom gap="1">
                  <Button variant="ghost" size="xs">Filter</Button>
                  <Button variant="ghost" size="xs">Export</Button>
                </RowAtom>
              </RowAtom>
              <StackAtom gap="2">
                <Text size="xs" color="secondary">No activity to show yet.</Text>
              </StackAtom>
            </StackAtom>
          </Card>
        </Row>
      </Section>

      <Section title="ConfirmationDialog" tokens={tokens} hidden={!showSection('ConfirmationDialog')}>
        <Row label="Destructive confirmation" tokens={tokens}>
          <Card variant="elevated" padding="lg" style={{ maxWidth: 400 }}>
            <StackAtom gap="8" align="center">
              <Icon size="xl" color="var(--lucent-danger-text)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1={12} y1={9} x2={12} y2={13} />
                  <line x1={12} y1={17} x2={12.01} y2={17} />
                </svg>
              </Icon>
              <StackAtom gap="1" align="center">
                <Text size="lg" weight="semibold">Delete project?</Text>
                <Text size="sm" color="secondary" align="center">This will permanently delete &quot;Acme Corp&quot; and all of its data. This action cannot be undone.</Text>
              </StackAtom>
              <RowAtom gap="3" style={{ width: '100%' }}>
                <Button variant="outline" style={{ flex: 1 }}>Cancel</Button>
                <Button variant="danger" style={{ flex: 1 }}>Delete</Button>
              </RowAtom>
            </StackAtom>
          </Card>
        </Row>
        <Row label="With typed confirmation" tokens={tokens}>
          <Card variant="elevated" padding="lg" style={{ maxWidth: 400 }}>
            <StackAtom gap="8" align="center">
              <Icon size="xl" color="var(--lucent-danger-text)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1={12} y1={9} x2={12} y2={13} />
                  <line x1={12} y1={17} x2={12.01} y2={17} />
                </svg>
              </Icon>
              <StackAtom gap="1" align="center">
                <Text size="lg" weight="semibold">Delete your account?</Text>
                <Text size="sm" color="secondary" align="center">All projects, data, and billing history will be permanently removed. Type DELETE to confirm.</Text>
              </StackAtom>
              <Input placeholder="Type DELETE to confirm" size="md" style={{ width: '100%' }} />
              <RowAtom gap="3" style={{ width: '100%' }}>
                <Button variant="outline" style={{ flex: 1 }}>Cancel</Button>
                <Button variant="danger" style={{ flex: 1 }} disabled>Delete account</Button>
              </RowAtom>
            </StackAtom>
          </Card>
        </Row>
        <Row label="Non-destructive confirmation" tokens={tokens}>
          <Card variant="elevated" padding="lg" style={{ maxWidth: 400 }}>
            <StackAtom gap="8" align="center">
              <Icon size="xl" color="var(--lucent-info-text)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx={12} cy={12} r={10} />
                  <line x1={12} y1={16} x2={12} y2={12} />
                  <line x1={12} y1={8} x2={12.01} y2={8} />
                </svg>
              </Icon>
              <StackAtom gap="1" align="center">
                <Text size="lg" weight="semibold">Publish changes?</Text>
                <Text size="sm" color="secondary" align="center">This will make your draft visible to all team members. You can unpublish later from settings.</Text>
              </StackAtom>
              <RowAtom gap="3" style={{ width: '100%' }}>
                <Button variant="outline" style={{ flex: 1 }}>Keep as draft</Button>
                <Button variant="primary" style={{ flex: 1 }}>Publish</Button>
              </RowAtom>
            </StackAtom>
          </Card>
        </Row>
      </Section>

      <Section title="BulkActionBar" tokens={tokens} hidden={!showSection('BulkActionBar')}>
        <Row label="Default (ButtonGroup actions)" tokens={tokens}>
          <RowAtom gap="3" align="center" style={{ width: '100%', maxWidth: 600, padding: 'var(--lucent-space-3) var(--lucent-space-4)', background: tokens.surface, borderRadius: 'var(--lucent-radius-lg)', border: `1px solid ${tokens.borderDefault}` }}>
            <Checkbox indeterminate checked onChange={() => {}} />
            <Text size="sm" weight="semibold">3 selected</Text>
            <Divider orientation="vertical" />
            <ButtonGroup>
              <Button variant="outline" size="sm">Export</Button>
              <Button variant="outline" size="sm">Archive</Button>
              <Button variant="danger-outline" size="sm">Delete</Button>
            </ButtonGroup>
            <RowAtom style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm">Clear selection</Button>
            </RowAtom>
          </RowAtom>
        </Row>
        <Row label="Minimal (single action)" tokens={tokens}>
          <RowAtom gap="3" align="center" style={{ width: '100%', maxWidth: 600, padding: 'var(--lucent-space-3) var(--lucent-space-4)', background: tokens.surface, borderRadius: 'var(--lucent-radius-lg)', border: `1px solid ${tokens.borderDefault}` }}>
            <Checkbox checked onChange={() => {}} />
            <Text size="sm" weight="semibold">12 selected</Text>
            <RowAtom style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Button variant="danger" size="sm">Delete selected</Button>
            </RowAtom>
          </RowAtom>
        </Row>
        <Row label="With count and secondary actions" tokens={tokens}>
          <RowAtom gap="3" align="center" style={{ width: '100%', maxWidth: 600, padding: 'var(--lucent-space-3) var(--lucent-space-4)', background: tokens.surface, borderRadius: 'var(--lucent-radius-lg)', border: `1px solid ${tokens.borderDefault}` }}>
            <Checkbox indeterminate checked onChange={() => {}} />
            <RowAtom gap="2" align="center">
              <Text size="sm" weight="semibold">5 of 24 selected</Text>
              <Button variant="ghost" size="xs">Select all</Button>
            </RowAtom>
            <Divider orientation="vertical" />
            <Button variant="outline" size="sm">Assign label</Button>
            <Button variant="outline" size="sm">Move to</Button>
            <Button variant="danger-outline" size="sm">Delete</Button>
            <RowAtom style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm">Clear</Button>
            </RowAtom>
          </RowAtom>
        </Row>
      </Section>

      <Section title="FormLayout" tokens={tokens} hidden={!showSection('FormLayout')}>
        <Row label="Full form" tokens={tokens}>
          <Card variant="elevated" padding="lg" style={{ width: 480 }}>
            <StackAtom as="form" gap="6">
              <StackAtom gap="1">
                <Text as="h2" size="lg" weight="semibold">Create project</Text>
                <Text size="sm" color="secondary">Fill in the details to set up your new project.</Text>
              </StackAtom>
              <StackAtom gap="4">
                <RowAtom gap="4">
                  <FormField label="First name" htmlFor="r-fname" required style={{ flex: 1 }}>
                    <Input id="r-fname" placeholder="Jane" />
                  </FormField>
                  <FormField label="Last name" htmlFor="r-lname" required style={{ flex: 1 }}>
                    <Input id="r-lname" placeholder="Doe" />
                  </FormField>
                </RowAtom>
                <FormField label="Email" htmlFor="r-email" helperText="We'll never share your email.">
                  <Input id="r-email" type="email" placeholder="jane@example.com" />
                </FormField>
                <FormField label="Role" htmlFor="r-role">
                  <Select
                    id="r-role"
                    placeholder="Select a role..."
                    options={[
                      { value: 'admin', label: 'Admin' },
                      { value: 'editor', label: 'Editor' },
                      { value: 'viewer', label: 'Viewer' },
                    ]}
                  />
                </FormField>
              </StackAtom>
              <Divider />
              <StackAtom gap="4">
                <FormField label="Bio" htmlFor="r-bio">
                  <Textarea id="r-bio" placeholder="Tell us about yourself..." rows={3} />
                </FormField>
                <Checkbox label="I agree to the terms" contained />
              </StackAtom>
              <RowAtom gap="2" justify="end">
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Create</Button>
              </RowAtom>
            </StackAtom>
          </Card>
        </Row>
        <Row label="Inline login form" tokens={tokens}>
          <StackAtom as="form" gap="4" style={{ maxWidth: 320 }}>
            <FormField label="Username" htmlFor="r-user" required helperText="Letters and numbers only, 3–20 chars.">
              <Input id="r-user" placeholder="yourname" />
            </FormField>
            <FormField label="Password" htmlFor="r-pass" required>
              <Input id="r-pass" type="password" />
            </FormField>
            <Button variant="primary">Sign in</Button>
          </StackAtom>
        </Row>
      </Section>

      <Section title="EmptyStateCard" tokens={tokens} hidden={!showSection('EmptyStateCard')}>
        <Row label="No results" tokens={tokens}>
          <Card variant="outline" padding="lg" style={{ width: 400 }}>
            <EmptyState
              illustration={
                <Icon size="xl">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx={11} cy={11} r={8} />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </Icon>
              }
              title="No results found"
              description="Try adjusting your search or filters to find what you're looking for."
              action={<Button variant="secondary" size="sm">Clear filters</Button>}
            />
          </Card>
        </Row>
        <Row label="Getting started" tokens={tokens}>
          <Card variant="elevated" padding="lg" style={{ width: 400 }}>
            <EmptyState
              illustration={
                <Icon size="xl">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </Icon>
              }
              title="No projects yet"
              description="Create your first project to get started."
              action={<Button variant="primary" size="sm">Create project</Button>}
            />
          </Card>
        </Row>
        <Row label="Error with retry" tokens={tokens}>
          <Card variant="outline" padding="lg" style={{ width: 400 }}>
            <EmptyState
              illustration={
                <Icon size="xl">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx={12} cy={12} r={10} />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                </Icon>
              }
              title="Something went wrong"
              description="We couldn't load your data. Please try again."
              action={<Button variant="outline" size="sm">Retry</Button>}
            />
          </Card>
        </Row>
      </Section>

      <Section title="ProductItemCard" tokens={tokens} hidden={!showSection('ProductItemCard')}>
        <Row label="Product card (default)" tokens={tokens}>
          <Card
            variant="elevated"
            padding="lg"
            style={{ width: 320 }}
            media={
              <div style={{ height: 180, background: `linear-gradient(135deg, ${tokens.surfaceRaised} 0%, color-mix(in srgb, ${tokens.accentDefault} 12%, ${tokens.surfaceRaised}) 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size="xl" color={tokens.textSecondary}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0118 0v6" />
                    <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
                  </svg>
                </Icon>
              </div>
            }
          >
            <StackAtom gap="4">
              <StackAtom gap="1">
                <Text size="md" weight="semibold">Wireless Headphones</Text>
                <Text size="sm" color="secondary">Active noise cancelling, 40hr battery</Text>
              </StackAtom>
              <RowAtom gap="2" wrap>
                <Chip variant="neutral" size="sm">Audio</Chip>
                <Chip variant="neutral" size="sm">Bluetooth</Chip>
                <Chip variant="neutral" size="sm">ANC</Chip>
              </RowAtom>
              <RowAtom gap="4" justify="between" align="baseline">
                <Text size="lg" weight="bold" family="display">$249.00</Text>
                <Text size="xs" color="secondary">Free shipping</Text>
              </RowAtom>
              <Button variant="primary" style={{ width: '100%' }}>Add to Cart</Button>
            </StackAtom>
          </Card>
        </Row>
        <Row label="Article card variant" tokens={tokens}>
          <Card variant="outline" padding="lg" hoverable style={{ width: 340 }}>
            <StackAtom gap="4">
              <RowAtom gap="3" align="start">
                <Icon size="lg" color="var(--lucent-text-secondary)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1={16} y1={13} x2={8} y2={13} />
                    <line x1={16} y1={17} x2={8} y2={17} />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </Icon>
                <StackAtom gap="1" style={{ flex: 1 }}>
                  <Text size="md" weight="semibold">Design Tokens at Scale</Text>
                  <Text size="xs" color="secondary">Published Mar 15, 2026</Text>
                </StackAtom>
              </RowAtom>
              <Text size="sm" color="secondary">
                How we unified spacing, color, and typography across 12 product surfaces using a single token system.
              </Text>
              <RowAtom gap="2" wrap>
                <Chip variant="neutral" size="sm">Design Systems</Chip>
                <Chip variant="neutral" size="sm">Tokens</Chip>
              </RowAtom>
              <RowAtom gap="4" justify="between" align="center">
                <Text size="xs" color="secondary">8 min read</Text>
                <Button variant="ghost" size="sm">Read more</Button>
              </RowAtom>
            </StackAtom>
          </Card>
        </Row>
        <Row label="Team member card variant" tokens={tokens}>
          <Card variant="filled" padding="lg" style={{ width: 280 }}>
            <StackAtom gap="4">
              <StackAtom gap="3" align="center">
                <Avatar alt="Alex Chen" size="lg" />
                <StackAtom gap="0" align="center">
                  <Text size="md" weight="semibold">Alex Chen</Text>
                  <Text size="sm" color="secondary">Engineering Lead</Text>
                </StackAtom>
              </StackAtom>
              <RowAtom gap="2" wrap justify="center">
                <Chip variant="neutral" size="sm">React</Chip>
                <Chip variant="neutral" size="sm">Go</Chip>
                <Chip variant="neutral" size="sm">Platform</Chip>
              </RowAtom>
              <RowAtom gap="3">
                <Button variant="outline" style={{ flex: 1 }} size="sm">Profile</Button>
                <Button variant="primary" style={{ flex: 1 }} size="sm">Message</Button>
              </RowAtom>
            </StackAtom>
          </Card>
        </Row>
      </Section>

      <Section title="AnnouncementCard" tokens={tokens} hidden={!showSection('AnnouncementCard')}>
        <Row label="Feature announcement with media" tokens={tokens}>
          <Card
            variant="elevated"
            padding="lg"
            style={{ width: 380 }}
            media={
              <div style={{ height: 160, background: `linear-gradient(135deg, color-mix(in srgb, ${tokens.accentDefault} 15%, ${tokens.surfaceRaised}) 0%, color-mix(in srgb, ${tokens.accentDefault} 5%, ${tokens.surfaceRaised}) 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size="xl" color={tokens.accentDefault}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <path d="M7 16l4-8 4 4 4-6" />
                  </svg>
                </Icon>
              </div>
            }
          >
            <StackAtom gap="4">
              <RowAtom gap="2">
                <Chip variant="accent" size="sm">New Feature</Chip>
              </RowAtom>
              <StackAtom gap="1">
                <Text size="md" weight="semibold">Redesigned Analytics Dashboard</Text>
                <Text size="sm" color="secondary">Track key metrics at a glance with our new real-time dashboard. Includes custom date ranges, export to CSV, and team sharing.</Text>
              </StackAtom>
              <RowAtom gap="2">
                <Button variant="primary" size="sm">Try it now</Button>
                <Button variant="ghost" size="sm">Learn more</Button>
              </RowAtom>
            </StackAtom>
          </Card>
        </Row>
        <Row label="System notice (no media)" tokens={tokens}>
          <Card variant="outline" padding="md" style={{ width: 400, borderColor: 'var(--lucent-warning-default)' }}>
            <RowAtom gap="3" align="start">
              <Icon size="lg" color="var(--lucent-warning-text)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1={12} y1={9} x2={12} y2={13} />
                  <line x1={12} y1={17} x2={12.01} y2={17} />
                </svg>
              </Icon>
              <StackAtom gap="2" style={{ flex: 1 }}>
                <Text size="sm" weight="semibold">Storage almost full</Text>
                <Text size="sm" color="secondary">You've used 92% of your storage. Upgrade your plan or delete unused files to free up space.</Text>
                <RowAtom gap="2">
                  <Button variant="primary" size="sm">Upgrade plan</Button>
                  <Button variant="ghost" size="sm">Manage storage</Button>
                </RowAtom>
              </StackAtom>
            </RowAtom>
          </Card>
        </Row>
        <Row label="Promotional banner with thumbnail" tokens={tokens}>
          <Card variant="filled" padding="md" hoverable style={{ width: 380 }}>
            <RowAtom gap="5" align="center">
              <div style={{ width: 80, height: 80, borderRadius: 'var(--lucent-radius-lg)', overflow: 'hidden', flexShrink: 0, background: `linear-gradient(135deg, color-mix(in srgb, var(--lucent-success-default) 20%, ${tokens.surfaceRaised}) 0%, ${tokens.surfaceRaised} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size="lg" color="var(--lucent-success-text)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                    <line x1={7} y1={7} x2={7.01} y2={7} />
                  </svg>
                </Icon>
              </div>
              <StackAtom gap="2" style={{ flex: 1 }}>
                <RowAtom gap="2" align="center">
                  <Text size="md" weight="semibold">Spring Sale</Text>
                  <Chip variant="success" size="sm">-30%</Chip>
                </RowAtom>
                <Text size="sm" color="secondary">All Pro plans are 30% off through April. Upgrade now and lock in the price for a year.</Text>
                <Button variant="primary" size="sm" style={{ alignSelf: 'flex-start' }}>Claim offer</Button>
              </StackAtom>
            </RowAtom>
          </Card>
        </Row>
        <Row label="Success confirmation" tokens={tokens}>
          <Card variant="outline" padding="md" style={{ width: 400, borderColor: 'var(--lucent-success-default)' }}>
            <RowAtom gap="3" align="start">
              <Icon size="lg" color="var(--lucent-success-text)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </Icon>
              <StackAtom gap="1" style={{ flex: 1 }}>
                <Text size="sm" weight="semibold">Payment received</Text>
                <Text size="sm" color="secondary">Your invoice #1042 for $2,400.00 has been paid successfully.</Text>
              </StackAtom>
              <Button variant="ghost" size="sm">Dismiss</Button>
            </RowAtom>
          </Card>
        </Row>
      </Section>

      <Section title="CollapsibleCard" tokens={tokens} hidden={!showSection('CollapsibleCard')}>
        <Row label="Variants" tokens={tokens}>
          <Card variant="ghost" padding="none" hoverable style={{ width: 320 }}>
            <Collapsible trigger={<Text as="span" weight="semibold" size="sm">Ghost</Text>} defaultOpen>
              <Text size="sm" color="secondary">Transparent container — content floats on the page surface.</Text>
            </Collapsible>
          </Card>
          <Card variant="outline" padding="none" hoverable style={{ width: 320 }}>
            <Collapsible trigger={<Text as="span" weight="semibold" size="sm">Outline</Text>} defaultOpen>
              <Text size="sm" color="secondary">Subtle border, no fill — the most common CollapsibleCard variant.</Text>
            </Collapsible>
          </Card>
          <Card variant="filled" padding="none" hoverable style={{ width: 320 }}>
            <Collapsible trigger={<Text as="span" weight="semibold" size="sm">Filled</Text>} defaultOpen>
              <Text size="sm" color="secondary">Tinted surface for visual grouping within a page section.</Text>
            </Collapsible>
          </Card>
          <Card variant="elevated" padding="none" hoverable style={{ width: 320 }}>
            <Collapsible trigger={<Text as="span" weight="semibold" size="sm">Elevated</Text>} defaultOpen>
              <Text size="sm" color="secondary">Shadow for prominent collapsible sections.</Text>
            </Collapsible>
          </Card>
        </Row>
        <Row label="Combo (two-tone)" tokens={tokens}>
          <Card variant="filled" padding="none" hoverable style={{ width: 360 }}>
            <Collapsible open={comboOpen} onOpenChange={setComboOpen} padded={false} trigger={<Text as="span" weight="semibold" size="sm">Combo layout</Text>}>
              <Card variant="elevated" padding="sm" style={{ margin: 'var(--lucent-space-1) var(--lucent-space-2) var(--lucent-space-2)' }}>
                <Text size="sm" color="secondary">Two-tone layout — flat trigger surface, elevated body.</Text>
              </Card>
            </Collapsible>
          </Card>
        </Row>
      </Section>

      <Section title="SearchFilterBar" tokens={tokens} hidden={!showSection('SearchFilterBar')}>
        <Row label="Candidates — compact filter bar" tokens={tokens}>
          <RowAtom gap="2" align="center" wrap>
            <FilterSearch placeholder="Search by name, email, or skill…" size="sm" />
            <FilterSelect label="Availability" size="sm" options={[
              { value: 'all', label: 'All' },
              { value: 'available', label: 'Available' },
              { value: 'notice', label: 'On notice' },
              { value: 'unavailable', label: 'Unavailable' },
            ]} />
            <FilterMultiSelect label="Status" size="sm" options={[
              { value: 'active', label: 'Active' },
              { value: 'archived', label: 'Archived' },
              { value: 'on-hold', label: 'On hold' },
            ]} value={[...sfbStatuses]} onChange={(vals) => setSfbStatuses(new Set(vals))} />
            <FilterMultiSelect label="Tags" size="sm" options={sfbTagOptions} value={[...sfbTags]} onChange={(vals) => setSfbTags(new Set(vals))} />
            <FilterDateRange label="Date range" size="sm" value={sfbDateRange} onChange={setSfbDateRange} />
            {sfbHasFilters && <Button variant="ghost" size="sm" onClick={sfbClearAll}>Clear all</Button>}
            <div style={{ flex: 1 }} />
            <RowAtom gap="2" align="center">
              <Menu trigger={<Button variant="secondary" size="sm" chevron leftIcon={<svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 2v12M4 14l-3-3M4 14l3-3M12 14V2M12 2l-3 3M12 2l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}>Newest first</Button>} size="sm">
                <MenuItem selected onSelect={() => {}}>Newest first</MenuItem>
                <MenuItem onSelect={() => {}}>Oldest first</MenuItem>
                <MenuItem onSelect={() => {}}>Name A–Z</MenuItem>
              </Menu>
              <SegmentedControl
                size="sm"
                defaultValue="grid"
                options={[
                  { value: 'grid', label: <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg> },
                  { value: 'list', label: <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 3h12M2 8h12M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
                ]}
              />
            </RowAtom>
          </RowAtom>
        </Row>
        <Row label="Filter bar + DataTable" tokens={tokens}>
          <StackAtom gap="3" style={{ width: '100%' }}>
            <RowAtom gap="2" align="center" wrap>
              <FilterSearch placeholder="Search by name or role…" size="sm" value={sfbSearch} onChange={setSfbSearch} />
              <FilterMultiSelect label="Status" size="sm" options={[
                { value: 'active', label: 'Active' },
                { value: 'archived', label: 'Archived' },
                { value: 'on-hold', label: 'On hold' },
              ]} value={[...sfbStatuses]} onChange={(vals) => setSfbStatuses(new Set(vals))} />
              <FilterMultiSelect label="Tags" size="sm" options={sfbTagOptions} value={[...sfbTags]} onChange={(vals) => setSfbTags(new Set(vals))} />
              <FilterDateRange label="Date added" size="sm" value={sfbDateRange} onChange={setSfbDateRange} />
            </RowAtom>
            {sfbHasFilters && (
              <RowAtom gap="2" align="center">
                <Text size="sm" color="secondary">
                  Showing {sfbFilteredCandidates.length} of {sfbCandidates.length} candidates
                </Text>
                <Button variant="ghost" size="xs" onClick={sfbClearAll}>Clear all</Button>
              </RowAtom>
            )}
            <DataTable
              style={{ width: '100%' }}
              pageSize={5}
              columns={[
                { key: 'name', header: 'Name', sortable: true },
                { key: 'role', header: 'Role', sortable: true },
                { key: 'status', header: 'Status',
                  headerFilter: (
                    <FilterMultiSelect label="" variant="ghost" size="xs" options={[
                      { value: 'active', label: 'Active' },
                      { value: 'archived', label: 'Archived' },
                      { value: 'on-hold', label: 'On hold' },
                    ]} value={[...sfbStatuses]} onChange={(vals) => setSfbStatuses(new Set(vals))} icon={<svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 3h12M4 8h8M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>} />
                  ),
                  render: (row: typeof sfbCandidates[0]) => <Chip size="sm" variant={row.status === 'Active' ? 'success' : row.status === 'Archived' ? 'neutral' : 'warning'} dot>{row.status}</Chip> },
                { key: 'tags', header: 'Tags',
                  headerFilter: (
                    <FilterMultiSelect label="" variant="ghost" size="xs" options={sfbTagOptions} value={[...sfbTags]} onChange={(vals) => setSfbTags(new Set(vals))} icon={<svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 3h12M4 8h8M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>} />
                  ),
                  render: (row: typeof sfbCandidates[0]) => <RowAtom gap="1" wrap>{row.tags.map(t => <Chip key={t} size="sm" swatch={{ 'data-science': '#6366f1', devops: '#10b981', hot: '#f59e0b', react: '#3b82f6' }[t]}>{t}</Chip>)}</RowAtom> },
                { key: 'added', header: 'Added', sortable: true, render: (row: typeof sfbCandidates[0]) => <Text size="sm" color="secondary">{row.added.toLocaleDateString()}</Text> },
              ]}
              rows={sfbFilteredCandidates}
              emptyState={<Text size="sm" color="secondary">No candidates match your filters.</Text>}
            />
          </StackAtom>
        </Row>
      </Section>

      {/* ─── Golden Compositions ─────────────────────────────────────────── */}

      <Section title="Profile Card" tokens={tokens} hidden={!showSection('GoldenProfileCard')}>
        <Row label="Full composition" tokens={tokens}>
          <ProfileCard />
        </Row>
      </Section>

      <Section title="Preferences Card" tokens={tokens} hidden={!showSection('GoldenPreferencesCard')}>
        <Row label="Full composition" tokens={tokens}>
          <PreferencesCard />
        </Row>
      </Section>

      <Section title="Pricing Table" tokens={tokens} hidden={!showSection('GoldenPricingTable')}>
        <Row label="Full composition" tokens={tokens}>
          <PricingTable />
        </Row>
      </Section>

      <Section title="Notification Feed" tokens={tokens} hidden={!showSection('GoldenNotificationFeed')}>
        <Row label="Full composition" tokens={tokens}>
          <NotificationFeed />
        </Row>
      </Section>

      <Section title="Onboarding Flow" tokens={tokens} hidden={!showSection('GoldenOnboardingFlow')}>
        <Row label="Full composition" tokens={tokens}>
          <OnboardingFlow />
        </Row>
      </Section>

      <Section title="Dashboard Header" tokens={tokens} hidden={!showSection('GoldenDashboardHeader')}>
        <Row label="Full composition" tokens={tokens}>
          <DashboardHeader />
        </Row>
      </Section>

      </div>
      ) : tab === 'tokens' ? (
        <TokenPreview />
      ) : (
        <SelectPlayground />
      )}
    </PageLayout>
    </>
  );
}

function Section({ title, tokens, children, hidden }: { title: string; tokens: ReturnType<typeof useLucent>['tokens']; children: React.ReactNode; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <Card variant="outline" padding="lg" style={{ marginBottom: tokens.space6 }}>
      <Text as="h2" size="lg" weight="semibold" style={{ marginBottom: tokens.space5, marginTop: 0 }}>{title}</Text>
      <StackAtom gap="4">{children}</StackAtom>
    </Card>
  );
}

function Row({ label, tokens, children }: { label: string; tokens: ReturnType<typeof useLucent>['tokens']; children: React.ReactNode }) {
  return (
    <StackAtom gap="2">
      <span style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, fontFamily: tokens.fontFamilyMono, letterSpacing: tokens.letterSpacingWide, textTransform: 'uppercase' }}>{label}</span>
      <RowAtom gap="3" wrap>{children}</RowAtom>
    </StackAtom>
  );
}
