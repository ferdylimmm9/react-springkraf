import React from 'react';

export interface UseLoadOnIntersectProps {
  loadNextPage(): void;
  hasNextPage: boolean;
  loading: boolean;
}

export default function useLoadOnIntersect(props: UseLoadOnIntersectProps) {
  // Need refs for IntersectionObserver closure to access object
  const contextRef = React.useRef(props);
  contextRef.current = props;

  const ref = React.useRef<HTMLDivElement | null>(null);
  const observer = React.useRef<IntersectionObserver>();
  const load = React.useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries?.[0];
    if (
      !entry ||
      !contextRef.current ||
      !entry.isIntersecting ||
      contextRef.current.loading ||
      !contextRef.current.hasNextPage
    )
      return;
    try {
      contextRef.current.loadNextPage();
    } catch (e) {
      console.error(e);
    }
  }, []);

  React.useEffect(() => {
    observer.current = new IntersectionObserver(load, {
      threshold: 0.1,
      rootMargin: '48px',
    });
    if (ref.current) {
      observer.current.observe(ref.current);
    }
    return () => observer.current?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // Trigger the scroll again
    if (!props || !ref.current || !observer.current || props.loading) return;
    observer.current.unobserve(ref.current);
    observer.current.observe(ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loading]);

  return {
    ref,
    loading: props.loading,
  };
}
