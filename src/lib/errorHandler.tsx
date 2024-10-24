import { ApolloError } from "@apollo/client";
import { toast } from "sonner";

export const onApolloError = (service: name) => (error: ApolloError) => {
  console.error(error);

  toast.error(error.message, {
    description: "This is a graphql-server on " + service,
  });
};
