import { LoadingPage } from "@/app/components/fallbacks/LoadingPage";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import { DragZone } from "@/components/upload/drag";
import { useLokUpload } from "@/datalayer/hooks/useLokUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokUser } from "@/linkers";
import { useRef } from "react";
import { useMeQuery, useUpdateUserProfileMutation } from "../api/graphql";
import { MorseCodeRecorder } from "../components/MorseCodeRecorder";

// (legacy) export type removed – not used

const Page = (props) => {
  const { data } = useMeQuery();

  if (!data) {
    return <LoadingPage />;
  }

  const uploadFile = useLokUpload();

  const resolve = useResolve();
  const [update] = useUpdateUserProfileMutation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const createFile = async (_file: File, key: string) => {
    update({
      variables: {
        input: {
          id: data?.me.profile.id,
          avatar: key,
          name: data?.me.username,
        },
      },
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = await uploadFile(file);
    await createFile(file, key);
    // reset value to allow re-upload of same file name
    e.target.value = "";
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <LokUser.ModelPage
      object={data.me.id}
      actions={<LokUser.Actions object={data.me.id} />}
      pageActions={<LokUser.ObjectButton object={data.me.id} />}
      title={data?.me?.username}
      sidebars={
        <MultiSidebar map={{
          "Komments": <LokUser.Komments object={data.me.id} />,
        }} />
      }
    >
      {/* Profile Hero Section */}
      <MorseCodeRecorder />

    </LokUser.ModelPage >
  );
}

export default Page;
