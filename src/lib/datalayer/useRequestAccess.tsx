import { AccessCredentialsFragment, RequestAccessDocument, RequestAccessMutation } from "@/mikro-next/api/graphql";
import { ApolloClient } from "@apollo/client";
import React from "react";


export type ErrorState = {
    status: "error";
    data: undefined;
    error: Error;
};

export type LoadedState<T> = {
    status: "loaded";
    data: T;
    error: undefined;
};

export type LoadingState = {
    status: "loading";
    data: undefined;
    error: undefined;
};

export type RequestAccessState = LoadingState | LoadedState<AccessCredentialsFragment> | ErrorState;


export const useRequestAccess = (key: string, client: ApolloClient<any>) => {


    const [state, setState] = React.useState<RequestAccessState>({
        status: "loading",
        data: undefined,
        error: undefined
    });

    React.useEffect(() => {
        if (client) {
            client.query<RequestAccessMutation>({
                query: RequestAccessDocument,
                variables: {
                    key: key
                }
            }).then((result) => {
                setState({
                    status: "loaded",
                    data: result.data.requestAccess,
                    error: undefined
                });
            }).catch((error) => {
                setState({
                    status: "error",
                    data: undefined,
                    error: error
                });
            });
        }
    }, [key, client]);

    return state;
}

