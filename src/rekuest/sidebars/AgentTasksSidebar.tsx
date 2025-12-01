
import { useListAssignationsQuery } from "../api/graphql";
import ListAssignationCard from "../components/cards/ListAssignationCard";

export const AgentTasksSidebar = (props: { agent: string }) => {
  const { data, error, loading } = useListAssignationsQuery({
    variables: {
      filter: { agent: props.agent },
      pagination: { limit: 10, offset: 0 },
    },
  });

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Runs</h2>
        <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error loading runs: {error.message}
          </p>
        </div>
      </div>
    );
  }



  return (
    <div className="p-4 space-y-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Tasks Overview</h2>
        <p className="text-sm text-muted-foreground">
          The last 10 Tasks that have been executed on this agent.
        </p>
      </div>
      {data?.tasks.map((card) => (
        <ListAssignationCard key={card.id} item={card} />
      ))}
    </div>
  );
};
