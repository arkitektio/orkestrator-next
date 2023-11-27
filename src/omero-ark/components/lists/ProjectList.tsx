import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset, OmeroArkProject } from "@/linkers";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import ProjectCard from "../cards/ProjectCard";
import { withOmeroArk } from "@jhnnsrs/omero-ark";
import { useListProjectsQuery } from "@/omero-ark/api/graphql";



const List = () => {
  const { data, error, subscribeToMore, refetch } = withOmeroArk(
    useListProjectsQuery,
  )({
    variables: {  },
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
