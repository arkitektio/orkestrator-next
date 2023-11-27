import { withOmeroArk } from "@jhnnsrs/omero-ark"
import { useEnsureOmeroUserMutation, useMeQuery } from "./api/graphql"
import { Button } from "@/components/ui/button";

export const EnsureMeButton = () => {


    const [setMe, data] = withOmeroArk(useEnsureOmeroUserMutation)({
        refetchQueries: ["me"]
    });
  
  
    return <Button onClick={() => setMe({ variables: { password: "omero", username: "root"}})}> Set me</Button>
  
  
  
}

export const ConnectedGuard = ({children}: {children: React.ReactNode}) => {
    const { data, errors} = withOmeroArk(useMeQuery)()


    if (errors) {
        return <> Couldn't request user data. </>
    }

    if (!data) {
        return <> Loading...</>
    }

    if (!data.me.omeroUser) {
        return <> You are not yet associated with an account on omero do this now :)<EnsureMeButton/></>
    }


    return <>{children}</>

}



