import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { Chip } from '../../atoms/Chip/index.js';
import { Check } from '../../../icons/Check.js';

export type StepperSize = 'sm' | 'md' | 'lg';
export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepDef {
  /** Step label */
  label: string;
  /** Optional description shown below the label */
  description?: string;
  /** Optional custom icon for the circle (overrides number/checkmark) */
  icon?: ReactNode;
}

export interface StepperProps {
  /** Step labels — strings or objects with label/description/icon */
  steps: readonly (string | StepDef)[];
  /** Zero-based index of the current step */
  current: number;
  /** Circle and connector sizing */
  size?: StepperSize;
  /** Layout direction */
  orientation?: StepperOrientation;
  /** Show "STEP N" prefix above labels */
  numbered?: boolean;
  /** Show Completed / In Progress / Pending status badges */
  showStatus?: boolean;
  /** Inline style overrides for the root container */
  style?: CSSProperties;
}

// ─── Size config ────────────────────────────────────────────────────────────

const sizeConfig: Record<StepperSize, {
  circle: number;
  checkIcon: number;
  connector: number;
  labelSize: string;
  descSize: string;
  prefixSize: string;
  gap: string;
}> = {
  sm: { circle: 24, checkIcon: 12, connector: 2, labelSize: 'var(--lucent-font-size-xs)', descSize: 'var(--lucent-font-size-xs)', prefixSize: 'var(--lucent-font-size-xs)', gap: 'var(--lucent-space-2)' },
  md: { circle: 32, checkIcon: 14, connector: 2, labelSize: 'var(--lucent-font-size-sm)', descSize: 'var(--lucent-font-size-xs)', prefixSize: 'var(--lucent-font-size-xs)', gap: 'var(--lucent-space-3)' },
  lg: { circle: 40, checkIcon: 18, connector: 3, labelSize: 'var(--lucent-font-size-md)', descSize: 'var(--lucent-font-size-sm)', prefixSize: 'var(--lucent-font-size-xs)', gap: 'var(--lucent-space-3)' },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalizeStep(step: string | StepDef): StepDef {
  return typeof step === 'string' ? { label: step } : step;
}

function CheckIcon({ size }: { size: number }) {
  return (
    <span aria-hidden style={{ display: 'inline-flex', width: size, height: size }}><Check /></span>
  );
}

type StepState = 'completed' | 'current' | 'pending';

function getState(i: number, current: number): StepState {
  if (i < current) return 'completed';
  if (i === current) return 'current';
  return 'pending';
}

const STATUS_LABELS: Record<StepState, string> = {
  completed: 'Completed',
  current: 'In Progress',
  pending: 'Pending',
};

const STATUS_CHIP_VARIANT: Record<StepState, 'success' | 'accent' | 'neutral'> = {
  completed: 'success',
  current: 'accent',
  pending: 'neutral',
};

// ─── Check animation ────────────────────────────────────────────────────────

const STEPPER_STYLE_ID = 'lucent-stepper-keyframes';

function ensureKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STEPPER_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STEPPER_STYLE_ID;
  style.textContent = `@keyframes lucent-stepper-check{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}`;
  document.head.appendChild(style);
}

// ─── Circle ─────────────────────────────────────────────────────────────────

function StepCircle({ index, state, step, cfg }: {
  index: number;
  state: StepState;
  step: StepDef;
  cfg: typeof sizeConfig['md'];
}) {
  const isActive = state !== 'pending';
  return (
    <div
      aria-current={state === 'current' ? 'step' : undefined}
      style={{
        width: cfg.circle,
        height: cfg.circle,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: cfg.labelSize,
        fontWeight: 'var(--lucent-font-weight-semibold)' as unknown as number,
        fontFamily: 'var(--lucent-font-family-base)',
        background: isActive
          ? 'var(--lucent-accent-default)'
          : 'color-mix(in srgb, var(--lucent-text-secondary) 12%, var(--lucent-surface))',
        color: isActive
          ? 'var(--lucent-accent-fg)'
          : 'var(--lucent-text-secondary)',
        transition: 'background var(--lucent-duration-base) var(--lucent-easing-default), color var(--lucent-duration-base) var(--lucent-easing-default)',
        flexShrink: 0,
      }}
    >
      {step.icon
        ? step.icon
        : state === 'completed'
          ? <span style={{ display: 'flex', animation: 'lucent-stepper-check 300ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}><CheckIcon size={cfg.checkIcon} /></span>
          : index + 1}
    </div>
  );
}

// ─── Status chip ────────────────────────────────────────────────────────────

function StatusChip({ state }: { state: StepState }) {
  return (
    <Chip variant={STATUS_CHIP_VARIANT[state]} size="sm" borderless>
      {STATUS_LABELS[state]}
    </Chip>
  );
}

// ─── Horizontal layout ─────────────────────────────────────────────────────

function StepLabel({ step, state, index, cfg, numbered, showStatus }: {
  step: StepDef;
  state: StepState;
  index: number;
  cfg: typeof sizeConfig['md'];
  numbered: boolean;
  showStatus: boolean;
}) {
  return (
    <>
      {numbered && (
        <span style={{
          fontSize: cfg.prefixSize,
          fontFamily: 'var(--lucent-font-family-base)',
          fontWeight: 'var(--lucent-font-weight-medium)' as unknown as number,
          color: 'var(--lucent-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--lucent-letter-spacing-wide)',
        }}>
          Step {index + 1}
        </span>
      )}
      <span style={{
        fontSize: cfg.labelSize,
        fontFamily: 'var(--lucent-font-family-base)',
        fontWeight: state === 'current'
          ? 'var(--lucent-font-weight-semibold)' as unknown as number
          : 'var(--lucent-font-weight-regular)' as unknown as number,
        color: state !== 'pending' ? 'var(--lucent-text-primary)' : 'var(--lucent-text-secondary)',
        transition: 'color var(--lucent-duration-base) var(--lucent-easing-default)',
      }}>
        {step.label}
      </span>
      {step.description && (
        <span style={{
          fontSize: cfg.descSize,
          fontFamily: 'var(--lucent-font-family-base)',
          color: 'var(--lucent-text-secondary)',
        }}>
          {step.description}
        </span>
      )}
      {showStatus && <StatusChip state={state} />}
    </>
  );
}

function HorizontalStepper({ steps, current, cfg, numbered, showStatus }: {
  steps: StepDef[];
  current: number;
  cfg: typeof sizeConfig['md'];
  numbered: boolean;
  showStatus: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: cfg.gap }}>
      {/* Circle row with connectors behind */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {/* Connector track — sits behind circles */}
        <div style={{
          position: 'absolute',
          left: cfg.circle / 2,
          right: cfg.circle / 2,
          top: cfg.circle / 2 - cfg.connector / 2,
          height: cfg.connector,
          borderRadius: cfg.connector / 2,
          background: 'var(--lucent-border-default)',
          overflow: 'hidden',
        }}>
          {/* Filled portion — always rendered so width transitions */}
          <div style={{
            height: '100%',
            borderRadius: cfg.connector / 2,
            background: 'var(--lucent-accent-default)',
            width: steps.length > 1
              ? `${(current / (steps.length - 1)) * 100}%`
              : '0%',
            transition: 'width 300ms var(--lucent-easing-default)',
          }} />
        </div>
        {/* Circles on top */}
        {steps.map((step, i) => (
          <div key={step.label} style={{
            flex: 1,
            display: 'flex',
            justifyContent: i === 0 ? 'flex-start' : i === steps.length - 1 ? 'flex-end' : 'center',
            position: 'relative',
            zIndex: 1,
          }}>
            <StepCircle index={i} state={getState(i, current)} step={step} cfg={cfg} />
          </div>
        ))}
      </div>

      {/* Labels row */}
      <div style={{ display: 'flex' }}>
        {steps.map((step, i) => {
          const state = getState(i, current);
          const isLast = i === steps.length - 1;
          const align = i === 0 ? 'flex-start' : isLast ? 'flex-end' : 'center';
          const textAlign = i === 0 ? 'left' as const : isLast ? 'right' as const : 'center' as const;
          return (
            <div key={step.label} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: align,
              gap: '2px',
              textAlign,
            }}>
              <StepLabel step={step} state={state} index={i} cfg={cfg} numbered={numbered} showStatus={showStatus} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Vertical layout ────────────────────────────────────────────────────────

function VerticalStepper({ steps, current, cfg, numbered, showStatus }: {
  steps: StepDef[];
  current: number;
  cfg: typeof sizeConfig['md'];
  numbered: boolean;
  showStatus: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {steps.map((step, i) => {
        const state = getState(i, current);
        const isLast = i === steps.length - 1;
        return (
          <div key={step.label} style={{ display: 'flex', gap: cfg.gap }}>
            {/* Circle + connector column */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <StepCircle index={i} state={state} step={step} cfg={cfg} />
              {!isLast && (
                <div style={{
                  width: cfg.connector,
                  flex: 1,
                  minHeight: 24,
                  borderRadius: cfg.connector / 2,
                  background: i < current ? 'var(--lucent-accent-default)' : 'var(--lucent-border-default)',
                  transition: 'background var(--lucent-duration-base) var(--lucent-easing-default)',
                  margin: '4px 0',
                }} />
              )}
            </div>

            {/* Label column */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '2px',
              paddingTop: (cfg.circle - 18) / 2,
              paddingBottom: isLast ? 0 : 'var(--lucent-space-4)',
            }}>
              {numbered && (
                <span style={{
                  fontSize: cfg.prefixSize,
                  fontFamily: 'var(--lucent-font-family-base)',
                  fontWeight: 'var(--lucent-font-weight-medium)' as unknown as number,
                  color: 'var(--lucent-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--lucent-letter-spacing-wide)',
                }}>
                  Step {i + 1}
                </span>
              )}
              <span style={{
                fontSize: cfg.labelSize,
                fontFamily: 'var(--lucent-font-family-base)',
                fontWeight: state === 'current'
                  ? 'var(--lucent-font-weight-semibold)' as unknown as number
                  : 'var(--lucent-font-weight-regular)' as unknown as number,
                color: state !== 'pending' ? 'var(--lucent-text-primary)' : 'var(--lucent-text-secondary)',
                transition: 'color var(--lucent-duration-base) var(--lucent-easing-default)',
              }}>
                {step.label}
              </span>
              {step.description && (
                <span style={{
                  fontSize: cfg.descSize,
                  fontFamily: 'var(--lucent-font-family-base)',
                  color: 'var(--lucent-text-secondary)',
                }}>
                  {step.description}
                </span>
              )}
              {showStatus && <StatusChip state={state} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function Stepper({
  steps,
  current,
  size = 'md',
  orientation = 'horizontal',
  numbered = false,
  showStatus = false,
  style,
}: StepperProps) {
  useEffect(ensureKeyframes, []);
  const cfg = sizeConfig[size];
  const normalized = steps.map(normalizeStep);
  const Layout = orientation === 'vertical' ? VerticalStepper : HorizontalStepper;

  return (
    <div
      role="group"
      aria-label="Progress steps"
      style={{
        fontFamily: 'var(--lucent-font-family-base)',
        ...style,
      }}
    >
      <Layout steps={normalized} current={current} cfg={cfg} numbered={numbered} showStatus={showStatus} />
    </div>
  );
}
