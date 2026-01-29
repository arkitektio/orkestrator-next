import { memo } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import { ControlProps, ReactFlowState, useReactFlow, useStore, useStoreApi } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LockIcon, MinusIcon, PlusIcon, UnlockIcon, View } from 'lucide-react';
import { HTMLAttributes, forwardRef } from 'react';
import type { PanelPosition } from '@xyflow/system';



export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * The position of the panel.
   * @default "top-left"
   */
  position?: PanelPosition;
};


export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ position = 'top-left', children, className, style, ...rest }, ref) => {
    const positionClasses = `${position}`.split('-');

    return (
      <div className={cc(['react-flow__panel', className, ...positionClasses])} style={style} ref={ref} {...rest}>
        {children}
      </div>
    );
  }
);

const selector = (s: ReactFlowState) => ({
  isInteractive: s.nodesDraggable || s.nodesConnectable || s.elementsSelectable,
  minZoomReached: s.transform[2] <= s.minZoom,
  maxZoomReached: s.transform[2] >= s.maxZoom,
  ariaLabelConfig: s.ariaLabelConfig,
});

function ControlsComponent({
  style,
  showZoom = true,
  showFitView = true,
  showInteractive = true,
  fitViewOptions,
  onZoomIn,
  onZoomOut,
  onFitView,
  onInteractiveChange,
  className,
  children,
  position = 'bottom-left',
  orientation = 'vertical',
  'aria-label': ariaLabel,
}: ControlProps) {
  const store = useStoreApi();
  const { isInteractive, minZoomReached, maxZoomReached, ariaLabelConfig } = useStore(selector, shallow);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const onZoomInHandler = () => {
    zoomIn();
    onZoomIn?.();
  };

  const onZoomOutHandler = () => {
    zoomOut();
    onZoomOut?.();
  };

  const onFitViewHandler = () => {
    fitView(fitViewOptions);
    onFitView?.();
  };

  const onToggleInteractivity = () => {
    store.setState({
      nodesDraggable: !isInteractive,
      nodesConnectable: !isInteractive,
      elementsSelectable: !isInteractive,
    });

    onInteractiveChange?.(!isInteractive);
  };

  const orientationClass = orientation === 'horizontal' ? 'horizontal' : 'vertical';
  return (
    <Panel position={position}
      className={cc(['react-flow__controls p-2', orientationClass, className])}
      style={style}
      data-testid="rf__controls"
      aria-label={ariaLabel ?? ariaLabelConfig['controls.ariaLabel']}
    >
      {showZoom && (
        <>
          <Button
          variant={"outline"}
          size="icon"
            onClick={onZoomInHandler}
            className="react-flow__controls-zoomin"
            title={ariaLabelConfig['controls.zoomIn.ariaLabel']}
            aria-label={ariaLabelConfig['controls.zoomIn.ariaLabel']}
            disabled={maxZoomReached}
          >
            <PlusIcon />
          </Button>
          <Button
          variant={"outline"}
          size="icon"
            onClick={onZoomOutHandler}
            className="react-flow__controls-zoomout"
            title={ariaLabelConfig['controls.zoomOut.ariaLabel']}
            aria-label={ariaLabelConfig['controls.zoomOut.ariaLabel']}
            disabled={minZoomReached}
          >
            <MinusIcon />
          </Button>
        </>
      )}
      {showFitView && (
        <Button
          variant={"outline"}
          size="icon"
          className="react-flow__controls-fitview"
          onClick={onFitViewHandler}
          title={ariaLabelConfig['controls.fitView.ariaLabel']}
          aria-label={ariaLabelConfig['controls.fitView.ariaLabel']}
        >
          <View />
        </Button>
      )}
      {showInteractive && (
        <Button
        variant={"outline"}
          size="icon"
          className="react-flow__controls-interactive"
          onClick={onToggleInteractivity}
          title={ariaLabelConfig['controls.interactive.ariaLabel']}
          aria-label={ariaLabelConfig['controls.interactive.ariaLabel']}
        >
          {isInteractive ? <UnlockIcon /> : <LockIcon />}
        </Button>
      )}
      {children}
    </Panel>
  );
}

ControlsComponent.displayName = 'Controls';

/**
 * The `<Controls />` component renders a small panel that contains convenient
 * buttons to zoom in, zoom out, fit the view, and lock the viewport.
 *
 * @public
 * @example
 *```tsx
 *import { ReactFlow, Controls } from '@xyflow/react'
 *
 *export default function Flow() {
 *  return (
 *    <ReactFlow nodes={[...]} edges={[...]}>
 *      <Controls />
 *    </ReactFlow>
 *  )
 *}
 *```
 *
 * @remarks To extend or customise the controls, you can use the [`<ControlButton />`](/api-reference/components/control-button) component
 *
 */
export const Controls = memo(ControlsComponent);
