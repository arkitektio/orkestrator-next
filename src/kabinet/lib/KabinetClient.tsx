import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { RekuestConfig } from "@jhnnsrs/rekuest";
import { createClient } from "graphql-ws";

export const createKabinetClient = (config: RekuestConfig) => {
  let token = config.retrieveToken();

  const httpLink = createHttpLink({
    uri: config.endpointUrl,
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });

  const queryLink = httpLink;

  const wslink = new GraphQLWsLink(
    createClient({
      url: config.wsEndpointUrl,
      connectionParams: () => ({
        token: token,
      }),
    }),
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wslink,
    queryLink as unknown as ApolloLink,
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({ possibleTypes: config.possibleTypes }),
  });
};
