import React from 'react';

export default function useDetectDevice() {
  const userAgent =
    typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;
  return React.useMemo(() => {
    const isSSR = userAgent === 'SSR';
    const isEdge = () => Boolean(userAgent.match(/Edge|Edg/i));
    const isAndroid = Boolean(userAgent.match(/Android/i));
    const isIos = Boolean(userAgent.match(/iPhone|iPad|iPod|iOS/i));
    const isOpera = Boolean(userAgent.match(/Opera Mini/i));
    const isWindows = Boolean(userAgent.match(/IEMobile/i));
    const isMac =
      Boolean(userAgent.match(/Mac OS X/i)) ||
      Boolean(userAgent.match(/Macintosh/i));

    const isMobile = isAndroid || isIos;
    const isApple = isIos || isMac;
    const isDesktop = !isMobile && !isSSR;

    return {
      isEdge,
      isSSR,
      isAndroid,
      isIos,
      isOpera,
      isWindows,
      isApple,
      isMac,
      isMobile,
      isDesktop,
    };
  }, [userAgent]);
}
