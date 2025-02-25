import { usePinGraphMutation } from "@/kraph/api/graphql";
import { Button, ButtonProps } from "../ui/button";

type Func = (arg: {
  variables: {
    input: { id: string; pinned: boolean };
  };
}) => any;

export const PinButton = ({
  item,
  func,
  ...props
}: {
  item: { __typename?: string | undefined; pinned: boolean; id: string };
  func: Func;
} & ButtonProps) => {
  return (
    <Button
      onClick={() =>
        func({
          variables: {
            input: {
              id: item.id,
              pinned: !item.pinned,
            },
          },
        })
      }
      {...props}
    >
      {item.pinned ? "Unpin" : "Pin"}
    </Button>
  );
};
