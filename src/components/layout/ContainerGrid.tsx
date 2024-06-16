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
              id: item.dataset.object,
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

  let lg_size = fitLength && fitLength < 2 ? fitLength : 2;
  let xl_size = fitLength && fitLength < 3 ? fitLength : 3;
  let xxl_size = fitLength && fitLength < 4 ? fitLength : 4;
  let xxxl_size = fitLength && fitLength < 5 ? fitLength : 5;
  let xxxxl_size = fitLength && fitLength < 6 ? fitLength : 6;

  return (
    <div
      className={`grid @lg:grid-cols-${lg_size} @xl-grid-cols-${xl_size} @2xl:grid-cols-${xxl_size}  @3xl:grid-cols-${xxxl_size}   @5xl:grid-cols-${xxxxl_size} gap-4`}
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
        `grid @lg:grid-cols-2 @xl:grid-cols-3 @2xl:grid-cols-4  @3xl:grid-cols-5 @4xl:grid-cols-6 gap-2`,
        className,
      )}
      data-enableselect="true"
    >
      {children}
    </div>
  );
};

export { ResponsiveContainerGrid };
