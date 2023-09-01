import { Card } from "@/components/ui/card";
import { SmartModel } from "@/smart/SmartModel";
import { EasyGuard } from "@jhnnsrs/arkitekt";
import { RekuestGuard } from "@jhnnsrs/rekuest";

export const Hallo: React.FC = (props) => {
  return <>Hallo you</>;
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
