import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { useIsEdgePossible, useEdgePaths } from "../OntologyGraphProvider";

interface PathEdgePresentationProps {
    id: string;
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Transform for positioning */
    transform?: string;
}

/**
 * Shared presentation component for path builder edge labels.
 * Handles coloring, styling, and visual feedback based on path membership and selectability.
 */
export const PathEdgePresentation = ({
    id,
    children,
    className = "",
    transform,
}: PathEdgePresentationProps) => {
    const isPossible = useIsEdgePossible(id);
    const edgePaths = useEdgePaths(id);
    const isInPath = edgePaths.length > 0;

    // Use the first path's color if edge is in any path
    const pathColor = isInPath ? edgePaths[0].color : undefined;

    // Border color: path color > gray (no blue default)
    const borderColor = pathColor || 'rgba(100, 100, 100, 0.3)';
    const borderWidth = pathColor ? '2px' : '1px';

    return (
        <Card
            style={{
                position: "absolute",
                transform: transform,
                opacity: isPossible ? 1 : 0.2,
                pointerEvents: isPossible ? 'all' : 'none',
                boxShadow: pathColor
                    ? `0 0 12px 2px ${pathColor}`
                    : isPossible
                        ? '0 0 8px 1px rgba(59, 130, 246, 0.4)'
                        : '0 0 5px 1px rgba(100, 100, 100, 0.2)',
                borderColor: borderColor,
                borderWidth: borderWidth,
                filter: !isPossible && !pathColor ? 'grayscale(0.8)' : 'none'
            }}
            className={`p-3 text-xs group nodrag nopan transition-all duration-300 ${className}`}
        >
            {children}
        </Card>
    );
};

/**
 * Get the stroke style for an edge based on its path membership and selectability.
 */
export const useEdgeStrokeStyle = (edgeId: string) => {
    const isPossible = useIsEdgePossible(edgeId);
    const edgePaths = useEdgePaths(edgeId);
    const pathColor = edgePaths.length > 0 ? edgePaths[0].color : undefined;

    return {
        opacity: isPossible ? 1 : 0.15,
        stroke: pathColor || (isPossible ? 'rgb(59, 130, 246)' : 'rgb(100, 100, 100)'),
        strokeWidth: pathColor ? 4 : isPossible ? 3 : 1,
        filter: pathColor
            ? `drop-shadow(0 0 8px ${pathColor}) drop-shadow(0 0 16px ${pathColor})`
            : isPossible
                ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))'
                : 'none',
        transition: 'all 0.3s ease'
    };
};
