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
        </RekuestGuard>
      </EasyGuard>
    </>
  );
}

export default Home;
