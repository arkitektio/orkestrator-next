import { StringField } from "@/components/fields/StringField";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Link } from "@/components/ui/link";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { manifest } from "@/constants";
import { RekuestModuleLink } from "@/linkers";
import {
  EasyGuard,
  useArkitektConnect,
  useArkitektLogin,
} from "@jhnnsrs/arkitekt";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";
import { ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const ConnectButton = () => {
  const { registeredEndpoints, load, remove } = useArkitektConnect();

  const form = useForm({
    defaultValues: {
      url: "",
    },
  });


  return (
    <div className="flex flex-col w-full h-full">
    <div className="px-3 py-16 flex-1">
        <div className="flex flex-col">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Arkitekt. Your Server. Your Control.</h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              The open-source platform for deploying, managing, and scaling bioimage applications. In Order to get started, you need to connect to an Arkitekt
              Server.
            </p>
          
            <div className="flex items-center space-x-2">
                Discovered Endpoints
            </div>

            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {registeredEndpoints.map((endpoint) => (
                
              
              
              
              <Card key={endpoint.base_url} onClick={() => load({endpoint, manifest: manifest, requestedClientType: "desktop", requestPublic: true})} className="cursor-pointer hover:bg-accent-300">

                <CardHeader>

                  <CardTitle className="text-lg font-bold">{endpoint.name}</CardTitle>
                  <CardDescription className="text-gray-500">{endpoint?.description}</CardDescription>


                </CardHeader>

                <CardContent>
                <a
                  href={endpoint.base_url}
                  target="_blank"
                >
                  {endpoint.base_url}
                </a>
              
                </CardContent>
              </Card>
))}
            </div>
          <Sheet>
  <SheetTrigger asChild><Button variant={"secondary"}> Advanced Login</Button></SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle> Log in to your local server?</SheetTitle>
      <SheetDescription>
            <div className="space-y-4">
              <p className=" dark:text-gray-400">
                Enter your username and password to access your local server.
              </p>
              <Form  {...form}>
              <div className="grid w-full max-w-sm gap-2">
                <StringField name="url" description="The local server url"/>
              <Button className="w-full" type="submit" variant={"secondary"}>Connect</Button>
              </div>
              </Form>
            </div>
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>      

</div>
        </div>
      </div>
   
      </div>
  );
};

export const LoginButton = () => {
  const { login } = useArkitektLogin();
  const { remove, fakts } = useArkitektConnect();

  return (
    <>
    <div className="flex flex-col w-full h-full">
    <div className="px-3 py-16 flex-1">
        <div className="flex flex-col">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"> Welcome to {fakts?.self?.name}.</h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {fakts?.self?.welcomeMessage || "You are now logged in to your local server. You can now access all the features of your server."}
            </p>
          
            
            <div className="flex items-center space-x-2">
            <Button onClick={() => login()} className="w-60">Login</Button>

            <Button onClick={() => remove()} variant={"ghost"}>Remove</Button>
          
            </div>


                
              <Sheet>
      <SheetTrigger asChild><Button variant={"ghost"} className="mt-30"> Advanced Info</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Debug Info</SheetTitle>

          <SheetDescription className="space-y-4">
            <div className="space-y-4">
              <p className=" dark:text-gray-400"> These are the registered services on your server.</p>
              

          <ServicesInfo/>
          </div>
          <div className="space-y-4">
              <p className=" dark:text-gray-400"> Look at the fakts configured for this service</p>
              <pre className="space-y-4">
                  {JSON.stringify(fakts, null, 2)}
                </pre>

          </div>
                
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
</Sheet>      

</div>
        </div>
      </div>
   
      </div>


    </>
  );
};

//
type ConfiguredServices = "live.arkitekt.lok" | "live.arkitekt.rekuest-next" | "live.arkitekt.fluss";

type ServiceCardProps = {
  service: ConfiguredServices;
  value: any;
  key: string;
};

const LokServiceWidget = (props: ServiceCardProps) => {


  const [health, setHealth] = useState<boolean | null>(null);

  useEffect(() => {
    if (props.value?.healthz) {
      fetch(props.value.healthz).then((res) => res.json()).then((data) => {
        setHealth(true);

        console.log(data)
      }).catch((e) => {
        console.error(e, props.value.healthz);
        setHealth(false);
      }
      )
    }   




  }, [props.value]);




  return (
    <Card>
      <CardHeader><CardTitle>{props.service}</CardTitle></CardHeader>
      <CardContent>
        <CardDescription>
          <div className="flex items-center space-x-2">
            <div>Health</div>
            <div>{health === null ? "Loading" : health ? "Healthy" : "Unhealthy"}</div>
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  );
};


const serviceRegistry: {[key in ConfiguredServices]: (props: ServiceCardProps) => React.ReactNode} = {
  "live.arkitekt.lok": LokServiceWidget,
  "live.arkitekt.rekuest-next": LokServiceWidget,
  "live.arkitekt.fluss": LokServiceWidget,
}



export const ServiceInfo = (props: {value: any, service: ConfiguredServices, key: string}) => {

  const ServiceWidget = serviceRegistry[props.service];

  if (!ServiceWidget) {
    return <div>Service not found</div>
  }



  return (
      <ServiceWidget service={props.service} key={props.key} value={props.value}/>
  );
}



export const ServicesInfo = () => {

  const { fakts } = useArkitektConnect();

  const listedServices = fakts ? Object.keys(fakts).map((key) => {
    return {
      key: key,
      value: fakts[key as keyof typeof fakts],
      service: fakts[key as keyof typeof fakts]?.__service 
    };
  }).filter(e => e.key && e.value && e.service) : [];

  return (
    <div className="grid grid-cols-1 gap-2">
      {listedServices.map((service) => {
        return <ServiceInfo {...service}/>
      })}
    </div>
  );

    };







export const Home = () => {
  const { login, user } = useArkitektLogin();
  const { remove, fakts } = useArkitektConnect();

  return (
    <>
    <div className="flex flex-col w-full h-full">
    <div className="px-3 py-16 flex-1">
        <div className="flex flex-col">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"> Hi {user?.preferred_username}</h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              You are currently logged in to {fakts?.self?.name}. You can now access all the features of your server.
            </p>



          
            
            <div className="flex items-center space-x-2">
            <Button onClick={() => login()} className="w-60">Login</Button>

            <Button onClick={() => remove()} variant={"ghost"}>Remove</Button>
          
            </div>


            




                
              <Sheet>
      <SheetTrigger asChild><Button variant={"ghost"} className="mt-30"> Advanced Info</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Debug Info</SheetTitle>
          <SheetDescription>

          <ServicesInfo/>
                <pre className="space-y-4">
                  {JSON.stringify(fakts, null, 2)}
                </pre>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
</Sheet>      

</div>
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
      <EasyGuard
        notConnectedFallback={<ConnectButton />}
        notLoggedInFallback={<LoginButton />}
      >
          <Home/>

      </EasyGuard>
    </>
  );
}

export default Page;
