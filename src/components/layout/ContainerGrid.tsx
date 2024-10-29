import { cn, notEmpty } from "@/lib/utils";
import { useSelection } from "@/providers/selection/SelectionContext";
import autoAnimate from "@formkit/auto-animate";
import React, { useEffect, useRef } from "react";

export type FittingResponsiveGridProps = {
  children?: React.ReactNode;
  fitLength?: number;
};

export const ContainerGrid: React.FC<FittingResponsiveGridProps> = ({
  children,
  fitLength,
}) => {
  const parent = useRef<HTMLDivElement | null>(null);
  const { registerSelectables, unregisterSelectables } = useSelection();

  useEffect(() => {
    if (parent.current) {
      autoAnimate(parent.current);

      const selectables = Array.from<HTMLElement>(
        parent.current.children as unknown as HTMLElement[],
      )
        .map((item) => {
          if (!item.dataset.identifier || !item.dataset.object) {
            return null;
          }
          return {
            structure: {
              identifier: item.dataset.identifier,
              object: item.dataset.object,
            },
            item: item,
          };
        })
        .filter(notEmpty);

      registerSelectables(selectables);

      return () => {
        unregisterSelectables(selectables);
      };
    }
  }, [children]);

  return (
    <div
      className={`grid @lg:grid-cols-2 @xl-grid-cols-2 @2xl:grid-cols-4  @3xl:grid-cols-6  @5xl:grid-cols-6 @6xl:grid-cols-8 @7xl:grid-cols-10 @7xl:grid-cols-12 gap-4`}
      data-enableselect="true"
      ref={parent}
    >
      {children}
    </div>
  );
};

export type IResponsiveGridProps = {
  children?: React.ReactNode;
  className?: string;
};

const ResponsiveContainerGrid: React.FC<IResponsiveGridProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        `grid @lg:grid-cols-2 @xl:grid-cols-3 @2xl:grid-cols-4  @3xl:grid-cols-5 @4xl:grid-cols-6 @5xl:grid-cols-8  @6xl:grid-cols-10 gap-2`,
        className,
      )}
      data-enableselect="true"
    >
      {children}
    </div>
  );
};

export { ResponsiveContainerGrid };
