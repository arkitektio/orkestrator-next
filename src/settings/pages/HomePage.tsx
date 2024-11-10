import { SwitchField } from "@/components/fields/SwitchField";
import { PageLayout } from "@/components/layout/PageLayout";
import { Form } from "@/components/ui/form";
import { useSettings } from "@/providers/settings/SettingsContext";
import deepEqual from "deep-equal";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const { setSettings, settings } = useSettings();

  const form = useForm({
    defaultValues: settings,
  });

  const {
    formState,
    formState: { isValidating },
    watch,
  } = form;

  const data = watch();

  useEffect(() => {
    if (formState.isValid && !isValidating) {
      console.log("formState", formState);
      if (!deepEqual(data, settings)) {
        console.log("submitting", data);
        setSettings(data);
      }
    }
  }, [formState, data, isValidating, settings]);

  return (
    <PageLayout actions={<></>} title="App Settings">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            console.log("setting", data);
            setSettings(data);
          })}
          className="space-y-4"
        >
          <SwitchField
            name="experimentalViv"
            label="Experimental Viv"
            description="Enable Experimental Caching"
          />
          <SwitchField
            name="experimentalCache"
            label="Experimental Cache Mode"
            description="Cache image layers"
          />
        </form>
      </Form>
    </PageLayout>
  );
};

export default Page;
