import { Card } from "@/components/ui/card";
import { CypherEditor } from "../cypher/CypherEditor";

export const CypherSidebar = (props: { cypher: string }) => {
  return (
    <div className="p-3 h-96 rounded">
      <Card className="h-full p-2">
        <CypherEditor cypher={props.cypher} />
      </Card>
    </div>
  );
};
