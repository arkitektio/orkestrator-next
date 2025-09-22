import { PageLayout } from "@/components/layout/PageLayout";
import { ActionButton } from "@/components/ui/action";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { Separator } from "@/components/ui/separator";
import React from "react";
import {
  ListDefinitionsDocument,
  ListReleasesDocument,
  useRescanReposMutation,
} from "../api/graphql";
import { PopularCarousel } from "../components/PopularCarousel";
import DefinitionList from "../components/lists/DefinitionList";
import ReleasesList from "../components/lists/ReleasesList";
import { CreateRepoForm } from "../forms/CreateRepoForm";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const [rescan, { loading }] = useRescanReposMutation({
    refetchQueries: [ListReleasesDocument, ListDefinitionsDocument],
  });

  return (
    <PageLayout
      pageActions={
        <div className="flex flex-row gap-1">
          <>
            <FormDialogAction
              label="Add Repo"
              variant="outline"
              size="sm"
              onSubmit={(item) => {
                console.log(item);
              }}
            >
              <CreateRepoForm />
            </FormDialogAction>
          </>

          <ActionButton
            label="Rescan Repos"
            run={async () => {
              await rescan();
            }}
            variant="outline"
            size="sm"
          >
            {loading ? "Rescanning..." : "Rescan Repos"}
          </ActionButton>
        </div>
      }
      title="App Store"
    >
      <div className="p-3 ">
        <PopularCarousel />

        <Separator className="mt-8 mb-2" />

        <DefinitionList />
        <ReleasesList />
      </div>
    </PageLayout>
  );
};

export default Page;
