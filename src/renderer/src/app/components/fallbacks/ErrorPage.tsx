import { PageLayout } from "@/components/layout/PageLayout";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { ApolloError } from "@apollo/client/errors";

export const ErrorPage = (props: { error: ApolloError }) => {
  return (
    <PageLayout title="Error">
      <div className="items-center justify-center h-full w-full flex flex-col">
        <Card className="text-foreground p-3 ">
          <Alert className="text-foreground bg-destructive">
            GraphQLErrors
          </Alert>
          <div className="p-3 @container flex flex-col ">
            {props.error.graphQLErrors.map((error) => (
              <>
                <h1 className="text-foreground">{error.message}</h1>
              </>
            ))}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};
