import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { useIsNodePossible, useNodePaths } from "../OntologyGraphProvider";

interface PathNodePresentationProps {
    id: string;
    label: string;
    tags?: Array<{ value: string }>;
    className?: string;
    children?: ReactNode;
    /** Show multi-path indicator */
    showPathCount?: boolean;
}

/**
 * Shared presentation component for path builder nodes.
 * Handles coloring, styling, and visual feedback based on path membership and selectability.
 */
export const PathNodePresentation = ({
    id,
    label,
    tags = [],
    className = "",
    children,
    showPathCount = true,
}: PathNodePresentationProps) => {
    const isPossible = useIsNodePossible(id);
    const nodePaths = useNodePaths(id);
    const isInPath = nodePaths.length > 0;

    // Use the first path's color if node is in any path
    const pathColor = isInPath ? nodePaths[0].color : undefined;

    // Border color: path color > gray (no blue default)
    const borderColor = pathColor || 'rgba(100, 100, 100, 0.3)';

    // Create semi-transparent version of path color for glow effects
    const glowColor = pathColor
        ? pathColor.replace('rgb', 'rgba').replace(')', ', 0.6)')
        : undefined;

    return (
        <Card
            className={`h-full w-full relative group transition-all duration-300 flex items-center justify-center p-3 ${className}`}
            style={{
                opacity: isPossible ? 1 : 0.2,
                pointerEvents: isPossible ? 'auto' : 'none',
                boxShadow: isInPath && glowColor
                    ? `0 0 20px 4px ${glowColor}, 0 0 40px 8px ${glowColor.replace('0.6', '0.3')}, inset 0 0 20px 2px ${glowColor.replace('0.6', '0.2')}`
                    : isPossible
                        ? '0 0 10px 2px rgba(59, 130, 246, 0.5)'
                        : '0 0 5px 1px rgba(100, 100, 100, 0.2)',
                border: `3px solid ${borderColor}`,
                filter: !isPossible && !isInPath ? 'grayscale(0.8)' : 'none',
                backgroundColor: 'hsl(var(--card))'
            }}
        >
            <div className="flex flex-col items-center justify-center gap-2 text-center">
                {children || <div className="font-semibold">{label}</div>}

                {tags.length > 0 && (
                    <div className="flex flex-row gap-1 flex-wrap justify-center">
                        {tags.map((tag) => (
                            <Badge key={tag.value} variant="outline" className="text-xs">
                                {tag.value}
                            </Badge>
                        ))}
                    </div>
                )}

                {showPathCount && nodePaths.length > 1 && (
                    <div className="text-xs text-muted-foreground">
                        In {nodePaths.length} paths
                    </div>
                )}
            </div>
        </Card>
    );
};
