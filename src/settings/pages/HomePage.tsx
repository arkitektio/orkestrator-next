import { SliderField } from "@/components/fields/SliderField";
import { SwitchField } from "@/components/fields/SwitchField";
import { PageLayout } from "@/components/layout/PageLayout";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { UpdateChecker } from "@/components/ui/update-checker";
import { Arkitekt } from "@/lib/arkitekt/Arkitekt";
import { useSettings } from "@/providers/settings/SettingsContext";
import deepEqual from "deep-equal";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const { setSettings, settings } = useSettings();
  const fakts = Arkitekt.useFakts();

  const services = Arkitekt.useServices();
  const unresolvedServices = Arkitekt.useUnresolvedServices();

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
      if (!deepEqual(data, settings)) {
        setSettings(data);
      }
    }
  }, [formState, data, isValidating, settings]);

  return (
    <PageLayout
      pageActions={
        <>
          <Dialog>
            <DialogTrigger>Open Fakts</DialogTrigger>
            <DialogContent className="min-w-[70vw] text-white">
              <pre>{JSON.stringify(fakts, null, 2)}</pre>
            </DialogContent>
          </Dialog>
        </>
      }
      title="App Settings"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
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
          <SliderField
            name="defaultZoomLevel"
            label={`Default Zoom Level (${Math.round((form.watch("defaultZoomLevel") || 1.0) * 100)}%)`}
            description="Set the default zoom level for the application (25% - 300%)"
            min={0.25}
            max={3.0}
            step={0.05}
            throttle={100}
          />
        </form>
      </Form>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold">App Updates</h3>
        <UpdateChecker />
      </div>

      {services.map((service) => {
        return (
          <div key={service.key} className="p-4">
            <h2 className="text-2xl font-bold">{service.key}</h2>
            <pre className="text-sm text-gray-300">
              {JSON.stringify(service, null, 2)}
            </pre>
          </div>
        );
      })}
      {unresolvedServices.map((service) => {
        return (
          <div key={service.key} className="p-4 bg-red-800">
            <h2 className="text-2xl font-bold">{service.key}</h2>
            <pre className="text-sm text-gray-300">
              {JSON.stringify(service, null, 2)}
            </pre>
          </div>
        );
      })}
    </PageLayout>
  );
};

export default Page;
