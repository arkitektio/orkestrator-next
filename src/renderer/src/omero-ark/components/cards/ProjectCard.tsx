import { OmeroArkProject } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListProjectFragment } from "../../api/graphql";
import { Card } from "@/components/ui/card";

interface Props {
  project: ListProjectFragment;
  mates?: MateFinder[];
}

const TCard = ({ project, mates }: Props) => {
  return (
    <OmeroArkProject.Smart
      object={project?.id}
    >
      <Card className="px-2 py-2 h-full w-full">
        <OmeroArkProject.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={project.id}
        >
          {project?.name}
        </OmeroArkProject.DetailLink>
      </Card>
    </OmeroArkProject.Smart>
  );
};

export default TCard;
