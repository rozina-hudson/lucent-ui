import { useState, useRef, useEffect, useId, useCallback, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl.js';
import { Select } from '../Select/Select.js';
import { Input } from '../Input/Input.js';
import { Button } from '../Button/Button.js';
import { ColorSwatch } from '../ColorSwatch/ColorSwatch.js';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RGBA { r: number; g: number; b: number; a: number }
// h: 0–360, s: 0–100, v: 0–100, a: 0–1
interface HSVA { h: number; s: number; v: number; a: number }
type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsb';

// ─── Color math ───────────────────────────────────────────────────────────────

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const sn = s / 100, vn = v / 100;
  const c = vn * sn, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = vn - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn), d = max - min;
  const v = max, s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sn = s / 100, ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0, g = 0, bb = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; bb = x; }
  else if (h < 240) { g = x; bb = c; }
  else if (h < 300) { r = x; bb = c; }
  else { r = c; bb = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((bb + m) * 255) };
}

function normalizeHex(hex: string): string {
  const h = hex.replace('#', '');
  if (h.length === 3) return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
  if (h.length === 6 || h.length === 8) return `#${h}`;
  return '#000000';
}

function hexToRgba(hex: string): RGBA {
  const n = normalizeHex(hex);
  return {
    r: parseInt(n.slice(1, 3), 16),
    g: parseInt(n.slice(3, 5), 16),
    b: parseInt(n.slice(5, 7), 16),
    a: n.length === 9 ? +(parseInt(n.slice(7, 9), 16) / 255).toFixed(2) : 1,
  };
}

function rgbaToHex({ r, g, b, a }: RGBA): string {
  const ch = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  const base = `#${ch(r)}${ch(g)}${ch(b)}`;
  return a < 1 ? `${base}${ch(Math.round(a * 255))}` : base;
}

function hsvaToRgba({ h, s, v, a }: HSVA): RGBA {
  return { ...hsvToRgb(h, s, v), a };
}

function rgbaToHsva({ r, g, b, a }: RGBA): HSVA {
  return { ...rgbToHsv(r, g, b), a };
}

function hsvaToHex(hsva: HSVA): string {
  return rgbaToHex(hsvaToRgba(hsva));
}

function parseColor(input: string): RGBA | null {
  const s = input.trim();
  if (s.startsWith('#')) {
    const hex = normalizeHex(s);
    if (/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) return hexToRgba(hex);
    return null;
  }
  const rgbMatch = s.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([\d.]+))?\s*\)$/);
  if (rgbMatch) {
    const r = +(rgbMatch[1] ?? '0'), g = +(rgbMatch[2] ?? '0'), b = +(rgbMatch[3] ?? '0');
    const a = rgbMatch[4] !== undefined ? +rgbMatch[4] : 1;
    if ([r, g, b].every(n => n <= 255) && a >= 0 && a <= 1) return { r, g, b, a };
    return null;
  }
  const hslMatch = s.match(/^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)$/);
  if (hslMatch) {
    const h = +(hslMatch[1] ?? '0'), sl = +(hslMatch[2] ?? '0'), l = +(hslMatch[3] ?? '0');
    if (h <= 360 && sl <= 100 && l <= 100) return { ...hslToRgb(h, sl, l), a: 1 };
    return null;
  }
  return null;
}

// ─── Preset types ─────────────────────────────────────────────────────────────

export interface ColorPresetGroup {
  label: string;
  colors: string[];
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_PRESET_GROUPS: ColorPresetGroup[] = [
  {
    label: 'Presets',
    colors: [
      '#000000', '#2563eb', '#16a34a', '#ca8a04',
      '#dc2626', '#0ea5e9', '#9333ea', '#4f46e5', '#e11d48',
    ],
  },
];

const CHECKERBOARD = [
  'linear-gradient(45deg, #c0c0c0 25%, transparent 25%)',
  'linear-gradient(-45deg, #c0c0c0 25%, transparent 25%)',
  'linear-gradient(45deg, transparent 75%, #c0c0c0 75%)',
  'linear-gradient(-45deg, transparent 75%, #c0c0c0 75%)',
].join(', ');

// ─── SliderTrack ──────────────────────────────────────────────────────────────

interface SliderTrackProps {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  trackStyle?: CSSProperties;
  formatTooltip?: (v: number) => string;
}

function SliderTrack({ value, min, max, onChange, trackStyle, formatTooltip }: SliderTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const resolve = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    onChange(min + pct * (max - min));
  }, [min, max, onChange]);

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={trackRef}
      style={{ position: 'relative', height: 12, borderRadius: 6, cursor: 'crosshair', userSelect: 'none', ...trackStyle }}
      onPointerDown={e => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        resolve(e);
      }}
      onPointerMove={e => { if (e.buttons > 0) resolve(e); }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <div
        style={{
          position: 'absolute',
          left: `${pct}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: 'white',
          border: '2px solid rgba(0,0,0,0.22)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {/* Tooltip */}
        {dragging && formatTooltip && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 6,
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            fontSize: 11,
            fontFamily: 'var(--lucent-font-family-base)',
            fontWeight: 500,
            borderRadius: 4,
            padding: '2px 6px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {formatTooltip(value)}
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Eyedropper icon ──────────────────────────────────────────────────────────

function EyedropperIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 22l1-1h3l9-9" />
      <path d="M3 21v-3l9-9" />
      <path d="M15 6l3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface ColorPickerProps {
  value?: string;
  onChange?: (hex: string) => void;
  label?: string;
  disabled?: boolean;
  presetGroups?: ColorPresetGroup[];
  id?: string;
  style?: CSSProperties;
}

export function ColorPicker({
  value,
  onChange,
  label,
  disabled = false,
  presetGroups = DEFAULT_PRESET_GROUPS,
  id,
  style,
}: ColorPickerProps) {
  const generatedId = useId();
  const pickerId = id ?? generatedId;

  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<ColorFormat>('hex');
  const [activeGroupIdx, setActiveGroupIdx] = useState(0);
  const [hsva, setHsva] = useState<HSVA>(() => {
    const rgba = value ? (parseColor(value) ?? { r: 0, g: 0, b: 0, a: 1 }) : { r: 0, g: 0, b: 0, a: 1 };
    return rgbaToHsva(rgba);
  });
  const [hexText, setHexText] = useState(() => hsvaToHex(hsva).slice(1).toUpperCase());

  const containerRef = useRef<HTMLDivElement>(null);
  const spectrumRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value) return;
    const parsed = parseColor(value);
    if (parsed) {
      setHsva(rgbaToHsva(parsed));
      setHexText(rgbaToHex(parsed).slice(1).toUpperCase());
    }
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const applyHsva = useCallback((next: HSVA) => {
    setHsva(next);
    const hex = hsvaToHex(next);
    setHexText(hex.slice(1).toUpperCase());
    onChange?.(hex);
  }, [onChange]);

  const handleSpectrumPointer = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = spectrumRef.current!.getBoundingClientRect();
    const s = Math.round(clamp((e.clientX - rect.left) / rect.width, 0, 1) * 100);
    const v = Math.round((1 - clamp((e.clientY - rect.top) / rect.height, 0, 1)) * 100);
    applyHsva({ ...hsva, s, v });
  }, [hsva, applyHsva]);

  const pickWithEyedropper = useCallback(async () => {
    if (!('EyeDropper' in window)) return;
    try {
      // @ts-expect-error EyeDropper is not in TS lib yet
      const result = await new window.EyeDropper().open();
      const parsed = parseColor(result.sRGBHex);
      if (parsed) applyHsva(rgbaToHsva(parsed));
    } catch {
      // user cancelled
    }
  }, [applyHsva]);

  const rgba = hsvaToRgba(hsva);
  const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b);
  const currentHex = hsvaToHex(hsva);
  const opaqueHex = hsvaToHex({ ...hsva, a: 1 });
  const alphaPercent = Math.round(hsva.a * 100);

  const formats: { id: ColorFormat; label: string }[] = [
    { id: 'hex', label: 'Hex' },
    { id: 'rgb', label: 'RGB' },
    { id: 'hsl', label: 'HSL' },
    { id: 'hsb', label: 'HSB' },
  ];

  const canEyedrop = typeof window !== 'undefined' && 'EyeDropper' in window;

  return (
    <div
      ref={containerRef}
      style={{ display: 'inline-flex', flexDirection: 'column', gap: 'var(--lucent-space-1)', position: 'relative', ...style }}
    >
      <style>{`
        .lucent-cp-field::-webkit-outer-spin-button,
        .lucent-cp-field::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .lucent-cp-field { -moz-appearance: textfield; }
      `}</style>
      {label && (
        <label
          htmlFor={`${pickerId}-swatch`}
          style={{
            fontSize: 'var(--lucent-font-size-sm)',
            fontWeight: 'var(--lucent-font-weight-medium)',
            color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
            fontFamily: 'var(--lucent-font-family-base)',
          }}
        >
          {label}
        </label>
      )}

      {/* Swatch trigger */}
      <button
        id={`${pickerId}-swatch`}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(o => !o)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        style={{
          position: 'relative',
          width: 40,
          height: 40,
          borderRadius: 'var(--lucent-radius-lg)',
          border: `2px solid ${isOpen ? 'var(--lucent-focus-ring)' : 'var(--lucent-border-default)'}`,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          padding: 0,
          overflow: 'hidden',
          boxShadow: isOpen ? `0 0 0 3px var(--lucent-accent-subtle)` : 'none',
          transition: 'box-shadow var(--lucent-duration-fast) var(--lucent-easing-default)',
        }}
        onFocus={e => { e.currentTarget.style.boxShadow = `0 0 0 3px var(--lucent-accent-subtle)`; }}
        onBlur={e => { if (!isOpen) e.currentTarget.style.boxShadow = 'none'; }}
      >
        {/* Checkerboard for transparency */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: CHECKERBOARD,
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
          backgroundColor: '#fff',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: `rgba(${rgba.r},${rgba.g},${rgba.b},${hsva.a})` }} />
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Color picker"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            zIndex: 1000,
            background: 'var(--lucent-surface)',
            border: '1px solid var(--lucent-border-default)',
            borderRadius: 'var(--lucent-radius-xl)',
            boxShadow: 'var(--lucent-shadow-md)',
            width: 280,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* ── Spectrum (full-bleed) ─────────────────────── */}
          <div
            ref={spectrumRef}
            style={{
              position: 'relative',
              height: 160,
              background: `hsl(${hsva.h}, 100%, 50%)`,
              cursor: 'crosshair',
              userSelect: 'none',
              flexShrink: 0,
            }}
            onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); handleSpectrumPointer(e); }}
            onPointerMove={e => { if (e.buttons > 0) handleSpectrumPointer(e); }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #fff, transparent)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #000)' }} />
            {/* Handle */}
            <div style={{
              position: 'absolute',
              left: `${hsva.s}%`,
              top: `${100 - hsva.v}%`,
              transform: 'translate(-50%, -50%)',
              width: 14,
              height: 14,
              borderRadius: '50%',
              border: '2px solid #fff',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.35)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* ── Content ──────────────────────────────────── */}
          <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Swatch preview + sliders row */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {/* Mini swatch showing current color with alpha */}
              <div style={{ position: 'relative', width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--lucent-border-default)' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: CHECKERBOARD,
                  backgroundSize: '6px 6px',
                  backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0',
                  backgroundColor: '#fff',
                }} />
                <div style={{ position: 'absolute', inset: 0, background: `rgba(${rgba.r},${rgba.g},${rgba.b},${hsva.a})` }} />
              </div>

              {/* Hue + alpha sliders */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <SliderTrack
                  value={hsva.h}
                  min={0}
                  max={360}
                  onChange={h => applyHsva({ ...hsva, h: Math.round(h) })}
                  trackStyle={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }}
                  formatTooltip={h => `${Math.round(h)}°`}
                />
                {/* Alpha track with checkerboard */}
                <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: CHECKERBOARD,
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
                    backgroundColor: '#fff',
                  }} />
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, transparent, ${opaqueHex})` }} />
                  <SliderTrack
                    value={hsva.a}
                    min={0}
                    max={1}
                    onChange={a => applyHsva({ ...hsva, a: Math.round(a * 100) / 100 })}
                    trackStyle={{ background: 'transparent', position: 'relative', zIndex: 1 }}
                    formatTooltip={a => `${Math.round(a * 100)}%`}
                  />
                </div>
              </div>
            </div>

            {/* Format tabs */}
            <SegmentedControl
              size="sm"
              value={format}
              onChange={(v: string) => setFormat(v as ColorFormat)}
              options={formats.map(({ id, label }) => ({ value: id, label }))}
            />

            {/* ── Format inputs ──────────────────────────── */}
            {format === 'hex' && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {/* Eyedropper */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={pickWithEyedropper}
                  disabled={!canEyedrop}
                  title={canEyedrop ? 'Pick color from screen' : 'Not supported in this browser'}
                  leftIcon={<EyedropperIcon />}
                  style={{ flexShrink: 0, paddingLeft: 8, paddingRight: 8 }}
                />
                {/* # + hex input */}
                <Input
                  size="sm"
                  prefix="#"
                  value={hexText}
                  onChange={e => {
                    const raw = e.target.value.replace('#', '');
                    setHexText(raw.toUpperCase());
                    const parsed = parseColor(`#${raw}`);
                    if (parsed) {
                      const next = rgbaToHsva(parsed);
                      setHsva(next);
                      onChange?.(rgbaToHex(parsed));
                    }
                  }}
                  spellCheck={false}
                  placeholder="000000"
                  maxLength={8}
                  style={{ flex: 1 }}
                />
                {/* Alpha % */}
                <Input
                  size="sm"
                  type="number"
                  suffix="%"
                  value={alphaPercent}
                  min={0}
                  max={100}
                  onChange={e => {
                    const v = +e.target.value;
                    if (!isNaN(v) && v >= 0 && v <= 100) applyHsva({ ...hsva, a: v / 100 });
                  }}
                  className="lucent-cp-field"
                  style={{ width: 68, flexShrink: 0 }}
                />
              </div>
            )}

            {format === 'rgb' && (
              <div style={{ display: 'flex', gap: 6 }}>
                {([
                  { label: 'R', val: rgba.r, max: 255, fn: (v: number) => applyHsva(rgbaToHsva({ ...rgba, r: v })) },
                  { label: 'G', val: rgba.g, max: 255, fn: (v: number) => applyHsva(rgbaToHsva({ ...rgba, g: v })) },
                  { label: 'B', val: rgba.b, max: 255, fn: (v: number) => applyHsva(rgbaToHsva({ ...rgba, b: v })) },
                  { label: 'A', val: alphaPercent, max: 100, fn: (v: number) => applyHsva({ ...hsva, a: v / 100 }) },
                ] as { label: string; val: number; max: number; fn: (v: number) => void }[]).map(({ label, val, max, fn }) => (
                  <Input key={label} size="sm" type="number" prefix={label} value={val} min={0} max={max} onChange={e => { const v = +e.target.value; if (!isNaN(v) && v >= 0 && v <= max) fn(v); }} className="lucent-cp-field" style={{ flex: 1 }} />
                ))}
              </div>
            )}

            {format === 'hsl' && (
              <div style={{ display: 'flex', gap: 6 }}>
                {([
                  { label: 'H', val: hsl.h, max: 360, fn: (v: number) => { const { r, g, b } = hslToRgb(v, hsl.s, hsl.l); applyHsva(rgbaToHsva({ r, g, b, a: hsva.a })); } },
                  { label: 'S', val: hsl.s, max: 100, fn: (v: number) => { const { r, g, b } = hslToRgb(hsl.h, v, hsl.l); applyHsva(rgbaToHsva({ r, g, b, a: hsva.a })); } },
                  { label: 'L', val: hsl.l, max: 100, fn: (v: number) => { const { r, g, b } = hslToRgb(hsl.h, hsl.s, v); applyHsva(rgbaToHsva({ r, g, b, a: hsva.a })); } },
                  { label: 'A', val: alphaPercent, max: 100, fn: (v: number) => applyHsva({ ...hsva, a: v / 100 }) },
                ] as { label: string; val: number; max: number; fn: (v: number) => void }[]).map(({ label, val, max, fn }) => (
                  <Input key={label} size="sm" type="number" prefix={label} value={val} min={0} max={max} onChange={e => { const v = +e.target.value; if (!isNaN(v) && v >= 0 && v <= max) fn(v); }} className="lucent-cp-field" style={{ flex: 1 }} />
                ))}
              </div>
            )}

            {format === 'hsb' && (
              <div style={{ display: 'flex', gap: 6 }}>
                {([
                  { label: 'H', val: hsva.h, max: 360, fn: (v: number) => applyHsva({ ...hsva, h: v }) },
                  { label: 'S', val: hsva.s, max: 100, fn: (v: number) => applyHsva({ ...hsva, s: v }) },
                  { label: 'B', val: hsva.v, max: 100, fn: (v: number) => applyHsva({ ...hsva, v }) },
                  { label: 'A', val: alphaPercent, max: 100, fn: (v: number) => applyHsva({ ...hsva, a: v / 100 }) },
                ] as { label: string; val: number; max: number; fn: (v: number) => void }[]).map(({ label, val, max, fn }) => (
                  <Input key={label} size="sm" type="number" prefix={label} value={val} min={0} max={max} onChange={e => { const v = +e.target.value; if (!isNaN(v) && v >= 0 && v <= max) fn(v); }} className="lucent-cp-field" style={{ flex: 1 }} />
                ))}
              </div>
            )}

            {/* Presets */}
            {presetGroups.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {presetGroups.length > 1 && (
                  <Select
                    size="sm"
                    value={String(activeGroupIdx)}
                    onChange={e => setActiveGroupIdx(Number(e.target.value))}
                    options={presetGroups.map((g, i) => ({ value: String(i), label: g.label }))}
                  />
                )}
                {presetGroups.length === 1 && (
                  <span style={{
                    fontSize: 'var(--lucent-font-size-xs)',
                    fontWeight: 'var(--lucent-font-weight-medium)',
                    color: 'var(--lucent-text-secondary)',
                    fontFamily: 'var(--lucent-font-family-base)',
                  }}>
                    {presetGroups[0]?.label}
                  </span>
                )}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(presetGroups[activeGroupIdx]?.colors ?? []).map(preset => {
                    const isActive = normalizeHex(preset).toLowerCase() === currentHex.slice(0, 7).toLowerCase();
                    return (
                      <ColorSwatch
                        key={preset}
                        color={preset}
                        selected={isActive}
                        onClick={() => applyHsva(rgbaToHsva(hexToRgba(preset)))}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

ColorPicker.displayName = 'ColorPicker';
