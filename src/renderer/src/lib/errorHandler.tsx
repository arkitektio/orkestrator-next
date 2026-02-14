import { ApolloError } from "@apollo/client";
import { toast } from "sonner";

export const onApolloError = (service: name) => (error: ApolloError) => {
  console.error(error);

  if (error.graphQLErrors) {
    const message = error.graphQLErrors.map((e) => e.message).join(", ");
    error.graphQLErrors.forEach((e) => {
      toast.error(<div className="p-3">{message}</div>, {
        description: "This is a graphql-server on " + service,
      });
    });
  } else {
    toast.error(<div className="p-3">{error.message}</div>, {
      description: "This is a network-error on " + service,
    });
  }

  return error;
};
