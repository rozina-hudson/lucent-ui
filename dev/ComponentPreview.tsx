import { useState, useEffect, useRef } from 'react';
import { LucentProvider, useLucent, brandTokens } from '../src/index.js';
import { adjustLightness, getThemeComplementBorderColor, deriveBorderVariants } from '../src/tokens/color.js';
import { Button } from '../src/components/atoms/Button/index.js';
import { Input } from '../src/components/atoms/Input/index.js';
import { Textarea } from '../src/components/atoms/Textarea/index.js';
import { Badge } from '../src/components/atoms/Badge/index.js';
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
import { Card } from '../src/components/molecules/Card/index.js';
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
import { DataTable } from '../src/components/molecules/DataTable/index.js';
import { CommandPalette } from '../src/components/molecules/CommandPalette/index.js';
import { MultiSelect } from '../src/components/molecules/MultiSelect/index.js';
import { DatePicker } from '../src/components/molecules/DatePicker/index.js';
import { DateRangePicker } from '../src/components/molecules/DateRangePicker/index.js';
import { FileUpload } from '../src/components/molecules/FileUpload/index.js';
import { Timeline } from '../src/components/molecules/Timeline/index.js';
import type { LucentTokens, Theme, UploadFile } from '../src/index.js';

type AccentPreset = 'default' | 'gold' | 'indigo';

const indigoTokens: Partial<LucentTokens> = {
  accentDefault: '#4f46e5',
  accentHover: '#4338ca',
  accentActive: '#3730a3',
  accentSubtle: '#eef2ff',
  focusRing: '#4f46e5',
};

const accentLabel: Record<AccentPreset, string> = {
  default: 'Default (monochrome)',
  gold: 'Gold (brandTokens)',
  indigo: 'Indigo',
};

function NavIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
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

export function ComponentPreview() {
  const [theme, setTheme] = useState<Theme>('light');
  const [accent, setAccent] = useState<AccentPreset>('default');
  const [overrides, setOverrides] = useState<Partial<LucentTokens>>({});

  const tokenPreset =
    accent === 'gold' ? brandTokens :
    accent === 'indigo' ? indigoTokens :
    undefined;

  const mergedTokens: Partial<LucentTokens> = {
    ...(tokenPreset || {}),
    ...overrides,
  };

  const handleTokenChange = (key: keyof LucentTokens, value: string) => {
    setOverrides(prev => ({ ...prev, [key]: value }));
  };

  const clearOverrides = () => setOverrides({});

  return (
    <LucentProvider theme={theme} tokens={mergedTokens}>
      <Inner
        theme={theme}
        accent={accent}
        overrides={overrides}
        onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        onSetAccent={setAccent}
        onChangeOverride={handleTokenChange}
        clearOverrides={clearOverrides}
      />
    </LucentProvider>
  );
}

function Inner({
  theme,
  accent,
  overrides,
  onToggleTheme,
  onSetAccent,
  onChangeOverride,
  clearOverrides,
}: {
  theme: Theme;
  accent: AccentPreset;
  overrides: Partial<LucentTokens>;
  onToggleTheme: () => void;
  onSetAccent: (p: AccentPreset) => void;
  onChangeOverride: (key: keyof LucentTokens, value: string) => void;
  clearOverrides: () => void;
}) {
  const { tokens } = useLucent();
  const [inputVal, setInputVal] = useState('');
  const [textareaVal, setTextareaVal] = useState('');
  const [deriveAccent, setDeriveAccent] = useState(true);
  const [deriveBorder, setDeriveBorder] = useState(true);
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState('option1');
  const [radioSize, setRadioSize] = useState('m');
  const [toggled, setToggled] = useState(false);
  const [sliderValue, setSliderValue] = useState(40);
  const [selectVal, setSelectVal] = useState('');
  const [tags, setTags] = useState(['React', 'TypeScript', 'Design Systems']);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertDismissed, setAlertDismissed] = useState(false);

  // font scale slider (percentage of base)
  const [fontScalePercent, setFontScalePercent] = useState(100);
  const baseFontSizesRef = useRef<Record<string, string>>({});

  // spacing scale slider
  const [spaceScalePercent, setSpaceScalePercent] = useState(100);
  const baseSpaceRef = useRef<Record<string, string>>({});

  const [radiusPx, setRadiusPx] = useState(() => {
    const raw = tokens.radiusLg;
    if (raw.endsWith('px')) return parseInt(raw);
    if (raw.endsWith('rem')) return Math.round(parseFloat(raw) * 16);
    return 0;
  });

  // track border colors per theme for context-aware derivation
  const borderColorsRef = useRef<{ light: string; dark: string }>({ light: '', dark: '' });

  // when deriveAccent toggled on or base color/theme changes, update other tokens
  useEffect(() => {
    if (deriveAccent) {
      const base = tokens.accentDefault;
      const hover = theme === 'light' ? adjustLightness(base, -0.08) : adjustLightness(base, 0.08);
      const active = theme === 'light' ? adjustLightness(base, -0.12) : adjustLightness(base, 0.12);
      const subtle = theme === 'light' ? adjustLightness(base, 0.8) : adjustLightness(base, -0.8);
      const border = theme === 'light' ? adjustLightness(base, -0.15) : adjustLightness(base, 0.15);
      onChangeOverride('accentHover', hover);
      onChangeOverride('accentActive', active);
      onChangeOverride('accentSubtle', subtle);
      onChangeOverride('accentBorder', border);
    }
  }, [deriveAccent, theme, tokens.accentDefault]);

  // when deriveBorder toggled on or base color/theme changes, update other tokens
  useEffect(() => {
    if (deriveBorder) {
      const base = tokens.borderDefault;
      const variants = deriveBorderVariants(base);
      onChangeOverride('borderSubtle', variants.subtle);
      onChangeOverride('borderStrong', variants.strong);
    }
  }, [deriveBorder, tokens.borderDefault]);

  // when theme changes, switch to the complementary border color for that theme
  useEffect(() => {
    if (deriveBorder) {
      const colorKey = theme === 'light' ? 'light' : 'dark';
      const otherKey = theme === 'light' ? 'dark' : 'light';

      // if we have a color stored for the current theme, use it
      if (borderColorsRef.current[colorKey]) {
        onChangeOverride('borderDefault', borderColorsRef.current[colorKey]);
      } else {
        // first time in this theme, compute complement of the other theme's color
        const currentColor = tokens.borderDefault;
        const complement = getThemeComplementBorderColor(currentColor);
        borderColorsRef.current[colorKey] = complement;
        onChangeOverride('borderDefault', complement);
      }
    }
  }, [theme, deriveBorder]);

  // keep slider in sync if token changes externally
  useEffect(() => {
    const raw = tokens.radiusLg;
    const px = raw.endsWith('px') ? parseInt(raw) : raw.endsWith('rem') ? Math.round(parseFloat(raw) * 16) : 0;
    setRadiusPx(px);
  }, [tokens.radiusLg, tokens.radiusMd, tokens.radiusSm, tokens.radiusXl, tokens.radiusFull]);

  // remember original font sizes once, then keep scale state updated
  useEffect(() => {
    if (Object.keys(baseFontSizesRef.current).length === 0) {
      [
        'fontSizeXs','fontSizeSm','fontSizeMd','fontSizeLg','fontSizeXl','fontSize2xl','fontSize3xl'
      ].forEach(k => {
        baseFontSizesRef.current[k] = tokens[k as keyof typeof tokens] as string;
      });
    }

    if (Object.keys(baseSpaceRef.current).length === 0) {
      Object.keys(tokens)
        .filter(k => k.startsWith('space'))
        .forEach(k => {
          baseSpaceRef.current[k] = tokens[k as keyof typeof tokens] as string;
        });
    }
  }, [tokens]);

  useEffect(() => {
    // if any font token changes outside the slider, recompute percent
    const raw = tokens.fontSizeMd;
    const baseRaw = baseFontSizesRef.current.fontSizeMd;
    if (baseRaw) {
      const num = parseFloat(raw);
      const baseNum = parseFloat(baseRaw);
      const percent = Math.round((num / baseNum) * 100);
      setFontScalePercent(percent);
    }
  }, [
    tokens.fontSizeXs,
    tokens.fontSizeSm,
    tokens.fontSizeMd,
    tokens.fontSizeLg,
    tokens.fontSizeXl,
    tokens.fontSize2xl,
    tokens.fontSize3xl,
  ]);

  useEffect(() => {
    // keep spacing slider in sync when spacing tokens change externally
    const raw = tokens.space4; // use mid-level token as reference
    const baseRaw = baseSpaceRef.current.space4;
    if (baseRaw) {
      const num = parseFloat(raw);
      const baseNum = parseFloat(baseRaw);
      const percent = Math.round((num / baseNum) * 100);
      setSpaceScalePercent(percent);
    }
  }, [tokens]);

  const allFruits = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange', 'Peach', 'Pear', 'Pineapple', 'Strawberry'];
  const searchResults = searchQuery.length > 0
    ? allFruits
        .filter(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((f, i) => ({ id: i, label: f }))
    : [];

  return (
    <div style={{ background: tokens.bgBase, color: tokens.textPrimary, fontFamily: tokens.fontFamilyBase, minHeight: '100vh', padding: tokens.space8, paddingRight: '280px' }}>
      {/* Header */}
      {/* Customizer sidebar */}
      <div style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: 240,
        overflowY: 'auto',
        padding: tokens.space4,
        background: tokens.surfaceDefault,
        borderLeft: `1px solid ${tokens.borderDefault}`,
        zIndex: 1000,
      }}>
        <h2 style={{ fontSize: tokens.fontSizeLg, fontWeight: tokens.fontWeightSemibold, marginTop: 0 }}>Customizer</h2>
        <div style={{ marginBottom: tokens.space6 }}>
          <Toggle label="Dark mode" checked={theme === 'dark'} onChange={onToggleTheme} />
          <div style={{ marginTop: tokens.space4, display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
            {(['default', 'gold', 'indigo'] as AccentPreset[]).map(p => (
              <button
                key={p}
                onClick={() => onSetAccent(p)}
                style={{
                  padding: `${tokens.space1} ${tokens.space3}`,
                  border: `1px solid ${accent === p ? tokens.accentDefault : tokens.borderDefault}`,
                  borderRadius: tokens.radiusMd,
                  background: accent === p ? tokens.accentDefault : tokens.surfaceDefault,
                  color: accent === p ? tokens.textOnAccent : tokens.textPrimary,
                  fontFamily: tokens.fontFamilyBase,
                  fontSize: tokens.fontSizeSm,
                  fontWeight: accent === p ? tokens.fontWeightSemibold : tokens.fontWeightRegular,
                  cursor: 'pointer',
                }}
              >
                {accentLabel[p]}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: tokens.space4 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: tokens.space2 }}>
            <input
              type="checkbox"
              checked={deriveAccent}
              onChange={e => setDeriveAccent(e.target.checked)}
            />
            <span style={{ fontSize: tokens.fontSizeSm }}>Derive variants from accentDefault</span>
          </label>
        </div>
        {(deriveAccent ? ['accentDefault'] : ['accentDefault', 'accentHover', 'accentActive', 'accentSubtle', 'accentBorder']).map(key => (
          <div key={key} style={{ marginBottom: tokens.space4 }}>
            <Input
              type="color"
              label={key}
              value={tokens[key as keyof typeof tokens] as string}
              onChange={e => {
                const val = e.target.value;
                onChangeOverride(key as keyof LucentTokens, val);
                if (deriveAccent && key === 'accentDefault') {
                  // compute derived tokens
                  const base = val;
                  const hover = theme === 'light' ? adjustLightness(base, -0.08) : adjustLightness(base, 0.08);
                  const active = theme === 'light' ? adjustLightness(base, -0.12) : adjustLightness(base, 0.12);
                  const subtle = theme === 'light' ? adjustLightness(base, 0.8) : adjustLightness(base, -0.8);
                  const border = theme === 'light' ? adjustLightness(base, -0.15) : adjustLightness(base, 0.15);
                  onChangeOverride('accentHover', hover);
                  onChangeOverride('accentActive', active);
                  onChangeOverride('accentSubtle', subtle);
                  onChangeOverride('accentBorder', border);
                }
              }}
            />
          </div>
        ))}

        {/* border color pickers */}
        <div style={{ marginTop: tokens.space6, marginBottom: tokens.space4, paddingTop: tokens.space4, borderTop: `1px solid ${tokens.borderDefault}` }}>
          <span style={{ fontSize: tokens.fontSizeSm, fontWeight: tokens.fontWeightSemibold, display: 'block', marginBottom: tokens.space3 }}>Border Colors</span>
        </div>
        <div style={{ marginBottom: tokens.space4 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: tokens.space2 }}>
            <input
              type="checkbox"
              checked={deriveBorder}
              onChange={e => setDeriveBorder(e.target.checked)}
            />
            <span style={{ fontSize: tokens.fontSizeSm }}>Derive variants from borderDefault</span>
          </label>
        </div>
        {(deriveBorder ? ['borderDefault'] : ['borderDefault', 'borderSubtle', 'borderStrong']).map(key => (
          <div key={key} style={{ marginBottom: tokens.space4 }}>
            <Input
              type="color"
              label={key}
              value={tokens[key as keyof typeof tokens] as string}
              onChange={e => {
                const val = e.target.value;
                onChangeOverride(key as keyof LucentTokens, val);
                if (deriveBorder && key === 'borderDefault') {
                  // store this color for the current theme
                  const colorKey = theme === 'light' ? 'light' : 'dark';
                  borderColorsRef.current[colorKey] = val;

                  // compute derived variants from the chosen color
                  const variants = deriveBorderVariants(val);
                  onChangeOverride('borderSubtle', variants.subtle);
                  onChangeOverride('borderStrong', variants.strong);
                }
              }}
            />
          </div>
        ))}

        {/* font size scale slider */}
        <div style={{ marginBottom: tokens.space4 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
            <span style={{ fontSize: tokens.fontSizeSm }}>Font scale ({fontScalePercent}%)</span>
            <input
              type="range"
              min={50}
              max={150}
              value={fontScalePercent}
              onChange={e => {
                const pct = parseInt(e.target.value);
                setFontScalePercent(pct);
                const scale = pct / 100;
                Object.entries(baseFontSizesRef.current).forEach(([key, val]) => {
                  const num = parseFloat(val);
                  const unit = val.replace(/[\d.]/g, '');
                  onChangeOverride(key as keyof LucentTokens, `${num * scale}${unit}`);
                });
              }}
            />
          </label>
        </div>

        {/* spacing scale slider */}
        <div style={{ marginBottom: tokens.space4 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
            <span style={{ fontSize: tokens.fontSizeSm }}>Spacing scale ({spaceScalePercent}%)</span>
            <input
              type="range"
              min={50}
              max={150}
              value={spaceScalePercent}
              onChange={e => {
                const pct = parseInt(e.target.value);
                setSpaceScalePercent(pct);
                const scale = pct / 100;
                Object.entries(baseSpaceRef.current).forEach(([key, val]) => {
                  const num = parseFloat(val);
                  const unit = val.replace(/[\d.]/g, '');
                  onChangeOverride(key as keyof LucentTokens, `${num * scale}${unit}`);
                });
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: tokens.space4 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
            <span style={{ fontSize: tokens.fontSizeSm }}>Border radius ({radiusPx}px)</span>
            <input
              type="range"
              min={0}
              max={32}
              value={radiusPx}
              onChange={e => {
                const v = parseInt(e.target.value);
                setRadiusPx(v);
                ['radiusSm','radiusMd','radiusLg','radiusXl','radiusFull'].forEach(k =>
                  onChangeOverride(k as keyof LucentTokens, `${v}px`)
                );
              }}
            />
          </label>
        </div>

        <Button size="sm" onClick={clearOverrides}>Reset</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: tokens.space8, flexWrap: 'wrap', gap: tokens.space4 }}>
        <div>
          <h1 style={{ fontSize: tokens.fontSize2xl, fontWeight: tokens.fontWeightBold, margin: 0 }}>Lucent UI — Component Preview</h1>
          <p style={{ color: tokens.textSecondary, margin: `${tokens.space1} 0 0`, fontSize: tokens.fontSizeSm }}>Molecules Wave 1 · Atoms Wave 1 + 2 · {theme} mode · {accentLabel[accent]}</p>
        </div>
      </div>

      {/* ── Molecules ── */}

      {/* Text */}
      <Section title="Text" tokens={tokens}>
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
      </Section>

      {/* FormField */}
      <Section title="FormField" tokens={tokens}>
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
      <Section title="SearchInput" tokens={tokens}>
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
      </Section>

      {/* Card */}
      <Section title="Card" tokens={tokens}>
        <Row label="Body only" tokens={tokens}>
          <Card style={{ width: 280 }}>
            <Text size="sm" color="secondary">A simple card with body content only.</Text>
          </Card>
        </Row>
        <Row label="Header + footer" tokens={tokens}>
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
          <Card padding="sm" shadow="none" radius="sm" style={{ width: 160 }}>
            <Text size="xs">sm padding, no shadow</Text>
          </Card>
          <Card padding="lg" shadow="lg" radius="lg" style={{ width: 160 }}>
            <Text size="xs">lg padding + shadow</Text>
          </Card>
        </Row>
      </Section>

      {/* Alert */}
      <Section title="Alert" tokens={tokens}>
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
      <Section title="EmptyState" tokens={tokens}>
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
      <Section title="Skeleton" tokens={tokens}>
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
      <Section title="Checkbox" tokens={tokens}>
        <Row label="Controlled" tokens={tokens}>
          <Checkbox label="Accept terms" checked={checked} onChange={e => setChecked(e.target.checked)} />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled checked" disabled checked />
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Checkbox size="sm" label="Small" defaultChecked />
          <Checkbox size="md" label="Medium" defaultChecked />
        </Row>
      </Section>

      {/* Radio */}
      <Section title="Radio" tokens={tokens}>
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
        <Row label="Group disabled" tokens={tokens}>
          <RadioGroup name="disabled-demo" value="a" onChange={() => {}} disabled>
            <Radio value="a" label="Option A" />
            <Radio value="b" label="Option B" />
          </RadioGroup>
        </Row>
      </Section>

      {/* Toggle */}
      <Section title="Toggle" tokens={tokens}>
        <Row label="Controlled" tokens={tokens}>
          <Toggle label="Dark mode" checked={toggled} onChange={e => setToggled(e.target.checked)} />
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Toggle size="sm" label="Small" defaultChecked />
          <Toggle size="md" label="Medium" defaultChecked />
          <Toggle size="lg" label="Large" defaultChecked />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <Toggle disabled label="Disabled off" />
          <Toggle disabled defaultChecked label="Disabled on" />
        </Row>
      </Section>

      {/* Slider */}
      <Section title="Slider" tokens={tokens}>
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

      {/* CodeBlock */}
      <Section title="CodeBlock" tokens={tokens}>
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
      </Section>

      {/* Table */}
      <Section title="Table" tokens={tokens}>
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
                ['variant', '"primary" | "secondary" | "ghost" | "danger"', '"primary"', 'Visual style of the button'],
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

      {/* Select */}
      <Section title="Select" tokens={tokens}>
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

      {/* Tag */}
      <Section title="Tag" tokens={tokens}>
        <Row label="Dismissible" tokens={tokens}>
          {tags.map(t => (
            <Tag key={t} onDismiss={() => setTags(prev => prev.filter(x => x !== t))}>{t}</Tag>
          ))}
          {tags.length === 0 && <span style={{ fontSize: tokens.fontSizeSm, color: tokens.textSecondary }}>All tags dismissed — refresh to reset</span>}
        </Row>
        <Row label="Variants (static)" tokens={tokens}>
          <Tag variant="neutral">Neutral</Tag>
          <Tag variant="accent">Accent</Tag>
          <Tag variant="success">Success</Tag>
          <Tag variant="warning">Warning</Tag>
          <Tag variant="danger">Danger</Tag>
          <Tag variant="info">Info</Tag>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Tag size="sm" onDismiss={() => {}}>Small</Tag>
          <Tag size="md" onDismiss={() => {}}>Medium</Tag>
        </Row>
      </Section>

      {/* Tooltip */}
      <Section title="Tooltip" tokens={tokens}>
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
      <Section title="Icon" tokens={tokens}>
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
      <Section title="Button" tokens={tokens}>
        <Row label="Variants" tokens={tokens}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" bordered={false}>Flat</Button>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="Icons" tokens={tokens}>
          <Button leftIcon={<StarIcon />}>With prefix</Button>
          <Button variant="secondary" rightIcon={<StarIcon />}>With suffix</Button>
          <Button variant="secondary" chevron>Dropdown</Button>
          <Button leftIcon={<StarIcon />} chevron>Both</Button>
        </Row>
        <Row label="States" tokens={tokens}>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button variant="primary" fullWidth>Full width</Button>
        </Row>
      </Section>

      {/* Input */}
      <Section title="Input" tokens={tokens}>
        <Row label="Default" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Input label="Email" type="email" placeholder="you@example.com" value={inputVal} onChange={e => setInputVal(e.target.value)} />
          </div>
        </Row>
        <Row label="With helper" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Input label="Username" helperText="3–20 characters" placeholder="yourname" />
          </div>
        </Row>
        <Row label="Error state" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Input label="Password" type="password" errorText="Must be at least 8 characters" defaultValue="short" />
          </div>
        </Row>
      </Section>

      {/* Textarea */}
      <Section title="Textarea" tokens={tokens}>
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
      </Section>

      {/* Badge */}
      <Section title="Badge" tokens={tokens}>
        <Row label="Variants" tokens={tokens}>
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success" dot>Active</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">12</Badge>
          <Badge variant="info">Beta</Badge>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Badge size="sm" variant="success">Small</Badge>
          <Badge size="md" variant="success">Medium</Badge>
        </Row>
      </Section>

      {/* Avatar */}
      <Section title="Avatar" tokens={tokens}>
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
      <Section title="Spinner" tokens={tokens}>
        <Row label="Sizes" tokens={tokens}>
          <Spinner size="xs" />
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Row>
      </Section>

      {/* Divider */}
      <Section title="Divider" tokens={tokens}>
        <Row label="Horizontal" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <p style={{ margin: `0 0 ${tokens.space2}`, color: tokens.textSecondary, fontSize: tokens.fontSizeSm }}>Content above</p>
            <Divider />
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

      <Section title="Breadcrumb" tokens={tokens}>
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

      <Section title="Tabs" tokens={tokens}>
        <Row label="Default" tokens={tokens}>
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
      </Section>

      <Section title="Collapsible" tokens={tokens}>
        <Row label="Default" tokens={tokens}>
          <div style={{ width: '100%', maxWidth: 400, borderBottom: `1px solid ${tokens.borderDefault}` }}>
            <Collapsible trigger={<Text weight="medium">Advanced options</Text>}>
              <Text color="secondary">Hidden content that expands when you click the trigger above. Can contain any ReactNode.</Text>
            </Collapsible>
          </div>
        </Row>
        <Row label="Default open" tokens={tokens}>
          <div style={{ width: '100%', maxWidth: 400, borderBottom: `1px solid ${tokens.borderDefault}` }}>
            <Collapsible defaultOpen trigger={<Text weight="medium">Expanded by default</Text>}>
              <Text color="secondary">This section starts expanded.</Text>
            </Collapsible>
          </div>
        </Row>
      </Section>

      <Section title="NavLink" tokens={tokens}>
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
      </Section>

      <Section title="PageLayout" tokens={tokens}>
        <Row label="With header + sidebar" tokens={tokens}>
          <div style={{ width: '100%', height: 320, border: `1px solid ${tokens.borderDefault}`, borderRadius: tokens.radiusMd, overflow: 'hidden' }}>
            <PageLayout
              headerHeight={44}
              sidebarWidth={180}
              header={
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: `0 ${tokens.space4}` }}>
                  <Text weight="semibold">My App</Text>
                </div>
              }
              sidebar={
                <div style={{ padding: tokens.space3, display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
                  <NavLink href="#" isActive>Dashboard</NavLink>
                  <NavLink href="#">Components</NavLink>
                  <NavLink href="#">Settings</NavLink>
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
              header={
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: `0 ${tokens.space4}` }}>
                  <Text weight="semibold">My App</Text>
                </div>
              }
              sidebar={
                <div style={{ padding: tokens.space3, display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
                  <NavLink href="#" isActive>Dashboard</NavLink>
                  <NavLink href="#">Components</NavLink>
                  <NavLink href="#">Settings</NavLink>
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
              header={
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: `0 ${tokens.space4}` }}>
                  <Text weight="semibold">My App</Text>
                </div>
              }
              sidebar={
                <div style={{ padding: tokens.space3, display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
                  <NavLink href="#" isActive>Dashboard</NavLink>
                  <NavLink href="#">Components</NavLink>
                  <NavLink href="#">Settings</NavLink>
                </div>
              }
              rightSidebar={
                <div style={{ padding: tokens.space3, display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
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

      <Section title="DataTable" tokens={tokens}>
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
        <Row label="Empty state" tokens={tokens}>
          <DataTable columns={[{ key: 'name', header: 'Name' }]} rows={[]} style={{ width: 320 }} />
        </Row>
      </Section>

      <Section title="CommandPalette" tokens={tokens}>
        <Row label="⌘K to open" tokens={tokens}>
          <CommandPalette
            commands={[
              { id: 'new', label: 'New document', description: 'Create a blank document', group: 'Create', onSelect: () => {} },
              { id: 'open', label: 'Open file…', description: 'Browse and open a file', group: 'Create', onSelect: () => {} },
              { id: 'settings', label: 'Settings', description: 'Open app settings', group: 'Navigate', onSelect: () => {} },
              { id: 'logout', label: 'Log out', group: 'Account', onSelect: () => {} },
            ]}
          />
          <Text size="sm" color="secondary">Press <kbd style={{ padding: '1px 5px', borderRadius: tokens.radiusSm, border: `1px solid ${tokens.borderDefault}`, fontFamily: tokens.fontFamilyMono, fontSize: tokens.fontSizeXs }}>⌘K</kbd> to open the palette</Text>
        </Row>
      </Section>

      <Section title="MultiSelect" tokens={tokens}>
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

      <Section title="DatePicker" tokens={tokens}>
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

      <Section title="DateRangePicker" tokens={tokens}>
        <Row label="Default" tokens={tokens}>
          <DateRangePicker onChange={() => {}} />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <DateRangePicker disabled />
        </Row>
      </Section>

      <Section title="FileUpload" tokens={tokens}>
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

      <Section title="Timeline" tokens={tokens}>
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
      </Section>
    </div>
  );
}

function Section({ title, tokens, children }: { title: string; tokens: ReturnType<typeof useLucent>['tokens']; children: React.ReactNode }) {
  return (
    <div style={{ background: tokens.surfaceDefault, border: `1px solid ${tokens.borderDefault}`, borderRadius: tokens.radiusLg, padding: tokens.space6, marginBottom: tokens.space6 }}>
      <h2 style={{ fontSize: tokens.fontSizeLg, fontWeight: tokens.fontWeightSemibold, marginBottom: tokens.space5, marginTop: 0 }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space4 }}>{children}</div>
    </div>
  );
}

function Row({ label, tokens, children }: { label: string; tokens: ReturnType<typeof useLucent>['tokens']; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
      <span style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, fontFamily: tokens.fontFamilyMono, letterSpacing: tokens.letterSpacingWide, textTransform: 'uppercase' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.space3, flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}
