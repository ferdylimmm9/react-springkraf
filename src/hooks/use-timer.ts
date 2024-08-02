import React from 'react';

export default function useTimer(_second = 60): [
  number,
  {
    reset: () => void;
    set: (set: number) => void;
  },
] {
  const [second, setSecond] = React.useState(_second);

  const handler = React.useMemo(() => {
    const reset = () => setSecond(_second);
    const set = (set: number) => setSecond(set);

    return { reset, set };
  }, [_second]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSecond((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return [second, handler];
}

export function useSingletonTimeout() {
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const intervalRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  React.useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timeoutRef.current);
    };
  }, []);
  return {
    setInterval: React.useCallback((cb: () => void, interval: number) => {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(cb, interval);
    }, []),
    setTimeout: React.useCallback((cb: () => void, timeout: number) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(cb, timeout);
    }, []),
  };
}
