import { useGetDatasetQuery, useGetImageQuery } from "@/mikro-next/api/graphql";
import { withMikroNext } from "@jhnnsrs/mikro-next";

export const ImageRender = (props: { object: string }) => {
  const { data } = withMikroNext(useGetImageQuery)({
    variables: {
      id: props.object,
    },
  });

  return <>{data?.image.name}</>;
};

export const DatasetRender = (props: { object: string }) => {
  const { data } = withMikroNext(useGetDatasetQuery)({
    variables: {
      id: props.object,
    },
  });

  return <>{data?.dataset.name}</>;
};

export const ConditionalStructureRender = (props: {
  identifier: string;
  object: string;
}) => {
  if (props.identifier === "@mikronext/image") {
    return <ImageRender object={props.object} />;
  }

  if (props.identifier === "@mikronext/dataset") {
    return <DatasetRender object={props.object} />;
  }

  return (
    <>
      {props.identifier} {props.object}
    </>
  );
};
