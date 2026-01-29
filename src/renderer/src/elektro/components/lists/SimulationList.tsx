
import { createList } from "@/components/layout/createList";
import { useListSimulationsQuery } from "@/elektro/api/graphql";
import { ElektroSimulation } from "@/linkers";
import SimulationCard from "../cards/SimulationCard";

const TList = createList({
  useHook: useListSimulationsQuery,
  dataKey: "simulations",
  ItemComponent: SimulationCard,
  title: "Simulations",
  smart: ElektroSimulation,
});
export default TList;
