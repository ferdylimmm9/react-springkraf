import React from 'react';
import { Freeze } from 'react-freeze';

export interface FreezeContainerProps extends React.ComponentProps<'div'> {
  isActive: boolean;
  /** sometimes with freeze the children layout won't showing anything*/
  withFreeze?: boolean;
}

/**
 * when component has unbind all logic about scroll and memoized data has removed
 * this component use for hide the component on layout without unbind
 */
export default function FreezeContainer(props: FreezeContainerProps) {
  const { isActive, style, withFreeze = true, children, ...rest } = props;

  return (
    <div
      {...rest}
      style={{
        ...style,
        display: isActive ? undefined : 'none',
      }}
    >
      {withFreeze ? (
        <Freeze children={children} freeze={!isActive} />
      ) : (
        children
      )}
    </div>
  );
}
