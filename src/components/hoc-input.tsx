import invariant from 'invariant';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export interface HOCInputProps<T extends string[]> {
  keys: [...T];
  children:
    | React.ReactNode
    | ((values: {
        //@ts-ignore
        [Key in keyof T as Exclude<T[Key], number>]: any;
      }) => React.ReactNode);
}

export interface FormValueContextState<T extends string[]> {
  values: {
    //@ts-ignore
    [Key in keyof T as Exclude<T[Key], number>]: any;
  };
}

export const FormContext = React.createContext({
  values: {} as any,
});

export default function HOCInput<T extends string[]>(props: HOCInputProps<T>) {
  const { keys, children } = props;
  const { control } = useFormContext();
  const values = useWatch({ name: keys, control });

  const transformedValues = values.reduce((prev, next, idx) => {
    return {
      ...prev,
      [keys[idx]]: next,
    };
  }, {});

  const value = React.useMemo(
    () => ({
      values: transformedValues,
    }),
    [transformedValues],
  );

  return (
    <FormContext.Provider value={value}>
      {typeof children === 'function' ? children(transformedValues) : children}
    </FormContext.Provider>
  );
}

export function useFormValueState<
  T extends string[],
>(): FormValueContextState<T> {
  const context = React.useContext(FormContext);
  invariant(
    context !== undefined,
    'useHOCInput must be used inside Form Container',
  );

  return context;
}
