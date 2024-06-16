import { PageLayout } from "@/components/layout/PageLayout";
import { ApolloError } from "@apollo/client/errors";

export const ErrorPage = (props: { error: ApolloError }) => {
  return (
    <PageLayout title="Error">
      <div className="text-foreground">GraphQLErrors</div>
      <div className="p-3 @container ">
        {props.error.graphQLErrors.map((error) => (
          <>
            <h1 className="text-foreground">{error.message}</h1>
          </>
        ))}
      </div>
    </PageLayout>
  );
};
