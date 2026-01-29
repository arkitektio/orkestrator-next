import { ListRender } from "@/components/layout/ListRender";
import { OmeroArkProject } from "@/linkers";
import { useListProjectsQuery } from "@/omero-ark/api/graphql";
import ProjectCard from "../cards/ProjectCard";

const List = () => {
  const { data, error, subscribeToMore, refetch } = useListProjectsQuery({
    variables: {},
  });

  return (
    <>
      {error && <div>Error: {error.message}</div>}
      <ListRender
        array={data?.projects}
        title={
          <OmeroArkProject.ListLink className="flex-0">
            Projects
          </OmeroArkProject.ListLink>
        }
        refetch={refetch}
      >
        {(ex, index) => <ProjectCard key={index} project={ex} mates={[]} />}
      </ListRender>
    </>
  );
};

export default List;
