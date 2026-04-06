import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { Identifier, Structure } from "@/providers/types";
import { useDrop } from "react-dnd";

import { resolveSmartDrop } from "@/providers/smart/dropUtils";

export type DropZoneProps = {
  accepts: Identifier[];
  className?: string;
  compareWithList?: { id: string }[];
  overLabel: React.ReactNode;
  canDropLabel: React.ReactNode;
  onDrop: (items: Structure[]) => Promise<void>;
};

export const DropZone = ({
  className,
  accepts,
  onDrop,
  compareWithList,
  overLabel,
  canDropLabel,
}: DropZoneProps) => {
  const [{ isOver, canDrop, allItemsContained }, drop] = useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE],
      drop: async (item, monitor) => {
        const resolvedDrop = resolveSmartDrop(item, monitor.getItemType());
        if (!resolvedDrop) {
          return {};
        }

        return await onDrop(resolvedDrop.partners);
      },
      collect: (monitor) => {
        const resolvedDrop = resolveSmartDrop(monitor.getItem(), monitor.getItemType());
        let items = resolvedDrop?.partners;
        if (!items) {
          return {
            isOver: false,
            canDrop: false,
            allItemsContained: false,
          };
        }
        if (compareWithList && compareWithList.length > 0) {
          const compareIds = compareWithList.map((c) => c.id);
          items = items.filter((i) => !compareIds.includes(i.id));
          console.log("ALL COMPARED ITEMS", items);
        }

        if (items.length === 0) {
          return {
            isOver: !!monitor.isOver(),
            canDrop: true,
            allItemsContained: true,
          };
        }

        return {
          isOver: !!monitor.isOver(),
          canDrop:
            monitor.canDrop() &&
            accepts.includes(items.at(0)?.identifier || ""),
          allItemsContained: false,
        };
      },
    };
  }, []);

  return (
    <div className={`${!canDrop && "hidden"} ${className}`} ref={drop}>
      {allItemsContained && "All items already contained"}
      {isOver ? overLabel : canDropLabel}
    </div>
  );
};
