import { ListRender } from "@/components/layout/ListRender";
import { HistoryFragment } from "@/mikro-next/api/graphql";
import HistoryCard from "../cards/HistoryCard";

export const ProvenanceSidebar = (props: {
  items: HistoryFragment[] | undefined;
}) => {
  return (
    <div className="p-3">
      <h2 className="text-xl">Latest Provenance</h2>
      <ListRender array={props.items}>
        {(item, i) => <HistoryCard history={item} key={i} />}
      </ListRender>
    </div>
  );
};
