import { Card } from "@/components/ui/card";
import { SmartModel } from "@/smart/SmartModel";
import { EasyGuard } from "@jhnnsrs/arkitekt";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";
import { HerreGuard, useHerre } from "@jhnnsrs/herre";

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
          <SmartModel
            identifier="github.io.jhnnsrs.orkestrator"
            object="latest"
          >
            <Card>Hallo</Card>
          </SmartModel>

          <SmartModel
            identifier="github.io.jhnnsrs.orkestrator"
            object="latest"
          >
            <Card>Two</Card>
          </SmartModel>
        </RekuestGuard>
      </EasyGuard>
    </>
  );
}

export default Home;
