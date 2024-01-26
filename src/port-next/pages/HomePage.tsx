import React from "react";
import PodList from "../components/lists/PodList";
import DefinitionList from "../components/lists/DefinitionList";
import { PageLayout } from "@/components/layout/PageLayout";
import ReleaseCarousel from "../components/carousels/ReleaseCarousel";
import { withPort } from "@jhnnsrs/port-next";
import {
  FlavourUpdateFragmentDoc,
  useFlavoursUpdatesSubscription,
} from "../api/graphql";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import AddRepoForm from "../components/forms/AddRepoForm";
import RescanRepoForm from "../components/forms/RescanRepoForm";

export type IRepresentationScreenProps = {};

export const FlavourUpdater = () => {
  const { data, loading } = withPort(useFlavoursUpdatesSubscription)({
    variables: {},
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data) {
        const updatedFlavour = subscriptionData.data.flavours;

        client.writeFragment({
          id: client.cache.identify(updatedFlavour),
          fragment: FlavourUpdateFragmentDoc,
          data: updatedFlavour,
        });
      }
    },
  });

  return <></>;
};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      actions={
        <>
          <FormDialogAction label="Add Repo">
            <AddRepoForm />
          </FormDialogAction>
          <FormDialogAction label="Scan Repos">
            <RescanRepoForm />
          </FormDialogAction>
        </>
      }
    >
      <FlavourUpdater />
      <div className="flex flex-col">
        <h3 className="text-4xl font-light mb-3">Featured Apps</h3>
        <h1 className="font-light"> Here you can find the best of the best</h1>
      </div>
      <div className="flex-1 p-3">
        <ReleaseCarousel />
      </div>
      <div className="flex-1">
        <PodList />
        <DefinitionList/>
      </div>
    </PageLayout>
  );
};

export default Page;
