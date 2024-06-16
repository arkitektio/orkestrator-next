import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Orkestrator } from "@/root";

export const NotLoggedIn = () => {
  const { login } = Orkestrator.useLogin();
  const { remove, fakts } = Orkestrator.useConnect();

  return (
    <>
      <div className="flex flex-col w-full h-full flex items-center justify-center">
        <div className="flex flex-col">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl  text-foreground">
              {" "}
              Welcome to{" "}
              <Sheet>
                <SheetTrigger asChild>
                  <div className="text-4xl sm:text-5xl md:text-6xl text-primary cursor-pointer inline">
                    {" "}
                    {fakts?.self?.deployment_name}
                  </div>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Debug Info</SheetTitle>

                    <SheetDescription className="space-y-4">
                      <div className="space-y-4">
                        <p className=" dark:text-gray-400">
                          {" "}
                          These are the registered services on your server.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <p className=" dark:text-gray-400">
                          {" "}
                          Look at the fakts configured for this service
                        </p>
                        <pre className="space-y-4">
                          {JSON.stringify(fakts, null, 2)}
                        </pre>
                      </div>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>{" "}
            </h1>
            {fakts?.self?.welcome_message && (
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {fakts?.self?.welcome_message}
              </p>
            )}

            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              You need to login to access the features of this server.
            </p>

            <div className="flex items-center space-x-2">
              <Button onClick={() => login()} className="w-60">
                Login
              </Button>

              <Button
                onClick={() => {
                  remove();
                }}
                variant={"ghost"}
                className="text-foreground"
              >
                Disconnect form server
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
