import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import NodeHandles from "./NodeHandles";
import { NODE_DIAMETER } from "./nodeSize";

/**
 * The shell every node in this graph wears: one circle, one size.
 *
 * The name is clamped rather than truncated to a single line — a circle has
 * more room in the middle than at the edges, and three short lines fit where
 * one long one would not.
 */
export const CircleNode = (props: {
  icon: LucideIcon;
  title: string;
  /** The name, already wrapped in whatever link the kind deserves. */
  children: ReactNode;
  /** Ring, border and icon colour — what kind of thing this is. */
  className: string;
  iconClassName: string;
  /** The node the walk started from, drawn as the anchor of the component. */
  emphasised?: boolean;
  /** A line under the name: the axes, the kind. */
  caption?: string;
}) => (
  <>
    <NodeHandles />
    <div
      title={props.title}
      style={{ width: NODE_DIAMETER, height: NODE_DIAMETER }}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 rounded-full border-2 px-3 text-center shadow-sm",
        props.className,
        props.emphasised &&
          "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    >
      <props.icon className={cn("h-4 w-4 shrink-0", props.iconClassName)} />
      <div className="line-clamp-3 max-w-full break-words text-[11px] font-semibold leading-tight">
        {props.children}
      </div>
      {props.caption && (
        <div className="max-w-full truncate font-mono text-[9px] leading-none text-muted-foreground">
          {props.caption}
        </div>
      )}
    </div>
  </>
);

export default CircleNode;
