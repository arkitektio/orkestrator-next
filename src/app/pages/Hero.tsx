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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NotLoggedIn } from "../components/fallbacks/NotLoggedIn";
import { NotConnected } from "../components/fallbacks/NotConnected";
import { discover } from "@/lib/arkitekt/fakts/discover";
import { FaktsEndpoint } from "@/lib/arkitekt/fakts/endpointSchema";
import { useMeQuery } from "@/lok-next/api/graphql";

export const ConnectButton = () => {
  const connect = Arkitekt.useConnect();

  const [endpoints, setEndpoints] = React.useState<FaktsEndpoint[]>([]);

  const form = useForm({
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);

    const controller = new AbortController();

    discover({
      url: data.url,
      timeout: 2000,
      controller: controller,
    }).then((endpoint) => {
      connect({
        endpoint,
        controller,
      });
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
            The open-source platform for deploying, managing, and scaling
            bioimage applications. In order to get you started, you need to
            connect to an Arkitekt Server.
          </p>

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
                    {endpoint?.description}
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

//
type ConfiguredServices =
  | "live.arkitekt.lok"
  | "live.arkitekt.rekuest-next"
  | "live.arkitekt.fluss";

type ServiceCardProps = {
  service: ConfiguredServices;
  value: any;
  key: string;
};

const LokServiceWidget = (props: ServiceCardProps) => {
  const [health, setHealth] = useState<boolean | null>(null);

  useEffect(() => {
    if (props.value?.healthz) {
      fetch(props.value.healthz)
        .then((res) => res.json())
        .then((data) => {
          setHealth(true);

          console.log(data);
        })
        .catch((e) => {
          console.error(e, props.value.healthz);
          setHealth(false);
        });
    }
  }, [props.value]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.service}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <div className="flex items-center space-x-2">
            <div>Health</div>
            <div>
              {health === null ? "Loading" : health ? "Healthy" : "Unhealthy"}
            </div>
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const serviceRegistry: {
  [key in ConfiguredServices]: (props: ServiceCardProps) => React.ReactNode;
} = {
  "live.arkitekt.lok": LokServiceWidget,
  "live.arkitekt.rekuest-next": LokServiceWidget,
  "live.arkitekt.fluss": LokServiceWidget,
};

export const ServiceInfo = (props: {
  value: any;
  service: ConfiguredServices;
  key: string;
}) => {
  const ServiceWidget = serviceRegistry[props.service];

  if (!ServiceWidget) {
    return <div>Service not found</div>;
  }

  return (
    <ServiceWidget
      service={props.service}
      key={props.key}
      value={props.value}
    />
  );
};

export const ServicesInfo = () => {
  const fakts = Arkitekt.useFakts();

  const listedServices = fakts
    ? Object.keys(fakts)
        .map((key) => {
          return {
            key: key,
            value: fakts[key as keyof typeof fakts],
            service: fakts[key as keyof typeof fakts]?.__service,
          };
        })
        .filter((e) => e.key && e.value && e.service)
    : [];

  return (
    <div className="grid grid-cols-1 gap-2">
      {listedServices.map((service) => {
        return <ServiceInfo {...service} />;
      })}
    </div>
  );
};

export const Home = () => {
  const fakts = Arkitekt.useFakts();
  const disconnect = Arkitekt.useDisconnect();

  const { data, error } = useMeQuery({
    fetchPolicy: "cache-and-network",
  });

  return (
    <>
      <div className="flex flex-col w-full h-full flex items-center justify-center">
        <div className="flex flex-col">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
              {" "}
              Hi {data?.me?.username} :)
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              You are currently logged in to {fakts?.self?.deployment_name}. You
              can now access all the features of your server.
            </p>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => {
                  disconnect();
                }}
                variant={"ghost"}
                className="text-foreground"
              >
                Disconnect form server
              </Button>
            </div>

            <div className="flex-grow" />
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * This is the hero component, which is the main page of the public appliccation.
 * @todo: This component should be replaced with amore useful component for the public application.
 */
function Page() {
  return (
    <>
      <Arkitekt.Guard notConnectedFallback={<NotConnected />}>
        <Home />
      </Arkitekt.Guard>
    </>
  );
}

export default Page;
