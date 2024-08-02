import React from 'react';

export interface UseCounterProps {
  onChange?: (value: number) => void;
  initialValue?: number;
  options?: Partial<{ min: number; max: number }>;
  value?: number;
}

export default function useCounter(props: UseCounterProps) {
  const { initialValue = 0, value = 0 } = props;
  const [step, setStep] = React.useState(initialValue);

  const isMax = step === props.options?.max;
  const isMin = step === props.options?.min;

  const handler = React.useMemo(() => {
    const increment = () => {
      setStep((prev) => {
        if (isMax) return prev;
        const next = prev + 1;
        props?.onChange?.(next);
        return next;
      });
    };

    const decrement = () => {
      setStep((prev) => {
        if (isMin) return prev;
        const previous = prev - 1;
        props?.onChange?.(previous);
        return previous;
      });
    };

    const reset = () => {
      setStep(() => initialValue);
      props?.onChange?.(initialValue);
    };

    const set = (number: number) => () => {
      const isMax = number === props.options?.max;
      const isMin = number === props.options?.min;
      if (isMax || isMin) return;

      setStep(number);
      props?.onChange?.(number);
    };

    return {
      increment,
      decrement,
      reset,
      set,
    };
  }, [initialValue, isMax, isMin, props]);

  React.useEffect(() => {
    setStep(value);
  }, [value]);

  return {
    step,
    handler,
    isMax,
    isMin,
  };
}
