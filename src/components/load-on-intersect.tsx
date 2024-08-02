import React from 'react';
import useLoadOnIntersect, {
  UseLoadOnIntersectProps,
} from '../hooks/use-load-on-intersect';

export interface LoadOnIntersectProps extends UseLoadOnIntersectProps {
  loader: React.ReactNode;
}

export default function LoadOnIntersect(props: LoadOnIntersectProps) {
  const { loader, ...rest } = props;
  // Setup infinite scroll
  const infiniteScroll = useLoadOnIntersect(rest);

  if (!infiniteScroll) return null;

  return (
    <>
      <div style={{ height: 1, width: '100%' }} ref={infiniteScroll.ref} />
      {infiniteScroll.loading ? <>{loader}</> : <div style={{ height: 40 }} />}
    </>
  );
}
