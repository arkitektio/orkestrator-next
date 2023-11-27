import { PageLayout } from "@/components/layout/PageLayout";
import { useSettings } from "@/providers/settings/SettingsContext";
import { useFakts } from "@jhnnsrs/fakts";
import React from "react";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {


    const { settings} = useSettings();
    const {fakts} = useFakts()



  return (
    <PageLayout actions={<></>}>
      <pre>{JSON.stringify(fakts, null, 3)}</pre>
    </PageLayout>
  );
};

export default Page;
