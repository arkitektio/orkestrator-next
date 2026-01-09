import { createList } from "@/components/layout/createList";
import { RekuestAction } from "@/linkers";
import {
  useAllActionsQuery
} from "@/rekuest/api/graphql";
import ActionCard from "../cards/ActionCard";


const ActionList = createList(
  {
    useHook: useAllActionsQuery,
    dataKey: "actions",
    ItemComponent: ActionCard,
    title: "Actions",
    smart: RekuestAction,
  }
)

export default ActionList
