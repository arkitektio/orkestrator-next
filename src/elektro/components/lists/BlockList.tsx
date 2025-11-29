
import { createList } from "@/components/layout/createList";
import { useListBlocksQuery } from "@/elektro/api/graphql";
import { ElektroBlock } from "@/linkers";
import BlockCard from "../cards/BlockCard";

const BlockList = createList({
  useHook: useListBlocksQuery,
  dataKey: "blocks",
  ItemComponent: BlockCard,
  title: "Blocks",
  smart: ElektroBlock,
});
export default BlockList;
