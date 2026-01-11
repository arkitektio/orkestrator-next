import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Edit2, Database } from "lucide-react";
import { stringToColor } from "./utils";
import { cn } from "@/lib/utils";

interface TypeCardProps {
  name: string;
  description?: string;
  instanceCount?: number;
  propertyCount: number;
  isSystemDefined?: boolean;
  onEdit?: () => void;
  onClick?: () => void;
}

export function TypeCard({
  name,
  description,
  instanceCount = 0,
  propertyCount,
  isSystemDefined = false,
  onEdit,
  onClick,
}: TypeCardProps) {
  const bgColor = stringToColor(name);

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]",
        "border-2"
      )}
      style={{ backgroundColor: bgColor }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-foreground/70" />
            <h3 className="text-xl font-bold">{name}</h3>
          </div>
          {isSystemDefined ? (
            <Lock className="h-4 w-4 text-muted-foreground" />
          ) : (
            onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1 rounded hover:bg-background/20 transition-colors"
              >
                <Edit2 className="h-4 w-4 text-foreground/70" />
              </button>
            )
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && (
          <p className="text-sm text-foreground/80 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            {formatCount(instanceCount)} Nodes
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {propertyCount} {propertyCount === 1 ? "Property" : "Properties"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
