import { LokUser } from "@/linkers";
import { Badge } from "@/components/ui/badge";
import { MentionType } from "../types";

export const Mention = ({ element }: { element: MentionType }) => {
  return (
    <>
      {element?.user && (
        <LokUser.Smart
          object={element?.user?.id}
          className="inline-flex"
          dropClassName={() => "inline"}
          containerClassName="inline"
          mates={[]}
        >
          <LokUser.DetailLink
            object={element?.user?.id}
            className="inline"
          >
            <Badge variant="secondary" className="inline-flex items-center gap-1 font-normal cursor-pointer hover:bg-secondary/80">
              @{element?.user?.username}
            </Badge>
          </LokUser.DetailLink>
        </LokUser.Smart>
      )}
    </>
  );
};
