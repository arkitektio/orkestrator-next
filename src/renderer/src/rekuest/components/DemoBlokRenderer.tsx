import * as React from 'react';
import BlokRenderer from '@/blok/renderer/BlokRenderer';

type DemoBlokData = {
  id?: string | null;
  uiComponents: unknown;
  demoState: unknown;
};

type DemoBlokRendererProps = Omit<
  React.ComponentProps<typeof BlokRenderer>,
  'uiComponents' | 'initialState'
> & {
  blok: DemoBlokData;
};

export const DemoBlokRenderer = (props: DemoBlokRendererProps) => {
  const {blok, surfaceId, ...rendererProps} = props;

  return (
    <BlokRenderer
      {...rendererProps}
      surfaceId={surfaceId ?? `${blok.id ?? 'blok'}-demo`}
      uiComponents={blok.uiComponents}
      initialState={blok.demoState}
    />
  );
};

export default DemoBlokRenderer;
