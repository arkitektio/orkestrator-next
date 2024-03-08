import { Button } from "@/components/ui/button";
import { RekuestModuleLink } from "@/linkers";
import {
  EasyGuard,
  useArkitektConnect,
  useArkitektLogin,
} from "@jhnnsrs/arkitekt";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";

export const ConnectButton = () => {
  const { registeredEndpoints, load, remove } = useArkitektConnect();

  return (
    <>
      {registeredEndpoints.map((endpoint) => {
        return (
          <Button onClick={() => load({ endpoint, requestedClientType: "desktop" })}>
            Connect to {endpoint.name}
          </Button>
        );
      })}
      Rendered
    </>
  );
};

export const LoginButton = () => {
  const { login } = useArkitektLogin();
  const { remove } = useArkitektConnect();

  return (
    <>
      <Button onClick={() => remove()}>Remove</Button>
      <Button onClick={() => login()}>Login</Button>
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
        <RekuestGuard>
          <RekuestModuleLink>Dashboard</RekuestModuleLink>
        </RekuestGuard>
      </EasyGuard>
    </>
  );
}

export default Page;
