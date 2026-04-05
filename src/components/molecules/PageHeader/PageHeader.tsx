import type { CSSProperties, ReactNode } from 'react';
import { Button, type ButtonVariant } from '../../atoms/Button/Button.js';
import { Row } from '../../atoms/Row/Row.js';
import { Stack } from '../../atoms/Stack/Stack.js';
import { Text } from '../../atoms/Text/Text.js';
import { Divider } from '../../atoms/Divider/Divider.js';
import { Breadcrumb, type BreadcrumbItem } from '../Breadcrumb/Breadcrumb.js';

export interface PageHeaderAction {
  label: ReactNode;
  onClick?: () => void;
  /** Optional href — when set, the underlying Button renders as a link via onClick navigation. */
  href?: string;
  /** Override the default variant. Primary action defaults to "primary", secondary actions to "outline". */
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  'aria-label'?: string;
}

export interface PageHeaderProps {
  /** Page title — rendered as an h1 in display font. */
  title: string;
  /** Optional subtitle or metadata line below the title. */
  subtitle?: ReactNode;
  /** Breadcrumb items rendered above the title. */
  breadcrumbs?: BreadcrumbItem[];
  /** Primary CTA rendered rightmost. Pass `null` to explicitly omit. */
  action?: PageHeaderAction | null;
  /**
   * 0–3 secondary actions rendered to the left of the primary `action`.
   * Defaults to `variant="outline"` so they stay visually subordinate to the primary CTA.
   * For more than 3 actions, use a SplitButton or overflow menu instead.
   */
  secondaryActions?: PageHeaderAction[];
  /** Hide the bottom divider. Default: false. */
  hideDivider?: boolean;
  style?: CSSProperties;
}

function renderAction(action: PageHeaderAction, fallbackVariant: ButtonVariant, key?: number) {
  return (
    <Button
      key={key}
      size="sm"
      variant={action.variant ?? fallbackVariant}
      {...(action.onClick !== undefined && { onClick: action.onClick })}
      {...(action.leftIcon !== undefined && { leftIcon: action.leftIcon })}
      {...(action.rightIcon !== undefined && { rightIcon: action.rightIcon })}
      {...(action.disabled !== undefined && { disabled: action.disabled })}
      {...(action.loading !== undefined && { loading: action.loading })}
      {...(action['aria-label'] !== undefined && { 'aria-label': action['aria-label'] })}
    >
      {action.label}
    </Button>
  );
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  action,
  secondaryActions,
  hideDivider = false,
  style,
}: PageHeaderProps) {
  const hasSecondary = secondaryActions != null && secondaryActions.length > 0;
  const hasPrimary = action != null;
  const hasAnyAction = hasSecondary || hasPrimary;

  return (
    <Stack gap="4" {...(style !== undefined && { style })}>
      {breadcrumbs != null && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}

      <Row justify="between" align="end" wrap gap="3">
        <Stack gap="1" style={{ minWidth: 0 }}>
          <Text as="h1" size="3xl" weight="bold" family="display">
            {title}
          </Text>
          {subtitle != null && (
            <Text size="sm" color="secondary">
              {subtitle}
            </Text>
          )}
        </Stack>

        {hasAnyAction && (
          <Row gap="2" wrap>
            {hasSecondary && secondaryActions.map((a, i) => renderAction(a, 'outline', i))}
            {hasPrimary && renderAction(action, 'primary')}
          </Row>
        )}
      </Row>

      {!hideDivider && <Divider />}
    </Stack>
  );
}
