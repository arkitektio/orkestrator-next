import { useGetFolderQuery } from "@/mikro-next/api/graphql";

export const FolderRender = (props: { object: string }) => {
  const { data } = useGetFolderQuery({
    variables: {
      id: props.object,
    },
  });

  return <>{data?.folder.name}</>;
};

export const ConditionalStructureRender = (props: {
  identifier: string;
  object: string;
}) => {
  if (props.identifier === "@mikro/folder") {
    return <FolderRender object={props.object} />;
  }

  return (
    <>
      {props.identifier} {props.object}
    </>
  );
};
