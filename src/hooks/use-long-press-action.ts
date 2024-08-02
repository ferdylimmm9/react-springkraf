import React from 'react';

export default function useLongPress(action: () => void) {
  const intervalRef = React.useRef(null);

  const startAction = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      action();
    }, 120) as any;
  };

  const stopAction = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => stopAction();
  }, []);

  return [startAction, stopAction];
}
