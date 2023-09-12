import { withLokNext } from "@jhnnsrs/lok-next";
import { ElementRenderProps } from "../types";
import { useUserQuery } from "@/lok-next/api/graphql";

export const MentionEdit = ({
  attributes,
  children,
  element,
}: ElementRenderProps) => {
  if (!element.user) {
    return <>Illl configured</>;
  }
  console.log(element);

  const { data, error } = withLokNext(useUserQuery)({
    variables: { id: element.user },
  });

  return (
    <>
      {data?.user ? (
        <span className="font-light inline">@{data?.user?.username}</span>
      ) : (
        <span {...attributes} className="cursor-pointer flex flex-row">
          {element.user}{" "}
        </span>
      )}
    </>
  );
};
