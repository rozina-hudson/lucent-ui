import { Children, cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from 'react';

export interface ButtonGroupProps {
  /** Button or SplitButton children to group. */
  children: ReactNode;
  /** Style overrides for the wrapper. */
  style?: CSSProperties;
}

const INNER_RADIUS = 'var(--lucent-radius-sm)';

export function ButtonGroup({
  children,
  style,
}: ButtonGroupProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement[];
  const count = items.length;

  return (
    <div
      role="group"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'calc(var(--lucent-space-1) / 2)',
        ...style,
      }}
    >
      {items.map((child, i) => {
        const isFirst = i === 0;
        const isLast = i === count - 1;
        const isOnly = count === 1;

        if (isOnly) return child;

        const childStyle: CSSProperties = (child.props as { style?: CSSProperties }).style ?? {};
        const outerRadius = childStyle.borderRadius ?? 'var(--lucent-radius-lg)';

        let borderRadius: string;
        if (isFirst) {
          borderRadius = `${outerRadius} ${INNER_RADIUS} ${INNER_RADIUS} ${outerRadius}`;
        } else if (isLast) {
          borderRadius = `${INNER_RADIUS} ${outerRadius} ${outerRadius} ${INNER_RADIUS}`;
        } else {
          borderRadius = INNER_RADIUS;
        }

        return cloneElement(child, {
          key: i,
          style: {
            ...childStyle,
            borderRadius,
          },
        } as Record<string, unknown>);
      })}
    </div>
  );
}

ButtonGroup.displayName = 'ButtonGroup';
