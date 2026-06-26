import { ListRender } from "@/components/layout/ListRender";
import { ProvenanceEntryFragment } from "@/elektro/api/graphql";
import HistoryCard from "../cards/HistoryCard";

export const ProvenanceSidebar = (props: {
  items: ProvenanceEntryFragment[] | undefined;
}) => {
  return (
    <div className="p-3 flex flex-col gap-2">
      <ListRender array={props.items}>
        {(item, i) => <HistoryCard history={item} key={i} />}
      </ListRender>
    </div>
  );
};
