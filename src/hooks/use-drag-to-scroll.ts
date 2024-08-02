import React from 'react';

export function getClientPosition(e: MouseEvent | TouchEvent) {
  if ('touches' in e && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  } else if ('clientX' in e) {
    return {
      x: e.clientX,
      y: e.clientY,
    };
  } else {
    throw new Error('Not a Mouse/Touch Event');
  }
}

export default function useDragToScroll() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isDown = React.useRef(false);
  const scrollLeft = React.useRef<number | null>(null);
  const startX = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;
    const mouseDown = (event: MouseEvent) => {
      isDown.current = true;
      startX.current = event.pageX - element.offsetLeft;
      scrollLeft.current = element.scrollLeft;
    };
    const mouseLeave = (event: MouseEvent) => {
      isDown.current = false;
    };
    const mouseUp = (event: MouseEvent) => {
      isDown.current = false;
      if (element.scrollLeft > 3) {
        event.stopPropagation();
      }
    };
    const mouseMove = (event: MouseEvent) => {
      if (!isDown.current) return;
      event.preventDefault();
      event.stopPropagation();
      const x = event.pageX - element.offsetLeft;
      const move = (x - (startX?.current || 0)) * 2;
      element.scrollLeft = (scrollLeft?.current || 0) - move;
    };

    element.addEventListener('mousedown', mouseDown);
    element.addEventListener('mouseup', mouseUp);
    element.addEventListener('mouseleave', mouseLeave);
    element.addEventListener('mousemove', mouseMove);
    return () => {
      element.addEventListener('mousedown', mouseDown);
      element.removeEventListener('mouseup', mouseUp);
      element.removeEventListener('mouseleave', mouseLeave);
      element.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  return {
    ref,
  };
}
