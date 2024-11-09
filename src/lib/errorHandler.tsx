import { ApolloError } from "@apollo/client";
import { toast } from "sonner";

export const onApolloError = (service: name) => (error: ApolloError) => {
  console.error(error);

  if (error.graphQLErrors) {
    let message = error.graphQLErrors.map((e) => e.message).join(", ");
    error.graphQLErrors.forEach((e) => {
      toast.error(message, {
        description: "This is a graphql-server on " + service,
      });
    });
  } else {
    toast.error(error.message, {
      description: "This is a network-error on " + service,
    });
  }

  return error;
};
