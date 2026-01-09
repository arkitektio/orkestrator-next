import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Arkitekt } from "@/lib/arkitekt/Arkitekt";
import { discover } from "@/lib/arkitekt/fakts/discover";
import React from "react";
import { useForm } from "react-hook-form";
import { storeProbe } from "./storage";
import { DiscoveryProbe } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const CustomEndpointSheet = () => {
  const connect = Arkitekt.useConnect();
  const [introspectError, setIntrospectError] = React.useState<string | null>(
    null,
  );

  const form = useForm({
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (data: { url: string }) => {
    setIntrospectError(null);
    const controller = new AbortController();

    discover({ url: data.url, timeout: 2000, controller })
      .then((endpoint) => {
        const probe: DiscoveryProbe = {
          name: endpoint.name || "Custom endpoint",
          base_url: data.url,
          description: endpoint.description || "Custom endpoint",
          source: "stored",
        };
        storeProbe(probe);

        connect({
          endpoint,
          controller,
        }).catch((e) => {
          setIntrospectError(e.message);
        });
      })
      .catch((e) => {
        setIntrospectError(e.message);
      });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Custom Endpoint</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Connect to Custom Server</SheetTitle>
          <SheetDescription>
            Enter the address of your server to connect.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {introspectError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Could not connect to the server: {introspectError}
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <StringField
                name="url"
                description="The local server URL (e.g., http://localhost:8000)"
              />
              <Button className="w-full" type="submit" variant="secondary">
                Connect
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
