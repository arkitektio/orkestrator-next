import { Card } from "@/components/ui/card";
import { RekuestModuleLink } from "@/linkers";
import { SmartModel } from "@/providers/smart/SmartModel";
import { EasyGuard } from "@jhnnsrs/arkitekt";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";

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
