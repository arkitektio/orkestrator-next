import { LoadingPage } from "@/app/components/fallbacks/LoadingPage";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { LokUser } from "@/linkers";
import { useMeQuery } from "../api/graphql";
import { MorseCodeRecorder } from "../components/MorseCodeRecorder";

// (legacy) export type removed – not used

const Page = () => {
  const { data } = useMeQuery();

  if (!data) {
    return <LoadingPage />;
  }

  return (
    <LokUser.ModelPage
      object={data.me}
      actions={<LokUser.Actions object={data.me} />}
      pageActions={<LokUser.ObjectButton object={data.me} />}
      title={data?.me?.username}
      sidebars={
        <MultiSidebar map={{
          "Komments": <LokUser.Komments object={data.me} />,
        }} />
      }
    >
      {/* Profile Hero Section */}
      <MorseCodeRecorder />

    </LokUser.ModelPage >
  );
}

export default Page;
