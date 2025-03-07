import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { useNodeDescription } from "@/lib/rekuest/NodeDescription";
import { RekuestShortcut } from "@/linkers";
import { useShortcutQuery } from "@/rekuest/api/graphql";
import { useCallback, useState } from "react";

export default asDetailQueryRoute(useShortcutQuery, ({ data, refetch }) => {
  const copyHashToClipboard = useCallback(() => {
    navigator.clipboard.writeText(data?.shortcut.node?.hash || "");
  }, [data?.shortcut.node?.hash]);

  const [formData, setFormData] = useState({});

  const description = useNodeDescription({
    description: data.shortcut.node.description || "",
  });

  return (
    <ModelPageLayout
      identifier="@rekuest/shortcut"
      title={data.shortcut.name}
      object={data.shortcut.id}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <RekuestShortcut.Komments object={data?.shortcut?.id} />,
          }}
        />
      }
    >
      <div className=" p-6">
        <div className="mb-3">
          <h1
            className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl cursor-pointer"
            onClick={copyHashToClipboard}
          >
            {data?.shortcut?.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
            {description}
          </p>
        </div>
        {JSON.stringify(data?.shortcut.savedArgs)}
        {JSON.stringify(data?.shortcut.args)}
        {JSON.stringify(data?.shortcut.returns)}
        {data.shortcut.allowQuick && <>Quick</>}
      </div>
    </ModelPageLayout>
  );
});
