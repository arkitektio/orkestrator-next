import { cn } from "@/lib/utils";
import autoAnimate from "@formkit/auto-animate";
import React, { useEffect, useRef } from "react";

export type FittingResponsiveGridProps = {
  children?: React.ReactNode;
  fitLength?: number;
  className?: string;
};

export const ContainerGrid: React.FC<FittingResponsiveGridProps> = ({
  children,
  fitLength,
  className,
}) => {
  const parent = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (parent.current) {
      autoAnimate(parent.current, {
        // Animation duration in milliseconds (default: 250)
        duration: 240,
        // Easing for motion (default: 'ease-in-out')
        easing: "ease-in-out",
        // When true, this will enable animations even if the user has indicated
        // they don’t want them via prefers-reduced-motion.
        disrespectUserMotionPreference: false,
      });
    }
  }, [children]);

  return (
    <div
      className={cn(`grid @lg:grid-cols-2 @xl:grid-cols-2 @2xl:grid-cols-4  @3xl:grid-cols-6  @5xl:grid-cols-6 @6xl:grid-cols-8 @7xl:grid-cols-10 @7xl:grid-cols-10 gap-4 `, className)}
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
