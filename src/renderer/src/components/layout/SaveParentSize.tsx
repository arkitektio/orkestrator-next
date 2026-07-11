import { useEffect, useRef, useState } from "react";

export type ParentSizeState = {
  width: number;
  height: number;
};

export type SaveParentSizeProps = {
  children: (size: ParentSizeState) => React.ReactNode;
  className?: string;
};

/**
 * A minimal, dependency-free stand-in for `@visx/responsive`'s `ParentSize`:
 * measures its own container via `ResizeObserver` and calls `children` with
 * the current `{ width, height }`.
 */
export const SaveParentSize = ({ children, className }: SaveParentSizeProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<ParentSizeState>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ width: "100%", height: "100%" }}>
      {size.width < 10 || size.width > 2000 || size.height < 10 || size.height > 2000
        ? <>....</>
        : children(size)}
    </div>
  );
};
