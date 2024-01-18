import { RekuestModuleLink } from "@/linkers";
import { EasyGuard, useArkitektConnect, useArkitektLogin } from "@jhnnsrs/arkitekt";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";



export const ConnectButton = () => {
  const {registeredEndpoints, load} = useArkitektConnect()



  return <> 
  {registeredEndpoints.map((endpoint) => {
    return <button onClick={() => load({endpoint})}>Connect to {endpoint.name}</button>
  })}
  </>
}


export const LoginButton = () => {
  const { login} = useArkitektLogin()


  return <button onClick={() => login()}>Login</button>

}




/**
 * This is the hero component, which is the main page of the public appliccation.
 * @todo: This component should be replaced with amore useful component for the public application.
 */
function Page() {
  return (
    <>
      <EasyGuard notConnectedFallback={<ConnectButton/> } notLoggedInFallback={<LoginButton/>}>
        <RekuestGuard>
          <RekuestModuleLink>Dashboard</RekuestModuleLink>
        </RekuestGuard>
      </EasyGuard>
    </>
  );
}

export default Page;
