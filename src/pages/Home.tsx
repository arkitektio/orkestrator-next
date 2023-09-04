import { Card } from "@/components/ui/card";
import { SmartModel } from "@/providers/smart/SmartModel";
import { EasyGuard } from "@jhnnsrs/arkitekt";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";
import { HerreGuard, useHerre } from "@jhnnsrs/herre";
import { RekuestModuleLink } from "@/linkers";

export const Hallo: React.FC = (props) => {
  const { token } = useHerre();
  return <>ddd{token}</>;
};

function Home() {
  return (
    <>
      <EasyGuard>
        <RekuestGuard>
          <Hallo />
        </RekuestGuard>
      </EasyGuard>
    </>
  );
}

export default Home;
