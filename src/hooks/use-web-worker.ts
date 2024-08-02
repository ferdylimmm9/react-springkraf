import React from 'react';

/**
 * Worker URL is resolved as ``new URL('./path/to/worker', import.meta.url)``
 * Initialization of worker must be done by caller to make sure that webpack does its job
 */
export default function useWebWorker(create: () => Worker) {
  const worker = React.useRef<Worker>();
  React.useEffect(() => {
    if (worker.current === undefined) {
      worker.current = create();
    }
    return () => {
      worker.current?.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return worker;
}

/**
 * Web worker should receive and return a ``__messageKey`` (or your custom key name) property in its data.
 * The message key will also be inserted into the message posted to the web worker.
 * The promise will never be resolved until the web worker returns a message with the proper message key.
 */
export function useWebWorkerCalculation(
  createWorker: () => Worker,
  messageKeyName: string = '__messageKey',
) {
  const worker = useWebWorker(createWorker);
  return React.useCallback(
    function <TResult>(message: object): Promise<TResult> | undefined {
      if (worker.current === undefined) return undefined;
      const messageKey = Math.random().toString(16).substring(2);
      return new Promise((resolve, reject) => {
        const onMessage = (event: MessageEvent<any>) => {
          if (event.data[messageKeyName] === messageKey) {
            resolve(event.data);
            event.stopImmediatePropagation();
            cleanup();
          }
        };
        const onMessageError = (event: MessageEvent<any>) => {
          if (event.data[messageKeyName] === messageKey) {
            reject(event.data);
            event.stopImmediatePropagation();
            cleanup();
          }
        };
        const onError = (event: ErrorEvent) => {
          reject(event);
          cleanup();
        };
        const cleanup = () => {
          worker.current?.removeEventListener('message', onMessage);
          worker.current?.removeEventListener('messageerror', onMessageError);
          worker.current?.removeEventListener('error', onError);
        };
        worker.current!.addEventListener('message', onMessage);
        worker.current!.addEventListener('messageerror', onMessageError);
        worker.current!.addEventListener('error', onError);
        worker.current!.postMessage({
          ...message,
          [messageKeyName]: messageKey,
        });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messageKeyName],
  );
}
