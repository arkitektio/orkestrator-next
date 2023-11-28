import { RekuestModuleLink } from "@/linkers";
import { EasyGuard } from "@jhnnsrs/arkitekt";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";



/**
 * This is the hero component, which is the main page of the public appliccation.
 * @todo: This component should be replaced with amore useful component for the public application.
 */
function Page() {
  return (
    <>
      <EasyGuard>
        <RekuestGuard>
          <RekuestModuleLink>Dashboard</RekuestModuleLink>
        </RekuestGuard>
      </EasyGuard>
    </>
  );
}

export default Page;
