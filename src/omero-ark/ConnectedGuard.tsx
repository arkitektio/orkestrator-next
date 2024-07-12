import { Button } from "@/components/ui/button";
import { useEnsureOmeroUserMutation, useMeQuery } from "./api/graphql";

export const EnsureMeButton = () => {
  const [setMe, data] = useEnsureOmeroUserMutation({
    refetchQueries: ["me"],
  });

  return (
    <Button
      onClick={() =>
        setMe({ variables: { password: "omero", username: "root" } })
      }
    >
      {" "}
      Set me
    </Button>
  );
};

export const ConnectedGuard = ({ children }: { children: React.ReactNode }) => {
  const { data, errors } = useMeQuery();

  if (errors) {
    return <> Couldn't request user data. </>;
  }

  if (!data) {
    return <> Loading...</>;
  }

  if (!data.me.omeroUser) {
    return (
      <>
        {" "}
        You are not yet associated with an account on omero do this now :)
        <EnsureMeButton />
      </>
    );
  }

  return <>{children}</>;
};
