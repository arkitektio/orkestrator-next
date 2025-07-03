import { Arkitekt } from "@/lib/arkitekt/Arkitekt";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { manifest } from "@/constants";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import React from "react";
import { FaktsEndpoint } from "@/lib/arkitekt/fakts/endpointSchema";
import { discover } from "@/lib/arkitekt/fakts/discover";

export const NotConnected = () => {
  const connect = Arkitekt.useConnect();

  const [endpoints, setEndpoints] = React.useState<FaktsEndpoint[]>([]);
  const [introspectError, setIntrospectError] = React.useState<string | null>(
    null,
  );

  const location = useLocation();

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
    <div className="flex flex-col w-full h-full flex items-center justify-center">
      <div className="flex flex-col">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
            Hi Stranger :)
          </h1>
          <h2 className="text-2xl font-light tracking-tighter sm:text-3xl md:text-4xl text-foreground">
            Welcome to Arkitekt.
          </h2>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Before accessing this beautiful page you need to connect to a local
            server.
          </p>

          <div className="flex items-center space-x-2 text-foreground">
            <b className="text-primary mr-2">{location.pathname}</b> is waiting
            for you ;)
          </div>

          <div className="flex items-center space-x-2 text-foreground">
            Discovered Endpoints
          </div>

          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            {endpoints.map((endpoint) => (
              <Card
                key={endpoint.base_url}
                onClick={() =>
                  connect({
                    endpoint,
                    controller: new AbortController(),
                  })
                }
                className="cursor-pointer hover:bg-accent-300"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    {endpoint.name}
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    {endpoint?.description || "No description"}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <a href={endpoint.base_url} target="_blank">
                    {endpoint.base_url}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={"secondary"}> Advanced Login</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle> Log in to your local server?</SheetTitle>
                <SheetDescription>
                  <div className="space-y-4">
                    <p className=" dark:text-gray-400">
                      Enter your username and password to access your local
                      server.
                    </p>

                    {introspectError && (
                      <div className="bg-red-100 text-red-900 p-2 rounded-md">
                        Could not connect to the server
                        <p className="text-xs">{introspectError}</p>
                      </div>
                    )}
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid w-full max-w-sm gap-2">
                          <StringField
                            name="url"
                            description="The local server url"
                          />
                          <Button
                            className="w-full"
                            type="submit"
                            variant={"secondary"}
                          >
                            Connect
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
