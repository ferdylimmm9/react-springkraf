import React from 'react';
import generate, { Margin, Resolution, Options } from 'react-to-pdf';

interface UseGeneratePdfProps extends Partial<Options> {}

const DEFAULT_OPTIONS: Options = {
  method: 'open',
  resolution: Resolution.MEDIUM,
  page: {
    margin: Margin.MEDIUM,
  },
  canvas: {
    mimeType: 'image/png',
    qualityRatio: 1,
  },
  overrides: {
    pdf: {
      compress: true,
    },
  },
};

export default function useGeneratePdf(props?: UseGeneratePdfProps) {
  const { canvas, filename, method, overrides, page, resolution } = props || {};

  const targetRef = React.useRef<HTMLDivElement | null>(null);
  const generatePDF = React.useCallback(() => {
    generate(targetRef, {
      method: method || DEFAULT_OPTIONS?.method,
      resolution: resolution || DEFAULT_OPTIONS?.resolution,
      page: {
        ...DEFAULT_OPTIONS?.page,
        ...page,
      },
      canvas: {
        ...DEFAULT_OPTIONS?.canvas,
        ...canvas,
      },
      filename: filename,
      overrides: {
        pdf: {
          ...DEFAULT_OPTIONS?.overrides?.pdf,
          ...overrides?.pdf,
        },
        canvas: {
          ...DEFAULT_OPTIONS?.overrides?.canvas,
          ...overrides?.canvas,
        },
      },
    });
  }, [
    canvas,
    filename,
    method,
    overrides?.canvas,
    overrides?.pdf,
    page,
    resolution,
  ]);

  return { targetRef, generatePDF };
}
